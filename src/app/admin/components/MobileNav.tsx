import { Megaphone, Settings, Link as LinkIcon, Palette, FileText, Activity, Briefcase, Star } from "lucide-react";

type Tab = "announcements" | "settings" | "links" | "appearance" | "logs" | "services" | "cases";

interface MobileNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function MobileNav({ currentTab, onTabChange }: MobileNavProps) {
  const menuItems = [
    { id: "announcements", label: "Объявления", icon: Megaphone },
    { id: "services", label: "Проекты", icon: Star },
    { id: "cases", label: "Кейсы", icon: Briefcase },
    { id: "links", label: "Ссылки", icon: LinkIcon },
    { id: "settings", label: "SEO", icon: FileText },
    { id: "appearance", label: "Вид", icon: Palette },
    { id: "logs", label: "Логи", icon: Activity },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] z-50 pb-safe">
      <div className="flex justify-around items-center p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as Tab)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentTab === item.id
                ? "text-[#C5A66F]"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
