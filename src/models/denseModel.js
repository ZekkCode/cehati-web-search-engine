/**
 * denseModel.js — Dense Retrieval (MODEL Layer)
 * ================================================
 * Pencarian semantik menggunakan pre-computed document embeddings
 * dan Hugging Face Inference API untuk query encoding.
 *
 * Alur:
 * 1. Document embeddings di-load dari embeddings.bin (pre-computed)
 * 2. Query di-encode via HF Inference API → vektor 384 dimensi
 * 3. Hitung cosine similarity antara query dan semua dokumen
 * 4. Return top-K dokumen terurut
 *
 * Jika HF API tidak tersedia, Dense Retrieval dinonaktifkan
 * dan sistem fallback ke BM25.
 */

const HF_API_URL =
  "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";

/**
 * Encode query menjadi vektor embedding via Hugging Face Inference API.
 *
 * @param {string} query - Query pencarian
 * @param {string} [apiKey] - HF API key (opsional, untuk rate limit lebih tinggi)
 * @returns {Promise<Float32Array|null>} Embedding vektor atau null jika gagal
 */
export async function encodeQuery(query, apiKey = null) {
  try {
    // Panggil server-side API route kita sendiri untuk menghindari blokir extension browser
    const res = await fetch(`/api/encode?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      console.warn("Failed to encode query via server API:", res.status);
      return null;
    }

    const data = await res.json();
    if (data.error) {
      console.warn("Server API returned error:", data.error);
      return null;
    }
    
    return new Float32Array(data);
  } catch (err) {
    console.warn("Dense encoding gagal:", err.message);
    return null;
  }
}

/**
 * Hitung cosine similarity antara query embedding dan semua document embeddings.
 *
 * Cosine similarity = (A · B) / (|A| × |B|)
 * Karena embeddings sudah dinormalisasi L2, maka cosine sim = dot product.
 *
 * @param {Float32Array} queryVec - Query embedding (dim)
 * @param {Object} embeddingsData - { numDocs, dim, vectors: Float32Array }
 * @param {number} topK - Jumlah hasil
 * @returns {Map<number, number>} Map<docIndex, similarity_score>
 */
export function searchDense(queryVec, embeddingsData, topK = 100) {
  if (!queryVec || !embeddingsData) return new Map();

  const { numDocs, dim, vectors } = embeddingsData;
  const scores = [];

  // Hitung dot product (= cosine similarity karena L2-normalized)
  for (let i = 0; i < numDocs; i++) {
    const offset = i * dim;
    let dotProduct = 0;
    for (let j = 0; j < dim; j++) {
      dotProduct += queryVec[j] * vectors[offset + j];
    }
    if (dotProduct > 0) {
      scores.push([i, dotProduct]);
    }
  }

  // Sort descending
  scores.sort((a, b) => b[1] - a[1]);

  // Ambil top-K
  const result = new Map();
  for (let k = 0; k < Math.min(topK, scores.length); k++) {
    result.set(scores[k][0], scores[k][1]);
  }

  return result;
}
