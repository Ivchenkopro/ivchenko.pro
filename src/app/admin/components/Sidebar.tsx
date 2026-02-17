import { Megaphone, Settings, Link as LinkIcon, Palette, FileText, Activity, Briefcase, Star, Home } from "lucide-react";

type Tab = "announcements" | "home" | "settings" | "links" | "appearance" | "logs" | "services" | "cases";

interface SidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "announcements", label: "Объявления", icon: Megaphone },
    { id: "home", label: "Главная", icon: Home },
    { id: "services", label: "Мои проекты", icon: Star },
    { id: "cases", label: "Кейсы", icon: Briefcase },
    { id: "links", label: "Ссылки", icon: LinkIcon },
    { id: "settings", label: "Контент и SEO", icon: FileText },
    { id: "appearance", label: "Внешний вид", icon: Palette },
    { id: "logs", label: "Журнал", icon: Activity },
  ] as const;

  return (
    <aside className="w-full md:w-64 bg-[var(--card)] border-r border-[var(--border)] hidden md:block min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[var(--card-foreground)] mb-6">Меню</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentTab === item.id
                  ? "bg-[#C5A66F] text-white font-bold shadow-lg"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
