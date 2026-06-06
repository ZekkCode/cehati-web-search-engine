"use client";

/**
 * about/page.js — Halaman Tentang CEHATI (VIEW Layer)
 * ========================================================
 */

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Cpu,
  Database,
  Sliders,
  User,
  Globe,
  Broom,
  ListNumbers,
  MagnifyingGlass,
  TextT,
  Brain,
  GitMerge,
  UserCircle,
  Monitor,
  HardDrive
} from "@phosphor-icons/react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("architecture"); // tabs: architecture, retrieval, methodology, team
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Two-Column Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 w-full flex-1 flex flex-col md:flex-row gap-8 items-start">

        {/* Left Sidebar: SideNavBar */}
        <aside className="w-full md:w-64 shrink-0 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm sticky top-20">
          <div className="mb-6 border-b border-[#E2E8F0] pb-4">
            <h1 className="text-lg font-bold text-[#0F172A]">Tentang CEHATI</h1>
            <p className="text-[11px] text-slate-450 font-bold uppercase mt-1">Medical Precision v1.0</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("architecture")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${activeTab === "architecture"
                  ? "bg-[#CCFBF1] text-[#0D9488]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#0D9488]"
                }`}
            >
              <Cpu size={18} weight="bold" />
              <span>Arsitektur</span>
            </button>

            <button
              onClick={() => setActiveTab("retrieval")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${activeTab === "retrieval"
                  ? "bg-[#CCFBF1] text-[#0D9488]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#0D9488]"
                }`}
            >
              <Database size={18} weight="bold" />
              <span>Alur Retrieval</span>
            </button>

            <button
              onClick={() => setActiveTab("methodology")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${activeTab === "methodology"
                  ? "bg-[#CCFBF1] text-[#0D9488]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#0D9488]"
                }`}
            >
              <Sliders size={18} weight="bold" />
              <span>Metodologi</span>
            </button>

            <button
              onClick={() => setActiveTab("team")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left cursor-pointer ${activeTab === "team"
                  ? "bg-[#CCFBF1] text-[#0D9488]"
                  : "text-[#475569] hover:bg-slate-50 hover:text-[#0D9488]"
                }`}
            >
              <User size={18} weight="bold" />
              <span>Profil Pengembang</span>
            </button>
          </nav>
        </aside>

        {/* Right Column: Main Content Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Section 1: Introduction (Always Visible) */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Tentang CEHATI</h2>
            <div className="text-sm md:text-base text-[#475569] leading-relaxed">
              CEHATI (Cek Kesehatan dari Artikel) merupakan sistem temu kembali informasi (Information Retrieval) akademik tingkat lanjut yang dirancang khusus untuk domain medis berbahasa Indonesia. Dibangun di atas prinsip ilmiah yang ketat, platform ini mengutamakan keandalan deterministik dibandingkan dengan generasi stokastik (seperti LLM generatif), memberikan wawasan klinis terverifikasi tanpa risiko halusinasi informasi.
            </div>
          </section>

          {/* Conditional Content based on activeTab */}
          {activeTab === "architecture" && (
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6">Arsitektur MVC (Model-View-Controller)</h3>
              <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
                <p>
                  CEHATI menggunakan pola arsitektur **MVC** untuk memisahkan logika pengelolaan data (Model), tampilan antarmuka (View), dan koordinasi logika (Controller). Seluruh pemrosesan dilakukan secara efisien di sisi klien (client-side) menggunakan Next.js.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border border-[#E2E8F0] rounded-xl p-5 bg-[#F8FAFC]">
                    <h4 className="font-bold text-[#0F172A] mb-2 text-sm flex items-center gap-2">
                      <Database size={18} className="text-[#0D9488]" weight="bold" /> Model Layer
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Mengelola kalkulasi relevansi. Terdiri dari <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">bm25Model.js</code> untuk kemiripan leksikal, <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">denseModel.js</code> untuk kemiripan semantik, dan <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">hybridModel.js</code> untuk penggabungan skor.
                    </p>
                  </div>
                  <div className="border border-[#E2E8F0] rounded-xl p-5 bg-[#F8FAFC]">
                    <h4 className="font-bold text-[#0F172A] mb-2 text-sm flex items-center gap-2">
                      <Cpu size={18} className="text-[#0D9488]" weight="bold" /> Controller Layer
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Menghubungkan Model dan View. Dikendalikan oleh <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">searchController.js</code> yang mengatur inisialisasi mesin pencari, eksekusi query, filter sumber artikel, dan pencatatan statistik.
                    </p>
                  </div>
                  <div className="border border-[#E2E8F0] rounded-xl p-5 bg-[#F8FAFC]">
                    <h4 className="font-bold text-[#0F172A] mb-2 text-sm flex items-center gap-2">
                      <Monitor size={18} className="text-[#0D9488]" weight="bold" /> View Layer
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Merender antarmuka secara dinamis dan responsif. Terdiri dari halaman Next.js seperti <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">page.js</code> (beranda), <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">search/page.js</code> (halaman pencarian), dan <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">about/page.js</code> (tentang).
                    </p>
                  </div>
                  <div className="border border-[#E2E8F0] rounded-xl p-5 bg-[#F8FAFC]">
                    <h4 className="font-bold text-[#0F172A] mb-2 text-sm flex items-center gap-2">
                      <HardDrive size={18} className="text-[#0D9488]" weight="bold" /> Data Layer
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Koleksi data statis yang dimuat ke memori untuk menjamin pencarian instan: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">raw_articles.json</code> (koleksi artikel asli) dan <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] text-xs font-mono">bm25_index.json</code> (inverted index kata dasar).
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "retrieval" && (
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6">Alur Indeksasi & Pra-pemrosesan (Retrieval Pipeline)</h3>

              <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
                {/* Connector line for desktop */}
                <div className="hidden md:block absolute top-10 left-12 right-12 h-[2px] bg-[#E2E8F0] z-0" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0D9488] mb-3 shadow-sm">
                    <Globe size={24} weight="bold" />
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">1. Crawling Artikel</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Mengumpulkan data artikel kesehatan dari rumah sakit dan portal kesehatan tepercaya.</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0D9488] mb-3 shadow-sm">
                    <Broom size={24} weight="bold" />
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">2. Pra-pemrosesan</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Pembersihan teks (case folding, filtering) & Stemming Bahasa Indonesia Sastrawi.</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0D9488] mb-3 shadow-sm">
                    <ListNumbers size={24} weight="bold" />
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">3. Indeks & Embedding</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Penyusunan kamus inversi BM25 (sparse index) dan dense vectors representation.</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0D9488] mb-3 shadow-sm">
                    <MagnifyingGlass size={24} weight="bold" />
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">4. Eksekusi Pencarian</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Pencarian query dinamis dengan memadukan BM25 dan dense retrieval semantik secara hibrida.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "methodology" && (
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6">Metodologi Penilaian (Hybrid Scoring)</h3>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1 */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between h-[270px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TextT size={20} className="text-[#0D9488]" weight="bold" />
                      <h4 className="text-sm font-bold text-[#0F172A]">Skor Leksikal BM25</h4>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Mengevaluasi kecocokan kata kunci presisi berdasarkan konsep Term Frequency-Inverse Document Frequency (TF-IDF) yang ditingkatkan. Menerapkan penalti panjang dokumen secara ketat.
                    </p>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[10px] font-mono text-[#0D9488] text-center font-bold">
                    k1 = 1.2, b = 0.75
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between h-[270px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Brain size={20} className="text-[#0D9488]" weight="bold" />
                      <h4 className="text-sm font-bold text-[#0F172A]">Kemiripan Dense</h4>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Menggunakan model Transformer HuggingFace untuk memetakan makna semantik kalimat ke dalam ruang vektor berdimensi tinggi. Kemiripan dihitung menggunakan metode Cosine Similarity.
                    </p>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[10px] font-mono text-[#0D9488] text-center font-bold">
                    MiniLM-L12 384d
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between h-[270px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GitMerge size={20} className="text-[#0D9488]" weight="bold" />
                      <h4 className="text-sm font-bold text-[#0F172A]">Perangkingan Hibrida</h4>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Mengintegrasikan skor leksikal (BM25) dan kemiripan semantik (Dense) menggunakan bobot terkonfigurasi untuk memastikan ketepatan istilah teknis sekaligus menangkap makna sinonim.
                    </p>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[10px] font-mono text-[#0D9488] text-center font-bold">
                    Bobot: 0.4 BM25 / 0.6 Dense
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "team" && (
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6">Profil Pengembang</h3>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar block with custom icon */}
                <div className="h-24 w-24 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center shrink-0">
                  <UserCircle size={56} className="text-[#0D9488]" weight="light" />
                </div>

                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0F172A]">Zakaria Mujur Prasetyo</h4>
                    <p className="text-xs font-bold text-[#0D9488] mt-1">NIM: 240411100144</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Teknik Informatika • Universitas Trunojoyo Madura</p>
                  </div>

                  <p className="text-xs md:text-sm text-[#475569] leading-relaxed">
                    Merancang dan mengimplementasikan arsitektur sistem mesin pencari CEHATI berbasis arsitektur MVC (Model-View-Controller) dengan hibrida BM25 dan dense vector representation. Proyek ini dibuat untuk memenuhi kriteria kelulusan praktikum dan tugas besar UAS Temu Kembali Informasi.
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
                    <a
                      href="https://github.com/zekkcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      🐙 GitHub (zekkcode)
                    </a>
                    <a
                      href="https://linkedin.com/in/zakariamp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      🔗 LinkedIn (zakariamp)
                    </a>
                    <a
                      href="https://zekktech.biz.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      🌐 Website (zekktech.biz.id)
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
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
