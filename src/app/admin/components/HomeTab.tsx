"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_SETTINGS, SETTING_DESCRIPTIONS } from "@/lib/settings";
import { Save, Loader2, AlertCircle, WifiOff, Upload, CloudUpload } from "lucide-react";
import { HomeProject, FALLBACK_HOME_PROJECTS } from "@/lib/data";

interface AppSetting {
  key: string;
  value: string;
  description: string;
}

const HOME_KEYS = [
  "site_title",
  "site_description",
  "home_main_image",
  "home_bio_1",
  "home_bio_2",
  "home_projects_title",
  "home_projects_all",
  "home_projects_link_url",
  "home_cta_url",
  "home_stats_title",
  "stat_contacts",
  "stat_projects",
  "stat_deals",
  "stat_turnover",
  "btn_apply",
  "btn_share",
  "share_message",
  "contact_share_url"
] as const;

export default function HomeTab() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [homeProjects, setHomeProjects] = useState<HomeProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [projectsIsDemoMode, setProjectsIsDemoMode] = useState(false);
  const [projectsView, setProjectsView] = useState<"list" | "edit" | "create">(
    "list"
  );
  const [currentProject, setCurrentProject] = useState<HomeProject | null>(null);
  const [projectForm, setProjectForm] = useState<HomeProject>({
    id: 0,
    title: "",
    role: "",
    description: "",
    detailed_description: "",
    link: "",
    order: 1
  });

  useEffect(() => {
    fetchSettings();
    fetchHomeProjects();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .in("key", HOME_KEYS as unknown as string[]);

      if (error) throw error;

      const byKey = new Map<string, AppSetting>();
      data?.forEach((item) => {
        byKey.set(item.key, {
          key: item.key,
          value: item.value || "",
          description: item.description || SETTING_DESCRIPTIONS[item.key] || ""
        });
      });

      const finalSettings: AppSetting[] = HOME_KEYS.map((key) => {
        const existing = byKey.get(key);
        if (existing) return existing;
        return {
          key,
          value: DEFAULT_SETTINGS[key] || "",
          description: SETTING_DESCRIPTIONS[key] || ""
        };
      });

      setSettings(finalSettings);
      setIsDemoMode(false);
    } catch (err: unknown) {
      setIsDemoMode(true);
      setError("Нет связи с Supabase. Работа в локальном режиме.");

      const saved = localStorage.getItem("app_settings");
      if (saved) {
        const parsed: AppSetting[] = JSON.parse(saved);
        const byKey = new Map(parsed.map((s) => [s.key, s]));
        const finalSettings: AppSetting[] = HOME_KEYS.map((key) => {
          const existing = byKey.get(key);
          if (existing) return existing;
          return {
            key,
            value: DEFAULT_SETTINGS[key] || "",
            description: SETTING_DESCRIPTIONS[key] || ""
          };
        });
        setSettings(finalSettings);
      } else {
        const fallback: AppSetting[] = HOME_KEYS.map((key) => ({
          key,
          value: DEFAULT_SETTINGS[key] || "",
          description: SETTING_DESCRIPTIONS[key] || ""
        }));
        setSettings(fallback);
        localStorage.setItem("app_settings", JSON.stringify(fallback));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = (homeSettings: AppSetting[]) => {
    const saved = localStorage.getItem("app_settings");
    if (!saved) {
      localStorage.setItem("app_settings", JSON.stringify(homeSettings));
      return;
    }
    const parsed: AppSetting[] = JSON.parse(saved);
    const byKey = new Map(parsed.map((s) => [s.key, s]));
    homeSettings.forEach((s) => {
      byKey.set(s.key, s);
    });
    const merged = Array.from(byKey.values());
    localStorage.setItem("app_settings", JSON.stringify(merged));
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const getValue = (key: string) => {
    const found = settings.find((s) => s.key === key);
    return found ? found.value : "";
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (!isDemoMode) {
        try {
          const payload = settings.map((s) => ({
            key: s.key,
            value: s.value,
            description: s.description
          }));

          const { error } = await supabase
            .from("app_settings")
            .upsert(payload, { onConflict: "key" });

          if (error) throw error;

          await supabase.from("audit_logs").insert([
            {
              action: "update",
              entity: "settings_home",
              details: "Updated home page settings"
            }
          ]);
        } catch (supaErr) {
          console.error("Supabase failed, falling back to local:", supaErr);
          setIsDemoMode(true);
          setError("Ошибка Supabase. Переход в локальный режим.");
        }
      }

      saveToLocal(settings);
      alert("Настройки главной страницы сохранены");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Ошибка при сохранении: " + err.message);
      } else {
        setError("Ошибка при сохранении");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

      if (data) {
        updateSetting("home_main_image", data.publicUrl);
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        alert("Ошибка загрузки: " + error.message);
      } else {
        alert("Ошибка загрузки");
      }
    } finally {
      setUploading(false);
    }
  };

  const fetchHomeProjects = async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const { data, error } = await supabase
        .from("home_projects")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setHomeProjects(data as HomeProject[]);
        setProjectsIsDemoMode(false);
      } else {
        setHomeProjects(FALLBACK_HOME_PROJECTS);
        setProjectsIsDemoMode(true);
        setProjectsError(
          "В Supabase пока нет проектов для главной, показаны дефолтные значения."
        );
      }
    } catch (err) {
      console.error("Error fetching home projects:", err);
      setHomeProjects(FALLBACK_HOME_PROJECTS);
      setProjectsIsDemoMode(true);
      setProjectsError("Нет связи с Supabase. Показаны дефолтные проекты.");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleProjectsSync = async () => {
    if (!confirm("Это действие попытается загрузить текущие проекты главной в базу данных. Существующие записи могут быть обновлены. Продолжить?")) return;

    setProjectsLoading(true);
    setProjectsError("");
    try {
      const { error: healthCheck } = await supabase.from("home_projects").select("count").single();
      if (healthCheck) throw new Error("Нет соединения с базой данных");

      const sanitized = homeProjects.map(({ created_at, ...rest }) => rest);
      const { error: upsertError } = await supabase
        .from("home_projects")
        .upsert(sanitized, { onConflict: "id" });

      if (upsertError) throw upsertError;

      await fetchHomeProjects();
      setProjectsIsDemoMode(false);
      alert("Синхронизация проектов главной выполнена!");
    } catch (err) {
      console.error("Home projects sync error:", err);
      const message =
        err instanceof Error ? err.message : "Неизвестная ошибка синхронизации.";
      setProjectsError("Ошибка синхронизации: " + message);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleProjectEdit = (item: HomeProject) => {
    setCurrentProject(item);
    setProjectForm(item);
    setProjectsView("edit");
  };

  const handleProjectDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот проект?")) return;

    setProjectsLoading(true);
    setProjectsError("");
    try {
      const { error } = await supabase.from("home_projects").delete().eq("id", id);
      if (error) {
        throw error;
      }

      await supabase.from("audit_logs").insert([
        {
          action: "delete",
          entity: "home_project",
          details: `Deleted home project ID ${id}`
        }
      ]);

      await fetchHomeProjects();
    } catch (err) {
      console.error("Error deleting home project:", err);
      const message =
        err instanceof Error ? err.message : "Неизвестная ошибка удаления.";
      setProjectsError("Ошибка при удалении проекта: " + message);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectsLoading(true);
    setProjectsError("");

    try {
      const dataToSave = {
        title: projectForm.title,
        role: projectForm.role,
        description: projectForm.description,
        detailed_description: projectForm.detailed_description,
        link: projectForm.link,
        order: projectForm.order
      };

      if (projectsView === "create") {
        const { error } = await supabase.from("home_projects").insert([dataToSave]);
        if (error) {
          throw error;
        }
        await supabase.from("audit_logs").insert([
          {
            action: "create",
            entity: "home_project",
            details: `Created home project: ${projectForm.title}`
          }
        ]);
      } else if (projectsView === "edit" && currentProject) {
        const { error } = await supabase
          .from("home_projects")
          .update(dataToSave)
          .eq("id", currentProject.id);
        if (error) {
          throw error;
        }
        await supabase.from("audit_logs").insert([
          {
            action: "update",
            entity: "home_project",
            details: `Updated home project: ${projectForm.title}`
          }
        ]);
      }

      await fetchHomeProjects();
      setProjectsView("list");
    } catch (err) {
      console.error("Error saving home project:", err);
      const message =
        err instanceof Error ? err.message : "Неизвестная ошибка сохранения.";
      setProjectsError("Ошибка при сохранении проекта: " + message);
    } finally {
      setProjectsLoading(false);
    }
  };

  if (loading && settings.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Главная страница</h2>
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              Локальный режим
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Сохранить изменения
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <section className="border border-[var(--border)] rounded-2xl p-4 md:p-6 bg-[var(--card)]">
          <h3 className="text-lg font-bold mb-4">Верхний блок</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Заголовок сайта</label>
              <input
                type="text"
                value={getValue("site_title")}
                onChange={(e) => updateSetting("site_title", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Описание сайта (SEO)</label>
              <textarea
                value={getValue("site_description")}
                onChange={(e) => updateSetting("site_description", e.target.value)}
                rows={2}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Биография</label>
              <textarea
                value={getValue("home_bio_1")}
                onChange={(e) => updateSetting("home_bio_1", e.target.value)}
                rows={3}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black mb-2"
              />
              <textarea
                value={getValue("home_bio_2")}
                onChange={(e) => updateSetting("home_bio_2", e.target.value)}
                rows={3}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Главное фото</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={getValue("home_main_image")}
                  onChange={(e) => updateSetting("home_main_image", e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                  placeholder="/image.jpg или URL"
                />
                <div>
                  <input
                    type="file"
                    id="home-file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="home-file-upload"
                    className={`cursor-pointer inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg transition-colors ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? "Загрузка..." : "Загрузить"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-2xl p-4 md:p-6 bg-[var(--card)]">
          <h3 className="text-lg font-bold mb-4">Блок «Мои проекты»</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Заголовок блока</label>
              <input
                type="text"
                value={getValue("home_projects_title")}
                onChange={(e) => updateSetting("home_projects_title", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Текст ссылки «Все проекты»</label>
              <input
                type="text"
                value={getValue("home_projects_all")}
                onChange={(e) => updateSetting("home_projects_all", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ссылка для «Все проекты»</label>
              <input
                type="text"
                value={getValue("home_projects_link_url")}
                onChange={(e) => updateSetting("home_projects_link_url", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                placeholder="/services или полный URL"
              />
            </div>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-2xl p-4 md:p-6 bg-[var(--card)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Проекты на главной (список)</h3>
            <button
              onClick={() => {
                setProjectForm({
                  id: 0,
                  title: "",
                  role: "",
                  description: "",
                  detailed_description: "",
                  link: "",
                  order: homeProjects.length + 1
                });
                setCurrentProject(null);
                setProjectsView("create");
              }}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
            >
              Добавить проект
            </button>
          </div>

          {projectsIsDemoMode && (
            <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Локальный режим: показаны дефолтные или локальные проекты</span>
              </div>
              <button
                onClick={handleProjectsSync}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm"
              >
                <CloudUpload className="w-4 h-4" />
                Синхронизировать
              </button>
            </div>
          )}

          {projectsError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {projectsError}
            </div>
          )}

          {projectsLoading && projectsView === "list" ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : projectsView === "list" ? (
            <div className="space-y-3">
              {homeProjects.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">{item.title}</div>
                    {item.role && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.role}</div>
                    )}
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-md">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProjectEdit(item)}
                      className="px-3 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleProjectDelete(item.id)}
                      className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}

              {homeProjects.length === 0 && (
                <div className="text-sm text-gray-500">
                  Пока нет проектов. Нажмите «Добавить проект», чтобы создать первый.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleProjectSubmit} className="space-y-4 bg-white p-4 rounded-xl border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Название проекта</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Роль</label>
                  <input
                    type="text"
                    value={projectForm.role}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, role: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Краткое описание (видно сразу на карточке)
                </label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Детальное описание (открывается при раскрытии)
                </label>
                <textarea
                  rows={4}
                  value={projectForm.detailed_description || ""}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      detailed_description: e.target.value
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Порядок отображения (1 — первый)
                  </label>
                  <input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        order: Number(e.target.value) || 1
                      })
                    }
                    className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ссылка (опционально, если карточка должна вести куда-то)
                  </label>
                  <input
                    type="text"
                    value={projectForm.link || ""}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        link: e.target.value || undefined
                      })
                    }
                    className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                    placeholder="Оставьте пустым, чтобы карточка только раскрывалась"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setProjectsView("list")}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={projectsLoading}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {projectsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Сохранить проект
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="border border-[var(--border)] rounded-2xl p-4 md:p-6 bg-[var(--card)]">
          <h3 className="text-lg font-bold mb-4">Статистика</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Контакты</label>
              <input
                type="text"
                value={getValue("stat_contacts")}
                onChange={(e) => updateSetting("stat_contacts", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Проекты</label>
              <input
                type="text"
                value={getValue("stat_projects")}
                onChange={(e) => updateSetting("stat_projects", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Сделки</label>
              <input
                type="text"
                value={getValue("stat_deals")}
                onChange={(e) => updateSetting("stat_deals", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Оборот</label>
              <input
                type="text"
                value={getValue("stat_turnover")}
                onChange={(e) => updateSetting("stat_turnover", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
          </div>
        </section>

        <section className="border border-[var(--border)] rounded-2xl p-4 md:p-6 bg-[var(--card)]">
          <h3 className="text-lg font-bold mb-4">Кнопки и действия</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Текст кнопки «Оставить заявку»</label>
              <input
                type="text"
                value={getValue("btn_apply")}
                onChange={(e) => updateSetting("btn_apply", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ссылка кнопки внизу</label>
              <input
                type="text"
                value={getValue("home_cta_url")}
                onChange={(e) => updateSetting("home_cta_url", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                placeholder="/services или внешний URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Текст кнопки «Поделиться визиткой»</label>
              <input
                type="text"
                value={getValue("btn_share")}
                onChange={(e) => updateSetting("btn_share", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Текст при шаринге</label>
              <textarea
                value={getValue("share_message")}
                onChange={(e) => updateSetting("share_message", e.target.value)}
                rows={2}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Что делает нижняя кнопка на странице «Контакты»</label>
              <input
                type="text"
                value={getValue("contact_share_url")}
                onChange={(e) => updateSetting("contact_share_url", e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-white text-black"
                placeholder="Оставьте пустым — поделиться визиткой; /services или https://site.ru"
              />
              <p className="mt-1 text-xs text-gray-500">
                Пусто — поделиться визиткой; /route — страница в приложении; https://... — внешний сайт
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
