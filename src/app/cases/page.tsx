"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Loader2, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Case, FALLBACK_CASES } from "@/lib/data";
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
        
      if (data && data.length > 0) {
        // Merge with fallback to ensure links exist
        const mergedData = data.map(item => {
          const fallback = FALLBACK_CASES.find(f => f.id === item.id || f.title === item.title);
          return {
            ...item,
            link: item.link || fallback?.link,
            icon: item.icon || fallback?.icon,
            details: item.details || fallback?.details
          };
        });
        setCases(mergedData);
      } else {
        setCases(FALLBACK_CASES);
      }
    } catch (err) {
      console.error(err);
      setCases(FALLBACK_CASES);
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
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Примеры реализованных проектов</h1>

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

      {/* Floating Action Button - Removed */}

      {/* Toast Notification - Removed */}
    </main>
  );
}

function CaseIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || ICON_MAP["building"];
  return <Icon className="text-[#C5A66F]" size={28} />;
}

interface CaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string;
  link?: string;
}

function CaseCard({ icon, title, description, details, link }: CaseCardProps) {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-lg border border-[var(--border)] relative overflow-hidden group hover:border-[#C5A66F]/50 transition-all">
      {/* Decorative background element */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#C5A66F]/10 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[#C5A66F]/10 rounded-xl border border-[#C5A66F]/20">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight pr-2">{title}</h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-zinc-400 font-medium leading-relaxed">{description}</p>
          {details && (
            <div className="pt-3 mt-2 border-t border-white/10">
              <p className="text-sm text-zinc-500 leading-relaxed italic">
                {details}
              </p>
            </div>
          )}
          {link && (
            <div className="pt-4 mt-2">
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#C5A66F] text-black font-bold py-3 px-6 rounded-full shadow-[0_0_15px_rgba(197,166,111,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#b8955a]"
              >
                Подробнее
                <ChevronRight size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
