import Image from "next/image";
import { Building2, Handshake, TrendingUp, Wheat } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black pb-32 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-100 to-white z-0" />
      <div className="absolute top-20 right-[-20%] w-[60%] h-96 bg-[#C5A66F]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="w-full relative rounded-b-[3rem] overflow-hidden shadow-2xl shadow-[#C5A66F]/20">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full opacity-50" />
          <Image 
            src="/ава.png" 
            alt="Олег Ивченко" 
            width={800}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
        
        <div className="px-6 mt-8 relative z-30">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#C5A66F]/10 text-[#C5A66F] font-bold text-xs uppercase tracking-widest mb-4 border border-[#C5A66F]/20">
            Official Profile
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-4 leading-tight text-black">
            Предприниматель,<br/>инвестор, CEO
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed">
            Ваш проводник в мир <span className="text-[#C5A66F] font-bold">закрытых сделок</span> и больших возможностей
          </p>
          <div className="h-1.5 w-32 bg-gradient-to-r from-[#C5A66F] to-transparent rounded-full shadow-[0_0_15px_#C5A66F]"></div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10 relative z-10">
        {/* Intro */}
        <div className="space-y-4 text-gray-600 text-[16px] leading-relaxed">
          <p>
            Я превращаю ваши контакты в многомиллионные сделки. За 8 лет организовал доступ к <span className="font-bold text-black">4000+</span> проверенным партнерам в <span className="font-bold text-black">50+</span> отраслях.
          </p>
        </div>

        {/* Highlight Card */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 text-center shadow-2xl shadow-[#C5A66F]/30 relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-500">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          {/* Gold Glow Effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A66F] rounded-full -mr-20 -mt-20 blur-[80px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#C5A66F] rounded-full -ml-20 -mb-20 blur-[80px] opacity-40 animate-pulse delay-700"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="w-12 h-12 bg-[#C5A66F]/20 rounded-full flex items-center justify-center border border-[#C5A66F]/50 text-[#C5A66F]">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
             </div>
             <p className="text-white text-xl font-medium leading-relaxed">
               Ваша сделка от <span className="text-[#C5A66F] font-bold text-2xl">50 млн ₽</span> —<br/>моя специализация
             </p>
          </div>
        </div>

        {/* About */}
        <div className="space-y-4 text-gray-600 text-[16px] leading-relaxed">
          <p>
            Я — предприниматель с 20+ лет опыта в управлении бизнесом.
          </p>
          <p>
            Моя уникальность — в постоянной воронке возможностей и умении работать в партнёрстве. Делаю бизнес «два в одном»: нанизываю на имеющиеся сервисы новые возможности, которые формирую сам.
          </p>
        </div>

        {/* Focus Section */}
        <div>
          <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#C5A66F] rounded-full shadow-[0_0_10px_#C5A66F]"></span>
            Мой фокус:
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {[
              "M&A (слияния и поглощения)",
              "Стратегические контракты",
              "Финансовые операции",
              "Налоговый консалтинг",
              "GR (government relations) и инвестиции",
              "Взаимовыгодные партнёрства"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="min-w-[6px] h-[6px] rounded-full bg-[#C5A66F] shadow-[0_0_5px_#C5A66F]"></div>
                <span className="text-gray-800 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Values Section */}
        <div className="bg-[#C5A66F]/10 p-6 rounded-2xl border-l-4 border-[#C5A66F] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C5A66F]/5 to-transparent pointer-events-none" />
          <h3 className="text-lg font-bold text-black mb-3 relative z-10">Мои ценности:</h3>
          <p className="text-gray-700 italic relative z-10 leading-relaxed">
            «Репутация, слово и дело. Не бросаю слова на ветер. Работаю с теми, кто сам построил бизнес и реально делает.»
          </p>
        </div>

        {/* Key Roles Section */}
        <div>
          <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#C5A66F] rounded-full shadow-[0_0_10px_#C5A66F]"></span>
            Ключевые роли:
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <RoleCard 
              icon={<Building2 className="text-[#C5A66F]" />} 
              title="CEO и Со-Founder" 
              company="Global Finance" 
            />
            <RoleCard 
              icon={<Handshake className="text-[#C5A66F]" />} 
              title="CEO и Со-Founder" 
              company="Alun Partners" 
            />
            <RoleCard 
              icon={<TrendingUp className="text-[#C5A66F]" />} 
              title="Со-Founder" 
              company="инвестиционного фонда Alun Capital" 
            />
            <RoleCard 
              icon={<Wheat className="text-[#C5A66F]" />} 
              title="Со-Founder" 
              company="международный трейдинг зерна" 
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function RoleCard({ icon, title, company }: { icon: React.ReactNode, title: string, company: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5 hover:shadow-xl transition-all group">
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{title}</div>
        <div className="text-black font-bold text-lg leading-tight">{company}</div>
      </div>
    </div>
  );
}
