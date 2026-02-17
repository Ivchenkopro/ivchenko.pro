
import { supabase } from "./supabase";

export const DEFAULT_SETTINGS: Record<string, string> = {
  // General
  "site_title": "Олег Ивченко",
  "site_description": "Предприниматель, CEO, инвестор",
  "home_main_image": "/олегив.jpg",
  
  // Home Page - Bio
  "home_bio_1": "Я предприниматель, который из возможностей делает работающие бизнесы. Я хаб, где сходятся идеи, ресурсы и люди. Я отбираю лучшие из множества проектов, анализирую их, привлекаю деньги, исполнителей и партнеров и вместе мы ставим бизнес на рельсы.",
  "home_bio_2": "Уникальность моей работы — постоянная воронка возможностей и умение реализовывать их в партнерстве. В этом приложении — мои действующие бизнесы и точка входа для новых совместных проектов.",
  
  // Home Page - Stats
  "stat_contacts": "9000+",
  "stat_projects": "40",
  "stat_deals": "1300+",
  "stat_turnover": "3.5 млрд",
  
  // Home Page - Section Titles & Labels
  "home_projects_title": "Мои проекты",
  "home_projects_all": "Все проекты",
  "home_projects_link_url": "/services",
  "home_cta_url": "/services",
  "home_stats_title": "Масштаб в цифрах",
  
  // Home Page - Stats Labels (use \n for line breaks)
  "stat_contacts_label": "контактов\nв доступе",
  "stat_projects_label": "проектов\nв 2025 г.",
  "stat_deals_label": "сделок\nкоманды",
  "stat_turnover_label": "годовой оборот\nпроектов",

  // Buttons & Labels
  "btn_share": "Поделиться визиткой",
  "btn_apply": "Оставить заявку",
  "share_message": "Предприниматель, Инвестор. Контакты и проекты.",
  
  // Contacts Page
  "contact_title": "Контакты",
  "contact_subtitle": "Всегда на связи для партнеров",
  "contact_tg_channel": "@ivchenkooleg",
  "contact_tg_channel_url": "https://t.me/ivchenkooleg",
  "contact_tg_personal": "@oleg8383",
  "contact_tg_personal_url": "https://t.me/oleg8383",
  "contact_email": "oleg@ivchenko.pro",
  "contact_email_url": "mailto:oleg@ivchenko.pro",
  "contact_share_url": ""
};

export const SETTING_DESCRIPTIONS: Record<string, string> = {
  "site_title": "Заголовок сайта",
  "site_description": "Описание сайта (SEO)",
  "home_main_image": "Главное фото (URL или путь)",
  "home_bio_1": "Биография (абзац 1)",
  "home_bio_2": "Биография (абзац 2)",
  "home_projects_title": "Заголовок блока 'Мои проекты' на главной",
  "home_projects_all": "Текст ссылки 'Все проекты' на главной",
  "home_projects_link_url": "Ссылка 'Все проекты' на главной (URL)",
  "home_cta_url": "Ссылка нижней кнопки на главной (URL)",
  "stat_contacts": "Статистика: Контакты",
  "stat_projects": "Статистика: Проекты",
  "stat_deals": "Статистика: Сделки",
  "stat_turnover": "Статистика: Оборот",
  "btn_share": "Текст кнопки 'Поделиться'",
  "btn_apply": "Текст кнопки 'Оставить заявку'",
  "share_message": "Текст при шаринге",
  "contact_title": "Заголовок страницы контактов",
  "contact_subtitle": "Подзаголовок страницы контактов",
  "contact_tg_channel": "Telegram канал (текст)",
  "contact_tg_channel_url": "Telegram канал (ссылка)",
  "contact_tg_personal": "Личный Telegram (текст)",
  "contact_tg_personal_url": "Личный Telegram (ссылка)",
  "contact_email": "Email (текст)",
  "contact_email_url": "Email (ссылка)",
  "contact_share_url": "Нижняя кнопка на странице «Контакты»: пусто — поделиться визиткой, /route — страница в приложении, https://... — внешний сайт"
};

export async function getSettings() {
  try {
    const { data, error } = await supabase.from('app_settings').select('*');
    
    if (error) {
      console.error("Error fetching settings:", error);
      return DEFAULT_SETTINGS;
    }

    // Merge DB settings with defaults
    const settings = { ...DEFAULT_SETTINGS };
    data?.forEach((item: { key: string; value: string }) => {
      if (item.value) {
        settings[item.key] = item.value;
      }
    });
    
    return settings;
  } catch (err) {
    console.error("Unexpected error fetching settings:", err);
    return DEFAULT_SETTINGS;
  }
}
