"use client";

import { useState } from "react";
import { 
  Globe, 
  Handshake, 
  TrendingUp, 
  Wheat, 
  Search, 
  MessageCircle, 
  Plane, 
  Scale, 
  Package, 
  Landmark,
  X,
  ChevronRight,
  MessageSquare,
  Settings,
  UserCheck
} from "lucide-react";

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"main" | "standard">("main");

  const openModal = () => {
    setModalStep("main");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-[#C5A66F]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="px-6 py-8 space-y-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Основные направления</h1>

        {/* 1. Global Finance */}
        <ServiceCard 
          icon={<Globe className="text-[#C5A66F]" size={28} />}
          title="Global Finance"
          description="Международные финансы, ВЭД платежи, частное кредитование, работа с валютой."
          details="Банковское финансирование, операции с криптовалютой (USDT, BTC, ETH), трансграничные платежи для импортеров."
        />

        {/* 2. Alun Partners */}
        <ServiceCard 
          icon={<Handshake className="text-[#C5A66F]" size={28} />}
          title="Alun Partners"
          subtitle="(Бизнес-консьерж)"
          description="Стратегический консалтинг, бизнес-консьерж, Alun Private."
          details="Команда, которая больше 8 лет организует бизнес-взаимодействие в клубных сделках, требующих высокого уровня доверия Клиент - Исполнитель."
          isItalicDetails
        />

        {/* 3. Alun Capital */}
        <ServiceCard 
          icon={<TrendingUp className="text-[#C5A66F]" size={28} />}
          title="Alun Capital"
          description="Инвестиционный фонд."
          details="Поиск и продажа проектов по закрытым сделкам для среднего бизнеса, сотрудничество с фондами."
        />

        {/* 4. Grain Trading */}
        <ServiceCard 
          icon={<Wheat className="text-[#C5A66F]" size={28} />}
          title="Трейдинг зерна"
          description="Международный трейдинг зерна, участие в проекте управления международным портом."
        />

        {/* 5. Business Concierge Detailed */}
        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--card-foreground)] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#C5A66F] rounded-full shadow-[0_0_10px_#C5A66F]"></span>
            Бизнес-консьерж
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">Подробно с concierge.alun.ru</p>
          
          <div className="space-y-5">
            <ConciergeItem icon={<Search size={20} />} text="Поиск закрытой информации по внутренним базам и рекомендациям" />
            <ConciergeItem icon={<Landmark size={20} />} text="Организация помощи: финансовая, налоговая, медицинская" />
            <ConciergeItem icon={<MessageCircle size={20} />} text="Организация деловых переговоров с ЛПР (лицами, принимающими решения)" />
            <ConciergeItem icon={<Plane size={20} />} text="Помощь в оформлении иностранного подданства, ВНЖ, релокации бизнеса" />
            <ConciergeItem icon={<Scale size={20} />} text="Решение НЕформальных юридических вопросов" />
            <ConciergeItem icon={<Package size={20} />} text="Организация доставки лекарств, люкс-товаров из Европы" />
            <ConciergeItem icon={<Handshake size={20} />} text="Организация Клубных займов и банковских гарантий, сделок M&A" />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-40 flex justify-center">
        <button 
          onClick={openModal}
          className="bg-[#C5A66F] text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center gap-2 active:scale-95 transition-transform border border-[#C5A66F]/50"
        >
          <MessageSquare size={20} />
          Оставить заявку
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--card-foreground)]">
                {modalStep === "main" ? "Выберите формат" : "Выберите направление"}
              </h3>
              <button onClick={closeModal} className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--border)] transition-colors">
                <X size={20} className="text-[var(--muted-foreground)]" />
              </button>
            </div>

            {modalStep === "main" ? (
              <div className="space-y-3">
                <ModalOption 
                  icon={<UserCheck className="text-[#C5A66F]" />}
                  title="Крупная сделка (50+ млн ₽)"
                  subtitle="Личный чат с Олегом"
                  onClick={() => alert("Переход в чат с Олегом")}
                />
                <ModalOption 
                  icon={<Settings className="text-[#C5A66F]" />}
                  title="Стандартная услуга"
                  subtitle="Выбор направления"
                  onClick={() => setModalStep("standard")}
                  hasArrow
                />
                <ModalOption 
                  icon={<UserCheck className="text-[#C5A66F]" />}
                  title="Бизнес-консьерж"
                  subtitle="Информация + @ALUN_Concierge"
                  onClick={() => alert("Переход к @ALUN_Concierge")}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => setModalStep("main")}
                  className="text-sm text-[var(--muted-foreground)] mb-2 flex items-center gap-1 hover:text-[var(--card-foreground)] transition-colors"
                >
                  ← Назад
                </button>
                <ModalOption 
                  title="Global Finance" 
                  onClick={() => alert("Чат с партнером Global Finance")} 
                />
                <ModalOption 
                  title="Alun Partners" 
                  onClick={() => alert("Чат с партнером Alun Partners")} 
                />
                <ModalOption 
                  title="Alun Capital" 
                  onClick={() => alert("Чат с партнером Alun Capital")} 
                />
                <ModalOption 
                  title="Трейдинг зерна" 
                  onClick={() => alert("Чат с партнером Трейдинг")} 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  details?: string;
  isItalicDetails?: boolean;
}

function ServiceCard({ icon, title, subtitle, description, details, isItalicDetails }: ServiceCardProps) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A66F]/10 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[var(--secondary)] rounded-xl border border-[var(--border)] shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--card-foreground)] leading-tight">{title}</h3>
            {subtitle && <p className="text-sm text-[var(--muted-foreground)] font-medium">{subtitle}</p>}
          </div>
        </div>
        <p className="text-[var(--muted-foreground)] font-medium mb-3 leading-relaxed">{description}</p>
        {details && (
          <div className="pt-3 border-t border-[var(--border)]">
            <p className={`text-sm text-[var(--muted-foreground)] leading-relaxed ${isItalicDetails ? "italic" : ""}`}>
              {details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConciergeItemProps {
  icon: React.ReactNode;
  text: string;
}

function ConciergeItem({ icon, text }: ConciergeItemProps) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 min-w-[20px] text-[#C5A66F] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed group-hover:text-[var(--card-foreground)] transition-colors">{text}</p>
    </div>
  );
}

interface ModalOptionProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  hasArrow?: boolean;
}

function ModalOption({ icon, title, subtitle, onClick, hasArrow }: ModalOptionProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-[var(--secondary)] hover:bg-[#2A2A2A] p-4 rounded-xl flex items-center gap-4 transition-all border border-[var(--border)] hover:border-[#C5A66F]/30 text-left group"
    >
      {icon && (
        <div className="p-2 bg-[var(--card)] rounded-lg shadow-sm group-hover:scale-110 transition-transform border border-[var(--border)]">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className="font-bold text-[var(--foreground)]">{title}</div>
        {subtitle && <div className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">{subtitle}</div>}
      </div>
      {hasArrow && <ChevronRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F]" />}
    </button>
  );
}
