
export type Announcement = {
  id: number;
  tag: string;
  title: string;
  description: string;
  date: string;
  urgent: boolean;
  link?: string;
  button_text?: string;
  created_at?: string;
};

export type Service = {
  id: number;
  title: string;
  description: string[]; // Array of strings for bullet points
  icon: string;
  action_type: 'link' | 'modal';
  action_text: string;
  action_url?: string;
  modal_id?: string; // For special modals like "bank_guarantees"
  order: number;
  created_at?: string;
};

export type Case = {
  id: number;
  title: string;
  description: string;
  details?: string;
  link?: string;
  icon: string;
  order: number;
  created_at?: string;
};

export const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    tag: "Инвестиции",
    title: "Привлекаем раунд А в Fintech-стартап",
    description: "Ищем стратегического инвестора для масштабирования на рынок MENA. Оценка $15M, чек от $500k.",
    date: "2 часа назад",
    urgent: true
  },
  {
    id: 2,
    tag: "Партнерство",
    title: "Нужен партнер в строительный проект",
    description: "Застройка коттеджного поселка бизнес-класса в Подмосковье. Требуется компетенция в генподряде.",
    date: "Вчера",
    urgent: false
  },
  {
    id: 3,
    tag: "Покупка бизнеса",
    title: "Куплю действующее производство",
    description: "Интересует пищевая промышленность или упаковка. Оборот от 300 млн руб/год. Москва/МО.",
    date: "3 дня назад",
    urgent: false
  },
  {
    id: 4,
    tag: "Мероприятие",
    title: "Закрытый ужин инвесторов",
    description: "25 октября, Москва Сити. Только для членов клуба. Обсуждаем тренды 2025 года.",
    date: "Неделю назад",
    urgent: false
  }
];
