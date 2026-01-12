"use client";

import { Briefcase, Star, Shield, Award, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Кейсы", icon: Briefcase, href: "/cases" },
    { name: "Услуги", icon: Star, href: "/services" },
    { name: "Главная", icon: Shield, href: "/" },
    { name: "Результаты", icon: Award, href: "/results" },
    { name: "Контакты", icon: User, href: "/contacts" },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center">
      {/* iOS-style Glass Container - Dark Theme for Contrast */}
      <nav className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] px-2 py-2 shadow-2xl shadow-black/20 w-full max-w-md relative overflow-hidden">
        
        {/* Shine effect on top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <ul className="flex justify-between items-center relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href);

            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 py-2 relative group"
                >
                  {/* Animated Background Pill for Active State */}
                  <div 
                    className={`absolute inset-0 bg-[#C5A66F] rounded-2xl transition-all duration-300 ease-out ${
                      isActive 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-75 group-hover:opacity-10"
                    }`}
                  />

                  {/* Icon with float animation */}
                  <div className={`relative z-10 transition-all duration-300 ${
                    isActive 
                      ? "text-[#121212] -translate-y-1" 
                      : "text-gray-400 group-hover:text-white"
                  }`}>
                    <Icon 
                      size={22} 
                      strokeWidth={isActive ? 2 : 1.5} 
                      className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                    />
                  </div>

                  {/* Label with slide/fade animation */}
                  <span className={`relative z-10 text-[9px] font-bold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? "text-[#121212] translate-y-0 opacity-100" 
                      : "text-gray-500 translate-y-2 opacity-0 h-0"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
