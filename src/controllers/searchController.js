/**
 * searchController.js — Controller Utama Search Engine (CONTROLLER Layer)
 * ========================================================================
 * "Otak" dari CEHATI Search Engine.
 *
 * Bertanggung jawab untuk:
 * 1. Memuat dan menyiapkan data search index
 * 2. Mengorkestrasikan proses pencarian (BM25/Dense/Hybrid)
 * 3. Memformat hasil untuk ditampilkan di UI
 * 4. Menangani pagination
 *
 * Pola MVC:
 *   Model (models/)      → data + algoritma
 *   Controller (file ini) → orkestra alur bisnis
 *   View (components/)    → tampilan UI
 */

import { loadAllData, getDocumentById, getDatasetStats } from "@/models/dataLoader";
import { searchHybrid } from "@/models/hybridModel";
import { searchBM25WithPartialMatch } from "@/models/bm25Model";
import { preprocessQuery, generateSnippet } from "@/utils/textPreprocessor";
import { scoreToPercentage } from "@/utils/scoring";

// ── Cache state ─────────────────────────────────────────────────────
let _data = null;
let _isReady = false;
let _initPromise = null;

/**
 * Inisialisasi search engine: muat semua data yang diperlukan.
 * Dipanggil sekali saat aplikasi pertama kali dibuka.
 *
 * @returns {Promise<boolean>} true jika berhasil
 */
export async function initSearchEngine() {
  if (_isReady) return true;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      console.log("🚀 Inisialisasi CEHATI Search Engine...");
      _data = await loadAllData();
      _isReady = true;
      console.log("✅ Search engine siap!", {
        documents: _data.documents.length,
        bm25Terms: Object.keys(_data.bm25.idf).length,
        hasEmbeddings: !!_data.embeddings,
      });
      return true;
    } catch (err) {
      console.error("❌ Gagal memuat data:", err);
      _isReady = false;
      return false;
    }
  })();

  return _initPromise;
}

/**
 * Cek apakah search engine sudah siap.
 * @returns {boolean}
 */
export function isSearchReady() {
  return _isReady;
}

/**
 * Jalankan pencarian dan kembalikan hasil terformat.
 *
 * Alur:
 * 1. Preprocessing query
 * 2. Panggil Hybrid Search (BM25 + Dense)
 * 3. Format hasil (tambahkan metadata dokumen, snippet, score)
 * 4. Paginasi
 *
 * @param {Object} params
 * @param {string} params.query - Query pencarian
 * @param {number} [params.page=1] - Nomor halaman
 * @param {number} [params.perPage=10] - Hasil per halaman
 * @param {string} [params.sourceFilter] - Filter sumber
 * @param {string} [params.categoryFilter] - Filter kategori
 * @param {string} [params.hfApiKey] - HF API key untuk Dense
 * @returns {Promise<Object>} Hasil pencarian terformat
 */
export async function search({
  query,
  page = 1,
  perPage = 10,
  sourceFilter = null,
  categoryFilter = null,
  hfApiKey = null,
}) {
  if (!_isReady || !query?.trim()) {
    return emptyResult(query);
  }

  const startTime = performance.now();
  const trimmedQuery = query.trim();

  // ── 1. Preprocessing query ──────────────────────────────────────
  const queryTokens = preprocessQuery(trimmedQuery);
  if (queryTokens.length === 0) return emptyResult(trimmedQuery);

  // ── 2. Jalankan Hybrid Search ───────────────────────────────────
  let rawResults = [];
  let method = "bm25";
  try {
    const hybridRes = await searchHybrid(
      queryTokens,
      trimmedQuery,
      _data.bm25,
      _data.embeddings,
      { hfApiKey, topK: 100 }
    );
    rawResults = hybridRes.results;
    method = hybridRes.method;
  } catch (err) {
    console.warn("Hybrid search failed, falling back to BM25 only:", err);
    const bm25Scores = searchBM25WithPartialMatch(queryTokens, _data.bm25, 100);
    const entries = [...bm25Scores.entries()].sort((a, b) => b[1] - a[1]);
    const max = entries.length > 0 ? entries[0][1] : 1;
    rawResults = entries.map(([idx, score]) => ({
      index: idx,
      score: max > 0 ? score / max : 0,
    }));
    method = "bm25 (fallback)";
  }

  // ── 3. Format hasil dengan metadata dokumen ─────────────────────
  let formattedResults = [];
  const maxScore = rawResults.length > 0 ? rawResults[0].score : 1;

  for (const { index, score } of rawResults) {
    const doc = _data.documents[index];
    if (!doc) continue;

    // Terapkan filter
    if (sourceFilter && doc.source_name !== sourceFilter) continue;
    if (categoryFilter && doc.category !== categoryFilter) continue;

    formattedResults.push({
      id: doc.id,
      title: doc.title,
      snippet: generateSnippet(doc.content || doc.summary, trimmedQuery, 250),
      score: Math.round(score * 10000) / 10000,
      scorePercent: scoreToPercentage(score, maxScore),
      sourceName: doc.source_name,
      sourceUrl: doc.source_url,
      category: doc.category,
      healthTopic: doc.health_topic,
      publishedDate: doc.published_date,
      author: doc.author,
      wordCount: doc.word_count,
      tags: doc.tags || [],
    });
  }

  // ── 4. Paginasi ─────────────────────────────────────────────────
  const totalResults = formattedResults.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (safePage - 1) * perPage;
  const pagedResults = formattedResults.slice(startIdx, startIdx + perPage);

  // Re-assign rank setelah paginasi
  pagedResults.forEach((r, i) => {
    r.rank = startIdx + i + 1;
  });

  const searchTime = Math.round(performance.now() - startTime);

  return {
    query: trimmedQuery,
    method,
    totalResults,
    page: safePage,
    perPage,
    totalPages,
    results: pagedResults,
    searchTime, // dalam milliseconds
  };
}

/**
 * Ambil detail dokumen berdasarkan ID.
 * @param {string} docId
 * @returns {Promise<Object|null>}
 */
export async function getArticleDetail(docId) {
  if (!_isReady) await initSearchEngine();
  return getDocumentById(docId);
}

/**
 * Ambil statistik dataset.
 * @returns {Promise<Object>}
 */
export async function getStats() {
  if (!_isReady) await initSearchEngine();
  return getDatasetStats();
}

/**
 * Ambil beberapa artikel pilihan untuk ditampilkan di beranda.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getFeaturedArticles(limit = 6) {
  if (!_isReady) await initSearchEngine();
  return _data.documents.slice(0, limit);
}

/**
 * Ambil daftar filter yang tersedia.
 * @returns {Promise<Object>}
 */
export async function getFilters() {
  if (!_isReady) await initSearchEngine();
  const docs = _data.documents;
  return {
    sources: [...new Set(docs.map((d) => d.source_name))].sort(),
    categories: [...new Set(docs.map((d) => d.category).filter(Boolean))].sort(),
  };
}

function emptyResult(query = "") {
  return {
    query: query || "",
    method: "none",
    totalResults: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
    results: [],
    searchTime: 0,
  };
}
