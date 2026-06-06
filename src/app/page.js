"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStats, initSearchEngine, getFeaturedArticles } from "@/controllers/searchController";
import {
  Stethoscope,
  BookOpen,
  MagnifyingGlass,
  ArrowRight,
  Key,
  Brain,
  GitMerge
} from "@phosphor-icons/react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [engineReady, setEngineReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function prepare() {
      const ready = await initSearchEngine();
      setEngineReady(ready);
      if (ready) {
        setStats(await getStats());
        const articles = await getFeaturedArticles(6);
        setFeaturedArticles(articles);
      }
      setLoading(false);
    }

    prepare();
  }, []);

  if (!mounted) {
    return <div className="min-h-[100dvh] bg-[#F8FAFC]" />;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main id="main-content" className="min-h-[100dvh] bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between relative overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Tentang
            </Link>
            <button className="text-[#0D9488] p-1.5 hover:bg-[#CCFBF1] rounded-lg transition-colors cursor-pointer flex items-center justify-center">
              <Stethoscope size={20} weight="bold" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12 md:px-6 md:pt-24 text-center max-w-4xl mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#CBD5E1] bg-white shadow-sm text-xs font-semibold text-[#0D9488] mx-auto">
            <BookOpen size={14} weight="bold" className="shrink-0" />
            Perpustakaan Informasi Kesehatan Digital
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-balance text-slate-900 leading-[1.05] tracking-[-0.04em] flex flex-col items-center">
            <span className="text-5xl md:text-7xl font-extrabold block text-[#0D9488]">CEHATI</span>
            <span className="text-3xl md:text-5xl font-extrabold block text-slate-800 mt-2">Cek Kesehatan dari Artikel</span>
          </h1>

          <p className="mt-6 text-pretty text-sm md:text-base leading-relaxed text-[#475569] max-w-2xl mx-auto">
            Cari dan telusuri ribuan artikel kesehatan tervalidasi dari rumah sakit dan institusi medis terkemuka di Indonesia.
          </p>
        </motion.header>

        {/* Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10"
        >
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-full border border-[#E2E8F0] shadow-md flex items-center p-1.5 focus-within:border-[#0D9488] focus-within:ring-4 focus-within:ring-[#CCFBF1] transition-all">
              <div className="flex items-center flex-1 px-4">
                <MagnifyingGlass size={20} weight="bold" className="text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari penyakit, obat, gejala, atau artikel medis..."
                  className="flex-1 bg-transparent outline-none text-[#0F172A] placeholder-slate-400 text-sm md:text-base"
                  disabled={!engineReady}
                />
              </div>
              <button
                type="submit"
                disabled={!engineReady || !searchQuery.trim()}
                className="px-6 py-3 bg-[#0D9488] hover:bg-[#0F766E] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-semibold transition-all text-sm shrink-0 cursor-pointer"
              >
                Cari Artikel
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center items-center text-sm">
            <span className="text-[#475569] font-medium">Pencarian Populer:</span>
            {["Diabetes", "Hipertensi", "Kesehatan Anak", "Nutrisi", "Kesehatan Jiwa"].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSearchQuery(topic);
                  router.push(`/search?q=${encodeURIComponent(topic)}`);
                }}
                disabled={!engineReady}
                className="px-4 py-1.5 bg-white hover:bg-[#CCFBF1] hover:text-[#0D9488] text-[#475569] rounded-full border border-[#E2E8F0] transition-colors text-xs font-semibold cursor-pointer shadow-sm"
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 w-full">
        <div className="mb-8 flex items-end justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#0F172A] md:text-3xl">
              Artikel Kesehatan Pilihan
            </h2>
          </div>
          <Link href="/search?q=kesehatan" className="text-sm font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors flex items-center gap-1.5">
            Lihat Semua <ArrowRight size={14} weight="bold" className="shrink-0" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-slate-150 rounded w-full mb-2" />
                <div className="h-3 bg-slate-150 rounded w-5/6 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`} className="block group">
                <article className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:border-[#0D9488] hover:shadow-md transition-all duration-300 flex flex-col h-[285px] justify-between">
                  <div>
                    {/* Source Tag */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase border ${getSourceBadgeClass(article.source_name)}`}>
                        {article.source_name}
                      </span>
                      {article.health_topic && (
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-medium">
                          {article.health_topic}
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors line-clamp-2 leading-snug mb-3">
                      {article.title}
                    </h3>
                    {/* Excerpt */}
                    <p className="text-sm text-[#475569] line-clamp-3 leading-relaxed">
                      {article.summary || article.content || "Baca kelanjutan artikel untuk penjelasan lebih lanjut..."}
                    </p>
                  </div>
                  {/* Card Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-450 border-t border-[#E2E8F0] pt-4 font-semibold">
                    <span>{article.published_date || "Terbitan Baru"}</span>
                    <span className="flex items-center gap-1.5 text-[#0D9488] group-hover:text-[#0F766E] font-bold transition-colors">
                      Baca Selengkapnya <ArrowRight size={14} weight="bold" className="shrink-0" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Dataset Sources Section */}
      <section className="bg-slate-50 border-t border-b border-[#E2E8F0] py-12 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider mb-2">
              Koleksi Artikel Medis
            </h2>
            <p className="text-xl font-bold text-[#0F172A]">
              Sumber Dataset Kesehatan Terpercaya & Terakreditasi
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {[
              { name: "Ayo Sehat Kemenkes", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
              { name: "Halodoc", color: "border-sky-200 bg-sky-50 text-sky-700" },
              { name: "Bio Farma", color: "border-rose-200 bg-rose-50 text-rose-700" },
              { name: "Siloam Hospitals", color: "border-orange-200 bg-orange-50 text-orange-700" },
              { name: "RS Marzoeki Mahdi Bogor", color: "border-purple-200 bg-purple-50 text-purple-700" },
              { name: "RS Universitas Indonesia", color: "border-amber-200 bg-amber-50 text-amber-700" }
            ].map((src) => (
              <span
                key={src.name}
                className={`px-4 py-2 border rounded-xl text-xs font-bold shadow-sm ${src.color}`}
              >
                {src.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section (Technology) */}
      <section className="bg-white border-t border-[#E2E8F0] py-16 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#0F172A] md:text-3xl">
              Akurasi Tinggi Melalui Pencarian Hibrida
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Column 1 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between min-h-[246px]">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] mb-6 shadow-sm">
                  <Key size={20} weight="bold" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mb-3">BM25 (Kata Kunci)</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Algoritma pencarian leksikal tradisional yang mencocokkan kata kunci secara presisi. Sangat efektif untuk menemukan nama obat spesifik atau istilah medis Latin.
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between min-h-[246px]">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] mb-6 shadow-sm">
                  <Brain size={20} weight="bold" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mb-3">Dense Retrieval (Semantik)</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Memahami konteks dan makna di balik pertanyaan Anda menggunakan AI embeddings. Menemukan artikel relevan meskipun menggunakan sinonim atau istilah awam.
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between min-h-[246px]">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0D9488] mb-6 shadow-sm">
                  <GitMerge size={20} weight="bold" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mb-3">Hybrid Reranking</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Menggabungkan skor dari pencarian leksikal dan semantik, menghasilkan daftar hasil yang sangat relevan dan akurat secara klinis di halaman pertama.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-4 py-8 md:px-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-[#475569]">
          <div>
            <div className="text-base font-bold text-[#0D9488] mb-1">CEHATI</div>
            <div className="text-xs text-slate-400 font-medium">© 2024 CEHATI Digital Health Library. All rights reserved.</div>
          </div>
          <div className="flex gap-6 text-xs text-[#475569] font-bold">
            <Link href="/privacy" className="hover:text-[#0D9488] transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-[#0D9488] transition-colors">Syarat & Ketentuan</Link>
            <Link href="/contact" className="hover:text-[#0D9488] transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function getSourceBadgeClass(source) {
  const map = {
    "Ayo Sehat Kemenkes": "border-emerald-200 bg-emerald-50 text-emerald-700",
    Halodoc: "border-sky-200 bg-sky-50 text-sky-700",
    "Bio Farma": "border-rose-200 bg-rose-50 text-rose-700",
    "Siloam Hospitals": "border-orange-200 bg-orange-50 text-orange-700",
    "RS Marzoeki Mahdi Bogor": "border-purple-200 bg-purple-50 text-purple-700",
    "RS Universitas Indonesia": "border-amber-200 bg-amber-50 text-amber-700",
  };
  return map[source] || "border-slate-200 bg-slate-50 text-slate-650";
}
