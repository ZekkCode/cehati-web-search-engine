"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Database, WarningOctagon, Code } from "@phosphor-icons/react";

import Link from "next/link";

export default function TermsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-[#F8FAFC]" />;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-cehati.png" alt="CEHATI Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Beranda
            </Link>
            <Link href="/about" className="text-sm font-semibold text-[#475569] hover:text-[#0D9488] transition-colors">
              Tentang
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="border-b border-[#E2E8F0] pb-6">
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-[-0.03em]">Syarat & Ketentuan</h1>
            <p className="text-xs text-slate-450 font-bold uppercase mt-2">Terakhir diperbarui: 7 Juni 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <GraduationCap size={20} className="text-[#0D9488]" weight="bold" /> 1. Tujuan Akademik & Non-Komersial
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              CEHATI (Cek Kesehatan dari Artikel) merupakan sebuah proyek aplikasi pencarian informasi (Information Retrieval) yang dikembangkan untuk tujuan akademik guna memenuhi tugas besar praktikum dan ujian akhir semester (UAS) matakuliah **Temu Kembali Informasi**, program studi **Teknik Informatika, Universitas Trunojoyo Madura**. Proyek ini bersifat nonprofit dan murni dikembangkan demi simulasi teknis algoritma BM25, Dense Retrieval, dan Hybrid Search.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Database size={20} className="text-[#0D9488]" weight="bold" /> 2. Kebijakan Dataset & Sumber Crawling
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Dataset artikel kesehatan yang diindeks di dalam CEHATI dikumpulkan menggunakan teknik web crawling/scraping dari berbagai portal berita kesehatan tervalidasi dan terakreditasi di Indonesia (seperti Ayo Sehat Kemenkes, Halodoc, Bio Farma, Siloam Hospitals, RS Marzoeki Mahdi Bogor, dan RS Universitas Indonesia).
            </p>
            <p className="text-sm text-[#475569] leading-relaxed">
              Hak cipta intelektual atas seluruh konten artikel sepenuhnya dimiliki oleh masing-masing institusi penerbit asal. CEHATI mencantumkan atribusi sumber referensi berupa tautan URL asli menuju situs asal di setiap halaman detail artikel.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <WarningOctagon size={20} className="text-[#0D9488]" weight="bold" /> 3. Penafian Medis (Medical Disclaimer)
            </h2>
            <div className="bg-[#FEF2F2] border-l-4 border-rose-500 rounded-xl p-6">
              <p className="text-sm text-rose-900 leading-relaxed font-semibold mb-2">PENTING:</p>
              <p className="text-sm text-rose-800 leading-relaxed">
                Informasi yang disajikan oleh CEHATI hanya ditujukan untuk tujuan edukasi dan simulasi mesin pencari. CEHATI **tidak dapat** dan **tidak boleh** dijadikan acuan pengganti diagnosis medis profesional, saran pengobatan medis, atau konsultasi dokter asli. Jika Anda mengalami keluhan kesehatan nyata, harap segera hubungi tenaga medis atau dokter di rumah sakit terdekat.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Code size={20} className="text-[#0D9488]" weight="bold" /> 4. Batasan Tanggung Jawab Teknis
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Sistem pencarian hibrida ini disediakan &quot;apa adanya&quot; tanpa jaminan keandalan mutlak atas pembaruan data secara real-time. Kami tidak bertanggung jawab atas kerugian atau ketidaknyamanan yang timbul dari penyalahgunaan informasi pencarian di platform simulasi akademik ini.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-4 py-8 md:px-6 w-full">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-[#475569]">
          <div>
            <div className="text-base font-bold text-[#0D9488] mb-1">CEHATI</div>
            <div className="text-xs text-slate-400 font-medium">© 2024 CEHATI Digital Health Library. All rights reserved.</div>
          </div>
          <div className="flex gap-6 text-xs text-[#475569] font-bold">
            <Link href="/privacy" className="hover:text-[#0D9488] transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="text-[#0D9488] hover:text-[#0D9488] transition-colors">Syarat & Ketentuan</Link>
            <Link href="/contact" className="hover:text-[#0D9488] transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
