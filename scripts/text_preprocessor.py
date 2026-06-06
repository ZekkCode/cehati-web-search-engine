"""
text_preprocessor.py — Preprocessing Teks Bahasa Indonesia
============================================================
Modul ini menangani preprocessing teks untuk BM25 indexing:
1. Case folding (lowercase)
2. Cleaning (hapus URL, karakter non-alfanumerik)
3. Tokenisasi (pecah menjadi kata)
4. Stopword removal (hapus kata umum)
5. Stemming (ubah ke bentuk dasar dengan Nazief-Adriani)

Library: Sastrawi — stemmer dan stopword Bahasa Indonesia
"""

import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

# Inisialisasi Sastrawi (sekali saat import)
_stemmer_factory = StemmerFactory()
stemmer = _stemmer_factory.create_stemmer()
_stopword_factory = StopWordRemoverFactory()
STOPWORDS_ID = set(_stopword_factory.get_stop_words())

# Cache untuk stemming agar jauh lebih cepat (tidak perlu re-stem kata yang sama)
_STEM_CACHE = {}

def get_stem(word):
    if word not in _STEM_CACHE:
        _STEM_CACHE[word] = stemmer.stem(word)
    return _STEM_CACHE[word]


def clean_text(text: str) -> str:
    """Bersihkan teks: lowercase, hapus URL, hapus karakter non-alfanumerik."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess_text(text, use_stemming = True):
    """
    Pipeline preprocessing lengkap: clean → tokenize → stopword → stem.

    Args:
        text: Teks mentah
        use_stemming: Aktifkan stemming (lebih lambat tapi akurat)

    Returns:
        List of preprocessed tokens
    """
    cleaned = clean_text(text)
    tokens = cleaned.split()
    tokens = [t for t in tokens if t not in STOPWORDS_ID]
    if use_stemming:
        tokens = [get_stem(t) for t in tokens]
    tokens = [t for t in tokens if len(t) >= 2]
    return tokens
