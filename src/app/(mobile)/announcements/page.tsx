"use client";

import { Megaphone, ArrowRight, Tag, X, CheckCircle, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Announcement, FALLBACK_ANNOUNCEMENTS } from "@/lib/data";

export default function Announcements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(FALLBACK_ANNOUNCEMENTS);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

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
            try {
              const parsed = JSON.parse(localData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAnnouncements(parsed);
              } else {
                setAnnouncements(FALLBACK_ANNOUNCEMENTS);
              }
            } catch (e) {
              setAnnouncements(FALLBACK_ANNOUNCEMENTS);
            }
          }
        }
      } catch (err) {
        console.error("Supabase fetch error, checking local storage");
        const localData = localStorage.getItem('announcements');
        if (localData) {
            try {
              const parsed = JSON.parse(localData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAnnouncements(parsed);
              } else {
                setAnnouncements(FALLBACK_ANNOUNCEMENTS);
              }
            } catch (e) {
              setAnnouncements(FALLBACK_ANNOUNCEMENTS);
            }
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
              
              <button 
                className="w-full bg-[#2A241F] text-[#C5A66F] text-sm font-bold py-3 px-4 rounded-xl border border-[#C5A66F]/20 shadow-lg hover:bg-[#383028] hover:border-[#C5A66F]/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  if (item.action_type === 'modal' || item.details) {
                    setActiveAnnouncement(item);
                  } else if (item.link) {
                    window.open(item.link, '_blank');
                  }
                }}
              >
                {item.button_text || "Подробнее"}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Modal */}
      {activeAnnouncement && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card)] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-[var(--border)] sm:border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--card)] z-10 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-white">{activeAnnouncement.title}</h3>
                <p className="text-xs text-zinc-500">{activeAnnouncement.tag}</p>
              </div>
              <button 
                onClick={() => setActiveAnnouncement(null)} 
                className="p-2 bg-[var(--secondary)] rounded-full hover:bg-[var(--muted)] transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {activeAnnouncement.details?.title && (
                 <div>
                  <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                    <Car size={20} />
                    <h4 className="font-bold text-lg">{activeAnnouncement.details.title}</h4>
                  </div>
                </div>
              )}
              
              {activeAnnouncement.details?.content && activeAnnouncement.details.content.map((paragraph, idx) => (
                <p key={idx} className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}

              {activeAnnouncement.details?.list && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#C5A66F]">
                    <CheckCircle size={20} />
                    <h4 className="font-bold text-lg">{activeAnnouncement.details.list.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {activeAnnouncement.details.list.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A66F] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeAnnouncement.details?.footer && (
                <p className="mt-4 text-xs text-zinc-500 italic">
                  {activeAnnouncement.details.footer}
                </p>
              )}

              {activeAnnouncement.link && (
                <button 
                  onClick={() => window.open(activeAnnouncement.link, "_blank")}
                  className="w-full bg-[#C5A66F] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] hover:bg-[#b8955a] active:scale-95 transition-all"
                >
                  Написать в Telegram
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
