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
  UserCheck,
  FileText,
  Check,
  Briefcase,
  Send,
  Building2
} from "lucide-react";

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"main" | "standard">("main");

  // New states for Global Finance
  const [isBankGuaranteesModalOpen, setIsBankGuaranteesModalOpen] = useState(false);
  const [isGlobalFinanceModalOpen, setIsGlobalFinanceModalOpen] = useState(false);

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
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Бизнес-решения</h1>

        {/* 1. ALUN Finance */}
        <ServiceCard 
          icon={<Landmark className="text-[#C5A66F]" size={28} />}
          title="ALUN Finance"
          description={[
            "Частное финансирование: займы от частных инвесторов под задачи бизнеса",
            "Банковское финансирование: кредиты и банковские гарантии"
          ]}
          actions={
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setIsBankGuaranteesModalOpen(true)}
                className="flex-1 min-w-[140px] py-3 px-4 bg-transparent border border-[#C5A66F] text-[#C5A66F] text-sm font-bold rounded-xl hover:bg-[#C5A66F] hover:text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Банковские гарантии
                <ChevronRight size={14} className="text-[#C5A66F] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
              <button 
                onClick={() => setIsGlobalFinanceModalOpen(true)}
                className="flex-1 min-w-[140px] py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Связаться
                <MessageCircle size={14} />
              </button>
            </div>
          }
        />

        {/* 2. ALUN Estate */}
        <ServiceCard 
          icon={<Building2 className="text-[#C5A66F]" size={28} />}
          title="ALUN Estate"
          description={[
            "Подбор премиальной жилой и коммерческой недвижимости",
            "Сопровождение сделок купли-продажи «под ключ»",
            "Доступ к off-market объектам и преференциям от застройщиков",
            "Безупречное юридическое сопровождение сделок"
          ]}
          actions={
            <a 
              href="https://t.me/alun_estate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Связаться
              <MessageCircle size={14} />
            </a>
          }
        />

        {/* 3. Центр Девелоперских Решений */}
        <ServiceCard 
          icon={<Wheat className="text-[#C5A66F]" size={28} />}
          title="Центр Девелоперских Решений"
          description={[
            "Подбор и купля-продажа земельных участков под застройку",
            "Комплексное сопровождение девелоперских проектов",
            "Партнёры с опытом работы в Минстрое и Правительстве Москвы"
          ]}
          actions={
            <a 
              href="https://t.me/AleksanderZharkov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Связаться
              <MessageCircle size={14} />
            </a>
          }
        />

        {/* 4. Alun Capital */}
        <ServiceCard 
          icon={<TrendingUp className="text-[#C5A66F]" size={28} />}
          title="Alun Capital"
          description={[
            "Привлечение инвестиций и упаковка инвестиционного предложения",
            "Поиск и подбор инвесторов под профиль проекта",
            "Организация переговоров и сопровождение сделки до закрытия"
          ]}
          actions={
            <a 
              href="https://t.me/lucky6409" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Связаться
              <MessageCircle size={14} />
            </a>
          }
        />

        {/* 5. Global Finance */}
        <ServiceCard 
          icon={<Globe className="text-[#C5A66F]" size={28} />}
          title="Global Finance"
          description={[
            "Платёжный агент для ВЭД",
            "Оплата инвойсов и международные переводы",
            "Сопровождение ВЭД на выгодных условиях"
          ]}
          actions={
            <a 
              href="https://t.me/Igor_GF_001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Связаться
              <MessageCircle size={14} />
            </a>
          }
        />

        {/* 6. Бизнес-консьерж */}
        <ServiceCard 
          icon={<Handshake className="text-[#C5A66F]" size={28} />}
          title="Бизнес-консьерж"
          description={[
            "Решение сложных и срочных задач в России и за рубежом",
            "Медицина, визы, туризм",
            "Доставка редких препаратов и срочных грузов",
            "VIP-логистика и билеты на закрытые события"
          ]}
          actions={
            <a 
              href="https://t.me/ALUN_Concierge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Связаться
              <MessageCircle size={14} />
            </a>
          }
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

      {/* Bank Guarantees Modal */}
      {isBankGuaranteesModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-white/10 sm:border shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#18181B] z-10 pb-2 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Банковские гарантии</h3>
              <button onClick={() => setIsBankGuaranteesModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="text-[#C5A66F]" size={18} />
                  Описание услуги
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Помогаем получить банковские гарантии для участия в коммерческих и государственных тендерах (44-ФЗ, 223-ФЗ, 615-ПП) и исполнения контрактов. Работаем со сложными случаями и большими лимитами.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Check className="text-[#C5A66F]" size={18} />
                  Преимущества
                </h4>
                <ul className="space-y-2">
                  {[
                    "Одобрение от 1 часа",
                    "Лимиты до 1 млрд рублей",
                    "Без залога и поручительства",
                    "Минимальный пакет документов",
                    "Работаем со всеми регионами РФ"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A66F] mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Briefcase className="text-[#C5A66F]" size={18} />
                  Примеры использования
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-white">44-ФЗ</div>
                    <div className="text-[10px] text-gray-400">Госзакупки</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-white">223-ФЗ</div>
                    <div className="text-[10px] text-gray-400">Госкомпании</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-white">615-ПП</div>
                    <div className="text-[10px] text-gray-400">Капремонт</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <div className="text-xs font-bold text-white">Коммерческие</div>
                    <div className="text-[10px] text-gray-400">Контракты</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://t.me/alun_bg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#C5A66F] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Связаться с менеджером
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Finance Contact Modal */}
      {isGlobalFinanceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-white/10 sm:border shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Выберите услугу</h3>
              <button onClick={() => setIsGlobalFinanceModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <a 
                href="https://t.me/alun_bg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#C5A66F] hover:bg-[#C5A66F]/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-lg text-white group-hover:text-[#C5A66F] transition-colors">Банковские гарантии</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#C5A66F] transition-colors" />
                </div>
                <p className="text-sm text-gray-400">
                  Узнать условия гарантии
                </p>
              </a>

              <a 
                href="https://t.me/alun_finance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#C5A66F] hover:bg-[#C5A66F]/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-lg text-white group-hover:text-[#C5A66F] transition-colors">Частное финансирование</span>
                  <ChevronRight className="text-gray-400 group-hover:text-[#C5A66F] transition-colors" />
                </div>
                <p className="text-sm text-gray-400">
                  Узнать условия займа
                </p>
              </a>
            </div>
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
  description: string | string[];
  details?: string;
  isItalicDetails?: boolean;
  links?: { text: string; url: string }[];
  actions?: React.ReactNode;
}

function ServiceCard({ icon, title, subtitle, description, details, isItalicDetails, links, actions }: ServiceCardProps) {
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
        {Array.isArray(description) ? (
          <ul className="list-disc pl-5 text-[var(--muted-foreground)] font-medium mb-3 leading-relaxed space-y-1">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--muted-foreground)] font-medium mb-3 leading-relaxed">{description}</p>
        )}
        {details && (
          <div className="pt-3 border-t border-[var(--border)]">
            <p className={`text-sm text-[var(--muted-foreground)] leading-relaxed ${isItalicDetails ? "italic" : ""}`}>
              {details}
            </p>
          </div>
        )}
        
        {actions && (
           <div className="pt-4 mt-2 border-t border-[var(--border)]">
             {actions}
           </div>
        )}

        {links && links.length > 0 && !actions && (
          <div className="pt-3 mt-3 border-t border-[var(--border)] flex flex-wrap gap-2">
            {links.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#C5A66F] font-bold hover:underline">
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
