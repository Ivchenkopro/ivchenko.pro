"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff, Tag, Link as LinkIcon } from "lucide-react";
import { Announcement, FALLBACK_ANNOUNCEMENTS } from "@/lib/data";

export default function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentitem, setCurrentItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<Announcement>({
    id: 0,
    tag: "",
    title: "",
    description: "",
    date: "",
    urgent: false
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Announcement, string>>>({});

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setAnnouncements(data);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      const localData = localStorage.getItem('announcements');
      if (localData) {
        setAnnouncements(JSON.parse(localData));
      } else {
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
      }
      setIsDemoMode(true);
      setError("Нет связи с Supabase. Включен локальный режим.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof Announcement, string>> = {};
    if (!formData.title.trim()) errors.title = "Заголовок обязателен";
    if (!formData.description.trim()) errors.description = "Описание обязательно";
    if (!formData.tag.trim()) errors.tag = "Тег обязателен";
    if (!formData.date.trim()) errors.date = "Дата обязательна";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveToLocal = (newAnnouncements: Announcement[]) => {
    localStorage.setItem('announcements', JSON.stringify(newAnnouncements));
    setAnnouncements(newAnnouncements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (!isDemoMode) {
        try {
          if (view === "create") {
            const { error } = await supabase
              .from('announcements')
              .insert([{ ...formData, id: undefined }]);
            if (error) throw error;
            // Log action
            await supabase.from('audit_logs').insert([{ action: 'create', entity: 'announcement', details: `Created: ${formData.title}` }]);
          } else if (view === "edit" && currentitem?.id) {
            const { error } = await supabase
              .from('announcements')
              .update(formData)
              .eq('id', currentitem.id);
            if (error) throw error;
            // Log action
            await supabase.from('audit_logs').insert([{ action: 'update', entity: 'announcement', details: `Updated ID ${currentitem.id}: ${formData.title}` }]);
          }
          await fetchAnnouncements();
          setView("list");
          return;
        } catch (supaErr) {
          console.error("Supabase failed, falling back to local:", supaErr);
          setIsDemoMode(true);
          setError("Ошибка Supabase. Переход в локальный режим.");
        }
      }

      // Local Mode
      let updatedList = [...announcements];
      if (view === "create") {
        const newId = Math.max(0, ...updatedList.map(a => a.id || 0)) + 1;
        updatedList.unshift({ ...formData, id: newId });
      } else if (view === "edit" && currentitem?.id) {
        updatedList = updatedList.map(item => 
          item.id === currentitem.id ? formData : item
        );
      }
      
      saveToLocal(updatedList);
      setView("list");
      
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
      if (!isDemoMode) {
        try {
          const { error } = await supabase.from('announcements').delete().eq('id', id);
          if (error) throw error;
          await supabase.from('audit_logs').insert([{ action: 'delete', entity: 'announcement', details: `Deleted ID ${id}` }]);
          await fetchAnnouncements();
          return;
        } catch (supaErr) {
          console.error("Supabase failed, falling back to local:", supaErr);
          setIsDemoMode(true);
          setError("Ошибка Supabase. Переход в локальный режим.");
        }
      }
      const updatedList = announcements.filter(item => item.id !== id);
      saveToLocal(updatedList);
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
    setFormData({ id: 0, tag: "", title: "", description: "", date: "Сегодня", urgent: false });
    setView("create");
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      
      {isDemoMode && (
        <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl flex items-center gap-2">
          <WifiOff size={20} />
          <span>Локальный режим: изменения сохраняются только в браузере</span>
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[var(--card-foreground)]">Управление объявлениями</h2>
            <button onClick={openCreate} className="flex items-center gap-2 bg-[#C5A66F] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#b8955a] transition-colors">
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
                  <div key={item.id} className="bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {item.urgent && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Hot</span>}
                        <span className="px-2.5 py-1 rounded-md bg-[var(--secondary)] text-[var(--card-foreground)] text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 border border-[var(--border)]">
                          <Tag size={10} />
                          {item.tag}
                        </span>
                        {item.link && (
                          <span className="px-2.5 py-1 rounded-md bg-[var(--secondary)] text-[#C5A66F] text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 border border-[#C5A66F]/30">
                            <LinkIcon size={10} />
                            Есть ссылка
                          </span>
                        )}
                        <span className="text-xs text-[var(--muted-foreground)]">{item.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">{item.title}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button onClick={() => openEdit(item)} className="p-2 bg-[var(--secondary)] text-[var(--card-foreground)] rounded-lg hover:bg-[#C5A66F] hover:text-white transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => item.id && handleDelete(item.id)} className="p-2 bg-[var(--secondary)] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {(view === "create" || view === "edit") && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-[var(--muted-foreground)]">
            <button onClick={() => setView("list")} className="hover:text-[var(--foreground)] transition-colors">Назад</button>
            <span>/</span>
            <span className="text-[var(--foreground)]">{view === "create" ? "Новая запись" : "Редактирование"}</span>
          </div>
          <form onSubmit={handleSubmit} className="bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Заголовок</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors ${formErrors.title ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
                {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Тег</label>
                <input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors ${formErrors.tag ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
                {formErrors.tag && <p className="text-xs text-red-500">{formErrors.tag}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--foreground)]">Описание</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors resize-none ${formErrors.description ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
              {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Дата</label>
                <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors ${formErrors.date ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
                {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Текст кнопки</label>
                <input type="text" value={formData.button_text || ""} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] transition-colors" placeholder="Подробнее" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--foreground)]">Ссылка (необязательно)</label>
              <input type="text" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] transition-colors" placeholder="https://..." />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="urgent"
                checked={formData.urgent}
                onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--border)] bg-[var(--card)] accent-[#C5A66F]"
              />
              <label htmlFor="urgent" className="text-sm font-bold text-[var(--foreground)]">
                Пометить как "HOT" (Срочное)
              </label>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#C5A66F] text-white font-bold rounded-xl hover:bg-[#b8955a] transition-colors flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Сохранить
              </button>
              <button type="button" onClick={() => setView("list")} className="px-6 py-3 bg-[var(--secondary)] text-[var(--card-foreground)] font-bold rounded-xl hover:bg-[var(--border)] transition-colors">Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
