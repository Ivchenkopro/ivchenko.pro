"use client";

import { Megaphone, ArrowRight, Clock, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Announcement, FALLBACK_ANNOUNCEMENTS } from "@/lib/data";

export default function Announcements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(FALLBACK_ANNOUNCEMENTS);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('id', { ascending: false });

        if (!error && data && data.length > 0) {
          setAnnouncements(data);
        } else {
          // Try local storage if Supabase fails or is empty (and we have local edits)
          const localData = localStorage.getItem('announcements');
          if (localData) {
            setAnnouncements(JSON.parse(localData));
          }
        }
      } catch (err) {
        console.error("Supabase fetch error, checking local storage");
        const localData = localStorage.getItem('announcements');
        if (localData) {
          setAnnouncements(JSON.parse(localData));
        }
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAdminAccess = () => {
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A66F]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#C5A66F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="px-5 py-8 relative z-10 max-w-lg mx-auto">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[var(--secondary-foreground)] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Megaphone size={12} />
            Bulletin Board
          </div>
          <h1 
            onClick={handleAdminAccess}
            className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight cursor-pointer hover:text-[#C5A66F] transition-colors"
          >
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
              </div>

              <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-2 leading-tight group-hover:text-white transition-colors">
                {item.title}
              </h3>
              
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">
                {item.description}
              </p>
              
              {item.link && (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#C5A66F] hover:text-white transition-colors"
                >
                  {item.button_text || "Подробнее"}
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
