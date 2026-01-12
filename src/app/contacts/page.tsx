"use client";

import { Phone, Mail, Send, MapPin, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Contacts() {
  const [copied, setCopied] = useState("");

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black pb-32 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C5A66F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#C5A66F]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="px-6 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-black mb-2">Контакты</h1>
        <p className="text-gray-500 mb-8">Всегда на связи для партнеров</p>

        {/* Digital Business Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 border border-gray-100 shadow-2xl relative overflow-hidden mb-8 group">
          {/* Card Shine */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">Олег Ивченко</h2>
                <p className="text-[#C5A66F] font-medium text-sm">Предприниматель, Инвестор</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <Send size={20} className="text-[#C5A66F]" />
              </div>
            </div>

            <div className="space-y-4">
              <ContactRow 
                icon={<Send size={18} />}
                label="Telegram"
                value="@Oleg_Ivchenko"
                onCopy={() => handleCopy("@Oleg_Ivchenko", "tg")}
                isCopied={copied === "tg"}
                action={() => window.open("https://t.me/Oleg_Ivchenko", "_blank")}
              />
              
              <ContactRow 
                icon={<Mail size={18} />}
                label="Email"
                value="oleg@alun.ru"
                onCopy={() => handleCopy("oleg@alun.ru", "email")}
                isCopied={copied === "email"}
                action={() => window.location.href = "mailto:oleg@alun.ru"}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button 
            onClick={() => window.open("https://t.me/Oleg_Ivchenko", "_blank")}
            className="w-full bg-[#C5A66F] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Send size={20} />
            Написать в Telegram
          </button>
          
          <button className="w-full bg-gray-100 text-black font-medium py-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-gray-200">
            Скачать визитку (vCard)
          </button>
        </div>

        {/* Office Location */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <h3 className="text-black font-bold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-[#C5A66F]" />
            Офис
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Москва, Пресненская набережная 12,<br/>
            Башня «Федерация», офис 3402
          </p>
          <button className="text-[#C5A66F] text-sm font-bold flex items-center gap-1 hover:underline">
            Показать на карте <ArrowUpRight size={16} />
          </button>
        </div>

      </div>
    </main>
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
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={action}>
        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:text-black transition-colors">
          {icon}
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">{label}</div>
          <div className="text-black font-medium">{value}</div>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
        className="p-2 text-gray-400 hover:text-[#C5A66F] transition-colors"
      >
        {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
      </button>
    </div>
  );
}
