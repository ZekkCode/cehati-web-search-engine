"""
build_index.py — Script untuk Membangun Search Index SehatCari
===============================================================
Script ini dijalankan SATU KALI sebelum deploy untuk menghasilkan
file search index yang akan dipakai oleh frontend Next.js.

Output:
  public/data/documents.json   — Metadata dokumen (untuk tampilan)
  public/data/bm25_index.json  — Tokenized corpus + IDF (untuk BM25)
  public/data/embeddings.dat   — Document embeddings (untuk Dense Retrieval)

Cara menjalankan:
  cd website-search-engine/scripts
  py -3.14 -m pip install Sastrawi sentence-transformers
  py -3.14 build_index.py

Proses:
  1. Baca raw_articles.json dari folder crawl/data/raw/
  2. Transform data mentah ke format yang diperlukan
  3. Buat documents.json (kompak, hanya field untuk display)
  4. Tokenisasi semua dokumen → buat bm25_index.json
  5. Generate embeddings → simpan embeddings.dat (opsional)
"""

import json
import os
import sys
import time
import math
import struct
import re
import hashlib

# ── Path Configuration ───────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
CRAWL_DIR = os.path.join(os.path.dirname(PROJECT_DIR), "crawl")

# Dataset langsung dari raw_articles.json (hasil crawling)
RAW_DATASET_PATH = os.path.join(CRAWL_DIR, "data", "raw", "raw_articles.json")
# Fallback: processed dataset jika raw tidak tersedia
PROCESSED_DATASET_PATH = os.path.join(
    CRAWL_DIR, "data", "processed", "dataset_kesehatan_search_engine.json"
)
OUTPUT_DIR = os.path.join(PROJECT_DIR, "public", "data")


# ── Inline Text Preprocessor (no external dependency needed for basic) ──
# Sastrawi akan di-import secara opsional di bawah
_stemmer = None
_STOPWORDS_ID = None
_STEM_CACHE = {}


def _init_nlp():
    """Inisialisasi Sastrawi stemmer dan stopword list."""
    global _stemmer, _STOPWORDS_ID
    if _stemmer is not None:
        return True
    try:
        from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
        from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

        _stemmer = StemmerFactory().create_stemmer()
        _STOPWORDS_ID = set(StopWordRemoverFactory().get_stop_words())
        print("   ✅ Sastrawi NLP loaded")
        return True
    except ImportError:
        print("   ⚠️  Sastrawi tidak terinstall, gunakan preprocessing sederhana")
        # Fallback: daftar stopword minimal
        _STOPWORDS_ID = {
            "ada", "adalah", "adanya", "adapun", "agak", "agar", "akan", "aku",
            "amat", "anda", "antara", "apa", "apabila", "apakah", "apalagi",
            "atas", "atau", "bagai", "bagaimana", "bagi", "bahkan", "bahwa",
            "baik", "banyak", "baru", "bawah", "beberapa", "begitu", "belum",
            "benar", "berada", "berapa", "berbagai", "beri", "berikan",
            "berikut", "bersama", "besar", "bisa", "boleh", "buat", "bukan",
            "cara", "cukup", "dahulu", "dalam", "dan", "dapat", "dari",
            "daripada", "dengan", "depan", "di", "dia", "dimana", "diri",
            "dua", "empat", "hal", "hampir", "hanya", "hari", "harus",
            "hingga", "ia", "ini", "itu", "jadi", "jangan", "jauh", "jika",
            "juga", "kalau", "kami", "kamu", "kan", "kapan", "karena", "kata",
            "ke", "kenapa", "kepada", "kesampaian", "ketika", "kini", "kita",
            "kurang", "lagi", "lain", "lalu", "lama", "langsung", "lebih",
            "lewat", "lima", "luar", "maka", "mampu", "mana", "masa",
            "masih", "masing", "mau", "memang", "membuat", "menjadi",
            "mereka", "meski", "meskipun", "mungkin", "namun", "nanti",
            "nya", "oleh", "pada", "padahal", "paling", "para", "pasti",
            "per", "perlu", "pernah", "pula", "pun", "saat", "saja", "sama",
            "sampai", "sangat", "satu", "saya", "se", "sebagai", "sebab",
            "sebelum", "sebuah", "secara", "sedang", "sedangkan", "sedikit",
            "segala", "segera", "sejak", "sekali", "sekarang", "sekitar",
            "selain", "selalu", "selama", "selanjutnya", "seluruh", "semua",
            "sendiri", "seorang", "seperti", "sering", "serta", "sesuatu",
            "setelah", "setiap", "sudah", "supaya", "tadi", "tak", "tanpa",
            "tapi", "telah", "tentang", "tentu", "tepat", "terhadap",
            "terjadi", "termasuk", "ternyata", "tersebut", "tertentu",
            "tetap", "tetapi", "tiap", "tidak", "tiga", "turut", "untuk",
            "waktu", "walaupun", "yang",
        }
        _stemmer = False  # Mark as loaded but unavailable
        return False


