"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, LogOut, Save, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type Announcement = {
  id?: number;
  tag: string;
  title: string;
  description: string;
  date: string;
  urgent: boolean;
  created_at?: string;
};

export default function AdminPanel() {
  const router = useRouter();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Data State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // UI State
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentitem, setCurrentItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Announcement>({
    tag: "",
    title: "",
    description: "",
    date: "",
    urgent: false
  });
  
  // Form Validation State
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Announcement, string>>>({});

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
      
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keypress", resetTimer);
        window.removeEventListener("click", resetTimer);
      };
    }
  }, [isAuthenticated]);

  // Load Data
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnnouncements();
    }
  }, [isAuthenticated]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;
      if (data) setAnnouncements(data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      // Fallback for demo if Supabase is not set up
      setError("Не удалось загрузить данные из Supabase. Проверьте конфигурацию.");
    } finally {
      setLoading(false);
    }
  };

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
    router.push("/");
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof Announcement, string>> = {};
    if (!formData.title.trim()) errors.title = "Заголовок обязателен";
    if (!formData.description.trim()) errors.description = "Описание обязательно";
    if (!formData.tag.trim()) errors.tag = "Тег обязателен";
    if (!formData.date.trim()) errors.date = "Дата обязательна"; // In a real app, auto-generate
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (view === "create") {
        const { error } = await supabase
          .from('announcements')
          .insert([formData]);
        if (error) throw error;
      } else if (view === "edit" && currentitem?.id) {
        const { error } = await supabase
          .from('announcements')
          .update(formData)
          .eq('id', currentitem.id);
        if (error) throw error;
      }
      
      setView("list");
      fetchAnnouncements();
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError("Ошибка при сохранении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту запись?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchAnnouncements();
    } catch (err: any) {
      console.error("Error deleting data:", err);
      setError("Ошибка при удалении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item: Announcement) => {
    setCurrentItem(item);
    setFormData(item);
    setView("edit");
    setFormErrors({});
  };

  const openCreate = () => {
    setCurrentItem(null);
    setFormData({
      tag: "",
      title: "",
      description: "",
      date: "Сегодня", // Default
      urgent: false
    });
    setView("create");
    setFormErrors({});
  };

  // Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl">
          <h1 className="text-2xl font-bold text-[var(--card-foreground)] mb-6 text-center">Вход в панель</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#C5A66F] transition-colors"
                autoFocus
              />
              {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#C5A66F] text-white font-bold rounded-xl hover:bg-[#b8955a] transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <button
          onClick={handleLogout}
          className="p-2 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
          title="Выйти"
        >
          <LogOut size={24} />
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {view === "list" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--card-foreground)]">Объявления</h2>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-[#C5A66F] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#b8955a] transition-colors"
              >
                <Plus size={20} />
                Добавить
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-[#C5A66F]" />
              </div>
            ) : (
              <div className="grid gap-4">
                {announcements.length === 0 ? (
                  <p className="text-[var(--muted-foreground)] text-center py-8">Нет записей</p>
                ) : (
                  announcements.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.urgent && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Hot
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#C5A66F] uppercase border border-[#C5A66F]/30 px-2 py-0.5 rounded-md">
                            {item.tag}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">{item.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-1">{item.title}</h3>
                        <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 bg-[var(--secondary)] text-[var(--card-foreground)] rounded-lg hover:bg-[#C5A66F] hover:text-white transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
                          className="p-2 bg-[var(--secondary)] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {(view === "create" || view === "edit") && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[var(--muted-foreground)]">
              <button onClick={() => setView("list")} className="hover:text-[var(--foreground)] transition-colors">
                Назад
              </button>
              <span>/</span>
              <span className="text-[var(--foreground)]">{view === "create" ? "Новая запись" : "Редактирование"}</span>
            </div>

            <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--card-foreground)]">Заголовок</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-3 bg-[var(--background)] border rounded-xl focus:outline-none transition-colors ${
                      formErrors.title ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"
                    }`}
                  />
                  {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--card-foreground)]">Тег</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className={`w-full p-3 bg-[var(--background)] border rounded-xl focus:outline-none transition-colors ${
                      formErrors.tag ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"
                    }`}
                  />
                  {formErrors.tag && <p className="text-xs text-red-500">{formErrors.tag}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--card-foreground)]">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`w-full p-3 bg-[var(--background)] border rounded-xl focus:outline-none transition-colors resize-none ${
                    formErrors.description ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"
                  }`}
                />
                {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--card-foreground)]">Дата (строкой)</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full p-3 bg-[var(--background)] border rounded-xl focus:outline-none transition-colors ${
                      formErrors.date ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"
                    }`}
                  />
                  {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, urgent: !formData.urgent })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      formData.urgent ? "bg-red-500" : "bg-[var(--secondary)]"
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.urgent ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                  <span className="text-sm font-bold text-[var(--card-foreground)]">Пометить как "Hot"</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#C5A66F] text-white font-bold rounded-xl hover:bg-[#b8955a] transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-6 py-3 bg-[var(--secondary)] text-[var(--card-foreground)] font-bold rounded-xl hover:bg-[var(--border)] transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
