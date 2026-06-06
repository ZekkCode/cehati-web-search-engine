import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = {
  title: "CEHATI - Cek Kesehatan dari Artikel",
  description:
    "CEHATI (Cek Kesehatan dari Artikel) - Rujukan informasi kesehatan digital terpercaya dengan pencarian hibrida.",
  icons: {
    icon: "/logo-cehati.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen bg-[#F8FAFC] antialiased relative overflow-x-hidden`}>
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>

        {/* Global Background Watermark - Large and Behind Everything */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-no-repeat bg-center bg-contain opacity-[0.06]"
          style={{ backgroundImage: "url('/bg-cehati.png')" }}
        />

        {/* Main Content Wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}
