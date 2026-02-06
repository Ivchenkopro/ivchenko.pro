"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff } from "lucide-react";
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
    action_type: "link",
    action_text: "Подробнее",
    order: 0
  });

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

  const handleEdit = (item: Service) => {
    setCurrentItem(item);
    setFormData(item);
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
      const dataToSave = {
        ...formData,
        id: undefined,
        description: Array.isArray(formData.description) ? formData.description : [formData.description]
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
        updatedList.push({ ...formData, id: newId, description: Array.isArray(formData.description) ? formData.description : [formData.description] });
      } else if (view === "edit" && currentItem) {
        updatedList = updatedList.map(item => 
          item.id === currentItem.id ? { ...formData, description: Array.isArray(formData.description) ? formData.description : [formData.description] } : item
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

  const IconComponent = ICON_MAP[formData.icon] || ICON_MAP["landmark"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Услуги (на Главной)</h2>
        <button
          onClick={() => {
            setFormData({
              id: 0,
              title: "",
              description: [""],
              icon: "landmark",
              action_type: "link",
              action_text: "Подробнее",
              order: services.length + 1
            });
            setView("create");
          }}
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
      
      {isDemoMode && (
        <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl flex items-center gap-2">
          <WifiOff size={20} />
          <span>Локальный режим: изменения сохраняются только в браузере</span>
        </div>
      )}

      {!isDemoMode && usingLocalData && services.length > 0 && (
        <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span>Вы используете локальные данные. Выгрузите их в облако, чтобы они появились на телефоне.</span>
          </div>
          <button 
            onClick={handleSyncToCloud}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
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
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description?.[0]}...</p>
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
              <label className="block text-sm font-medium mb-1">Краткое описание (для карточки)</label>
              <textarea
                required
                rows={2}
                value={Array.isArray(formData.description) ? formData.description[0] || "" : formData.description}
                onChange={(e) => {
                  const newDesc = [...(Array.isArray(formData.description) ? formData.description : [formData.description])];
                  newDesc[0] = e.target.value;
                  setFormData({...formData, description: newDesc});
                }}
                className="w-full p-2 border rounded-lg bg-white text-black"
                placeholder="Краткое описание, которое видно сразу..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Подробное описание (раскрывается при клике)</label>
              <textarea
                rows={5}
                value={Array.isArray(formData.description) && formData.description.length > 1 ? formData.description.slice(1).join("\n") : ""}
                onChange={(e) => {
                  const shortDesc = Array.isArray(formData.description) ? formData.description[0] || "" : formData.description;
                  const detailed = e.target.value.split("\n");
                  setFormData({...formData, description: [shortDesc, ...detailed]});
                }}
                className="w-full p-2 border rounded-lg bg-white text-black"
                placeholder="Детальное описание, которое появляется внутри div..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Тип действия</label>
                <select
                  value={formData.action_type}
                  onChange={(e) => setFormData({...formData, action_type: e.target.value as any})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                >
                  <option value="link">Ссылка</option>
                  <option value="modal">Модальное окно</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Текст кнопки (например, "Подробнее")</label>
                <input
                  value={formData.action_text || "Подробнее"}
                  onChange={(e) => setFormData({...formData, action_text: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                />
              </div>
            </div>

            {formData.action_type === "link" && (
              <div>
                <label className="block text-sm font-medium mb-1">Ссылка (URL)</label>
                <input
                  value={formData.action_url || ""}
                  onChange={(e) => setFormData({...formData, action_url: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                  placeholder="https://..."
                />
              </div>
            )}

            {formData.action_type === "modal" && (
              <div>
                <label className="block text-sm font-medium mb-1">ID Модального окна (для разработчиков)</label>
                <input
                  value={formData.modal_id || ""}
                  onChange={(e) => setFormData({...formData, modal_id: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                  placeholder="bank_guarantees"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Порядок сортировки</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg bg-white text-black"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Сохранить"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
