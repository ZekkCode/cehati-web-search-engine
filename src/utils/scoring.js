/**
 * scoring.js — Normalisasi dan Kombinasi Skor
 * =============================================
 * Utility untuk menormalisasi skor BM25 & Dense
 * dan menggabungkannya dalam Hybrid Search.
 */

/**
 * Normalisasi Min-Max ke rentang [0, 1].
 * @param {number[]} scores - Array skor mentah
 * @returns {number[]} Skor ternormalisasi
 */
export function minMaxNormalize(scores) {
  if (!scores.length) return [];
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max - min === 0) return scores.map(() => 0);
  return scores.map((s) => (s - min) / (max - min));
}

/**
 * Gabungkan skor BM25 dan Dense menjadi skor Hybrid.
 *
 * @param {Map<number, number>} bm25Scores  - Map<docIndex, score>
 * @param {Map<number, number>} denseScores - Map<docIndex, score>
 * @param {number} bm25Weight  - Bobot BM25 (default 0.4)
 * @param {number} denseWeight - Bobot Dense (default 0.6)
 * @returns {Array<{index: number, score: number}>} Sorted results
 */
export function combineHybridScores(
  bm25Scores,
  denseScores,
  bm25Weight = 0.4,
  denseWeight = 0.6
) {
  // Kumpulkan semua doc indices
  const allIndices = new Set([...bm25Scores.keys(), ...denseScores.keys()]);

  // Normalisasi BM25
  const bm25Vals = [...bm25Scores.values()];
  const bm25Norm = minMaxNormalize(bm25Vals);
  const bm25NormMap = new Map();
  let i = 0;
  for (const key of bm25Scores.keys()) {
    bm25NormMap.set(key, bm25Norm[i++]);
  }

  // Normalisasi Dense
  const denseVals = [...denseScores.values()];
  const denseNorm = minMaxNormalize(denseVals);
  const denseNormMap = new Map();
  let j = 0;
  for (const key of denseScores.keys()) {
    denseNormMap.set(key, denseNorm[j++]);
  }

  // Hitung hybrid score
  const results = [];
  for (const idx of allIndices) {
    const b = bm25NormMap.get(idx) || 0;
    const d = denseNormMap.get(idx) || 0;
    results.push({ index: idx, score: bm25Weight * b + denseWeight * d });
  }

  // Sort descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Konversi skor ke persentase.
 * @param {number} score
 * @param {number} maxScore
 * @returns {number} Persentase (0-100)
 */
export function scoreToPercentage(score, maxScore = 1) {
  if (maxScore === 0) return 0;
  return Math.round(Math.min((score / maxScore) * 100, 100) * 100) / 100;
}
