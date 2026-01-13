"use client";

import { Briefcase, Star, Home, Award, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Кейсы", icon: Briefcase, href: "/cases" },
    { name: "Услуги", icon: Star, href: "/services" },
    { name: "Главная", icon: Home, href: "/" },
    { name: "Анонсы", icon: Award, href: "/announcements" },
    { name: "Контакты", icon: User, href: "/contacts" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex justify-center">
      {/* Light Premium Navigation */}
      <nav className="bg-[var(--card)]/90 backdrop-blur-2xl border border-[#C5A66F]/30 rounded-[2rem] px-2 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] w-full relative overflow-hidden">
        
        {/* Shine effect on top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A66F]/50 to-transparent" />

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
                  className="flex flex-col items-center justify-center gap-1 py-3 relative group"
                >
                  {/* Gold Background Pill for Active State */}
                  <div 
                    className={`absolute inset-x-2 inset-y-1 bg-[#C5A66F] rounded-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                      isActive 
                        ? "opacity-100 scale-100 shadow-[0_0_15px_rgba(197,166,111,0.4)]" 
                        : "opacity-0 scale-75"
                    }`}
                  />

                  {/* Icon */}
                  <div className={`relative z-10 transition-all duration-300 ${
                    isActive 
                      ? "text-white scale-110" 
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)]"
                  }`}>
                    <Icon 
                      size={24} 
                      strokeWidth={isActive ? 2 : 1.5} 
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
