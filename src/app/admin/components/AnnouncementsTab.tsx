"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff, Tag, Link as LinkIcon, RotateCcw, CloudUpload } from "lucide-react";
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
    urgent: false,
    link_text: "",
    details: {
      title: "",
      content: [],
      list: {
        title: "",
        items: []
      },
      footer: ""
    }
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Announcement, string>>>({});

  // Helper state for textareas
  const [detailsContent, setDetailsContent] = useState("");
  const [detailsListItems, setDetailsListItems] = useState("");

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
        
      if (!error && data && data.length > 0) {
        setAnnouncements(data);
        setIsDemoMode(false);
      } else {
        // If Supabase is empty or has error, try local
        throw new Error("Supabase empty or unavailable");
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      loadFromLocal();
      setIsDemoMode(true);
      if (err.message !== "Supabase empty or unavailable") {
         setError("Нет связи с Supabase. Включен локальный режим.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocal = () => {
    const localData = localStorage.getItem('announcements');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
        } else {
            setAnnouncements(FALLBACK_ANNOUNCEMENTS);
        }
      } catch (e) {
        console.error("Error parsing local data", e);
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
      }
    } else {
      setAnnouncements(FALLBACK_ANNOUNCEMENTS);
    }
  };

  const handleSync = async () => {
    if (!confirm("Это действие попытается загрузить все локальные объявления в базу данных. Существующие записи могут быть обновлены. Продолжить?")) return;
    
    setLoading(true);
    try {
      const { error: healthCheck } = await supabase.from('announcements').select('count').single();
      if (healthCheck) throw new Error("Нет соединения с базой данных");

      const sanitized = announcements.map(({ created_at, ...rest }) => rest);
      const { error: upsertError } = await supabase
        .from('announcements')
        .upsert(sanitized, { onConflict: 'id' });
      
      if (upsertError) throw upsertError;

      // 3. Refresh from DB to ensure consistency
      await fetchAnnouncements();
      setIsDemoMode(false);
      alert("Синхронизация успешно выполнена!");
      
    } catch (err: any) {
      console.error("Sync error:", err);
      setError("Ошибка синхронизации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Это действие сбросит все изменения и вернет стандартные объявления. Продолжить?")) {
      const defaultData = FALLBACK_ANNOUNCEMENTS;
      localStorage.setItem('announcements', JSON.stringify(defaultData));
      setAnnouncements(defaultData);
      window.location.reload();
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

    // Prepare details object
    const finalDetails = {
      ...formData.details,
      content: detailsContent.split('\n\n').filter(p => p.trim() !== ""),
      list: {
        title: formData.details?.list?.title || "",
        items: detailsListItems.split('\n').filter(i => i.trim() !== "")
      }
    };
    
    const finalFormData = { ...formData, details: finalDetails };
    
    try {
      if (!isDemoMode) {
        try {
          if (view === "create") {
            const { error } = await supabase
              .from('announcements')
              .insert([{ ...finalFormData, id: undefined }]);
            if (error) throw error;
            // Log action
            await supabase.from('audit_logs').insert([{ action: 'create', entity: 'announcement', details: `Created: ${finalFormData.title}` }]);
          } else if (view === "edit" && currentitem?.id) {
            const { error } = await supabase
              .from('announcements')
              .update(finalFormData)
              .eq('id', currentitem.id);
            if (error) throw error;
            // Log action
            await supabase.from('audit_logs').insert([{ action: 'update', entity: 'announcement', details: `Updated ID ${currentitem.id}: ${finalFormData.title}` }]);
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
        updatedList.unshift({ ...finalFormData, id: newId });
      } else if (view === "edit" && currentitem?.id) {
        updatedList = updatedList.map(item => 
          item.id === currentitem.id ? finalFormData : item
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
    
    // Ensure details structure exists
    const safeDetails = {
      title: item.details?.title || "",
      content: item.details?.content || [],
      list: {
        title: item.details?.list?.title || "",
        items: item.details?.list?.items || []
      },
      footer: item.details?.footer || ""
    };

    setFormData({
      ...item,
      details: safeDetails
    });
    
    setDetailsContent(safeDetails.content.join('\n\n'));
    setDetailsListItems(safeDetails.list.items.join('\n'));
    
    setView("edit");
    setFormErrors({});
  };

  const openCreate = () => {
    setCurrentItem(null);
    setFormData({ 
      id: 0, 
      tag: "", 
      title: "", 
      description: "", 
      date: "Сегодня", 
      urgent: false,
      details: {
        title: "",
        content: [],
        list: { title: "", items: [] },
        footer: ""
      }
    });
    setDetailsContent("");
    setDetailsListItems("");
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
        <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <WifiOff size={20} />
            <span>Локальный режим: изменения сохраняются только в браузере</span>
          </div>
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm"
          >
            <CloudUpload size={16} />
            Синхронизировать
          </button>
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[var(--card-foreground)]">Управление объявлениями</h2>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition-colors" title="Сбросить к стандартным">
                <RotateCcw size={20} />
                <span className="hidden sm:inline">Сброс</span>
              </button>
              <button onClick={openCreate} className="flex items-center gap-2 bg-[#C5A66F] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#b8955a] transition-colors">
                <Plus size={20} />
                Добавить
              </button>
            </div>
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
            
            {/* Основная информация */}
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
              <label className="text-sm font-bold text-[var(--foreground)]">Краткое описание (для карточки)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors resize-none ${formErrors.description ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
              {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Дата</label>
                <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full p-3 bg-white text-black border rounded-xl focus:outline-none transition-colors ${formErrors.date ? "border-red-500" : "border-[var(--border)] focus:border-[#C5A66F]"}`} />
                {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Текст кнопки на карточке</label>
                <input type="text" value={formData.button_text || ""} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] transition-colors" placeholder="Подробнее" />
              </div>
            </div>

            {/* Подробное содержание (Модальное окно) */}
            <div className="border-t border-[var(--border)] pt-6 space-y-4">
              <h3 className="font-bold text-lg text-[var(--foreground)]">Содержание модального окна</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Заголовок внутри окна</label>
                <input 
                  type="text" 
                  value={formData.details?.title || ""} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    details: { ...formData.details!, title: e.target.value } 
                  })} 
                  className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F]" 
                  placeholder="Заголовок подробностей" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Основной текст</label>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Разделяйте абзацы пустой строкой</p>
                <textarea 
                  value={detailsContent} 
                  onChange={(e) => setDetailsContent(e.target.value)} 
                  rows={6} 
                  className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] resize-none" 
                  placeholder="Текст описания..." 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--foreground)]">Заголовок списка</label>
                  <input 
                    type="text" 
                    value={formData.details?.list?.title || ""} 
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      details: { 
                        ...formData.details!, 
                        list: { ...formData.details!.list!, title: e.target.value } 
                      } 
                    })} 
                    className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F]" 
                    placeholder="Например: Ключевые параметры" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Элементы списка</label>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Каждый пункт с новой строки</p>
                <textarea 
                  value={detailsListItems} 
                  onChange={(e) => setDetailsListItems(e.target.value)} 
                  rows={5} 
                  className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] resize-none" 
                  placeholder="- Пункт 1&#10;- Пункт 2&#10;- Пункт 3" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Подвал (Footer)</label>
                <textarea 
                  value={formData.details?.footer || ""} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    details: { ...formData.details!, footer: e.target.value } 
                  })} 
                  rows={2} 
                  className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] resize-none" 
                  placeholder="Мелкий текст внизу..." 
                />
              </div>
            </div>

            {/* Действия и ссылки */}
            <div className="border-t border-[var(--border)] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Ссылка (внешняя)</label>
                <input type="text" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] transition-colors" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--foreground)]">Текст кнопки действия</label>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Например: Написать в Telegram</p>
                <input type="text" value={formData.link_text || ""} onChange={(e) => setFormData({ ...formData, link_text: e.target.value })} className="w-full p-3 bg-white text-black border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#C5A66F] transition-colors" placeholder="Написать в Telegram" />
              </div>
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
