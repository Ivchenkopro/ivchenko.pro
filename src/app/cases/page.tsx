"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Case } from "@/lib/data";
import { ICON_MAP } from "@/lib/icons";

export default function Cases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await supabase
        .from('cases')
        .select('*')
        .order('order', { ascending: true });
        
      if (data) setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 left-[-20%] w-[60%] h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 right-[-10%] w-[50%] h-80 bg-[#C5A66F]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="px-6 py-8 space-y-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Сделки и кейсы</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A66F]" />
          </div>
        ) : (
          <div className="space-y-6">
            {cases.map((item) => (
              <CaseCard 
                key={item.id}
                icon={<CaseIcon name={item.icon} />}
                title={item.title}
                description={item.description}
                details={item.details}
                link={item.link}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CaseIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || ICON_MAP["building"];
  return <Icon className="text-[#C5A66F]" size={28} />;
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
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-[#C5A66F]/10 text-[#C5A66F] text-sm font-bold rounded-xl border border-[#C5A66F]/20 hover:bg-[#C5A66F] hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
        >
          Подробнее
          <ChevronRight size={14} />
        </a>
      )}
    </div>
  );
}
