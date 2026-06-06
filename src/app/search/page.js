"use client";

/**
 * search/page.js — Halaman Hasil Pencarian (VIEW Layer)
 * ======================================================
 */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { initSearchEngine, search, getFilters } from "@/controllers/searchController";
import { MagnifyingGlass } from "@phosphor-icons/react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const sourceFilter = searchParams.get("source") || null;
  const categoryFilter = searchParams.get("category") || null;

  useEffect(() => {
    setMounted(true);
    async function run() {
      setLoading(true);
      await initSearchEngine();
      const f = await getFilters();
      setFilters(f);

      const q = searchParams.get("q");
      if (q) {
        setQuery(q);
        setSearching(true);
        try {
          const res = await search({
            query: q,
            page: currentPage,
            sourceFilter,
            categoryFilter,
          });
          setResults(res);
        } catch (err) {
          console.error("Pencarian gagal:", err);
          setResults({
            query: q,
            method: "none",
            totalResults: 0,
            page: 1,
            perPage: 10,
            totalPages: 1,
            results: [],
            searchTime: 0,
          });
        }
        setSearching(false);
      }
      setLoading(false);
    }
    run();
  }, [searchParams, currentPage, sourceFilter, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (src) => {
    const params = new URLSearchParams(searchParams.toString());
    if (src) {
      if (sourceFilter === src) {
        params.delete("source"); // Toggle off jika diklik ulang
      } else {
        params.set("source", src);
      }
    } else {
      params.delete("source");
    }
    params.delete("page"); // Reset page ke 1
    router.push(`/search?${params.toString()}`);
  };

  if (!mounted) {
    return <main className="min-h-screen bg-[#F8FAFC]" />;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
            <div className="bg-white rounded-full border border-[#E2E8F0] flex items-center px-4 py-1.5 focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#CCFBF1] transition-all">
              <MagnifyingGlass size={18} weight="bold" className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[#0F172A] placeholder-slate-400"
                placeholder="Cari artikel kesehatan..."
              />
              <button type="submit" className="ml-2 px-4 py-1 bg-[#0D9488] hover:bg-[#0F766E] rounded-full text-xs text-white font-semibold transition-colors cursor-pointer">
                Cari
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/about" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Tentang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 w-full flex-1">
        {loading ? (
          <LoadingState />
        ) : results ? (
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Aside - SideNavBar Component (Filters) */}
            <aside className="w-full md:w-64 shrink-0 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm sticky top-20">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#E2E8F0] pb-2">
                Filters
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Filter Sumber
                  </h3>

                  <div className="space-y-2">
                    {/* Checkbox Semua Sumber */}
                    <label className="flex items-center gap-2.5 text-sm font-semibold text-[#475569] hover:text-[#0D9488] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!sourceFilter}
                        onChange={() => handleFilterChange(null)}
                        className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-[#0D9488] focus:ring-[#0D9488] cursor-pointer accent-[#0D9488]"
                      />
                      <span>Semua Sumber</span>
                    </label>

                    {/* Checkbox Sumber Individu */}
                    {filters?.sources?.map((src) => (
                      <label key={src} className="flex items-center gap-2.5 text-sm font-semibold text-[#475569] hover:text-[#0D9488] cursor-pointer truncate">
                        <input
                          type="checkbox"
                          checked={sourceFilter === src}
                          onChange={() => handleFilterChange(src)}
                          className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-[#0D9488] focus:ring-[#0D9488] cursor-pointer accent-[#0D9488]"
                        />
                        <span className="truncate">{src}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area (Results) */}
            <div className="flex-1 min-w-0 w-full">
              {/* Search Meta Bar */}
              <div className="flex items-center justify-between mb-6 border-b border-[#E2E8F0] pb-3">
                <p className="text-sm font-semibold text-[#475569]">
                  Menampilkan <span className="text-[#0F172A] font-extrabold">{results.totalResults.toLocaleString("id-ID")}</span> hasil untuk &quot;<span className="text-[#0D9488] font-bold">{results.query}</span>&quot;
                  <span className="ml-1 text-slate-400 font-medium">({results.searchTime}ms)</span>
                </p>
                <span className="text-xs px-2.5 py-1 bg-teal-50 border border-[#CCFBF1] rounded-lg text-[#0D9488] font-bold uppercase">
                  Metode: {results.method.toUpperCase()}
                </span>
              </div>

              {searching && <LoadingState />}

              {/* Result Cards List */}
              {!searching && results.results.length === 0 && (
                <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                  <MagnifyingGlass size={40} weight="bold" className="text-slate-400 mb-4 mx-auto block" />
                  <p className="text-lg text-[#0F172A] font-bold">Tidak ada hasil ditemukan</p>
                  <p className="text-sm text-slate-500 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
              )}

              {!searching && (
                <div className="space-y-4">
                  {results.results.map((r) => (
                    <ResultCard key={r.id} result={r} query={results.query} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {results.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.min(results.totalPages, 10) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${p === results.page
                          ? "bg-[#0D9488] text-white shadow-sm"
                          : "bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488]"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-4 py-8 md:px-6 w-full">
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

// ── Result Card Component ───────────────────────────────────────────
function ResultCard({ result, query }) {
  const r = result;

  // Highlight kata query di snippet
  const highlightSnippet = (text) => {
    if (!text || !query) return text;
    const words = query.split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#CCFBF1] text-[#0F766E] font-bold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const sourceClass = getSourceBadgeClass(r.sourceName);

  return (
    <Link href={`/article/${r.id}`} className="block">
      <div className="bg-white border border-[#E2E8F0] hover:border-[#0D9488] hover:shadow-sm rounded-2xl p-6 transition-all duration-300">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 border rounded text-[10px] font-bold tracking-wide uppercase ${sourceClass}`}>
                {r.sourceName}
              </span>
              {r.healthTopic && (
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-semibold">
                  {r.healthTopic}
                </span>
              )}
              {r.publishedDate && (
                <span className="text-xs text-slate-400 font-medium">{r.publishedDate}</span>
              )}
              <span className="text-xs text-slate-400 font-medium">• {r.wordCount} kata</span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-[#0F172A] mb-2 line-clamp-2 hover:text-[#0D9488] transition-colors leading-snug">
              {r.title}
            </h2>

            {/* Snippet */}
            <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">
              {highlightSnippet(r.snippet)}
            </p>
          </div>

          {/* Relevancy Score Box */}
          <div className="shrink-0 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center justify-center">
              <span className="text-base font-extrabold text-[#0D9488]">
                {r.scorePercent.toFixed(0)}
              </span>
              <span className="text-[9px] text-slate-400 font-bold -mt-0.5">% Match</span>
            </div>
            {/* Score Bar */}
            <div className="mt-2 w-14 h-1.5 bg-slate-150 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D9488] rounded-full"
                style={{ width: `${r.scorePercent}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1.5 block">
              Score: {r.score.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Loading Skeleton Component ──────────────────────────────────────
function LoadingState() {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-1/3 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-full mb-1" />
          <div className="h-3 bg-slate-100 rounded w-5/6" />
        </div>
      ))}
    </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SearchContent />
    </Suspense>
  );
}
