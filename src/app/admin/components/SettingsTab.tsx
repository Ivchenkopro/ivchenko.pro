"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, AlertCircle, Loader2, WifiOff, Sparkles, Upload } from "lucide-react";
import { DEFAULT_SETTINGS, SETTING_DESCRIPTIONS } from "@/lib/settings";

interface AppSetting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // UI State
  const [view, setView] = useState<"list" | "edit" | "create">("list");
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<AppSetting>({
    key: "",
    value: "",
    description: ""
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppSetting, string>>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('key');
        
      if (error) throw error;
      if (data) {
        setSettings(data);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error("Error fetching settings:", err);
      setIsDemoMode(true);
      setError("Нет связи с Supabase. Работа в локальном режиме.");
      
      // Fallback logic
      const saved = localStorage.getItem('app_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      } else {
        const fallbackSettings: AppSetting[] = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
            key,
            value,
            description: SETTING_DESCRIPTIONS[key] || ""
        }));
        setSettings(fallbackSettings);
        localStorage.setItem('app_settings', JSON.stringify(fallbackSettings));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = (newSettings: AppSetting[]) => {
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleBackup = async () => {
    try {
      const { data: settingsData } = await supabase.from('app_settings').select('*');
      const { data: linksData } = await supabase.from('links').select('*');
      const { data: announcementsData } = await supabase.from('announcements').select('*');
      
      const backup = {
        timestamp: new Date().toISOString(),
        settings: settingsData,
        links: linksData,
        announcements: announcementsData
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Backup failed", err);
      alert("Ошибка создания резервной копии");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);
        
      if (data) {
        setFormData({ ...formData, value: data.publicUrl });
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof AppSetting, string>> = {};
    if (!formData.key.trim()) errors.key = "Ключ обязателен";
    if (!formData.value.trim()) errors.value = "Значение обязательно";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
                .from('app_settings')
                .insert([formData]);
            if (error) throw error;
            
            await supabase.from('audit_logs').insert([{ 
                action: 'create', 
                entity: 'settings', 
                details: `Created setting: ${formData.key}` 
            }]);
            } else if (view === "edit" && currentKey) {
            const { error } = await supabase
                .from('app_settings')
                .update(formData)
                .eq('key', currentKey);
            if (error) throw error;
            
            await supabase.from('audit_logs').insert([{ 
                action: 'update', 
                entity: 'settings', 
                details: `Updated setting: ${formData.key}` 
            }]);
            }
            await fetchSettings();
            setView("list");
            return;
        } catch (supaErr) {
             console.error("Supabase failed, falling back to local:", supaErr);
             setIsDemoMode(true);
             setError("Ошибка Supabase. Переход в локальный режим.");
        }
      }
      
      // Local mode logic
      let updatedList = [...settings];
      if (view === "create") {
          // Check for duplicate key
          if (updatedList.some(s => s.key === formData.key)) {
              throw new Error("Настройка с таким ключом уже существует");
          }
          updatedList.push(formData);
      } else if (view === "edit" && currentKey) {
          updatedList = updatedList.map(item => 
              item.key === currentKey ? formData : item
          );
      }
      saveToLocal(updatedList);
      setView("list");

    } catch (err: any) {
      console.error("Error saving setting:", err);
      setError("Ошибка при сохранении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту настройку?")) return;
    
    setLoading(true);
    try {
      if (!isDemoMode) {
          try {
            const { error } = await supabase
                .from('app_settings')
                .delete()
                .eq('key', key);
            
            if (error) throw error;

            await supabase.from('audit_logs').insert([{ 
                action: 'delete', 
                entity: 'settings', 
                details: `Deleted setting: ${key}` 
            }]);
            
            await fetchSettings();
            return;
          } catch (supaErr) {
            console.error("Supabase failed, falling back to local:", supaErr);
            setIsDemoMode(true);
            setError("Ошибка Supabase. Переход в локальный режим.");
          }
      }

      // Local mode logic
      const updatedList = settings.filter(s => s.key !== key);
      saveToLocal(updatedList);

    } catch (err: any) {
      console.error("Error deleting setting:", err);
      setError("Ошибка при удалении: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (setting: AppSetting) => {
    setFormData(setting);
    setCurrentKey(setting.key);
    setView("edit");
    setFormErrors({});
  };

  const startCreate = (prefillKey?: string) => {
    if (prefillKey && DEFAULT_SETTINGS[prefillKey]) {
      setFormData({
        key: prefillKey,
        value: DEFAULT_SETTINGS[prefillKey],
        description: SETTING_DESCRIPTIONS[prefillKey] || ""
      });
    } else {
      setFormData({ key: "", value: "", description: "" });
    }
    setCurrentKey(null);
    setView("create");
    setFormErrors({});
  };

  // Find missing default keys
  const missingKeys = Object.keys(DEFAULT_SETTINGS).filter(
    key => !settings.some(s => s.key === key)
  );

  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {view === "create" ? "Новая настройка" : "Редактирование настройки"}
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
            <label className="block text-sm font-medium mb-1">Ключ (Key)</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              disabled={view === "edit"} // Prevent changing key on edit
              className={`w-full p-2 rounded-lg border bg-white text-black ${
                formErrors.key ? "border-red-500" : "border-[var(--border)]"
              }`}
              placeholder="site_title"
            />
            {formErrors.key && <p className="text-red-500 text-xs mt-1">{formErrors.key}</p>}
            <p className="text-xs text-gray-500 mt-1">Уникальный идентификатор настройки (на английском)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Значение</label>
            <textarea
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className={`w-full p-2 rounded-lg border bg-white text-black ${
                formErrors.value ? "border-red-500" : "border-[var(--border)]"
              }`}
              rows={4}
            />
            {formErrors.value && <p className="text-red-500 text-xs mt-1">{formErrors.value}</p>}
            
            {/* Upload Button for image fields */}
            {(formData.key.includes('image') || formData.key.includes('photo') || formData.key === 'home_main_image') && (
              <div className="mt-2">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label 
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Загрузка..." : "Загрузить изображение"}
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              placeholder="Заголовок сайта"
            />
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
        <h2 className="text-xl font-bold">Настройки сайта</h2>
        <div className="flex gap-2">
            {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                Локальный режим
            </span>
            )}
            <button
            onClick={() => startCreate()}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
            >
            <Plus className="w-4 h-4" />
            Добавить
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Recommended Settings Section */}
      {missingKeys.length > 0 && !loading && (
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3 text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">Рекомендуемые настройки</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeys.map(key => (
              <button
                key={key}
                onClick={() => startCreate(key)}
                className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                title={SETTING_DESCRIPTIONS[key]}
              >
                <span className="font-semibold">+ {key}</span>
                {SETTING_DESCRIPTIONS[key] && (
                  <span className="text-blue-400 border-l border-blue-100 pl-2">
                    {SETTING_DESCRIPTIONS[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && settings.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
        </div>
      ) : settings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Настроек пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.key}
              className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {setting.key}
                  </span>
                  <span className="text-xs text-gray-400">{setting.description}</span>
                </div>
                <div className="text-sm font-medium break-all whitespace-pre-wrap">{setting.value}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(setting)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(setting.key)}
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
