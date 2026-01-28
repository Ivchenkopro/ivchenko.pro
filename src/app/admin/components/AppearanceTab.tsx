"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, RotateCcw, Palette, WifiOff } from "lucide-react";

interface ThemeSettings {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
}

const DEFAULT_THEME: ThemeSettings = {
  background: "#ffffff",
  foreground: "#171717",
  card: "#27272A",
  cardForeground: "#ffffff",
  border: "#e5e7eb",
};

const PRESETS = {
  hybrid: {
    name: "Гибридный (Текущий)",
    colors: DEFAULT_THEME
  },
  dark: {
    name: "Темная тема",
    colors: {
      background: "#09090b",
      foreground: "#fafafa",
      card: "#18181b",
      cardForeground: "#fafafa",
      border: "#27272a"
    }
  },
  light: {
    name: "Светлая тема",
    colors: {
      background: "#fafafa",
      foreground: "#09090b",
      card: "#ffffff",
      cardForeground: "#09090b",
      border: "#e4e4e7"
    }
  },
  blue: {
    name: "Синий акцент",
    colors: {
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      card: "#0ea5e9",
      cardForeground: "#ffffff",
      border: "#bae6fd"
    }
  }
};

export default function AppearanceTab() {
  const [colors, setColors] = useState<ThemeSettings>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .like('key', 'theme_%');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newColors = { ...DEFAULT_THEME };
        data.forEach(setting => {
          const key = setting.key.replace('theme_', '') as keyof ThemeSettings;
          if (newColors[key] !== undefined) {
            newColors[key] = setting.value;
          }
        });
        setColors(newColors);
        setIsDemoMode(false);
      } else {
        // Try local storage if no data in supabase
        const saved = localStorage.getItem('theme_settings');
        if (saved) {
           setColors(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.error("Error fetching theme:", err);
      setIsDemoMode(true);
      
      // Fallback to local storage
      const saved = localStorage.getItem('theme_settings');
      if (saved) {
        setColors(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = (newColors: ThemeSettings) => {
    localStorage.setItem('theme_settings', JSON.stringify(newColors));
    setColors(newColors);
    applyThemeToRoot(newColors);
  };

  const applyThemeToRoot = (newColors: ThemeSettings) => {
      const root = document.documentElement;
      Object.entries(newColors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });
  };

  const saveTheme = async (newColors: ThemeSettings) => {
    setSaving(true);
    try {
      if (!isDemoMode) {
        try {
            const updates = Object.entries(newColors).map(([key, value]) => ({
                key: `theme_${key}`,
                value: value,
                description: `Theme color for ${key}`
            }));

            const { error } = await supabase
                .from('app_settings')
                .upsert(updates);

            if (error) throw error;

            await supabase.from('audit_logs').insert([{ 
                action: 'update', 
                entity: 'settings', 
                details: 'Updated theme colors' 
            }]);
            
            setColors(newColors);
            applyThemeToRoot(newColors);
            return;
        } catch (supaErr) {
            console.error("Supabase failed, falling back to local:", supaErr);
            setIsDemoMode(true);
        }
      }
      
      // Local mode logic
      saveToLocal(newColors);

    } catch (err: any) {
      console.error("Error saving theme:", err);
      alert("Ошибка сохранения: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    if (confirm(`Применить пресет "${preset.name}"?`)) {
      setColors(preset.colors);
      // Optional: auto-save on preset selection? No, let user confirm with Save.
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Внешний вид</h2>
            {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                Локальный режим
            </span>
            )}
        </div>
        <p className="text-gray-500 mb-6">Настройте цветовую схему приложения</p>
        
        {/* Preview Card */}
        <div 
          className="p-6 rounded-xl border mb-8 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.background, 
            borderColor: colors.border 
          }}
        >
          <div className="mb-4 text-sm font-medium opacity-50" style={{ color: colors.foreground }}>
            Предпросмотр
          </div>
          <div 
            className="p-6 rounded-xl shadow-sm max-w-sm mx-auto transition-colors duration-300"
            style={{ 
              backgroundColor: colors.card, 
              color: colors.cardForeground 
            }}
          >
            <div className="font-bold text-lg mb-2">Заголовок карточки</div>
            <p className="opacity-80">
              Это пример того, как будет выглядеть контент на карточках с выбранными цветами.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-20 rounded bg-white/20"></div>
              <div className="h-8 w-8 rounded-full bg-white/20"></div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex gap-2 mb-2">
                <div className="w-4 h-4 rounded-full border" style={{ background: preset.colors.background }}></div>
                <div className="w-4 h-4 rounded-full border" style={{ background: preset.colors.card }}></div>
              </div>
              <div className="text-sm font-medium">{preset.name}</div>
            </button>
          ))}
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-2">Фон страницы</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.background}
                onChange={(e) => setColors({ ...colors, background: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.background}
                onChange={(e) => setColors({ ...colors, background: e.target.value })}
                className="flex-1 p-2 rounded border bg-white text-black uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Текст страницы</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.foreground}
                onChange={(e) => setColors({ ...colors, foreground: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.foreground}
                onChange={(e) => setColors({ ...colors, foreground: e.target.value })}
                className="flex-1 p-2 rounded border bg-white text-black uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Фон карточек</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.card}
                onChange={(e) => setColors({ ...colors, card: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.card}
                onChange={(e) => setColors({ ...colors, card: e.target.value })}
                className="flex-1 p-2 rounded border bg-white text-black uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Текст карточек</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.cardForeground}
                onChange={(e) => setColors({ ...colors, cardForeground: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.cardForeground}
                onChange={(e) => setColors({ ...colors, cardForeground: e.target.value })}
                className="flex-1 p-2 rounded border bg-white text-black uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Границы (Border)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.border}
                onChange={(e) => setColors({ ...colors, border: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.border}
                onChange={(e) => setColors({ ...colors, border: e.target.value })}
                className="flex-1 p-2 rounded border bg-white text-black uppercase"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => saveTheme(colors)}
            disabled={saving || loading}
            className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            Сохранить изменения
          </button>
          <button
            onClick={() => setColors(DEFAULT_THEME)}
            className="px-6 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
