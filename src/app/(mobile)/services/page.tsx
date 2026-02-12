"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight,
  MessageCircle,
  X,
  Loader2,
  Search, 
  Plane, 
  Scale, 
  Package, 
  Landmark,
  MessageSquare,
  FileText,
  Briefcase,
  CheckCircle,
  Lock,
  Car,
  ShieldCheck,
  Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Service, FALLBACK_SERVICES } from "@/lib/data";
import { ICON_MAP } from "@/lib/icons";

function ServiceIcon({ name }: { name: string }) {
  if (name === "lock") return <Lock size={24} />;
  if (name === "car") return <Car size={24} />;
  const Icon = ICON_MAP[name] || Landmark;
  return <Icon size={24} />;
}

function ConciergeItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
      <div className="w-10 h-10 rounded-full bg-[var(--card)] flex items-center justify-center text-[#C5A66F] shadow-sm">
        {icon}
      </div>
      <span className="text-sm font-medium text-[var(--foreground)]">{text}</span>
    </div>
  );
}

function ServiceCard({ icon, title, description, actions, tag }: { icon: React.ReactNode, title: string, description: string[], actions: React.ReactNode, tag?: string }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors relative overflow-hidden">
      {tag && (
        <div className={`absolute top-0 right-0 px-3 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-lg ${
          tag === 'Hot' 
            ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/20' 
            : 'bg-gradient-to-r from-[#C5A66F] to-[#b8955a] shadow-[#C5A66F]/20'
        }`}>
          {tag}
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center border border-[var(--border)] shadow-sm">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-3 leading-tight">
        {title}
      </h3>
      
      <div className="space-y-3 mb-6">
        {description.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
            <p className="text-sm text-[var(--muted-foreground)] leading-tight line-clamp-2">
              {item}
            </p>
          </div>
        ))}
      </div>
      
      {actions}
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [activeModal, setActiveModal] = useState<
    | null
    | "alun_finance_loans"
    | "bank_guarantees"
    | "alun_estate"
    | "developer_center"
    | "alun_capital"
    | "global_finance"
    | "ivchenko_pro"
    | "city_car"
  >(null);

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
        const mergedData = data.map((item: any) => {
          const fallback = FALLBACK_SERVICES.find(f => 
            f.id === item.id || 
            f.title === item.title
          );
          
          return {
            ...item,
            title: fallback ? fallback.title : item.title, // Ensure new title is used if matched
            description: Array.isArray(item.description) ? item.description : (fallback?.description || []),
            action_type: item.action_type || fallback?.action_type || 'link',
            action_text: item.action_text || fallback?.action_text || 'Подробнее',
            action_url: item.action_url || fallback?.action_url,
            modal_id: item.modal_id || fallback?.modal_id,
            role: item.role || fallback?.role,
            secondary_action_text: item.secondary_action_text || fallback?.secondary_action_text,
            secondary_action_type: item.secondary_action_type || fallback?.secondary_action_type,
            secondary_modal_id: item.secondary_modal_id || fallback?.secondary_modal_id,
            details: item.details || fallback?.details,
          } as Service;
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

  const handleAction = (service: Service) => {
    // Priority: Dynamic details from Admin
    if (service.details && (service.details.title || (service.details.content && service.details.content.length > 0))) {
      setActiveService(service);
      return;
    }

    if (service.title === "ALUN Finance") {
      setActiveModal("alun_finance_loans");
      return;
    }
    if (service.title === "ALUN Estate") {
      setActiveModal("alun_estate");
      return;
    }
    if (service.title === "Центр девелоперских решений") {
      setActiveModal("developer_center");
      return;
    }
    if (service.title === "ALUN Capital") {
      setActiveModal("alun_capital");
      return;
    }
    if (service.title === "Global Finance") {
      setActiveModal("global_finance");
      return;
    }
    if (service.title === "Ivchenko.pro") {
      setActiveModal("ivchenko_pro");
      return;
    }
    if (service.title === "Инвестиции в автолизинг CityCar") {
      setActiveModal("city_car");
      return;
    }

    if (service.action_type === 'link' && service.action_url) {
      window.open(service.action_url, '_blank');
    }
  };

  const handleSecondaryAction = (service: Service) => {
    if (service.title === "ALUN Finance") {
      setActiveModal("bank_guarantees");
      return;
    }

    if (service.secondary_action_type === 'link' && service.secondary_action_url) {
      window.open(service.secondary_action_url, '_blank');
    }
  };

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
            // Special rendering for Ivchenko.pro
            if (service.title === "Ivchenko.pro") {
              return (
                <div key={service.id} className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors relative overflow-hidden">
                {service.tag && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#C5A66F] to-[#b8955a] text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-lg shadow-[#C5A66F]/20">
                    {service.tag}
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center border border-[var(--border)] shadow-sm mb-4">
                  <div className="text-[#C5A66F]">
                    <Lock size={24} />
                  </div>
                </div>
              
              <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-3 leading-tight">
                {service.title}
              </h3>
                  
              <div className="space-y-4 mb-8">
                {service.description.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                    <span className="text-sm text-[var(--muted-foreground)] leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleAction(service)}
                className="w-full py-3 px-4 bg-[#2A241F] text-[#C5A66F] text-sm font-bold rounded-xl border border-[#C5A66F]/20 shadow-lg hover:bg-[#383028] hover:border-[#C5A66F]/50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {service.action_text || "Подробнее"}
                <ChevronRight size={14} />
              </button>
                </div>
              );
            }

            // Standard Service Card
            return (
              <ServiceCard 
                key={service.id}
                icon={service.icon === 'lock' ? <Lock size={24} className="text-[#C5A66F]" /> : service.icon === 'car' ? <Car size={24} className="text-[#C5A66F]" /> : ICON_MAP[service.icon] ? <div className="text-[#C5A66F]"><ServiceIcon name={service.icon} /></div> : null}
                title={service.title}
                description={service.description}
                tag={service.tag}
                actions={
                  <div className="flex gap-3">
                    {service.secondary_action_text && (
                      <button 
                        onClick={() => handleSecondaryAction(service)}
                        className="flex-1 py-3 px-4 bg-[#2A241F] text-[#C5A66F] text-sm font-bold rounded-xl border border-[#C5A66F]/20 shadow-lg hover:bg-[#383028] hover:border-[#C5A66F]/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {service.secondary_action_text}
                        <ChevronRight size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleAction(service)}
                      className="flex-1 py-3 px-4 bg-[#2A241F] text-[#C5A66F] text-sm font-bold rounded-xl border border-[#C5A66F]/20 shadow-lg hover:bg-[#383028] hover:border-[#C5A66F]/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {service.action_text}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                }
              />
            );
          })
        )}
      </div>

      {activeModal === "alun_finance_loans" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">Займы ALUN Finance</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Организуем займы от частных инвесторов для компаний реального сектора с выручкой от 300 млн ₽ в год. 
                  Работаем только с обеспеченными сделками — под залог имущества и поручительство собственников. 
                  Все сделки проходят многоэтапную проверку и сопровождаются юридическим оформлением.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Критерии и условия</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Оборот компании: от 300 млн ₽ в год.",
                    "Сектор: понятный, действующий бизнес в реальном секторе.",
                    "Обеспечение: залог имущества и поручительство собственников.",
                    "Срок займа: 3–12 месяцев.",
                    "Ставка: 2,5–4% в месяц.",
                    "Сумма: от 5 млн ₽."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <Briefcase size={20} />
                  <h4 className="font-bold text-lg">Частые цели</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Исполнение госконтрактов.",
                    "Пополнение оборотных средств.",
                    "Масштабирование производства."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/alun_finance", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "ivchenko_pro" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">Ivchenko.pro</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <ShieldCheck size={20} />
                  <h4 className="font-bold text-lg">Конфиденциальность и доверие</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Ivchenko.pro — точка входа для закрытых и конфиденциальных запросов, которые не относятся к стандартным сервисам. Здесь решают сложные ситуации в бизнесе и задачи, где важны доверие, взвешенный подход и правильные люди за столом. Запросы рассматриваются точечно, в узком кругу и без лишней огласки.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <Briefcase size={20} />
                  <h4 className="font-bold text-lg">С чем можно обратиться</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Запросы закрытого конфиденциального характера.",
                    "Сложные ситуации в бизнесе: кассовые разрывы, риск банкротства, проверки, претензии фискальных органов, арбитражные споры.",
                    "Поиск партнёров в действующий или новый бизнес.",
                    "Подбор проверенных подрядчиков под конкретные задачи.",
                    "Поиск тёплых выходов на нужных людей для бизнес-целей."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/oleg8383", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}



      {activeModal === "bank_guarantees" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">Банковские гарантии ALUN Finance</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Помогаем получить банковские гарантии для участия в коммерческих и государственных тендерах (44-ФЗ, 223-ФЗ, 615-ПП) и исполнения контрактов. Работаем со сложными случаями и большими лимитами.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Наиболее востребованные решения</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Кредитование под контракт.",
                    "Возобновляемая кредитная линия.",
                    "Пополнение оборотных средств.",
                    "Возвратный лизинг.",
                    "Кредит физических лиц под залог недвижимости для директора или акционера бизнеса.",
                    "Факторинг."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

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
                    <div key={i} className="bg-[var(--secondary)] p-3 rounded-xl border border-[var(--border)]">
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-xs text-zinc-500">{item.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => window.open("https://t.me/alun_bg", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "alun_estate" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">ALUN Estate</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  ALUN Estate сопровождает сделки купли-продажи премиальной жилой и коммерческой недвижимости «под ключ». 
                  Работаем как с объектами для жизни, так и с коммерческими активами: готовыми арендными бизнесами, коммерческими помещениями и другими доходными объектами. 
                  Работаем с открытыми и закрытыми off-market предложениями, согласовываем условия с застройщиками и собственниками, координируем всех участников сделки и отвечаем за юридическую чистоту.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Основные решения</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Купля-продажа премиальной жилой недвижимости (квартиры, апартаменты, дома).",
                    "Купля-продажа коммерческих объектов (готовые арендные бизнесы, офисы, склады и другие активы).",
                    "Анализ доходности и рисков.",
                    "Доступ к off-market предложениям и спецусловиям от застройщиков.",
                    "Полное юридическое сопровождение до регистрации права собственности."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/alun_estate", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "developer_center" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">Центр девелоперских решений</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Центр девелоперских решений занимается подбором и куплей-продажей земельных участков под застройку и полным сопровождением девелоперских проектов. 
                  Команда и партнёры имеют опыт работы в Минстрое, Правительстве Москвы и крупных девелоперских структурах, что позволяет учитывать как рыночные, так и регуляторные нюансы. 
                  Проекты усиливаются ресурсами бизнес-сообщества ALUN: экспертизой, партнёрами и доступом к финансированию.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <Briefcase size={20} />
                  <h4 className="font-bold text-lg">Что мы делаем</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Подбор и анализ земельных участков под жилую и коммерческую застройку.",
                    "Сопровождение сделок купли-продажи участков.",
                    "Комплексное сопровождение девелоперских проектов.",
                    "Взаимодействие с органами власти и профильными структурами.",
                    "Привлечение партнёров и ресурсов сообщества ALUN для реализации проектов."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Как мы работаем</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Формируем воронку подходящих участков под задачу клиента.",
                    "Проверяем градостроительные ограничения и экономику проекта.",
                    "Помогаем договориться между собственниками земли, девелопером и инвестором.",
                    "Поддерживаем коммуникацию с органами власти и профильными структурами.",
                    "Собираем партнёрский пул вокруг проекта: девелопер, подрядчики, инвесторы."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/AleksanderZharkov", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "alun_capital" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">ALUN Capital</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  ALUN Capital помогает решать инвестиционные задачи: привлечение капитала под рост, новые проекты и сделки M&amp;A. 
                  Команда подбирает инвесторов под профиль конкретного проекта, упаковывает предложение на понятном для них языке 
                  и сопровождает переговоры до подписания документов и фактического закрытия сделки.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Формат работы</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Анализ проекта и формулировка инвестиционной задачи.",
                    "Подготовка материалов для инвесторов: тизер, презентация, ключевые цифры.",
                    "Формирование short list инвесторов под профиль проекта.",
                    "Организация встреч и переговоров с потенциальными инвесторами.",
                    "Согласование ключевых условий и сопровождение сделки до закрытия."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/lucky6409", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "global_finance" && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">Global Finance</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <FileText size={20} />
                  <h4 className="font-bold text-lg">Описание услуги</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Платежный агент и партнёр по сопровождению внешнеэкономической деятельности. 
                  Global Finance помогает выстроить понятную и безопасную схему расчётов: оплата инвойсов, международные переводы, 
                  координация взаимодействия с банками и платёжными провайдерами, контроль соответствия документов требованиям контрагентов.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                  <CheckCircle size={20} />
                  <h4 className="font-bold text-lg">Наиболее востребованные решения</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Оплата инвойсов поставщикам за рубежом.",
                    "SWIFT-переводы контрагентам в разных юрисдикциях.",
                    "Расчёты в разных валютах по согласованной схеме.",
                    "Координация взаимодействия с банками и платёжными провайдерами.",
                    "Сопровождение платежей пакетами необходимых документов."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => window.open("https://t.me/Igor_GF_001", "_blank")}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Generic Dynamic Modal */}
      {activeService && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">{activeService.details?.title || activeService.title}</h3>
                <p className="text-xs text-zinc-500">{activeService.tag}</p>
              </div>
              <button 
                onClick={() => setActiveService(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {activeService.details?.content && activeService.details.content.map((paragraph, idx) => (
                <p key={idx} className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}

              {activeService.details?.list && activeService.details.list.items.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                    <CheckCircle size={20} />
                    <h4 className="font-bold text-lg">{activeService.details.list.title || "Детали"}</h4>
                  </div>
                  <ul className="space-y-3">
                    {activeService.details.list.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeService.details?.footer && (
                <p className="mt-4 text-xs text-zinc-500 italic">
                  {activeService.details.footer}
                </p>
              )}

              <button 
                onClick={() => {
                  if (activeService.action_url) {
                    window.open(activeService.action_url, "_blank");
                  } else {
                     window.open("https://t.me/oleg8383", "_blank");
                  }
                }}
                className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
              >
                {activeService.action_text || "Подробнее"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
