
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

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    title: "Привлечение инвестиций",
    description: ["Помощь в упаковке проекта", "Поиск инвесторов", "Сопровождение сделки"],
    icon: "briefcase",
    action_type: "link",
    action_text: "Подробнее",
    action_url: "#",
    order: 1
  },
  {
    id: 2,
    title: "Стратегический консалтинг",
    description: ["Анализ бизнес-модели", "Разработка стратегии роста", "Оптимизация процессов"],
    icon: "trending-up",
    action_type: "link",
    action_text: "Заказать",
    action_url: "#",
    order: 2
  },
  {
    id: 3,
    title: "Упаковка франшиз",
    description: ["Создание франчайзингового пакета", "Юридическая обвязка", "Маркетинг франшизы"],
    icon: "package",
    action_type: "link",
    action_text: "Узнать больше",
    action_url: "#",
    order: 3
  }
];
