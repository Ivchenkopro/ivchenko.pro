"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Lock } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import AnnouncementsTab from "./components/AnnouncementsTab";
import SettingsTab from "./components/SettingsTab";
import LinksTab from "./components/LinksTab";
import AppearanceTab from "./components/AppearanceTab";
import LogsTab from "./components/LogsTab";
import ServicesTab from "./components/ServicesTab";
import CasesTab from "./components/CasesTab";

type Tab = "announcements" | "settings" | "links" | "appearance" | "logs" | "services" | "cases";

export default function AdminPanel() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Tab State
  const [currentTab, setCurrentTab] = useState<Tab>("announcements");

  // Session Timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAuthenticated) {
      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsAuthenticated(false);
          alert("Сессия истекла из-за неактивности");
        }, 15 * 60 * 1000); // 15 minutes
      };
      
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keypress", resetTimer);
      window.addEventListener("click", resetTimer);
      
      resetTimer();
      
      // Log login action
      supabase.from('audit_logs').insert([{ 
        action: 'login', 
        entity: 'auth', 
        details: 'Admin session started' 
      }]);
      
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keypress", resetTimer);
        window.removeEventListener("click", resetTimer);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "6789") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Неверный пароль");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Админ-панель</h1>
            <p className="text-gray-500 text-sm">Введите код доступа для продолжения</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-center text-2xl tracking-widest"
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-sm mt-2 text-center">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              {currentTab === "announcements" && "Объявления"}
              {currentTab === "settings" && "Настройки"}
              {currentTab === "links" && "Ссылки"}
              {currentTab === "appearance" && "Внешний вид"}
              {currentTab === "logs" && "Журнал действий"}
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Выйти</span>
            </button>
          </header>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
            {currentTab === "announcements" && <AnnouncementsTab />}
            {currentTab === "services" && <ServicesTab />}
            {currentTab === "cases" && <CasesTab />}
            {currentTab === "settings" && <SettingsTab />}
            {currentTab === "links" && <LinksTab />}
            {currentTab === "appearance" && <AppearanceTab />}
            {currentTab === "logs" && <LogsTab />}
          </div>
        </div>
      </main>

      <MobileNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
