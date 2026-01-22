"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, GripVertical, ExternalLink } from "lucide-react";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  is_external: boolean;
  order: number;
  is_active: boolean;
}

export default function LinksTab() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // UI State
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentItem, setCurrentItem] = useState<LinkItem | null>(null);
  const [formData, setFormData] = useState<LinkItem>({
    id: 0,
    title: "",
    url: "",
    icon: "",
    is_external: true,
    order: 0,
    is_active: true
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LinkItem, string>>>({});

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('order', { ascending: true });
        
      if (error) throw error;
      if (data) {
        setLinks(data);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error("Error fetching links:", err);
      setIsDemoMode(true);
      setError("Нет связи с Supabase. Режим только для чтения.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof LinkItem, string>> = {};
    if (!formData.title.trim()) errors.title = "Название обязательно";
    if (!formData.url.trim()) errors.url = "URL обязателен";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (!isDemoMode) {
        const payload = {
            title: formData.title,
            url: formData.url,
            icon: formData.icon || null,
            is_external: formData.is_external,
            order: formData.order,
            is_active: formData.is_active
        };

        if (view === "create") {
          const { error } = await supabase
            .from('links')
            .insert([payload]);
          if (error) throw error;
          
          await supabase.from('audit_logs').insert([{ 
            action: 'create', 
            entity: 'link', 
            details: `Created link: ${formData.title}` 
          }]);
        } else if (view === "edit" && currentItem?.id) {
          const { error } = await supabase
            .from('links')
            .update(payload)
            .eq('id', currentItem.id);
          if (error) throw error;
          
          await supabase.from('audit_logs').insert([{ 
            action: 'update', 
            entity: 'link', 
            details: `Updated link ID ${currentItem.id}: ${formData.title}` 
          }]);
        }
        await fetchLinks();
        setView("list");
      } else {
        alert("В демо режиме нельзя сохранять ссылки");
      }
    } catch (err: any) {
      console.error("Error saving link:", err);
      setError("Ошибка при сохранении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту ссылку?")) return;
    
    if (isDemoMode) {
      alert("В демо режиме нельзя удалять ссылки");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.from('audit_logs').insert([{ 
        action: 'delete', 
        entity: 'link', 
        details: `Deleted link ID: ${id}` 
      }]);
      
      await fetchLinks();
    } catch (err: any) {
      console.error("Error deleting link:", err);
      setError("Ошибка при удалении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (link: LinkItem) => {
    setFormData(link);
    setCurrentItem(link);
    setView("edit");
    setFormErrors({});
  };

  const startCreate = () => {
    // Find max order
    const maxOrder = links.reduce((max, link) => Math.max(max, link.order), 0);
    setFormData({ 
        id: 0, 
        title: "", 
        url: "", 
        icon: "", 
        is_external: true, 
        order: maxOrder + 10, 
        is_active: true 
    });
    setCurrentItem(null);
    setView("create");
    setFormErrors({});
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {view === "create" ? "Новая ссылка" : "Редактирование ссылки"}
          </h2>
          <button
            onClick={() => setView("list")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Отмена
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full p-2 rounded-lg border bg-[var(--card)] ${
                formErrors.title ? "border-red-500" : "border-[var(--border)]"
              }`}
              placeholder="Наш Telegram"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className={`w-full p-2 rounded-lg border bg-[var(--card)] ${
                formErrors.url ? "border-red-500" : "border-[var(--border)]"
              }`}
              placeholder="https://t.me/..."
            />
            {formErrors.url && <p className="text-red-500 text-xs mt-1">{formErrors.url}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Порядок сортировки</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Иконка (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
                  placeholder="📱"
                />
             </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_external}
                onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Внешняя ссылка (открывать в новом окне)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Активна (отображать на сайте)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Сохранить
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Управление ссылками</h2>
        <button
          onClick={startCreate}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading && links.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Ссылок пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className={`bg-[var(--card)] p-4 rounded-xl border flex items-center gap-4 ${
                !link.is_active ? 'opacity-60 border-dashed' : 'border-[var(--border)]'
              }`}
            >
              <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                {link.icon || "🔗"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{link.title}</span>
                  {!link.is_active && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Скрыто</span>
                  )}
                  {link.is_external && (
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <div className="text-sm text-gray-400 truncate max-w-[200px] sm:max-w-md">
                  {link.url}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(link)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 hover:bg-red-50 rounded-full text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
