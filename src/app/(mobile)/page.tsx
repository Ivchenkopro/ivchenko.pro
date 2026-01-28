"use client";

import Image from "next/image";
import { Building2, TrendingUp, Users, ArrowRight, Wallet, Briefcase, FileText, ChevronRight, Send, Mail, Copy, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

const PROJECTS = [
  {
    title: "ALUN Capital",
    role: "Co-Founder",
    description: "Привлечение инвестиций",
  },
  {
    title: "Global Finance",
    role: "CEO и Co-Founder",
    description: "Кредиты, банковские гарантии, ВЭД",
  },
  {
    title: "Центр девелоперских решений",
    role: "CEO и Co-Founder",
    description: "Земля под застройку и девелопмент",
  },
  {
    title: "ALUN Estate",
    role: "CEO и Co-Founder",
    description: "Премиальная жилая и коммерческая недвижимость",
  },
  {
    title: "Вице-президент ALUN",
    role: "",
    description: "Сообщество предпринимателей и инвесторов",
  },
  {
    title: "Международный трейдинг зерна",
    role: "Co-Founder",
    description: "Международный трейдинг зерна и связанные проекты",
  },
];

export default function Home() {
  const [copied, setCopied] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings);
      } catch (e) {
        console.error("Error loading settings", e);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A66F]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[500px]">
        {/* Main Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/олегив.jpg" 
            alt={settings["site_title"]} 
            fill
            className="object-cover object-top"
            priority
          />
          {/* Gradient Overlay removed to keep text white */}
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 space-y-10 relative z-20 -mt-2">

        {/* Share Card (Dark Theme) */}
        <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[2rem] p-8 border border-[var(--border)] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 font-[family-name:var(--font-montserrat)]">
              {settings["home_bio_1"]}
            </p>

            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-8 font-[family-name:var(--font-montserrat)]">
              {settings["home_bio_2"]}
            </p>

            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: settings["site_title"],
                    text: settings["share_message"],
                    url: window.location.href,
                  });
                } else {
                  handleCopy(window.location.href, "share");
                }
              }}
              className="w-full bg-[var(--background)] text-[var(--foreground)] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
               {copied === "share" ? "Ссылка скопирована!" : settings["btn_share"]}
            </button>
          </div>
        </div>
        
        {/* My Projects */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Мои проекты</h2>
            <Link href="/services" className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
              Все проекты <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {PROJECTS.map((project) => (
              <ProjectCard 
                key={project.title}
                title={project.title}
                role={project.role}
                description={project.description}
              />
            ))}
          </div>
        </section>

        {/* Infographics Section (Dark Accent) */}
        <section className="rounded-[2rem] bg-[var(--card)] text-[var(--card-foreground)] p-8 relative overflow-hidden border border-[var(--border)]">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
            
            {/* Central White Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10">
             <h2 className="text-2xl font-bold text-center mb-1 uppercase tracking-wider">Масштаб в цифрах</h2>
             
             {/* Dotted separator */}
             <div className="w-full border-t-2 border-dotted border-[var(--border)] my-6" />

             <div className="grid grid-cols-2 gap-y-10 gap-x-4 text-center">
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">{settings["stat_contacts"]}</div>
                 <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest leading-tight">контактов<br/>в доступе</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">{settings["stat_projects"]}</div>
                 <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest leading-tight">проектов<br/>в 2025 г.</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">{settings["stat_deals"]}</div>
                 <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest leading-tight">сделок<br/>команды</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">{settings["stat_turnover"]}</div>
                 <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest leading-tight">годовой оборот<br/>проектов</div>
               </div>
             </div>
           </div>
        </section>

        {/* CTA Button */}
        <div className="pt-4 pb-8">
           <button className="w-full bg-[#C5A66F] text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(197,166,111,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
             <Wallet size={20} />
             {settings["btn_apply"]}
           </button>
        </div>

      </div>
    </main>
  );
}

function ProjectCard({ title, role, description, link }: { title: string, role: string, description: string, link?: string }) {
  const CardContent = () => (
    <div className="bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)] hover:border-[#C5A66F]/50 transition-all active:scale-[0.99] cursor-pointer shadow-sm group h-full">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-[var(--card-foreground)] text-lg leading-tight group-hover:text-[#C5A66F] transition-colors">{title}</h3>
        {role && <span className="text-[10px] font-medium bg-[#C5A66F]/10 text-[#C5A66F] px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{role}</span>}
      </div>
      {description && <div className="text-sm text-[var(--muted-foreground)] line-clamp-2">{description}</div>}
    </div>
  );

  if (link) {
    return (
      <Link href={link} target={link.startsWith('http') ? '_blank' : undefined}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

function StatCard({ value, label, sub }: { value: string, label: string, sub: string }) {
  return (
    <div className="bg-[var(--secondary)] p-3 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center hover:border-[#C5A66F]/50 transition-colors shadow-sm">
      <div className="text-[var(--card-foreground)] font-bold text-lg mb-0.5">{value}</div>
      <div className="text-[var(--muted-foreground)] text-[10px] font-medium uppercase">{label}</div>
      <div className="text-[var(--muted-foreground)] text-[9px]">{sub}</div>
    </div>
  );
}

function BlogCard({ title, category, image }: { title: string, category: string, image: string }) {
  return (
    <div className="flex gap-4 p-3 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors cursor-pointer group shadow-sm">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-[#C5A66F] text-xs font-bold uppercase tracking-wider mb-1">{category}</div>
        <h3 className="font-bold text-sm leading-snug text-[var(--card-foreground)] line-clamp-2">{title}</h3>
        <div className="mt-2 text-xs text-[var(--muted-foreground)] flex items-center gap-1 group-hover:text-[#C5A66F] transition-colors">
          Читать статью <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}
