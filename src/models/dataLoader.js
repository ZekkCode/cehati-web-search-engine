/**
 * dataLoader.js — Data Loader (MODEL Layer)
 * ===========================================
 * Memuat dan meng-cache data pre-computed dari public/data/:
 * - documents.json: metadata dokumen untuk display
 * - bm25_index.json: tokenized corpus + IDF untuk BM25
 * - embeddings.bin: document embeddings untuk Dense Retrieval
 *
 * Data di-cache di memory setelah pertama kali dimuat.
 */

let _documentsCache = null;
let _bm25Cache = null;
let _embeddingsCache = null;
let _loadingPromise = null;

/**
 * Muat documents.json — metadata semua artikel.
 * @returns {Promise<Array>} Array of document objects
 */
export async function loadDocuments() {
  if (_documentsCache) return _documentsCache;

  const res = await fetch("/data/documents.json");
  if (!res.ok) throw new Error("Gagal memuat documents.json");
  _documentsCache = await res.json();
  return _documentsCache;
}

/**
 * Muat bm25_index.json — tokenized corpus + IDF values.
 * @returns {Promise<Object>} { corpus, idf, doc_lengths, avg_dl, total_docs }
 */
export async function loadBM25Index() {
  if (_bm25Cache) return _bm25Cache;

  const res = await fetch("/data/bm25_index.json");
  if (!res.ok) throw new Error("Gagal memuat bm25_index.json");
  _bm25Cache = await res.json();
  return _bm25Cache;
}

/**
 * Muat embeddings.bin — document embeddings sebagai Float32Array.
 * Format binary: [uint32 num_docs] [uint32 dim] [float32 data...]
 *
 * @returns {Promise<{numDocs: number, dim: number, vectors: Float32Array}>}
 */
export async function loadEmbeddings() {
  if (_embeddingsCache) return _embeddingsCache;

  try {
    const res = await fetch("/data/embeddings.dat");
    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    const header = new Uint32Array(buffer, 0, 2);
    const numDocs = header[0];
    const dim = header[1];
    const vectors = new Float32Array(buffer, 8); // offset 8 bytes (header)

    _embeddingsCache = { numDocs, dim, vectors };
    return _embeddingsCache;
  } catch (err) {
    console.warn("⚠️ Embeddings tidak tersedia. Dense Retrieval dinonaktifkan. Detail:", err);
    return null;
  }
}

/**
 * Muat semua data sekaligus.
 * Mengembalikan promise yang di-cache agar tidak double-load.
 *
 * @returns {Promise<{documents: Array, bm25: Object, embeddings: Object|null}>}
 */
export async function loadAllData() {
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = Promise.all([
    loadDocuments(),
    loadBM25Index(),
    loadEmbeddings(),
  ]).then(([documents, bm25, embeddings]) => ({
    documents,
    bm25,
    embeddings,
  }));

  return _loadingPromise;
}

/**
 * Ambil dokumen berdasarkan ID.
 * @param {string} docId
 * @returns {Promise<Object|null>}
 */
export async function getDocumentById(docId) {
  const docs = await loadDocuments();
  return docs.find((d) => d.id === docId) || null;
}

/**
 * Ambil statistik dataset.
 * @returns {Promise<Object>}
 */
export async function getDatasetStats() {
  const docs = await loadDocuments();
  const sources = [...new Set(docs.map((d) => d.source_name))];
  const categories = [...new Set(docs.map((d) => d.category).filter(Boolean))];
  const topics = [...new Set(docs.map((d) => d.health_topic).filter(Boolean))];

  return {
    totalDocuments: docs.length,
    totalSources: sources.length,
    totalCategories: categories.length,
    totalTopics: topics.length,
    sources: sources.sort(),
    categories: categories.sort(),
    topics: topics.sort(),
    avgWordCount: Math.round(
      docs.reduce((sum, d) => sum + (d.word_count || 0), 0) / docs.length
    ),
  };
}
