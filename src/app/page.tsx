"use client";

import Image from "next/image";
import { Building2, TrendingUp, Users, ArrowRight, Wallet, Briefcase, FileText, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white pb-32 font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative w-full h-[65vh] min-h-[500px]">
        {/* Main Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/олегив.jpg" 
            alt="Олег Ивченко" 
            fill
            className="object-cover object-top opacity-90"
            priority
          />
          {/* Gradient Overlay for seamless transition to dark bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/20 to-[#0F0F0F] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center justify-end pb-8 px-4 text-center">
          
          <h1 className="text-[3.5rem] leading-[0.9] font-bold text-[#C5A66F] mb-3 tracking-wide drop-shadow-2xl">
            ОЛЕГ<br />ИВЧЕНКО
          </h1>
          
          <p className="text-lg text-gray-300 font-medium mb-5 tracking-wide">
            Предприниматель, инвестор, CEO
          </p>

          <div className="inline-block px-6 py-2 rounded-full bg-[#C5A66F] text-[#0F0F0F] font-bold text-xs uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(197,166,111,0.3)]">
            Official Profile
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 space-y-10 relative z-20 -mt-4">
        
        {/* Zakrytye Sdelki (Closed Deals) */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[#C5A66F] uppercase tracking-wider">Закрытые сделки</h2>
            <Link href="/cases" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#C5A66F] transition-colors">
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
          <h2 className="text-sm font-bold text-[#C5A66F] uppercase tracking-wider mb-4 px-1">Моя сеть</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard value="3 523" label="Контактов" sub="Подключение" />
            <StatCard value="167" label="Партнеров" sub="Активные" />
            <StatCard value="14.3B" label="Сделок" sub="Оборот" />
          </div>
        </section>

        {/* Blog i Analitika */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-sm font-bold text-[#C5A66F] uppercase tracking-wider">Блог и аналитика</h2>
            <Link href="/blog" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#C5A66F] transition-colors">
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
    <div className="min-w-[200px] h-[140px] rounded-2xl relative overflow-hidden group">
      <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-white font-bold text-sm leading-tight mb-0.5">{title}</div>
        <div className="text-gray-400 text-[10px]">{subtitle}</div>
      </div>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string, label: string, sub: string }) {
  return (
    <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-[#333] flex flex-col items-center text-center hover:border-[#C5A66F]/50 transition-colors">
      <div className="text-[#C5A66F] font-bold text-lg mb-0.5">{value}</div>
      <div className="text-gray-300 text-[10px] font-medium uppercase">{label}</div>
      <div className="text-gray-600 text-[9px]">{sub}</div>
    </div>
  );
}

function BlogCard({ title, category, image }: { title: string, category: string, image: string }) {
  return (
    <div className="bg-[#1A1A1A] p-3 rounded-2xl border border-[#333] flex gap-4 items-center hover:border-[#C5A66F]/30 transition-colors group">
      <div className="w-16 h-16 rounded-xl relative overflow-hidden flex-shrink-0">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div>
        <div className="text-[#C5A66F] text-[10px] font-bold uppercase tracking-wider mb-1">{category}</div>
        <div className="text-white font-bold text-sm leading-tight">{title}</div>
      </div>
    </div>
  );
}
