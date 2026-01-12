"use client";

import { Target, TrendingUp, Users, Rocket, Briefcase, Globe, Award, Zap } from "lucide-react";

export default function Results() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-black pb-32 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A66F]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#C5A66F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="px-5 py-8 relative z-10 max-w-lg mx-auto">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A66F]/10 border border-[#C5A66F]/20 text-[#C5A66F] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Award size={12} />
            Track Record
          </div>
          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
            Результаты <span className="text-[#C5A66F]">.</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[80%]">
            Цифры, которые говорят громче слов. Реальный вклад в бизнес партнеров.
          </p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Main Hero Card - Spans Full Width */}
          <div className="col-span-2 bg-[#121212] rounded-[2rem] p-6 relative overflow-hidden shadow-2xl shadow-[#C5A66F]/20 group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(197,166,111,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A66F] rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                  <TrendingUp className="text-[#C5A66F]" size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-[#C5A66F] text-[#121212] text-xs font-bold">
                  2024
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Годовой оборот проектов</span>
                <div className="text-5xl font-bold text-white tracking-tight">
                  3.3 <span className="text-[#C5A66F]">млрд ₽</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 1 */}
          <BentoCard 
            icon={<Users size={18} />}
            value="8,900+"
            label="Рабочих контактов"
            sub="ТОП-менеджеры"
            delay={100}
          />

          {/* Stat Card 2 */}
          <BentoCard 
            icon={<Briefcase size={18} />}
            value="4,000+"
            label="Партнеров"
            sub="50+ отраслей"
            delay={200}
          />

          {/* Stat Card 3 */}
          <BentoCard 
            icon={<Rocket size={18} />}
            value="137"
            label="Новых проектов"
            sub="Запущены с нами"
            delay={300}
            className="bg-[#C5A66F]/5 border-[#C5A66F]/20"
          />

          {/* Stat Card 4 */}
          <BentoCard 
            icon={<Target size={18} />}
            value="1,300+"
            label="Сделок"
            sub="Успешно закрыто"
            delay={400}
          />

          {/* Wide Card - Spheres */}
          <div className="col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-[2rem] p-5 shadow-xl shadow-gray-200/50 border border-white/60 flex items-center justify-between relative overflow-hidden group hover:shadow-[#C5A66F]/10 transition-all duration-500">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#C5A66F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 group-hover:text-[#C5A66F] group-hover:border-[#C5A66F]/30 transition-all duration-300 shadow-sm">
                <Globe size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-700 leading-none mb-1">35</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Сфер бизнеса</div>
              </div>
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-[#C5A66F]/10 flex items-center justify-center text-[#C5A66F] border border-[#C5A66F]/20">
              <Zap size={16} fill="currentColor" />
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="mt-6 p-1 rounded-[2rem] bg-gradient-to-br from-[#C5A66F] via-[#A68A55] to-[#8C7345] shadow-xl shadow-[#C5A66F]/30">
          <div className="bg-[#1a1a1a] rounded-[1.8rem] p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
             <div className="relative z-10">
               <h3 className="text-white font-bold text-lg mb-2">Масштабируйте успех</h3>
               <p className="text-gray-400 text-xs mb-4 leading-relaxed px-4">
                 Используйте наш опыт и связи для кратного роста вашего бизнеса.
               </p>
               <button className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg shadow-white/10">
                 Оставить заявку
               </button>
             </div>
          </div>
        </div>

      </div>
    </main>
  );
}

interface BentoCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  delay?: number;
  className?: string;
}

function BentoCard({ icon, value, label, sub, delay = 0, className = "" }: BentoCardProps) {
  return (
    <div 
      className={`bg-white p-5 rounded-[1.5rem] shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col justify-between h-36 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-300 group-hover:text-[#C5A66F] transition-colors duration-300">
          {icon}
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#C5A66F] transition-colors duration-300" />
      </div>
      
      <div>
        <div className="text-2xl font-bold text-black mb-1 group-hover:scale-105 transition-transform origin-left">{value}</div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-[9px] text-gray-300 leading-tight">{sub}</div>
      </div>
    </div>
  );
}
