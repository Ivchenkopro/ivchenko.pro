
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
  role?: string;
  secondary_action_text?: string;
  secondary_action_type?: 'link' | 'modal';
  secondary_action_url?: string;
  secondary_modal_id?: string;
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
    title: "ALUN Finance",
    description: [
      "Частное финансирование: займы от частных инвесторов под задачи бизнеса",
      "Банковское финансирование: кредиты и банковские гарантии"
    ],
    icon: "landmark",
    action_type: "modal",
    action_text: "Связаться",
    modal_id: "global_finance",
    role: "CEO и Со-Founder",
    secondary_action_text: "Банковские гарантии",
    secondary_action_type: "modal",
    secondary_modal_id: "bank_guarantees",
    order: 1
  },
  {
    id: 2,
    title: "ALUN Estate",
    description: [
      "Подбор премиальной жилой и коммерческой недвижимости",
      "Сопровождение сделок купли-продажи «под ключ»: от поиска объекта до закрытия сделок"
    ],
    icon: "building",
    action_type: "modal",
    action_text: "Оставить заявку",
    role: "CEO и Со-Founder",
    order: 2
  },
  {
    id: 3,
    title: "Alun Capital",
    description: [
      "Инвестиционный фонд.",
      "Поиск и продажа проектов по закрытым сделкам для среднего бизнеса, сотрудничество с фондами."
    ],
    icon: "trending-up",
    action_type: "modal",
    action_text: "Обсудить проект",
    role: "Со-Founder",
    order: 3
  },
  {
    id: 4,
    title: "Трейдинг зерна",
    description: [
      "Международный трейдинг зерна, участие в проекте управления международным портом."
    ],
    icon: "wheat",
    action_type: "modal",
    action_text: "Подробнее",
    role: "Со-Founder",
    order: 4
  },
  {
    id: 5,
    title: "Бизнес-консьерж",
    description: [
      "Поиск закрытой информации",
      "Финансовая, налоговая, медицинская помощь",
      "Переговоры с ЛПР",
      "ВНЖ и релокация",
      "Юридические вопросы",
      "Доставка из Европы",
      "Клубные займы и M&A"
    ],
    icon: "search",
    action_type: "modal",
    action_text: "Обсудить сделку",
    modal_id: "concierge_modal",
    order: 5
  }
];

export const FALLBACK_CASES: Case[] = [
  {
    id: 1,
    title: "Банковская гарантия 500 млн",
    description: "Анализ налоговых и арбитражных рисков, выстраивание защиты собственника, подготовка структуры к получению банковской гарантии на 500 млн рублей.",
    icon: "landmark",
    link: "https://t.me/ivchenkooleg/52",
    order: 1
  },
  {
    id: 2,
    title: "Инвестиции $1 млн для агротеха",
    description: "Привлечение стратегического инвестора на $1 млн для агротех-проекта автоматизации теплиц: отбор инвесторов, упаковка предложения и организация переговоров до сделки.",
    icon: "wheat",
    link: "https://t.me/ivchenkooleg/44",
    order: 2
  },
  {
    id: 3,
    title: "Финансирование под госконтракт",
    description: "Финансирование под действующие строительные госконтракты общей стоимостью 80 млн ₽: анализ обеспечения, подбор инвестора, согласование условий и сохранение репутации заемщика перед заказчиком.",
    icon: "briefcase",
    link: "https://t.me/ivchenkooleg/46",
    order: 3
  },
  {
    id: 4,
    title: "Поиск партнера под госконтракт",
    description: "Привлечение партнёра для локализации производства в России: поиск, оценка кандидатов и создание совместного предприятия 50/50 с CAPEX 600 млн ₽ под контракт с госкорпорацией.",
    icon: "handshake",
    link: "https://t.me/ivchenkooleg/45",
    order: 4
  },
  {
    id: 5,
    title: "Финансирование 80 млн",
    description: "Привлечение 80 млн ₽ под покупку карьера: анализ экономики проекта, подтверждение ликвидности имущества и привлечение частного инвестора под сделку.",
    icon: "banknote",
    link: "https://t.me/ivchenkooleg/55",
    order: 5
  }
];
