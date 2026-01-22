"use client";

import { Mail, Send, ArrowUpRight, Share2, Check } from "lucide-react";
import { useState } from "react";

export default function Contacts() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Олег Ивченко',
      text: 'Предприниматель, Инвестор. Контакты и проекты.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C5A66F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#C5A66F]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="px-6 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Контакты</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Всегда на связи для партнеров</p>

        {/* Contact Links List */}
        <div className="space-y-4">
          
          {/* Telegram Channel */}
          <a 
            href="https://t.me/ivchenkooleg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#2AABEE]/50 transition-all group active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-[#2AABEE]/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#2AABEE]/20 transition-colors">
              <Send size={24} className="text-[#2AABEE]" />
            </div>
            <div className="flex-grow">
              <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Telegram канал</div>
              <div className="text-lg font-bold text-[var(--card-foreground)]">@ivchenkooleg</div>
            </div>
            <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#2AABEE] transition-colors" />
          </a>

          {/* Personal Telegram */}
          <a 
            href="https://t.me/oleg8383" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#C5A66F]/50 transition-all group active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-[#C5A66F]/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#C5A66F]/20 transition-colors">
              <Send size={24} className="text-[#C5A66F]" />
            </div>
            <div className="flex-grow">
              <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Связаться с Олегом</div>
              <div className="text-lg font-bold text-[var(--card-foreground)]">@oleg8383</div>
            </div>
            <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F] transition-colors" />
          </a>

          {/* Email */}
          <a 
            href="mailto:oleg@ivchenko.pro" 
            className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#C5A66F]/50 transition-all group active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center shrink-0 group-hover:border-[#C5A66F]/50 transition-colors">
              <Mail size={24} className="text-[var(--foreground)]" />
            </div>
            <div className="flex-grow">
              <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Почта</div>
              <div className="text-lg font-bold text-[var(--card-foreground)] break-all">oleg@ivchenko.pro</div>
            </div>
            <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F] transition-colors" />
          </a>

        </div>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="mt-8 w-full bg-[#C5A66F] text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#b8955a]"
        >
          <Share2 size={20} />
          Поделиться визиткой
        </button>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-[var(--card)]/90 backdrop-blur-md text-[var(--card-foreground)] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-[var(--border)]">
              <div className="bg-[#C5A66F]/20 p-1 rounded-full">
                <Check size={16} className="text-[#C5A66F]" />
              </div>
              <span className="text-sm font-medium">Ссылка скопирована!</span>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
