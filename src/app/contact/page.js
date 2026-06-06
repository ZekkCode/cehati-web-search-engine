"use client";

import { useState, useEffect } from "react";
import { UserCircle, GithubLogo, LinkedinLogo, Globe, MapPin, Envelope } from "@phosphor-icons/react";

import Link from "next/link";

export default function ContactPage() {
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
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="border-b border-[#E2E8F0] pb-6">
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-[-0.03em]">Kontak Pengembang</h1>
            <p className="text-xs text-slate-450 font-bold uppercase mt-2">CEHATI Project Developer Profile</p>
          </div>

          {/* Profile Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Custom Avatar Icon */}
            <div className="h-24 w-24 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center shrink-0">
              <UserCircle size={56} className="text-[#0D9488]" weight="light" />
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">Zakaria Mujur Prasetyo</h2>
                <p className="text-sm font-bold text-[#0D9488] mt-1">NIM: 240411100144</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Teknik Informatika • Universitas Trunojoyo Madura</p>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed">
                Pengembang sistem mesin pencari kesehatan CEHATI. Proyek ini diimplementasikan menggunakan arsitektur MVC (Model-View-Controller) dengan memadukan algoritma leksikal BM25 dan Dense Retrieval semantik untuk menyajikan pencarian hibrida berpresisi tinggi.
              </p>
            </div>
          </div>

          {/* Social Channels and Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">Saluran Kontak Resmi:</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href="https://github.com/zekkcode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
              >
                <GithubLogo size={18} weight="bold" className="text-slate-800" /> GitHub Profile
              </a>
              <a
                href="https://linkedin.com/in/zakariamp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
              >
                <LinkedinLogo size={18} weight="bold" className="text-sky-700" /> LinkedIn Profile
              </a>
              <a
                href="https://zekktech.biz.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
              >
                <Globe size={18} weight="bold" className="text-emerald-600" /> Website Portofolio
              </a>
            </div>
          </div>

          {/* University Info Block */}
          <div className="border-t border-[#E2E8F0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-2">
              <MapPin size={16} weight="bold" className="text-[#0D9488]" /> Kamal, Bangkalan, Madura, Jawa Timur
            </span>
            <span className="flex items-center gap-2">
              <Envelope size={16} weight="bold" className="text-[#0D9488]" /> zakariamujur6@gmail.com
            </span>
          </div>
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
            <Link href="/terms" className="hover:text-[#0D9488] transition-colors">Syarat & Ketentuan</Link>
            <Link href="/contact" className="text-[#0D9488] hover:text-[#0D9488] transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
