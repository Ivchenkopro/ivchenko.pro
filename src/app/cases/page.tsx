"use client";

import { Building2, Anchor, Banknote, Users, ChevronRight } from "lucide-react";

export default function Cases() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 left-[-20%] w-[60%] h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 right-[-10%] w-[50%] h-80 bg-[#C5A66F]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="px-6 py-8 space-y-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Сделки и кейсы</h1>

        <div className="space-y-6">
          {/* 1. Hotel Complex */}
          <CaseCard 
            icon={<Building2 className="text-[#C5A66F]" size={28} />}
            title="Продажа гостиничного комплекса"
            description="Тихая сделка на 5 млрд ₽. Организация всей цепочки от поиска покупателя до закрытия сделки между резидентами сообщества."
            link="#"
          />

          {/* 2. Port Infrastructure */}
          <CaseCard 
            icon={<Anchor className="text-[#C5A66F]" size={28} />}
            title="Проекты портовой инфраструктуры"
            description="Участие в проекте управления международным портом, организация поставок и логистики."
            link="#"
          />

          {/* 3. Financing */}
          <CaseCard 
            icon={<Banknote className="text-[#C5A66F]" size={28} />}
            title="Привлечение финансирования"
            description="Более 1 млрд ₽ привлечено средств в проекты в 2024 году."
            details="Система частного кредитования в клубной среде — 0,5 млрд ₽."
            link="#"
          />

          {/* 4. Business Meetings */}
          <CaseCard 
            icon={<Users className="text-[#C5A66F]" size={28} />}
            title="Организация деловых встреч"
            description="Более 730 встреч организовано для решения задач бизнеса. Взаимодействие с топ-5 бизнес-клубов России."
            link="#"
          />
        </div>
      </div>
    </main>
  );
}

function CaseCard({ icon, title, description, details, link }: { icon: React.ReactNode, title: string, description: string, details?: string, link?: string }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors flex flex-col h-full">
      <div className="mb-4 bg-[#C5A66F]/10 w-14 h-14 rounded-full flex items-center justify-center border border-[#C5A66F]/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-2">{title}</h3>
      <p className="text-[var(--muted-foreground)] leading-relaxed mb-4 flex-grow">{description}</p>
      {details && (
        <div className="bg-[var(--secondary)]/50 rounded-xl p-4 border border-[var(--border)] mb-4">
          <p className="text-sm text-[var(--card-foreground)] font-medium">{details}</p>
        </div>
      )}
      
      <a 
        href={link || "#"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full py-3 px-4 bg-[#C5A66F]/10 text-[#C5A66F] text-sm font-bold rounded-xl border border-[#C5A66F]/20 hover:bg-[#C5A66F] hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
      >
        Подробнее
        <ChevronRight size={14} />
      </a>
    </div>
  );
}
