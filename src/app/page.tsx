"use client";

import Image from "next/image";
import { Building2, TrendingUp, Users, ArrowRight, Wallet, Briefcase, FileText, ChevronRight, Send, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [copied, setCopied] = useState("");

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative w-full h-[65vh] min-h-[500px]">
        {/* Main Image */}
        <div className="absolute inset-0 z-0 bg-black [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
          <Image 
            src="/олегив.jpg" 
            alt="Олег Ивченко" 
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center justify-end pb-8 px-4 text-center">
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 space-y-10 relative z-20 -mt-4">

        {/* New Share Card (Screenshot Style) */}
        <div className="bg-[#18181B] text-white rounded-[2rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Я предприниматель, который из возможностей делает работающие бизнесы. Я хаб, где сходятся идеи, ресурсы и люди. Я отбираю лучшие из множества проектов, анализирую их, привлекаю деньги, исполнителей и партнеров и вместе мы ставим бизнес на рельсы.
            </p>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Уникальность моей работы — постоянная воронка возможностей и умение реализовывать их в партнерстве. В этом приложении — мои действующие бизнесы и точка входа для новых совместных проектов.
            </p>

            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Олег Ивченко',
                    text: 'Предприниматель, Инвестор. Контакты и проекты.',
                    url: window.location.href,
                  });
                } else {
                  handleCopy(window.location.href, "share");
                }
              }}
              className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
               {copied === "share" ? "Ссылка скопирована!" : "Поделиться визиткой"}
            </button>
          </div>
        </div>
        
        {/* Moi Proekty (My Projects) */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[#4A4A4A] uppercase tracking-wider">Мои проекты</h2>
            <Link href="/cases" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#4A4A4A] transition-colors">
              Все проекты <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <ProjectCard 
              title="ALUN Capital"
              role="Co-Founder"
              description="Привлечение инвестиций"
            />
            <ProjectCard 
              title="Global Finance"
              role="CEO & Co-Founder"
              description="Кредиты, гарантии, ВЭД"
            />
            <ProjectCard 
              title="Центр девелоперских решений"
              role="CEO & Co-Founder"
              description="Земля под застройку и девелопмент"
            />
            <ProjectCard 
              title="ALUN Estate"
              role="CEO & Co-Founder"
              description="Премиальная жилая и коммерческая недвижимость"
            />
            <ProjectCard 
              title="Вице-президент ALUN"
              role=""
              description="Сообщество предпринимателей и инвесторов"
            />
            <ProjectCard 
              title="Международный трейдинг зерна"
              role="Co-Founder"
              description=""
            />
          </div>
        </section>

        {/* Infographics Section */}
        <section className="rounded-[2rem] bg-[#111111] text-white p-8 relative overflow-hidden border border-[#333]">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
            
            {/* Central White Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111]/80 pointer-events-none" />
 
            <div className="relative z-10">
             <h2 className="text-2xl font-bold text-center mb-1 uppercase tracking-wider">Масштаб в цифрах</h2>
             
             {/* Dotted separator */}
             <div className="w-full border-t-2 border-dotted border-white/20 my-6" />

             <div className="grid grid-cols-2 gap-y-10 gap-x-4 text-center">
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">9000+</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">контактов<br/>в доступе</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">40</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">проектов<br/>в 2025 г.</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">1300+</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">сделок<br/>команды</div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-bold mb-2">3.5 млрд</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight">годовой оборот<br/>проектов</div>
               </div>
             </div>
           </div>
        </section>



        {/* CTA Button */}
        <div className="pt-4 pb-8">
           <button className="w-full bg-[#C5A66F] text-[#0F0F0F] font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(197,166,111,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
             <Wallet size={20} />
             Оставить заявку
           </button>
        </div>

      </div>
    </main>
  );
}

function ProjectCard({ title, role, description }: { title: string, role: string, description: string }) {
  return (
    <div className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] hover:border-[#C5A66F]/30 transition-all active:scale-[0.99] cursor-pointer shadow-sm group">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-[#C5A66F] transition-colors">{title}</h3>
        {role && <span className="text-[10px] font-medium bg-[#C5A66F]/10 text-[#C5A66F] px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{role}</span>}
      </div>
      {description && <div className="text-sm text-[var(--muted-foreground)]">{description}</div>}
    </div>
  );
}

function DealCard({ image, title, subtitle }: { image: string, title: string, subtitle: string }) {
  return (
    <div className="min-w-[200px] h-[140px] rounded-2xl relative overflow-hidden group cursor-pointer">
      <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="text-white/90 text-[10px] font-bold uppercase tracking-wider mb-1">КАТЕГОРИЯ</div>
        <div className="text-white font-bold text-sm leading-tight mb-0.5">{title}</div>
        <div className="text-gray-400 text-[10px]">{subtitle}</div>
      </div>
    </div>
  );
}

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  action: () => void;
}

function ContactRow({ icon, label, value, onCopy, isCopied, action }: ContactRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] group hover:border-[#C5A66F]/30 transition-colors">
      <div className="flex items-center gap-3 cursor-pointer" onClick={action}>
        <div className="text-[#C5A66F]">{icon}</div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">{label}</div>
          <div className="text-[var(--foreground)] font-medium text-sm">{value}</div>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
        className="p-2 text-[var(--muted-foreground)] hover:text-[#C5A66F] transition-colors"
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string, label: string, sub: string }) {
  return (
    <div className="bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] flex flex-col items-center text-center hover:border-[#C5A66F]/50 transition-colors shadow-sm">
      <div className="text-[var(--card-foreground)] font-bold text-lg mb-0.5">{value}</div>
      <div className="text-[var(--muted-foreground)] text-[10px] font-medium uppercase">{label}</div>
      <div className="text-[var(--muted-foreground)] text-[9px]">{sub}</div>
    </div>
  );
}

function BlogCard({ title, category, image }: { title: string, category: string, image: string }) {
  return (
    <div className="flex gap-4 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#C5A66F]/30 transition-colors cursor-pointer group">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-[#C5A66F] text-xs font-bold uppercase tracking-wider mb-1">{category}</div>
        <h3 className="font-bold text-sm leading-snug text-[var(--foreground)] line-clamp-2">{title}</h3>
        <div className="mt-2 text-xs text-[var(--muted-foreground)] flex items-center gap-1 group-hover:text-[#C5A66F] transition-colors">
          Читать статью <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}
