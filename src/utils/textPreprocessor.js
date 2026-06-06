/**
 * textPreprocessor.js — Preprocessing Teks Bahasa Indonesia (Client-Side)
 * ========================================================================
 * Versi JavaScript dari text_preprocessor.py untuk digunakan di browser.
 * Melakukan tokenisasi dan pembersihan teks query pencarian.
 *
 * Catatan: Stemming Bahasa Indonesia TIDAK dilakukan di client-side
 * karena library Sastrawi hanya tersedia di Python.
 * Stemming sudah dilakukan saat build_index.py dijalankan.
 * Untuk query, kita gunakan pendekatan tanpa stemming
 * karena BM25 tetap bisa bekerja dengan token tanpa stem.
 *
 * Update: Kita menyertakan daftar stopword Bahasa Indonesia
 * yang sama dengan Sastrawi agar hasil preprocessing konsisten.
 */

// ── Daftar Stopword Bahasa Indonesia ────────────────────────────────
// Daftar ini diambil dari Sastrawi dan mencakup kata-kata umum
// yang tidak memiliki makna pencarian (dan, di, ke, dari, dll.)
const STOPWORDS_ID = new Set([
  "ada", "adalah", "adanya", "adapun", "agak", "agaknya", "agar", "akan",
  "akankah", "akhir", "akhirnya", "aku", "akulah", "amat", "amatlah",
  "anda", "andalah", "antar", "antara", "antaranya", "apa", "apaan",
  "apabila", "apakah", "apalagi", "apatah", "artinya", "asal", "asalkan",
  "atas", "atau", "ataukah", "ataupun", "awal", "awalnya", "bagai",
  "bagaikan", "bagaimana", "bagaimanakah", "bagaimanapun", "bagi",
  "bagian", "bahkan", "bahwa", "bahwasanya", "baik", "bakal", "bakalan",
  "balik", "banyak", "bapak", "baru", "bawah", "beberapa", "begini",
  "beginian", "beginikah", "beginilah", "begitu", "begitukah", "begitulah",
  "begitupun", "bekas", "belakang", "belakangan", "belum", "belumlah",
  "benar", "benarkah", "benarlah", "berada", "berakhir", "berakhirlah",
  "berakhirnya", "berapa", "berapakah", "berapalah", "berapapun",
  "berarti", "berawal", "berbagai", "berdatangan", "beri", "berikan",
  "berikut", "berikutnya", "berjumlah", "berkali", "berkata", "berkehendak",
  "berkeinginan", "berkenaan", "berlainan", "berlalu", "berlangsung",
  "berlebihan", "bermacam", "bermaksud", "bermula", "bersama",
  "bersiap", "bertanya", "berturut", "bertutur", "berupa", "besar",
  "betul", "betulkah", "biasa", "biasanya", "bila", "bilakah", "bisa",
  "bisakah", "boleh", "bolehkah", "bolehlah", "buat", "bukan", "bukankah",
  "bukanlah", "bukannya", "bulan", "bung", "cara", "caranya", "cukup",
  "cukupkah", "cukuplah", "cuma", "dahulu", "dalam", "dan", "dapat",
  "dari", "daripada", "datang", "dekat", "demi", "demikian", "demikianlah",
  "dengan", "depan", "di", "dia", "diakhiri", "diakhirinya", "dialah",
  "diantara", "diantaranya", "diberi", "diberikan", "diberikannya",
  "dibuat", "dibuatnya", "didapat", "didatangkan", "digunakan", "diibaratkan",
  "diibaratkannya", "diingat", "diingatkan", "diinginkan", "dijumpai",
  "dilakukan", "dilalui", "dilihat", "dimaksud", "dimaksudkan",
  "dimaksudkannya", "dimaksudnya", "dimana", "diminta", "dimisalkan",
  "dimulai", "dimulailah", "dimulainya", "dimungkinkan", "dini", "dipastikan",
  "diperbuat", "diperbuatnya", "dipergunakan", "diperkirakan",
  "diperlihatkan", "diperlukan", "dipersoalkan", "dipertanyakan",
  "dipunyai", "diri", "dirinya", "disampaikan", "disebut", "disebutkan",
  "disebutkannya", "disini", "disinilah", "ditambahkan", "ditandaskan",
  "ditanya", "ditanyai", "ditanyakan", "ditegaskan", "ditujukan",
  "ditunjuk", "ditunjuki", "ditunjukkan", "ditunjukkannya", "ditunjuknya",
  "dituturkan", "dituturkannya", "diucapkan", "diucapkannya", "diungkapkan",
  "dong", "dua", "dulu", "empat", "enggak", "enggaknya", "entah",
  "entahlah", "guna", "gunakan", "hal", "hampir", "hanya", "hanyalah",
  "hari", "harus", "haruslah", "harusnya", "hendak", "hendaklah",
  "hendaknya", "hingga", "ia", "ialah", "ibarat", "ibaratkan",
  "ibaratnya", "ibu", "ikut", "ingat", "ingin", "inginkah", "inginkan",
  "ini", "inikah", "inilah", "itu", "itukah", "itulah", "jadi",
  "jadilah", "jadinya", "jangan", "jangankan", "janganlah", "jauh",
  "jawab", "jawaban", "jawabnya", "jelas", "jelaskan", "jelaslah",
  "jelasnya", "jika", "jikalau", "juga", "jumlah", "jumlahnya",
  "justru", "kala", "kalau", "kalaulah", "kalaupun", "kalian", "kami",
  "kamilah", "kamu", "kamulah", "kan", "kapan", "kapankah", "kapanpun",
  "karena", "karenanya", "kasus", "kata", "katakan", "katakanlah",
  "katanya", "ke", "keadaan", "kebetulan", "kecil", "kedua",
  "keduanya", "keinginan", "kelamaan", "kelihatan", "kelihatannya",
  "kelima", "keluar", "kembali", "kemudian", "kemungkinan",
  "kemungkinannya", "kenapa", "kepada", "kepadanya", "kesampaian",
  "keseluruhan", "keseluruhannya", "keterlaluan", "ketika", "khususnya",
  "kini", "kinilah", "kira", "kiranya", "kita", "kitalah", "kok",
  "kurang", "lagi", "lagian", "lah", "lain", "lainnya", "lalu",
  "lama", "lamanya", "langsung", "lanjut", "lanjutnya", "lebih",
  "lewat", "lima", "luar", "macam", "maka", "makanya", "makin",
  "malah", "malahan", "mampu", "mampukah", "mana", "manakala",
  "manalagi", "masa", "masalah", "masalahnya", "masih", "masihkah",
  "masing", "mau", "maupun", "melainkan", "melakukan", "melalui",
  "melihat", "melihatnya", "memang", "memastikan", "memberi",
  "memberikan", "membuat", "memerlukan", "memihak", "meminta",
  "memintakan", "memisalkan", "memperbuat", "mempergunakan",
  "memperkirakan", "memperlihatkan", "mempersiapkan", "mempersoalkan",
  "mempertanyakan", "mempunyai", "memulai", "memungkinkan", "menaiki",
  "menambahkan", "menandaskan", "menanti", "menantikan", "menanya",
  "menanyai", "menanyakan", "mendapat", "mendapatkan", "mendatang",
  "mendatangi", "mendatangkan", "menegaskan", "mengakhiri",
  "mengapa", "mengatakan", "mengatakannya", "mengenai", "mengerjakan",
  "mengetahui", "menggunakan", "menghendaki", "mengibaratkan",
  "mengibaratkannya", "mengingat", "mengingatkan", "menginginkan",
  "mengira", "mengucapkan", "mengucapkannya", "mengungkapkan",
  "menjadi", "menjawab", "menjelaskan", "menuju", "menunjuk",
  "menunjuki", "menunjukkan", "menunjuknya", "menurut", "menuturkan",
  "menyampaikan", "menyangkut", "menyatakan", "menyebutkan",
  "menyeluruh", "menyiapkan", "merasa", "mereka", "merekalah",
  "merupakan", "meski", "meskipun", "meyakini", "meyakinkan",
  "minta", "mirip", "misal", "misalkan", "misalnya", "mula", "mulai",
  "mulailah", "mulanya", "mungkin", "mungkinkah", "nah", "naik",
  "namun", "nanti", "nantinya", "nyaris", "nyatanya", "oleh",
  "olehnya", "pada", "padahal", "padanya", "pak", "paling",
  "panjang", "pantas", "para", "pasti", "pastilah", "penting",
  "pentingnya", "per", "percuma", "perlu", "perlukah", "perlunya",
  "pernah", "persoalan", "pertama", "pertanyaan", "pertanyakan",
  "pihak", "pihaknya", "pukul", "pula", "pun", "punya", "rasa",
  "rasanya", "rata", "rupanya", "saat", "saatnya", "saja", "sajalah",
  "saling", "sama", "sambil", "sampai", "sana", "sangat", "sangatlah",
  "satu", "saya", "sayalah", "se", "sebab", "sebabnya", "sebagai",
  "sebagaimana", "sebagainya", "sebagian", "sebaik", "sebaiknya",
  "sebaliknya", "sebanyak", "sebegini", "sebegitu", "sebelum",
  "sebelumnya", "sebenarnya", "seberapa", "sebesar", "sebetulnya",
  "sebisanya", "sebuah", "sebut", "sebutlah", "sebutnya", "secara",
  "secukupnya", "sedang", "sedangkan", "sedemikian", "sedikit",
  "sedikitnya", "seenaknya", "segala", "segalanya", "segera",
  "seharusnya", "sehingga", "seingat", "sejak", "sejauh",
  "sejenak", "sejumlah", "sekadar", "sekadarnya", "sekali",
  "sekalian", "sekaligus", "sekalipun", "sekarang", "sekecil",
  "seketika", "sekiranya", "sekitar", "sekitarnya", "sekurang",
  "sekurangnya", "sela", "selain", "selaku", "selalu", "selama",
  "selamanya", "selanjutnya", "seluruh", "seluruhnya", "semacam",
  "semakin", "semampu", "semata", "sembari", "sementara", "semisal",
  "semisalnya", "sempat", "semua", "semuanya", "semula", "sendiri",
  "sendirian", "sendirinya", "seolah", "seorang", "sepanjang",
  "sepantasnya", "sepantasnyalah", "seperlunya", "seperti",
  "sepertinya", "sepihak", "sering", "seringnya", "serta",
  "serupa", "sesaat", "sesama", "sesampai", "sesegera", "sesekali",
  "seseorang", "sesuatu", "sesuatunya", "sesudah", "sesudahnya",
  "setelah", "setengah", "seterusnya", "setiap", "setiba",
  "setidaknya", "setinggi", "seusai", "sewaktu", "siap", "siapa",
  "siapakah", "siapapun", "sini", "sinilah", "soal", "soalnya",
  "suatu", "sudah", "sudahkah", "sudahlah", "supaya", "tadi",
  "tadinya", "tahu", "tahun", "tak", "tambah", "tambahnya", "tampak",
  "tampaknya", "tandas", "tandasnya", "tanpa", "tanya", "tanyakan",
  "tanyanya", "tapi", "tenang", "tentang", "tentu", "tentulah",
  "tentunya", "tepat", "terakhir", "terasa", "terbanyak", "terdahulu",
  "terdapat", "terdiri", "terhadap", "terhadapnya", "teringat",
  "terjadi", "terjadilah", "terjadinya", "terkira", "terlalu",
  "terlebih", "terlihat", "termasuk", "ternyata", "tersampaikan",
  "tersebut", "tersebutlah", "tertentu", "tertuju", "terus",
  "terutama", "tetap", "tetapi", "tiap", "tiba", "tidakkah",
  "tidaklah", "tidak", "tiga", "tinggi", "toh", "tunjuk",
  "turut", "tutur", "tuturnya", "ucap", "ucapnya", "ujar",
  "ujarnya", "umum", "umumnya", "ungkap", "ungkapnya", "untuk",
  "usah", "usai", "waduh", "wah", "wahai", "waktu", "walaupun",
  "wong", "yakni", "yaitu", "yang",
]);

