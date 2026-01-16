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
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Вкладка «Услуги»</h1>

        {/* 1. Global Finance */}
        <ServiceCard 
          icon={<Globe className="text-[#C5A66F]" size={28} />}
          title="Global Finance"
          description="Частное и банковское финансирование для задач бизнеса: займы от частных инвесторов, банковские кредиты и гарантии. Платежный агент и сопровождение ВЭД на выгодных условиях (оплата инвойсов, международные переводы)."
          links={[
            { text: "ALUN Finance", url: "https://t.me/alun_finance" },
            { text: "Банковские гарантии", url: "https://t.me/alun_bg" }
          ]}
        />

        {/* 2. ALUN Estate */}
        <ServiceCard 
          icon={<Landmark className="text-[#C5A66F]" size={28} />}
          title="ALUN Estate"
          description="Подбор и сопровождение сделок купля-продажи с премиальной жилой и коммерческой недвижимостью. Off-market объекты, преференции от застройщиков и безупречное юридическое сопровождение сделок."
          links={[
            { text: "@alun_estate", url: "https://t.me/alun_estate" }
          ]}
        />

        {/* 3. Центр Девелоперских Решений */}
        <ServiceCard 
          icon={<Wheat className="text-[#C5A66F]" size={28} />}
          title="Центр Девелоперских Решений"
          description="Подбор и купля-продажа земельных участков под застройку. Комплексное сопровождение девелоперских проектов. Партнеры с опытом работы в Минстрое, Правительстве Москвы, усиленные ресурсами бизнес-сообщества ALUN."
          links={[
            { text: "@AleksanderZharkov", url: "https://t.me/AleksanderZharkov" }
          ]}
        />

        {/* 4. Alun Capital */}
        <ServiceCard 
          icon={<TrendingUp className="text-[#C5A66F]" size={28} />}
          title="Alun Capital"
          description="Помощь в решении инвестиционных задач: привлечение инвестиций, упаковка предложения. Поиск и подбор инвесторов под профиль проекта, организация переговоров и сопровождение сделки до закрытия."
          links={[
            { text: "@aluninvest", url: "https://t.me/aluninvest" }
          ]}
        />

        {/* 5. Бизнес-консьерж */}
        <ServiceCard 
          icon={<Handshake className="text-[#C5A66F]" size={28} />}
          title="Бизнес-консьерж"
          description="Бизнес-консьерж для частных клиентов и компаний: сложные и срочные задачи в России и за рубежом. Медицина, визы и туризм, доставка редких препаратов и срочных грузов, VIP-логистика и билеты на закрытые события."
          links={[
            { text: "@ALUN_Concierge", url: "https://t.me/ALUN_Concierge" }
          ]}
        />
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
  links?: { text: string; url: string }[];
}

function ServiceCard({ icon, title, subtitle, description, details, isItalicDetails, links }: ServiceCardProps) {
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
        {links && links.length > 0 && (
          <div className="pt-3 mt-3 border-t border-[var(--border)] flex flex-wrap gap-2">
            {links.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#C5A66F] font-bold hover:underline"
              >
                {link.text} <ChevronRight size={14} />
              </a>
            ))}
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
