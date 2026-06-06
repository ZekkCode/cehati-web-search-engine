"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, HardDrive, Cloud, EyeSlash, Info } from "@phosphor-icons/react";

import Link from "next/link";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-[-0.03em]">Kebijakan Privasi</h1>
            <p className="text-xs text-slate-450 font-bold uppercase mt-2">Terakhir diperbarui: 7 Juni 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#0D9488]" weight="bold" /> Komitmen Privasi Kami
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              CEHATI (Cek Kesehatan dari Artikel) berkomitmen penuh untuk melindungi privasi pengguna. Aplikasi ini dirancang sebagai pustaka informasi kesehatan digital berbasis pencarian hibrida yang aman, transparan, dan minim pengumpulan data pribadi.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <HardDrive size={20} className="text-[#0D9488]" weight="bold" /> Pemrosesan Data di Sisi Klien (Client-Side)
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Sebagian besar data aplikasi, termasuk koleksi artikel medis asli dan kamus inversi BM25, dimuat secara instan ke memori peramban Anda. Proses pencarian kata kunci leksikal (BM25) berjalan sepenuhnya secara lokal pada komputer/perangkat Anda tanpa mengirim kueri teks ke server backend eksternal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Cloud size={20} className="text-[#0D9488]" weight="bold" /> Penggunaan API Hugging Face (Dense Retrieval)
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Untuk fitur pencarian semantik (Dense Retrieval), aplikasi ini mengirimkan teks kueri pencarian Anda ke Hugging Face Inference API secara anonim untuk dikonversi menjadi representasi vektor numerik (embedding 384 dimensi). Proses ini:
            </p>
            <ul className="list-disc list-inside text-sm text-[#475569] space-y-2 pl-4">
              <li>Tidak menyertakan alamat IP pribadi atau pengenal pelacakan (cookies/session).</li>
              <li>Hanya mengirimkan teks kueri mentah yang Anda ketikkan di kolom pencarian.</li>
              <li>Hasil pencarian hibrida digabungkan kembali secara lokal di peramban pengguna.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <EyeSlash size={20} className="text-[#0D9488]" weight="bold" /> Tidak Ada Penyimpanan Riwayat
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Kami tidak melacak, mengumpulkan, atau menyimpan riwayat pencarian medis Anda. Setiap riwayat pencarian bersifat sementara di sesi aktif peramban Anda dan akan terhapus secara otomatis ketika Anda menutup tab atau memuat ulang halaman.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Info size={20} className="text-[#0D9488]" weight="bold" /> Perubahan Kebijakan
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Kebijakan Privasi ini dapat diperbarui sewaktu-waktu seiring dengan penyempurnaan sistem pencarian akademik CEHATI. Semua perubahan akan langsung dipublikasikan di halaman ini.
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
            <Link href="/privacy" className="text-[#0D9488] hover:text-[#0D9488] transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-[#0D9488] transition-colors">Syarat & Ketentuan</Link>
            <Link href="/contact" className="hover:text-[#0D9488] transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
