"use client";

import { Megaphone, ArrowRight, Clock, Tag } from "lucide-react";

export default function Announcements() {
  const announcements = [
    {
      id: 1,
      tag: "Инвестиции",
      title: "Привлекаем раунд А в Fintech-стартап",
      description: "Ищем стратегического инвестора для масштабирования на рынок MENA. Оценка $15M, чек от $500k.",
      date: "2 часа назад",
      urgent: true
    },
    {
      id: 2,
      tag: "Партнерство",
      title: "Нужен партнер в строительный проект",
      description: "Застройка коттеджного поселка бизнес-класса в Подмосковье. Требуется компетенция в генподряде.",
      date: "Вчера",
      urgent: false
    },
    {
      id: 3,
      tag: "Покупка бизнеса",
      title: "Куплю действующее производство",
      description: "Интересует пищевая промышленность или упаковка. Оборот от 300 млн руб/год. Москва/МО.",
      date: "3 дня назад",
      urgent: false
    },
    {
      id: 4,
      tag: "Мероприятие",
      title: "Закрытый ужин инвесторов",
      description: "25 октября, Москва Сити. Только для членов клуба. Обсуждаем тренды 2025 года.",
      date: "Неделю назад",
      urgent: false
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A66F]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#C5A66F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="px-5 py-8 relative z-10 max-w-lg mx-auto">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200 border border-zinc-300 text-[#4A4A4A] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Megaphone size={12} />
            Bulletin Board
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
            Объявления
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-[90%]">
            Актуальные предложения, поиск партнеров и инвестиционные возможности.
          </p>
        </header>

        <div className="space-y-4">
          {announcements.map((item) => (
            <div 
              key={item.id}
              className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] relative overflow-hidden group hover:border-[#C5A66F]/30 transition-all duration-300"
            >
              {item.urgent && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-lg shadow-red-500/20">
                  Hot
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[var(--secondary)] text-[var(--card-foreground)] text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 border border-[var(--border)]">
                  <Tag size={10} />
                  {item.tag}
                </span>
                <span className="text-[var(--muted-foreground)] text-[10px] flex items-center gap-1">
                  <Clock size={10} />
                  {item.date}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-2 leading-tight group-hover:text-white transition-colors">
                {item.title}
              </h3>
              
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              <button className="w-full py-2.5 rounded-xl bg-[var(--secondary)] text-[var(--secondary-foreground)] font-medium text-sm border border-[var(--border)] hover:bg-[#C5A66F] hover:text-white hover:border-[#C5A66F] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(197,166,111,0.3)]">
                Подробнее
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