def _get_stem(word):
    """Stem kata menggunakan Sastrawi dengan cache."""
    if word not in _STEM_CACHE:
        if _stemmer and _stemmer is not False:
            _STEM_CACHE[word] = _stemmer.stem(word)
        else:
            _STEM_CACHE[word] = word  # No stemming available
    return _STEM_CACHE[word]


def clean_text(text):
    """Bersihkan teks: lowercase, hapus URL, hapus karakter non-alfanumerik."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess_text(text, use_stemming=True):
    """
    Pipeline preprocessing lengkap: clean → tokenize → stopword → stem.

    Args:
        text: Teks mentah
        use_stemming: Aktifkan stemming (lebih lambat tapi akurat)

    Returns:
        List of preprocessed tokens
    """
    _init_nlp()
    cleaned = clean_text(text)
    tokens = cleaned.split()
    tokens = [t for t in tokens if t not in _STOPWORDS_ID]
    if use_stemming and _stemmer and _stemmer is not False:
        tokens = [_get_stem(t) for t in tokens]
    tokens = [t for t in tokens if len(t) >= 2]
    return tokens


def generate_doc_id(title, source_url, index):
    """Generate unique document ID dari title + source_url + index."""
    raw = f"{title}_{source_url}_{index}"
    hash_suffix = hashlib.md5(raw.encode()).hexdigest()[:8]
    return f"DOC_{index:04d}_{hash_suffix}"


def categorize_health_topic(category):
    """
    Map kategori dari raw_articles ke health_topic yang lebih readable.

    Contoh: 'kesehatan_tubuh/jantung_pembuluh_darah' → 'Jantung & Pembuluh Darah'
    """
    if not category:
        return ""
    # Ambil bagian setelah '/' jika ada
    parts = category.split("/")
    topic = parts[-1] if len(parts) > 1 else parts[0]
    # Ubah underscore ke spasi dan capitalize
    return topic.replace("_", " ").title()


def generate_tags(source_name, category, content_length):
    """Generate tags otomatis berdasarkan sumber, kategori, dan konten."""
    tags = ["artikel_kesehatan"]

    # Tag dari sumber
    source_tag_map = {
        "Ayo Sehat Kemenkes": "ayosehat",
        "Halodoc": "halodoc",
        "Bio Farma": "biofarma",
        "Siloam Hospitals": "siloam",
        "RS Marzoeki Mahdi Bogor": "rsmmbogor",
        "RS Universitas Indonesia": "rsui",
    }
    if source_name in source_tag_map:
        tags.append(source_tag_map[source_name])

    # Tag dari kategori
    if category:
        cat_lower = category.lower()
        if "kanker" in cat_lower:
            tags.append("penyakit_tidak_menular")
        if "jantung" in cat_lower:
            tags.append("penyakit_tidak_menular")
        if "diabetes" in cat_lower:
            tags.append("penyakit_tidak_menular")
        if "mental" in cat_lower or "jiwa" in cat_lower:
            tags.append("kesehatan_mental")
        if "anak" in cat_lower or "bayi" in cat_lower:
            tags.append("ibu_anak")
        if "gizi" in cat_lower or "nutrisi" in cat_lower:
            tags.append("gizi")
        if "olahraga" in cat_lower or "aktivitas" in cat_lower:
            tags.append("gaya_hidup")

    # Tag umum
    tags.append("tips_kesehatan")

    return list(set(tags))


def transform_raw_to_dataset(raw_articles):
    """
    Transform raw_articles.json ke format yang dibutuhkan build_index.

    raw_articles.json format:
      {
        "title": "...",
        "published_date": "2026-05-26",
        "category": "artikel_kesehatan",
        "content": "...(teks panjang)...",
        "source_name": "Ayo Sehat Kemenkes",
        "source_type": "HTML",
        "source_url": "https://...",
        "summary": "",
        "author_or_unit": "Dr ...",
        "crawl_date": "2026-06-05T17:48:26"
      }

    Output format:
      {
        "doc_id": "DOC_0001_abc12345",
        "title": "...",
        "document_text": "judul. konten...",
        "clean_content": "...",
        "content": "...",
        "source_name": "...",
        "source_url": "...",
        "category": "...",
        "health_topic": "...",
        "published_date": "...",
        "author_or_unit": "...",
        "summary": "...",
        "word_count": 1234,
        "tags": [...]
      }
    """
    print(f"🔄 Transformasi {len(raw_articles)} artikel mentah...")
    dataset = []
    seen_urls = set()  # Untuk deduplikasi

    for i, article in enumerate(raw_articles):
        title = article.get("title", "").strip()
        content = article.get("content", "").strip()
        source_url = article.get("source_url", "").strip()

        # Skip artikel tanpa konten atau judul
        if not title or not content:
            continue

        # Deduplikasi berdasarkan source_url
        if source_url and source_url in seen_urls:
            continue
        if source_url:
            seen_urls.add(source_url)

        # Hitung word count
        word_count = len(content.split())

        # Skip artikel dengan konten terlalu pendek (< 50 kata)
        if word_count < 50:
            continue

        # Generate document_text: gabungan title + content untuk indexing
        document_text = f"{title}. {content}"

        # Clean content: hapus karakter aneh, pertahankan readability
        clean_content = content.replace("\r\n", "\n").replace("\r", "\n")
        clean_content = re.sub(r"\n{3,}", "\n\n", clean_content)

        category = article.get("category", "artikel_kesehatan")
        source_name = article.get("source_name", "")
        summary = article.get("summary", "")
        author = article.get("author_or_unit", "")
        published_date = article.get("published_date", "")

        doc = {
            "doc_id": generate_doc_id(title, source_url, i),
            "title": title,
            "document_text": document_text,
            "clean_content": clean_content,
            "content": content,
            "source_name": source_name,
            "source_url": source_url or "#",
            "category": category,
            "health_topic": categorize_health_topic(category),
            "published_date": published_date,
            "author_or_unit": author,
            "summary": summary,
            "word_count": word_count,
            "tags": generate_tags(source_name, category, word_count),
        }
        dataset.append(doc)

    print(f"   ✅ {len(dataset)} artikel valid (dari {len(raw_articles)} total)")
    return dataset


def load_dataset():
    """
    Muat dataset: prioritas raw_articles.json, fallback ke processed dataset.
    """
    # Prioritas 1: raw_articles.json
    if os.path.exists(RAW_DATASET_PATH):
        print(f"📂 Memuat raw dataset: {RAW_DATASET_PATH}")
        with open(RAW_DATASET_PATH, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        print(f"   ✅ {len(raw_data)} artikel mentah dimuat")
        return transform_raw_to_dataset(raw_data)

    # Prioritas 2: processed dataset (fallback)
    if os.path.exists(PROCESSED_DATASET_PATH):
        print(f"📂 Memuat processed dataset: {PROCESSED_DATASET_PATH}")
        with open(PROCESSED_DATASET_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"   ✅ {len(data)} dokumen dimuat")
        return data

    print(f"❌ Dataset tidak ditemukan!")
    print(f"   Cari di: {RAW_DATASET_PATH}")
    print(f"   Atau di: {PROCESSED_DATASET_PATH}")
    sys.exit(1)


def build_documents_json(dataset):
    """
    Buat file documents.json yang berisi metadata kompak untuk tampilan.
    Hanya menyertakan field yang diperlukan oleh frontend untuk menampilkan
    hasil pencarian dan detail artikel.
    """
    print("📄 Membuat documents.json...")
    documents = []
    for doc in dataset:
        if not doc.get("doc_id") or not doc.get("document_text"):
            continue

        # Parse tags dari string JSON ke list (jika perlu)
        tags = doc.get("tags", [])
        if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except (json.JSONDecodeError, TypeError):
                tags = []

        # Buat snippet dari awal clean_content (maks 300 karakter)
        content = doc.get("clean_content", doc.get("content", ""))
        snippet = content[:300] + "..." if len(content) > 300 else content

        documents.append({
            "id": doc["doc_id"],
            "title": doc.get("title", "Tanpa Judul"),
            "source_name": doc.get("source_name", ""),
            "source_url": doc.get("source_url", "#"),
            "category": doc.get("category", ""),
            "health_topic": doc.get("health_topic", ""),
            "published_date": doc.get("published_date", ""),
            "author": doc.get("author_or_unit", ""),
            "summary": doc.get("summary", ""),
            "snippet": snippet,
            "content": content,
            "word_count": int(doc.get("word_count", 0)),
            "tags": tags,
        })

    print(f"   ✅ {len(documents)} dokumen diproses")
    return documents


def build_bm25_index(dataset):
    """
    Bangun BM25 index: tokenisasi corpus, hitung IDF, simpan metadata.

    BM25 memerlukan:
    - corpus: list of tokenized documents (list of list of str)
    - idf: dict {term: idf_value}
    - doc_lengths: list panjang tiap dokumen
    - avg_dl: rata-rata panjang dokumen

    Formula IDF (Robertson-Walker):
    IDF(t) = log((N - n(t) + 0.5) / (n(t) + 0.5) + 1)
    dimana N = total dokumen, n(t) = jumlah dokumen mengandung term t
    """
    print("🔧 Membangun BM25 index...")
    start = time.time()

    # Inisialisasi NLP
    _init_nlp()

    # ── Tokenisasi corpus ────────────────────────────────────────────
    corpus = []
    for i, doc in enumerate(dataset):
        if not doc.get("document_text"):
            corpus.append([])
            continue

        tokens = preprocess_text(doc["document_text"], use_stemming=False)
        corpus.append(tokens)

        if (i + 1) % 500 == 0:
            print(f"   ... {i + 1}/{len(dataset)} dokumen di-tokenisasi")

    # ── Hitung document frequency untuk setiap term ──────────────────
    N = len(corpus)
    df = {}  # document frequency: {term: jumlah dokumen mengandung term}
    doc_lengths = []

    for tokens in corpus:
        doc_lengths.append(len(tokens))
        unique_terms = set(tokens)
        for term in unique_terms:
            df[term] = df.get(term, 0) + 1

    avg_dl = sum(doc_lengths) / N if N > 0 else 0

    # ── Hitung IDF ──────────────────────────────────────────────────
    idf = {}
    for term, freq in df.items():
        # Formula BM25 IDF (Robertson-Walker)
        idf[term] = math.log((N - freq + 0.5) / (freq + 0.5) + 1)

    elapsed = time.time() - start
    print(f"   ✅ BM25 index selesai dalam {elapsed:.1f}s")
    print(f"   Vocabulary: {len(idf)} terms | Avg doc length: {avg_dl:.0f}")

    return {
        "corpus": corpus,
        "idf": idf,
        "doc_lengths": doc_lengths,
        "avg_dl": avg_dl,
        "total_docs": N,
    }


def build_embeddings(dataset):
    """
    Generate embeddings untuk setiap dokumen menggunakan
    sentence-transformers model multilingual.

    Model: paraphrase-multilingual-MiniLM-L12-v2
    Dimensi: 384
    """
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
    except ImportError:
        print("⚠️  sentence-transformers belum terinstall. Skip embeddings.")
        print("   Install: pip install sentence-transformers")
        return None

    print("🤖 Memuat model embedding...")
    model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

    # Siapkan teks untuk encoding: title + summary + clean_content
    texts = []
    for doc in dataset:
        parts = [
            doc.get("title", ""),
            doc.get("summary", ""),
            doc.get("clean_content", doc.get("content", "")),
        ]
        combined = " ".join(p for p in parts if p)
        texts.append(combined[:2000])  # Batasi panjang untuk efisiensi

    print(f"🧮 Encoding {len(texts)} dokumen...")
    start = time.time()

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=64,
        normalize_embeddings=True,  # L2 normalize untuk cosine similarity
    )

    elapsed = time.time() - start
    print(f"   ✅ Embeddings selesai dalam {elapsed:.1f}s")
    print(f"   Shape: {embeddings.shape}")

    return embeddings


def save_embeddings_binary(embeddings, path):
    """
    Simpan embeddings sebagai file binary (Float32).
    Format: [num_docs (4 bytes)] [dim (4 bytes)] [float32 data...]

    Ini jauh lebih kecil daripada JSON (~8MB vs ~17MB).
    """
    import numpy as np
    num_docs, dim = embeddings.shape
    with open(path, "wb") as f:
        # Header: num_docs dan dimensi sebagai uint32
        f.write(struct.pack("<II", num_docs, dim))
        # Data: embedding vectors sebagai float32
        f.write(embeddings.astype(np.float32).tobytes())

    size_mb = os.path.getsize(path) / (1024 * 1024)
    print(f"   💾 Embeddings disimpan: {path} ({size_mb:.1f} MB)")


def main():
    """Main script: build semua search index."""
    print("=" * 60)
    print("🏗️  SehatCari — Build Search Index")
    print("=" * 60)

    # Buat output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # ── 1. Muat dataset ──────────────────────────────────────────────
    dataset = load_dataset()

    # Filter hanya dokumen yang valid
    dataset = [d for d in dataset if d.get("doc_id") and d.get("document_text")]
    print(f"   Dokumen valid: {len(dataset)}")

    # ── 2. Buat documents.json ───────────────────────────────────────
    documents = build_documents_json(dataset)
    docs_path = os.path.join(OUTPUT_DIR, "documents.json")
    with open(docs_path, "w", encoding="utf-8") as f:
        json.dump(documents, f, ensure_ascii=False)
    size_mb = os.path.getsize(docs_path) / (1024 * 1024)
    print(f"   💾 documents.json disimpan ({size_mb:.1f} MB)")

    # ── 3. Buat BM25 index ───────────────────────────────────────────
    bm25_data = build_bm25_index(dataset)
    bm25_path = os.path.join(OUTPUT_DIR, "bm25_index.json")
    with open(bm25_path, "w", encoding="utf-8") as f:
        json.dump(bm25_data, f, ensure_ascii=False)
    size_mb = os.path.getsize(bm25_path) / (1024 * 1024)
    print(f"   💾 bm25_index.json disimpan ({size_mb:.1f} MB)")

    # ── 4. Generate embeddings (opsional) ────────────────────────────
    embeddings = build_embeddings(dataset)
    if embeddings is not None:
        emb_path = os.path.join(OUTPUT_DIR, "embeddings.dat")
        save_embeddings_binary(embeddings, emb_path)

    # ── Selesai ──────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("✅ Build selesai! File output di:", OUTPUT_DIR)
    print("   Selanjutnya: npm run dev")
    print("=" * 60)


if __name__ == "__main__":
    main()