/**
 * Bersihkan teks: lowercase, hapus URL, hapus karakter non-alfanumerik.
 * @param {string} text - Teks mentah
 * @returns {string} Teks bersih
 */
export function cleanText(text) {
  if (!text) return "";
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/https?:\/\/\S+|www\.\S+/g, "");
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
}

/**
 * Tokenisasi teks menjadi array kata.
 * @param {string} text - Teks bersih
 * @returns {string[]} Array token
 */
export function tokenize(text) {
  if (!text) return [];
  return text.split(" ").filter((t) => t.length >= 2);
}

/**
 * Hapus stopword Bahasa Indonesia dari array token.
 * @param {string[]} tokens - Array token
 * @returns {string[]} Token tanpa stopword
 */
export function removeStopwords(tokens) {
  return tokens.filter((t) => !STOPWORDS_ID.has(t));
}

/**
 * Pipeline preprocessing query:
 * clean → tokenize → remove stopwords
 *
 * CATATAN: Stemming tidak dilakukan di client karena
 * library Sastrawi hanya ada di Python. Tapi karena
 * BM25 index sudah di-stem saat build, kita perlu
 * mencocokkan token query tanpa stem.
 * Oleh karena itu, kita simpan corpus dan stemmed corpus
 * dan gunakan pendekatan matching.
 *
 * @param {string} query - Query pencarian
 * @returns {string[]} Token yang sudah diproses
 */
