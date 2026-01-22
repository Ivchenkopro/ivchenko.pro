
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
    title: "Global Finance",
    description: [
      "Международные финансы, ВЭД платежи, частное кредитование, работа с валютой.",
      "Банковское финансирование, операции с криптовалютой (USDT, BTC, ETH), трансграничные платежи для импортеров."
    ],
    icon: "globe",
    action_type: "modal",
    action_text: "Связаться",
    modal_id: "global_finance",
    order: 1
  },
  {
    id: 2,
    title: "Alun Partners",
    description: [
      "Стратегический консалтинг, бизнес-консьерж, Alun Private.",
      "Команда, которая больше 8 лет организует бизнес-взаимодействие в клубных сделках, требующих высокого уровня доверия."
    ],
    icon: "handshake",
    action_type: "link",
    action_text: "Подробнее",
    action_url: "#",
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
    action_type: "link",
    action_text: "concierge.alun.ru",
    action_url: "https://concierge.alun.ru",
    order: 5
  },
  {
    id: 6,
    title: "Банковские гарантии",
    description: [
      "Оформление банковских гарантий для участников госзакупок (44-ФЗ, 223-ФЗ) и коммерческих контрактов."
    ],
    icon: "landmark",
    action_type: "modal",
    action_text: "Оформить",
    modal_id: "bank_guarantees",
    order: 6
  }
];

export const FALLBACK_CASES: Case[] = [
  {
    id: 1,
    title: "Продажа IT-компании",
    description: "Полное сопровождение M&A сделки по продаже разработчика ПО стратегическому инвестору.",
    details: "Сумма сделки: 120 млн руб.",
    icon: "handshake",
    order: 1
  },
  {
    id: 2,
    title: "Привлечение инвестиций в завод",
    description: "Организация синдицированного кредита и equity-финансирования для расширения производства.",
    details: "Привлечено: 450 млн руб.",
    icon: "building",
    order: 2
  },
  {
    id: 3,
    title: "Реструктуризация холдинга",
    description: "Оптимизация структуры владения активами для группы компаний в сфере логистики.",
    details: "Срок реализации: 6 месяцев",
    icon: "landmark",
    order: 3
  }
];
