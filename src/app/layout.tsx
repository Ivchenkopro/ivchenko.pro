import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <div className="max-w-md mx-auto bg-[#0F0F0F] min-h-screen relative shadow-2xl shadow-black overflow-hidden pb-32 border-x border-[#333]">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
