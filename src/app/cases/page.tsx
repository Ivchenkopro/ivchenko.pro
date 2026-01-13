"use client";

import { Building2, Anchor, Banknote, Users, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

export default function Cases() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const text = `🏛 Продажа гостиничного комплекса (5 млрд ₽)
⚓️ Проекты портовой инфраструктуры
💰 Привлечение финансирования (1+ млрд ₽)
🤝 Организация 730+ деловых встреч

Кейсы Олега Ивченко. Подробнее по ссылке.`;

    try {
      // Try to copy to clipboard
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Construct Telegram share URL
      // Using a generic URL since we might be in a web view or browser
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
      
      // Open Telegram in new tab
      window.open(tgUrl, '_blank');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for some mobile browsers if clipboard fails
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 left-[-20%] w-[60%] h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 right-[-10%] w-[50%] h-80 bg-[#C5A66F]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="px-6 py-8 space-y-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Примеры реализованных проектов</h1>

        <div className="space-y-6">
          {/* 1. Hotel Complex */}
          <CaseCard 
            icon={<Building2 className="text-[#C5A66F]" size={28} />}
            title="Продажа гостиничного комплекса"
            description="Тихая сделка на 5 млрд ₽. Организация всей цепочки от поиска покупателя до закрытия сделки между резидентами сообщества."
          />

          {/* 2. Port Infrastructure */}
          <CaseCard 
            icon={<Anchor className="text-[#C5A66F]" size={28} />}
            title="Проекты портовой инфраструктуры"
            description="Участие в проекте управления международным портом, организация поставок и логистики."
          />

          {/* 3. Financing */}
          <CaseCard 
            icon={<Banknote className="text-[#C5A66F]" size={28} />}
            title="Привлечение финансирования"
            description="Более 1 млрд ₽ привлечено средств в проекты в 2024 году."
            details="Система частного кредитования в клубной среде — 0,5 млрд ₽."
          />

          {/* 4. Business Meetings */}
          <CaseCard 
            icon={<Users className="text-[#C5A66F]" size={28} />}
            title="Организация деловых встреч"
            description="Более 730 встреч организовано для решения задач бизнеса. Взаимодействие с топ-5 бизнес-клубов России."
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 flex justify-center">
        <button 
          onClick={handleShare}
          className="bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center gap-3 active:scale-95 transition-transform"
        >
          <LinkIcon size={20} className="text-black" />
          Поделиться кейсом
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[var(--card)]/90 backdrop-blur-md text-[var(--card-foreground)] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-[var(--border)]">
            <div className="bg-[#C5A66F]/20 p-1 rounded-full">
              <Check size={16} className="text-[#C5A66F]" />
            </div>
            <span className="text-sm font-medium">Скопировано! Открываем Telegram...</span>
          </div>
        </div>
      )}
    </main>
  );
}

function CaseCard({ icon, title, description, details }: { icon: React.ReactNode, title: string, description: string, details?: string }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors">
      <div className="mb-4 bg-[#C5A66F]/10 w-14 h-14 rounded-full flex items-center justify-center border border-[#C5A66F]/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-2">{title}</h3>
      <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">{description}</p>
      {details && (
        <div className="bg-[var(--secondary)]/50 rounded-xl p-4 border border-[var(--border)]">
          <p className="text-sm text-[var(--card-foreground)] font-medium">{details}</p>
        </div>
      )}
    </div>
  );
}
