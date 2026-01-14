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
        <div className="absolute inset-0 z-0 bg-black [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
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
              Я предприниматель и инвестор. Моя команда помогает масштабировать бизнес, находить точки роста и привлекать инвестиции.
            </p>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Внедрение наших стратегий позволяет бизнесу кратно расти. Чтобы связаться со мной или обсудить партнерство, сохраните эту визитку.
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
        
        {/* Zakrytye Sdelki (Closed Deals) */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[#4A4A4A] uppercase tracking-wider">Закрытые сделки</h2>
            <Link href="/cases" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#4A4A4A] transition-colors">
              Все кейсы <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            <DealCard 
              image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60"
              title="Инвестиции в недвижимость"
              subtitle="ЖК Prime Park"
            />
            <DealCard 
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60"
              title="Строительство завода"
              subtitle="Промышленный сектор"
            />
            <DealCard 
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
              title="IT Стартап"
              subtitle="Финтех платформа"
            />
          </div>
        </section>

        {/* Moya Set (My Network) */}
        <section>
          <h2 className="text-sm font-bold text-[#4A4A4A] uppercase tracking-wider mb-4 px-1">Моя сеть</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard value="3 523" label="Контактов" sub="Подключение" />
            <StatCard value="167" label="Партнеров" sub="Активные" />
            <StatCard value="14.3B" label="Сделок" sub="Оборот" />
          </div>
        </section>

        {/* Blog i Analitika */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[#4A4A4A] uppercase tracking-wider">Блог и аналитика</h2>
            <Link href="/blog" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#4A4A4A] transition-colors">
              Читать <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            <BlogCard 
              title="Как масштабировать бизнес в 2024 году?"
              category="Стратегия"
              image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60"
            />
            <BlogCard 
              title="Инвестиционные тренды: куда вкладывать?"
              category="Аналитика"
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
            />
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
    <div className="bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] flex gap-4 items-center hover:border-[#C5A66F]/30 transition-colors group shadow-sm">
      <div className="w-16 h-16 rounded-xl relative overflow-hidden flex-shrink-0">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div>
        <div className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-wider mb-1">{category}</div>
        <div className="text-[var(--card-foreground)] font-bold text-sm leading-tight">{title}</div>
      </div>
    </div>
  );
}
