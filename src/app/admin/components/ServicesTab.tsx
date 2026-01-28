"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff } from "lucide-react";
import { Service } from "@/lib/data";
import IconSelector from "./IconSelector";
import { ICON_MAP } from "@/lib/icons";

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      if (data) setServices(data);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError("Ошибка загрузки данных");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSave = {
        ...formData,
        id: undefined,
        description: Array.isArray(formData.description) ? formData.description : [formData.description]
      };

      if (view === "create") {
        await supabase.from('services').insert([dataToSave]);
        await supabase.from('audit_logs').insert([{ action: 'create', entity: 'service', details: `Created: ${formData.title}` }]);
      } else if (view === "edit" && currentItem) {
        await supabase.from('services').update(dataToSave).eq('id', currentItem.id);
        await supabase.from('audit_logs').insert([{ action: 'update', entity: 'service', details: `Updated: ${formData.title}` }]);
      }
      
      setView("list");
      fetchServices();
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
        <h2 className="text-xl font-bold">Услуги</h2>
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
              <label className="block text-sm font-medium mb-1">Описание (каждый пункт с новой строки)</label>
              <textarea
                required
                rows={5}
                value={Array.isArray(formData.description) ? formData.description.join("\n") : formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value.split("\n")})}
                className="w-full p-2 border rounded-lg bg-white text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Тип кнопки</label>
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
                <label className="block text-sm font-medium mb-1">Текст кнопки</label>
                <input
                  value={formData.action_text}
                  onChange={(e) => setFormData({...formData, action_text: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                />
              </div>
            </div>

            {formData.action_type === "link" && (
              <div>
                <label className="block text-sm font-medium mb-1">URL Ссылки</label>
                <input
                  value={formData.action_url || ""}
                  onChange={(e) => setFormData({...formData, action_url: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-white text-black"
                />
              </div>
            )}

            {formData.action_type === "modal" && (
              <div>
                <label className="block text-sm font-medium mb-1">ID Модального окна (для разработчиков)</label>
                <input
                  value={formData.modal_id || ""}
                  onChange={(e) => setFormData({...formData, modal_id: e.target.value})}
                  className="w-full p-2 border rounded-lg"
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
                className="w-full p-2 border rounded-lg"
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
