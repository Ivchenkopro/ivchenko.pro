import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Олег Ивченко",
  description: "Предприниматель, CEO, инвестор",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <div className="max-w-md mx-auto bg-[var(--background)] min-h-screen relative shadow-2xl shadow-[rgba(0,0,0,0.05)] overflow-hidden pb-32 border-x border-[var(--border)]">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
