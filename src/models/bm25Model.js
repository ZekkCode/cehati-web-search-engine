/**
 * bm25Model.js — BM25 Search Engine (MODEL Layer)
 * ==================================================
 * Implementasi BM25 (Best Matching 25) di client-side JavaScript.
 *
 * Algoritma BM25 (Okapi BM25):
 *   score(D,Q) = Σ IDF(qi) × (tf × (k1+1)) / (tf + k1 × (1 - b + b × |D|/avgdl))
 *
 * Dimana:
 *   tf      = term frequency (jumlah kemunculan kata di dokumen)
 *   |D|     = panjang dokumen (jumlah token)
 *   avgdl   = rata-rata panjang dokumen
 *   k1=1.5  = saturasi term frequency
 *   b=0.75  = normalisasi panjang dokumen
 *   IDF(qi) = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
 *
 * Data yang dibutuhkan (dari bm25_index.json):
 *   - corpus: tokenized documents (sudah di-stem di Python)
 *   - idf: pre-computed IDF values
 *   - doc_lengths: panjang setiap dokumen
 *   - avg_dl: rata-rata panjang dokumen
 */

/**
 * Hitung skor BM25 untuk query terhadap semua dokumen.
 *
 * @param {string[]} queryTokens - Token query (sudah di-preprocess)
 * @param {Object} bm25Data - Data dari bm25_index.json
 * @param {number} k1 - Parameter saturasi TF (default 1.5)
 * @param {number} b - Parameter normalisasi panjang (default 0.75)
 * @param {number} topK - Jumlah hasil maksimal
 * @returns {Map<number, number>} Map<docIndex, score>
 */
export function searchBM25(queryTokens, bm25Data, k1 = 1.2, b = 0.75, topK = 100) {
  const { corpus, idf, doc_lengths, avg_dl } = bm25Data;
  const scores = new Map();

  // Untuk setiap dokumen, hitung skor BM25
  for (let docIdx = 0; docIdx < corpus.length; docIdx++) {
    const docTokens = corpus[docIdx];
    if (!docTokens || docTokens.length === 0) continue;

    const docLen = doc_lengths[docIdx];
    let score = 0;

    // Hitung term frequency untuk token query di dokumen ini
    for (const qTerm of queryTokens) {
      // IDF dari pre-computed data
      const termIdf = idf[qTerm];
      if (!termIdf || termIdf <= 0) continue;

      // Term frequency: hitung kemunculan qTerm di docTokens
      let tf = 0;
      for (const dt of docTokens) {
        if (dt === qTerm) tf++;
      }

      if (tf === 0) continue;

      // BM25 scoring formula
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avg_dl));
      score += termIdf * (numerator / denominator);
    }

    if (score > 0) {
      scores.set(docIdx, score);
    }
  }

  // Sort dan ambil top-K
  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK);

  return new Map(sorted);
}

/**
 * Cari dokumen menggunakan BM25 dengan partial matching.
 * Karena stemming tidak dilakukan di client, kita gunakan
 * pendekatan substring matching untuk meningkatkan recall.
 *
 * @param {string[]} queryTokens - Token query
 * @param {Object} bm25Data - Data BM25
 * @param {number} topK - Jumlah hasil
 * @returns {Map<number, number>} Map<docIndex, score>
 */
export function searchBM25WithPartialMatch(queryTokens, bm25Data, topK = 100) {
  const { corpus, idf, doc_lengths, avg_dl } = bm25Data;
  const k1 = 1.2;
  const b = 0.75;
  const scores = new Map();

  for (let docIdx = 0; docIdx < corpus.length; docIdx++) {
    const docTokens = corpus[docIdx];
    if (!docTokens || docTokens.length === 0) continue;

    const docLen = doc_lengths[docIdx];
    let score = 0;

    for (const qTerm of queryTokens) {
      // Cari exact match DAN prefix match
      let tf = 0;
      let matchedTerm = null;

      for (const dt of docTokens) {
        // Exact match
        if (dt === qTerm) {
          tf++;
          matchedTerm = qTerm;
        }
        // Prefix match: query "diabet" match dengan "diabetes"
        else if (qTerm.length >= 3 && dt.startsWith(qTerm)) {
          tf += 0.7; // Bobot lebih rendah untuk partial match
          if (!matchedTerm) matchedTerm = dt;
        }
      }

      if (tf === 0) continue;

      // Gunakan IDF dari term yang match (atau estimasi)
      const termIdf = idf[matchedTerm] || idf[qTerm] || 1.0;

      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avg_dl));
      score += termIdf * (numerator / denominator);
    }

    if (score > 0) {
      scores.set(docIdx, score);
    }
  }

  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK);

  return new Map(sorted);
}
