# 📖 Petunjuk Pengoperasian Lokal CEHATI (Untuk Dosen Pengampu)

Selamat datang di panduan pengoperasian lokal aplikasi **CEHATI (Cek Kesehatan dari Artikel)**. Berkas panduan ini disusun secara sistematis untuk memudahkan Bapak/Ibu Dosen Pengampu dalam menjalankan, menguji, dan menilai proyek mesin pencari kesehatan (Medical Search Engine) ini.

---

## 👤 Informasi Mahasiswa (Pengembang)

* **Nama Lengkap**: Zakaria Mujur Prasetyo
* **NIM**: 240411100144
* **Program Studi**: Teknik Informatika
* **Jurusan**: Teknik Informatika
* **Instansi**: Universitas Trunojoyo Madura (UTM)
* **Mata Kuliah**: Praktikum / Tugas Besar Temu Kembali Informasi (Information Retrieval)

---

## 💻 Prasyarat Sistem (System Prerequisites)

Sebelum menjalankan aplikasi, pastikan sistem Bapak/Ibu memiliki prasyarat berikut:
1. **Node.js** (Versi `18.x`, `20.x`, atau `22.x` direkomendasikan).
2. **Koneksi Internet** aktif (Koneksi internet diperlukan agar sistem dapat mengirimkan kueri pencarian ke *Hugging Face Inference API* guna melakukan proses *Query Embedding/Encoding* secara dinamis untuk metode *Dense Retrieval* semantik).

---

## 🚀 Langkah-Langkah Menjalankan Aplikasi Secara Lokal

### Langkah 1: Ekstraksi dan Masuk ke Direktori Proyek
Ekstrak berkas submission zip UAS, buka terminal (PowerShell, Command Prompt, atau Terminal di VS Code) di komputer Anda, lalu navigasikan ke direktori utama folder proyek website:
```bash
cd "240411100144-tugas-UAS/website-search-engine"
```

### Langkah 2: Instalasi Dependensi (Node Modules)
Jalankan perintah berikut untuk menginstal semua dependensi paket (seperti Next.js, React, Motion, dan Phosphor Icons) yang dibutuhkan oleh aplikasi:
```bash
npm install
```

### Langkah 3: Menjalankan Server Mode Pengembangan (Local Dev Server)
Jalankan server pengembangan lokal dengan perintah berikut:
```bash
npm run dev
```
Setelah proses selesai (biasanya hanya memakan waktu 2-3 detik), silakan buka peramban (*web browser*) Anda dan akses alamat:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Panduan Penilaian & Pengujian Kriteria UAS (Untuk Dosen)

Bapak/Ibu dapat menguji kesesuaian implementasi teknis IR (Information Retrieval) pada aplikasi CEHATI dengan langkah-langkah di bawah ini:

### 1. Pembuktian Metode Hybrid Search (Lexical & Semantic)
* **Uji Kueri Semantik**: Cari dengan kata kunci awam atau sinonim, seperti `"gula darah tinggi"` atau `"luka bakar air panas"`.
* **Kesesuaian Skor Relevansi**: 
  * Pada kartu hasil pencarian, sistem akan menampilkan **% Match** (Persentase Relevansi) beserta nilai desimal **Score** presisi (gabungan terbobot dari BM25 dan Dense Retrieval).
  * Pada bar detail metadata hasil pencarian, sistem secara otomatis mendeteksi status **Metode: HYBRID** jika panggilan embeddings berhasil, menunjukkan bahwa perangkingan telah memadukan pencarian leksikal dan semantik.
  * **Bobot Penggabungan**: Skor gabungan dihitung menggunakan rumus:
    $$\text{Skor Hibrida} = 0.4 \times \text{Normalize}(\text{BM25}) + 0.6 \times \text{Normalize}(\text{Dense})$$

### 2. Pembuktian Parameter & Algoritma BM25 (Okapi BM25)
* Pengaturan parameter BM25 dikonfigurasi secara ketat sesuai dengan ketentuan UAS:
  * Parameter Saturasi Term Frequency ($k_1$) = **`1.2`**
  * Parameter Normalisasi Panjang Dokumen ($b$) = **`0.75`**
* Bapak/Ibu dapat memeriksa file kode implementasi rumus BM25 ini langsung pada file:  
  📁 [src/models/bm25Model.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/models/bm25Model.js)
* **Koreksi Precision Matching**: Tokenisasi di tingkat leksikal dilengkapi dengan filter panjang minimum kueri $\ge 3$ huruf (`qTerm.length >= 3 && dt.startsWith(qTerm)`) untuk menghindari kecocokan salah pada kata dasar yang sangat pendek (seperti kata kueri `"penyakit"` tidak akan secara salah mencocokkan kata medis `"pen"` / alat bedah pen).

### 3. Pembuktian Dense Retrieval (Sentence Transformers)
* **Model**: Model yang digunakan untuk Query Embedding adalah model Transformer multibahasa dari Hugging Face: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (menghasilkan vektor berdimensi 384).
* **Adblock-Proof API Proxy (Server-Side Route)**: Untuk menghindari kegagalan *fetch* di sisi klien akibat adanya ekstensi pemblokir iklan (*Adblocker/CORS block*) di peramban, kueri embedding diproses melalui proxy Server-Side API Route lokal Next.js pada alamat:  
  📁 [src/app/api/encode/route.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/app/api/encode/route.js)

### 4. Struktur Arsitektur Pola MVC (Model-View-Controller)
Kode sumber aplikasi diatur rapi mengikuti pola arsitektur MVC untuk pemisahan logika sistem temu kembali informasi:
1. **Model Layer** (Logika Retrieval & Rumus):
   * [bm25Model.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/models/bm25Model.js) (Okapi BM25)
   * [denseModel.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/models/denseModel.js) (Semantic Dense)
   * [hybridModel.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/models/hybridModel.js) (Hybrid Scoring)
2. **Controller Layer** (Logika Bisnis & Koordinasi):
   * [searchController.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/controllers/searchController.js) (Mengatur alur inisialisasi indeks, pencarian, statistik, dan filter)
3. **View Layer** (Antarmuka Pengguna / Next.js Page Router):
   * Halaman Beranda: [src/app/page.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/app/page.js)
   * Halaman Pencarian: [src/app/search/page.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/app/search/page.js)
   * Halaman Detail: [src/app/article/[id]/page.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/app/article/%5Bid%5D/page.js)
   * Halaman Tentang: [src/app/about/page.js](file:///e:/Semester%204/Temu%20Kembali%20Informasi/TugasPertemuan8/240411100144-tugas-UAS/website-search-engine/src/app/about/page.js)

---

Terima kasih atas waktu dan perhatian Bapak/Ibu Dosen Pengampu dalam menguji sistem temu kembali informasi CEHATI ini. Semoga proyek ini memenuhi standar penilaian akademik yang diharapkan.
