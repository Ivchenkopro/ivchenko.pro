"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight,
  MessageCircle,
  X,
  Check,
  Loader2,
  Globe, 
  Handshake, 
  TrendingUp, 
  Wheat, 
  Search, 
  Plane, 
  Scale, 
  Package, 
  Landmark,
  MessageSquare,
  Settings,
  UserCheck,
  FileText,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Service, FALLBACK_SERVICES } from "@/lib/data";
import { ICON_MAP } from "@/lib/icons";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankGuaranteesModalOpen, setIsBankGuaranteesModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"main" | "standard">("main");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });
        
      if (data && data.length > 0) {
        // Merge with fallback to ensure buttons/actions exist
        const mergedData = data.map(item => {
          // Robust matching: ID, Title, or "Global Finance" alias
          const fallback = FALLBACK_SERVICES.find(f => 
            f.id === item.id || 
            f.title === item.title || 
            (item.title === "Global Finance" && f.title === "ALUN Finance")
          );
          
          return {
            ...item,
            title: fallback ? fallback.title : item.title, // Ensure new title is used if matched
            // Ensure secondary actions are present (e.g. for ALUN Finance)
            secondary_action_text: item.secondary_action_text || fallback?.secondary_action_text,
            secondary_action_type: item.secondary_action_type || fallback?.secondary_action_type,
            secondary_modal_id: item.secondary_modal_id || fallback?.secondary_modal_id,
            // Ensure primary actions
            action_text: item.action_text || fallback?.action_text,
            action_type: item.action_type || fallback?.action_type,
            modal_id: item.modal_id || fallback?.modal_id,
            description: item.description && item.description.length > 0 ? item.description : fallback?.description || []
          };
        });
        setServices(mergedData);
      } else {
        setServices(FALLBACK_SERVICES);
      }
    } catch (err) {
      console.error(err);
      setServices(FALLBACK_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalStep("main");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAction = (service: Service) => {
    if (service.action_type === 'link' && service.action_url) {
      window.open(service.action_url, '_blank');
    } else if (service.action_type === 'modal') {
      openModal();
    }
  };

  const handleSecondaryAction = (service: Service) => {
    if (service.secondary_action_type === 'link' && service.secondary_action_url) {
      window.open(service.secondary_action_url, '_blank');
    } else if (service.secondary_action_type === 'modal') {
      // Robust check for Bank Guarantees modal
      if (
        service.secondary_modal_id === 'bank_guarantees' || 
        service.title === 'ALUN Finance' || 
        service.title === 'Global Finance' ||
        service.id === 1
      ) {
        setIsBankGuaranteesModalOpen(true);
      } else {
        openModal();
      }
    }
  };

  // Icon mapping for Concierge items to match backup design
  const CONCIERGE_ICONS = [
    <Search size={20} key="search" />,
    <Landmark size={20} key="landmark" />,
    <MessageCircle size={20} key="message" />,
    <Plane size={20} key="plane" />,
    <Scale size={20} key="scale" />,
    <Package size={20} key="package" />,
    <Handshake size={20} key="handshake" />
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-[#C5A66F]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="px-6 py-8 space-y-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Бизнес-решения</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A66F]" />
          </div>
        ) : (
          services.map((service) => {
            // Special rendering for Business Concierge
            if (service.title === "Бизнес-консьерж" || service.id === 5) {
              return (
                <div key={service.id} className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)]">
                  <h2 className="text-xl font-bold text-[var(--card-foreground)] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#C5A66F] rounded-full shadow-[0_0_10px_#C5A66F]"></span>
                    {service.title}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mb-6">Подробно с concierge.alun.ru</p>
                  
                  <div className="space-y-5 mb-8">
                    {service.description.map((item, i) => (
                      <ConciergeItem 
                        key={i} 
                        icon={CONCIERGE_ICONS[i % CONCIERGE_ICONS.length]} 
                        text={item} 
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => handleAction(service)}
                    className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform border border-[#C5A66F]/50 hover:bg-[#b8955a]"
                  >
                    <MessageSquare size={20} />
                    {service.action_text || "Обсудить сделку"}
                  </button>
                </div>
              );
            }

            // Standard Service Card
            return (
              <ServiceCard 
                key={service.id}
                icon={ICON_MAP[service.icon] ? <div className="text-[#C5A66F]"><ServiceIcon name={service.icon} /></div> : null}
                title={service.title}
                description={service.description}
                actions={
                  <div className="flex gap-3">
                    {service.secondary_action_text && (
                      <button 
                        onClick={() => handleSecondaryAction(service)}
                        className="flex-1 py-3 px-4 bg-transparent border border-[#C5A66F] text-[#C5A66F] text-sm font-bold rounded-xl hover:bg-[#C5A66F]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {service.secondary_action_text}
                        <ChevronRight size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleAction(service)}
                      className="flex-1 py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {service.action_text}
                      {service.action_type === 'link' ? <ChevronRight size={14} /> : <MessageCircle size={14} />}
                    </button>
                  </div>
                }
              />
            );
          })
        )}
      </div>

      {/* Modal - Restored from backup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-gray-100 sm:border shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-black">
                {modalStep === "main" ? "Выберите формат" : "Выберите направление"}
              </h3>
              <button onClick={closeModal} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {modalStep === "main" ? (
              <div className="space-y-3">
                <ModalOption 
                  icon={<UserCheck className="text-[#C5A66F]" />}
                  title="Крупная сделка (50+ млн ₽)"
                  subtitle="Личный чат с Олегом"
                  onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")}
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
                  onClick={() => window.open("https://t.me/ALUN_Concierge", "_blank")}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => setModalStep("main")}
                  className="text-sm text-gray-500 mb-2 flex items-center gap-1 hover:text-black transition-colors"
                >
                  ← Назад
                </button>
                <ModalOption 
                  title="Global Finance" 
                  onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")} 
                />
                <ModalOption 
                  title="Alun Partners" 
                  onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")} 
                />
                <ModalOption 
                  title="Alun Capital" 
                  onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")} 
                />
                <ModalOption 
                  title="Трейдинг зерна" 
                  onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")} 
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bank Guarantees Modal */}
      {isBankGuaranteesModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#18181B] z-10 pb-4 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold text-white">Банковские гарантии</h3>
              <button 
                onClick={() => setIsBankGuaranteesModalOpen(false)} 
                className="p-2 bg-[#27272A] rounded-full hover:bg-[#3F3F46] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Помогаем получить банковские гарантии для участия в коммерческих и государственных тендерах (44-ФЗ, 223-ФЗ, 615-ПП) и исполнения контрактов. Работаем со сложными случаями и большими лимитами.
                </p>
              </div>

              {/* Advantages */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Преимущества</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Одобрение от 1 часа",
                    "Лимиты до 1 млрд рублей",
                    "Без залога и поручительства",
                    "Минимальный пакет документов",
                    "Работаем со всеми регионами РФ"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <Briefcase size={20} />
                  <h4 className="font-bold text-lg">Примеры использования</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "44-ФЗ", subtitle: "Госзакупки" },
                    { title: "223-ФЗ", subtitle: "Госкомпании" },
                    { title: "615-ПП", subtitle: "Капремонт" },
                    { title: "Коммерческие", subtitle: "Контракты" }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#27272A] p-3 rounded-xl border border-[var(--border)]">
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-xs text-zinc-500">{item.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => window.open("https://t.me/ivchenko_oleg", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || ICON_MAP["landmark"];
  return <Icon size={28} />;
}

function ServiceCard({ icon, title, description, actions }: { icon: React.ReactNode, title: string, description: string[], actions: React.ReactNode }) {
  return (
    <div className="bg-[#18181B] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-[#C5A66F]/10 w-14 h-14 rounded-full flex items-center justify-center border border-[#C5A66F]/20">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      
      <ul className="space-y-2 mb-6">
        {description.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm leading-relaxed">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C5A66F] shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {actions}
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
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">{text}</p>
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
      className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl flex items-center gap-4 transition-all border border-gray-100 hover:border-[#C5A66F]/30 text-left group"
    >
      {icon && (
        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className="font-bold text-black">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 group-hover:text-gray-700">{subtitle}</div>}
      </div>
      {hasArrow && <ChevronRight size={20} className="text-gray-400 group-hover:text-[#C5A66F]" />}
    </button>
  );
}
