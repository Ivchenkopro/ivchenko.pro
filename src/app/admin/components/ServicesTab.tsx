"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff, CloudUpload } from "lucide-react";
import { Service, FALLBACK_SERVICES } from "@/lib/data";
import IconSelector from "./IconSelector";
import { ICON_MAP } from "@/lib/icons";

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [usingLocalData, setUsingLocalData] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentItem, setCurrentItem] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState<Service>({
    id: 0,
    title: "",
    description: [""],
    icon: "landmark",
    role: "",
    action_type: "link",
    action_text: "Подробнее",
    action_url: "",
    secondary_action_text: "",
    secondary_action_type: "link",
    secondary_action_url: "",
    order: 0,
    tag: ""
  });

  // Helper for textarea
  const [descText, setDescText] = useState("");
  
  // Helpers for details
  const [detailsContent, setDetailsContent] = useState("");
  const [detailsListItems, setDetailsListItems] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });
        
      if (error) throw error;
      if (data && data.length > 0) {
        setServices(data);
        setIsDemoMode(false);
        setUsingLocalData(false);
      } else {
        // Fallback if empty
        const localData = localStorage.getItem('services');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.length > 0) {
            setServices(parsed);
            setUsingLocalData(true);
          } else {
            setServices(FALLBACK_SERVICES);
            setUsingLocalData(true);
          }
        } else {
          setServices(FALLBACK_SERVICES);
          setUsingLocalData(true);
        }
      }
    } catch (err: any) {
      console.error("Error fetching services:", err);
      const localData = localStorage.getItem('services');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.length > 0) {
          setServices(parsed);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } else {
        setServices(FALLBACK_SERVICES);
      }
      setIsDemoMode(true);
      setUsingLocalData(true);
      setError("Нет связи с Supabase. Включен локальный режим.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!confirm("Это действие попытается загрузить все локальные данные в базу данных. Существующие записи могут быть обновлены. Продолжить?")) return;
    
    setLoading(true);
    try {
      // 1. Check connection
      const { error: healthCheck } = await supabase.from('services').select('count').single();
      if (healthCheck) throw new Error("Нет соединения с базой данных");

      // 2. Upsert all local services
      const { error: upsertError } = await supabase
        .from('services')
        .upsert(services, { onConflict: 'id' });
      
      if (upsertError) throw upsertError;

      // 3. Refresh from DB
      await fetchServices();
      setIsDemoMode(false);
      setUsingLocalData(false);
      alert("Синхронизация успешно выполнена!");
      
    } catch (err: any) {
      console.error("Sync error:", err);
      setError("Ошибка синхронизации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Service) => {
    setCurrentItem(item);
    setFormData({
      ...item,
      details: item.details || {
        title: "",
        content: [],
        list: { title: "", items: [] },
        footer: ""
      }
    });
    setDescText(Array.isArray(item.description) ? item.description.join('\n') : item.description);
    
    // Set details state
    if (item.details) {
      setDetailsContent(item.details.content ? item.details.content.join('\n\n') : "");
      setDetailsListItems(item.details.list?.items ? item.details.list.items.join('\n') : "");
    } else {
      setDetailsContent("");
      setDetailsListItems("");
    }
    
    setView("edit");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены?")) return;
    try {
      await supabase.from('services').delete().eq('id', id);
      await supabase.from('audit_logs').insert([{ action: 'delete', entity: 'service', details: `Deleted service ID ${id}` }]);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const saveToLocal = (newServices: Service[]) => {
    localStorage.setItem('services', JSON.stringify(newServices));
    setServices(newServices);
  };

  const handleSyncToCloud = async () => {
    if (!confirm("Вы хотите выгрузить локальные данные в облако? Это сделает их доступными на всех устройствах.")) return;
    setLoading(true);
    try {
      // 1. Prepare data (remove IDs to let DB generate them)
      const dataToSync = services.map(({ id, ...rest }) => rest);
      
      // 2. Insert into Supabase
      const { error } = await supabase.from('services').insert(dataToSync);
      if (error) throw error;
      
      // 3. Clear local storage to force next load from DB
      localStorage.removeItem('services');
      
      alert("Данные успешно выгружены в облако!");
      fetchServices();
    } catch (err: any) {
      console.error(err);
      setError("Ошибка синхронизации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const descriptionArray = descText.split('\n').filter(line => line.trim() !== "");
      
      // Prepare details
      const finalDetails = {
        title: formData.details?.title || "",
        content: detailsContent.split('\n\n').filter(p => p.trim() !== ""),
        list: {
          title: formData.details?.list?.title || "",
          items: detailsListItems.split('\n').filter(i => i.trim() !== "")
        },
        footer: formData.details?.footer || ""
      };

      const dataToSave = {
        ...formData,
        id: undefined,
        description: descriptionArray,
        details: finalDetails
      };

      if (!isDemoMode) {
        try {
          if (view === "create") {
            const { error } = await supabase.from('services').insert([dataToSave]);
            if (error) throw error;
            await supabase.from('audit_logs').insert([{ action: 'create', entity: 'service', details: `Created: ${formData.title}` }]);
          } else if (view === "edit" && currentItem) {
            const { error, data } = await supabase.from('services').update(dataToSave).eq('id', currentItem.id).select();
            if (error) throw error;
            // If no rows updated (e.g. ID from fallback doesn't exist), try insert
            if (!data || data.length === 0) {
               const { error: insertError } = await supabase.from('services').insert([dataToSave]);
               if (insertError) throw insertError;
            }
            await supabase.from('audit_logs').insert([{ action: 'update', entity: 'service', details: `Updated: ${formData.title}` }]);
          }
          await fetchServices();
          setView("list");
          return;
        } catch (supaErr) {
          console.error("Supabase failed, falling back to local:", supaErr);
          setIsDemoMode(true);
          setError("Ошибка Supabase. Переход в локальный режим.");
        }
      }

      // Local Mode
      let updatedList = [...services];
      if (view === "create") {
        const newId = Math.max(0, ...updatedList.map(s => s.id)) + 1;
        updatedList.push({ ...dataToSave, id: newId });
      } else if (view === "edit" && currentItem) {
        updatedList = updatedList.map(item => 
          item.id === currentItem.id ? { ...dataToSave, id: currentItem.id } : item
        );
      }
      
      saveToLocal(updatedList);
      setView("list");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormData({
      id: 0,
      title: "",
      description: [""],
      icon: "landmark",
      role: "",
      action_type: "link",
      action_text: "Подробнее",
      action_url: "",
      secondary_action_text: "",
      secondary_action_type: "link",
      secondary_action_url: "",
      order: services.length + 1,
      tag: "",
      details: {
        title: "",
        content: [],
        list: { title: "", items: [] },
        footer: ""
      }
    });
    setDescText("");
    setDetailsContent("");
    setDetailsListItems("");
    setView("create");
  };

  const IconComponent = ICON_MAP[formData.icon] || ICON_MAP["landmark"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Мои проекты (Услуги)</h2>
        <button
          onClick={openCreate}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      
      {(isDemoMode || usingLocalData) && (
        <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <WifiOff size={20} />
            <span>Локальный режим: используются данные из браузера</span>
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

      {view === "list" ? (
        <div className="grid gap-4">
          {services.map((item) => {
            const ItemIcon = ICON_MAP[item.icon] || ICON_MAP["landmark"];
            return (
              <div key={item.id} className="p-4 bg-white border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ItemIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {item.title}
                      {item.role && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">{item.role}</span>}
                    </h3>
                    <p className="text-xs text-gray-500">{Array.isArray(item.description) ? item.description[0] : item.description}...</p>
                    {item.tag && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{item.tag}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Иконка</label>
                <IconSelector value={formData.icon} onChange={(val) => setFormData({...formData, icon: val})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Заголовок</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Роль</label>
                <input
                  value={formData.role || ""}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                  placeholder="Например: CEO и Co-Founder"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Тег (например: HOT)</label>
                <input
                  value={formData.tag || ""}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                  placeholder="Оставьте пустым, если не нужно"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание (пункты)</label>
                <p className="text-xs text-gray-500 mb-1">Каждая строка — отдельный пункт списка</p>
                <textarea
                  required
                  rows={5}
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                  placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold mb-3 text-[var(--foreground)]">Содержание модального окна (Детали)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Заголовок внутри окна</label>
                    <input
                      value={formData.details?.title || ""}
                      onChange={(e) => setFormData({
                        ...formData, 
                        details: { ...formData.details!, title: e.target.value }
                      })}
                      className="w-full p-2 border rounded-lg bg-white text-black"
                      placeholder="Заголовок деталей"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Основной текст</label>
                    <p className="text-xs text-gray-500 mb-1">Двойной перенос строки (Enter x2) создает новый абзац</p>
                    <textarea 
                      value={detailsContent} 
                      onChange={(e) => setDetailsContent(e.target.value)} 
                      rows={6} 
                      className="w-full p-2 border rounded-lg bg-white text-black" 
                      placeholder="Текст описания..." 
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-3">
                    <label className="block text-sm font-bold">Список (опционально)</label>
                    <div>
                      <input 
                        value={formData.details?.list?.title || ""} 
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          details: { 
                            ...formData.details!, 
                            list: { ...formData.details?.list!, title: e.target.value } 
                          } 
                        })} 
                        className="w-full p-2 border rounded-lg bg-white text-black mb-2" 
                        placeholder="Заголовок списка" 
                      />
                      <textarea 
                        value={detailsListItems} 
                        onChange={(e) => setDetailsListItems(e.target.value)} 
                        rows={4} 
                        className="w-full p-2 border rounded-lg bg-white text-black" 
                        placeholder="Элемент списка 1&#10;Элемент списка 2" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Подвал (Footer)</label>
                    <textarea 
                      value={formData.details?.footer || ""} 
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        details: { ...formData.details!, footer: e.target.value } 
                      })} 
                      rows={2} 
                      className="w-full p-2 border rounded-lg bg-white text-black resize-none" 
                      placeholder="Мелкий текст внизу..." 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold border-b pb-2">Действия</h3>
              
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <label className="block text-sm font-bold">Основная кнопка</label>
                <div>
                  <label className="block text-xs mb-1">Текст</label>
                  <input
                    value={formData.action_text}
                    onChange={(e) => setFormData({...formData, action_text: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Ссылка (если не модальное окно)</label>
                  <input
                    value={formData.action_url || ""}
                    onChange={(e) => setFormData({...formData, action_url: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <label className="block text-sm font-bold">Вторая кнопка (опционально)</label>
                <div>
                  <label className="block text-xs mb-1">Текст</label>
                  <input
                    value={formData.secondary_action_text || ""}
                    onChange={(e) => setFormData({...formData, secondary_action_text: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                    placeholder="Например: Презентация"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Ссылка</label>
                  <input
                    value={formData.secondary_action_url || ""}
                    onChange={(e) => setFormData({...formData, secondary_action_url: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white text-black"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#C5A66F] text-white rounded-lg font-bold hover:bg-[#b8955a] flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
