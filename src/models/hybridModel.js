/**
 * hybridModel.js — Hybrid Search (MODEL Layer)
 * ===============================================
 * Menggabungkan BM25 (lexical) dan Dense Retrieval (semantic)
 * untuk hasil pencarian yang lebih baik.
 *
 * Formula:
 *   hybrid_score = w_bm25 × normalize(bm25) + w_dense × normalize(dense)
 *
 * Default weights: BM25 = 0.4, Dense = 0.6
 * Dense diberi bobot lebih besar karena artikel kesehatan
 * mendapat manfaat dari pemahaman semantik (sinonim medis, dll).
 *
 * Jika Dense tidak tersedia, fallback ke BM25 saja.
 */

import { searchBM25WithPartialMatch } from "./bm25Model";
import { encodeQuery, searchDense } from "./denseModel";
import { combineHybridScores } from "@/utils/scoring";

/**
 * Jalankan Hybrid Search.
 *
 * @param {string[]} queryTokens - Token query (preprocessed)
 * @param {string} rawQuery - Query mentah (untuk Dense encoding)
 * @param {Object} bm25Data - Data BM25 index
 * @param {Object|null} embeddingsData - Data embeddings (null jika tidak ada)
 * @param {Object} options - { bm25Weight, denseWeight, topK, hfApiKey }
 * @returns {Promise<{results: Array<{index: number, score: number}>, method: string}>}
 */
export async function searchHybrid(
  queryTokens,
  rawQuery,
  bm25Data,
  embeddingsData,
  options = {}
) {
  const {
    bm25Weight = 0.4,
    denseWeight = 0.6,
    topK = 100,
    hfApiKey = null,
  } = options;

  // ── 1. BM25 Search (selalu tersedia) ──────────────────────────────
  const bm25Scores = searchBM25WithPartialMatch(queryTokens, bm25Data, topK * 2);

  // ── 2. Dense Search (opsional) ────────────────────────────────────
  let denseScores = new Map();
  let usedMethod = "bm25"; // Track metode yang digunakan

  if (embeddingsData) {
    try {
      const queryVec = await encodeQuery(rawQuery, hfApiKey);
      if (queryVec) {
        denseScores = searchDense(queryVec, embeddingsData, topK * 2);
        usedMethod = "hybrid";
      }
    } catch {
      console.warn("Dense search gagal, fallback ke BM25");
    }
  }

  // ── 3. Gabungkan skor ─────────────────────────────────────────────
  let results;
  if (denseScores.size > 0) {
    // Hybrid: gabungkan BM25 + Dense
    results = combineHybridScores(bm25Scores, denseScores, bm25Weight, denseWeight);
  } else {
    // Fallback: BM25 saja (normalisasi ke [0,1])
    const entries = [...bm25Scores.entries()].sort((a, b) => b[1] - a[1]);
    const max = entries.length > 0 ? entries[0][1] : 1;
    results = entries.map(([idx, score]) => ({
      index: idx,
      score: max > 0 ? score / max : 0,
    }));
  }

  return {
    results: results.slice(0, topK),
    method: usedMethod,
  };
}