export function preprocessQuery(query) {
  const cleaned = cleanText(query);
  const tokens = tokenize(cleaned);
  const filtered = removeStopwords(tokens);
  return filtered;
}

/**
 * Generate snippet teks yang relevan dengan query.
 * Mencari posisi pertama kata query dalam teks dan
 * mengambil konteks di sekitarnya.
 *
 * @param {string} text - Teks lengkap
 * @param {string} query - Query pencarian
 * @param {number} maxLen - Panjang maks snippet
 * @returns {string} Snippet dengan konteks
 */
export function generateSnippet(text, query, maxLen = 300) {
  if (!text) return "";
  if (!query) return text.slice(0, maxLen) + (text.length > maxLen ? "..." : "");

  const textLower = text.toLowerCase();
  const words = query.toLowerCase().split(/\s+/);

  let bestPos = -1;
  for (const w of words) {
    const pos = textLower.indexOf(w);
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos;
    }
  }

  let snippet;
  if (bestPos === -1) {
    snippet = text.slice(0, maxLen);
  } else {
    const start = Math.max(0, bestPos - 50);
    snippet = (start > 0 ? "..." : "") + text.slice(start, start + maxLen);
  }

  if (snippet.length < text.length) snippet = snippet.trimEnd() + "...";
  return snippet;
}
