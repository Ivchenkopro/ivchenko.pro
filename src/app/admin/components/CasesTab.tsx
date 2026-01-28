"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Loader2, WifiOff } from "lucide-react";
import { Case, FALLBACK_CASES } from "@/lib/data";
import IconSelector from "./IconSelector";
import { ICON_MAP } from "@/lib/icons";

export default function CasesTab() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentItem, setCurrentItem] = useState<Case | null>(null);
  const [formData, setFormData] = useState<Case>({
    id: 0,
    title: "",
    description: "",
    details: "",
    link: "",
    icon: "building",
    order: 0
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('order', { ascending: true });
        
      if (error) throw error;
      if (data) setCases(data);
    } catch (err: any) {
      console.error("Error fetching cases:", err);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Case) => {
    setCurrentItem(item);
    setFormData(item);
    setView("edit");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены?")) return;
    try {
      await supabase.from('cases').delete().eq('id', id);
      await supabase.from('audit_logs').insert([{ action: 'delete', entity: 'case', details: `Deleted case ID ${id}` }]);
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSave = { ...formData, id: undefined };

      if (view === "create") {
        await supabase.from('cases').insert([dataToSave]);
        await supabase.from('audit_logs').insert([{ action: 'create', entity: 'case', details: `Created: ${formData.title}` }]);
      } else if (view === "edit" && currentItem) {
        await supabase.from('cases').update(dataToSave).eq('id', currentItem.id);
        await supabase.from('audit_logs').insert([{ action: 'update', entity: 'case', details: `Updated: ${formData.title}` }]);
      }
      
      setView("list");
      fetchCases();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Кейсы и сделки</h2>
        <button
          onClick={() => {
            setFormData({
              id: 0,
              title: "",
              description: "",
              details: "",
              link: "",
              icon: "building",
              order: cases.length + 1
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
          {cases.map((item) => {
            const ItemIcon = ICON_MAP[item.icon] || ICON_MAP["building"];
            return (
              <div key={item.id} className="p-4 bg-white border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ItemIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</p>
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
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Детали (опционально)</label>
              <textarea
                rows={2}
                value={formData.details || ""}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="Дополнительная информация (например, суммы)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ссылка</label>
              <input
                value={formData.link || ""}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
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
