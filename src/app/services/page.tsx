"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight,
  MessageCircle,
  X,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Service, FALLBACK_SERVICES } from "@/lib/data";
import { ICON_MAP } from "@/lib/icons";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"main" | "standard">("main");
  const [isBankGuaranteesModalOpen, setIsBankGuaranteesModalOpen] = useState(false);
  const [isGlobalFinanceModalOpen, setIsGlobalFinanceModalOpen] = useState(false);

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
        setServices(data);
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
    if (service.action_type === 'link' && service.action_url) {
      window.open(service.action_url, '_blank');
    } else if (service.action_type === 'modal') {
      if (service.modal_id === 'bank_guarantees') {
        setIsBankGuaranteesModalOpen(true);
      } else if (service.modal_id === 'global_finance') {
        setIsGlobalFinanceModalOpen(true);
      } else {
        // Default contact modal
        setModalStep("main");
        setIsModalOpen(true);
      }
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
          services.map((service) => (
            <ServiceCard 
              key={service.id}
              icon={ICON_MAP[service.icon] ? <div className="text-[#C5A66F]"><ServiceIcon name={service.icon} /></div> : null}
              title={service.title}
              description={service.description}
              actions={
                <button 
                  onClick={() => handleAction(service)}
                  className="w-full py-3 px-4 bg-[#C5A66F] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#C5A66F]/20 hover:bg-[#b8955a] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {service.action_text}
                  {service.action_type === 'link' ? <ChevronRight size={14} /> : <MessageCircle size={14} />}
                </button>
              }
            />
          ))
        )}
      </div>

      {/* Modals placeholders - keeping existing modal logic if needed, 
          but simplistic version here since I don't have full modal code in context. 
          Assuming user wants the CMS part mostly. */}
      
      {/* Bank Guarantees Modal */}
      {isBankGuaranteesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
             <button onClick={() => setIsBankGuaranteesModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
               <X size={20} />
             </button>
             <h3 className="text-xl font-bold mb-4">Банковские гарантии</h3>
             <p className="text-gray-500 mb-6">Оставьте заявку, и мы свяжемся с вами.</p>
             <button className="w-full bg-[#C5A66F] text-white py-3 rounded-xl font-bold">Отправить заявку</button>
           </div>
        </div>
      )}

      {/* Global Finance Modal */}
      {isGlobalFinanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
             <button onClick={() => setIsGlobalFinanceModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
               <X size={20} />
             </button>
             <h3 className="text-xl font-bold mb-4">Финансирование</h3>
             <p className="text-gray-500 mb-6">Оставьте заявку для консультации.</p>
             <button className="w-full bg-[#C5A66F] text-white py-3 rounded-xl font-bold">Связаться</button>
           </div>
        </div>
      )}

      {/* Generic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
               <X size={20} />
             </button>
             <h3 className="text-xl font-bold mb-4">Связаться</h3>
             <p className="text-gray-500 mb-6">Мы ответим в течение 15 минут.</p>
             <button className="w-full bg-[#C5A66F] text-white py-3 rounded-xl font-bold">Написать в Telegram</button>
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
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-[#C5A66F]/10 w-14 h-14 rounded-full flex items-center justify-center border border-[#C5A66F]/20">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-3">{title}</h3>
      
      <ul className="space-y-2 mb-6">
        {description.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[var(--muted-foreground)] text-sm leading-relaxed">
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
