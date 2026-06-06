"use client";

/**
 * article/[id]/page.js — Halaman Detail Artikel (VIEW Layer)
 * ============================================================
 */

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { initSearchEngine, getArticleDetail } from "@/controllers/searchController";
import { CalendarBlank, User, LinkSimple } from "@phosphor-icons/react";

export default function ArticleDetailPage({ params }) {
  const { id } = use(params);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      await initSearchEngine();
      const d = await getArticleDetail(id);
      setDoc(d);
      setLoading(false);
    }
    load();
  }, [id]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Link href="/">
              <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-6" />
            <div className="h-4 bg-slate-150 rounded w-1/3" />
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Link href="/">
              <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-6" />
            <div className="h-4 bg-slate-150 rounded w-1/3 mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-slate-100 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!doc) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-6 text-sm">ID Artikel: {id}</p>
          <Link href="/" className="px-6 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] rounded-full text-white font-bold text-sm transition-colors cursor-pointer">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const sourceClass = getSourceBadgeClass(doc.source_name);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Tentang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-12 shadow-sm">
          {/* Back Button */}
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-[#0D9488] transition-colors mb-6 cursor-pointer"
          >
            ← KEMBALI
          </button>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#0F172A] mb-6 leading-[1.15] tracking-[-0.03em]">
            {doc.title}
          </h1>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[#E2E8F0]">
            <span className={`px-2.5 py-1 border rounded text-[10px] font-bold tracking-wide uppercase ${sourceClass}`}>
              {doc.source_name}
            </span>
            {doc.health_topic && (
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-semibold">
                {doc.health_topic}
              </span>
            )}
            {doc.published_date && (
              <span className="text-xs text-slate-450 font-semibold flex items-center gap-1">
                <CalendarBlank size={16} weight="bold" className="text-slate-400" /> {doc.published_date}
              </span>
            )}
            {doc.author && (
              <span className="text-xs text-slate-450 font-semibold flex items-center gap-1">
                <User size={16} weight="bold" className="text-slate-400" /> {doc.author}
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">• {doc.word_count} kata</span>
          </div>

          {/* Summary Box */}
          {doc.summary && (
            <div className="bg-[#F0FDF4] border-l-4 border-[#0D9488] rounded-xl p-6 mb-8">
              <p className="text-sm text-slate-700 leading-relaxed italic">
                {doc.summary}
              </p>
            </div>
          )}

          {/* Content Body */}
          <div className="prose max-w-none text-slate-700 leading-relaxed space-y-5 text-sm md:text-base">
            {doc.content?.split("\n").map((paragraph, i) => {
              const text = paragraph.trim();
              if (!text) return null;

              // Deteksi Heading
              if (text.startsWith("Mitos") || text.startsWith("Fakta:") || text.startsWith("Langkah") || text.startsWith("Tips")) {
                return (
                  <h3 key={i} className="text-lg md:text-xl font-bold text-[#0F172A] pt-4 pb-1">
                    {text}
                  </h3>
                );
              }

              // Deteksi Catatan Klinis
              if (text.toUpperCase().includes("CATATAN KLINIS") || text.toUpperCase().includes("NOTE:")) {
                return (
                  <div key={i} className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-6 my-6">
                    <h4 className="text-xs font-extrabold text-[#0D9488] uppercase tracking-wider mb-2">Catatan Klinis</h4>
                    <p className="text-sm text-[#475569] leading-relaxed italic">{text.replace(/Catatan Klinis:/gi, "").replace(/Note:/gi, "").trim()}</p>
                  </div>
                );
              }

              return (
                <p key={i}>
                  {text}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {doc.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#E2E8F0]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Topik Terkait:
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#F8FAFC] text-slate-600 border border-[#E2E8F0] rounded-full text-xs font-semibold">
                    #{tag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Reference Link */}
          {doc.source_url && doc.source_url !== "#" && (
            <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
              <a
                href={doc.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0D9488] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              >
                <LinkSimple size={16} weight="bold" /> Baca Artikel Asli di {doc.source_name}
              </a>
            </div>
          )}
        </div>
      </article>

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
