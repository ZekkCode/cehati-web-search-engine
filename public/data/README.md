# public/data/

Folder ini berisi data pre-computed yang dihasilkan oleh `scripts/build_index.py`.

## File yang akan dihasilkan:

- `documents.json` — Metadata dokumen untuk display
- `bm25_index.json` — Tokenized corpus + IDF untuk BM25  
- `embeddings.bin` — Document embeddings untuk Dense Retrieval

## Cara generate:

```bash
cd scripts
pip install -r requirements.txt
python build_index.py
```
