
export type Announcement = {
  id: number;
  tag: string;
  title: string;
  description: string;
  details?: {
    title?: string;
    content: string[]; // Paragraphs
    list?: {
      title: string;
      items: string[];
    };
    footer?: string;
  };
  date: string;
  urgent: boolean;
  link?: string;
  button_text?: string; // Text for the card button
  link_text?: string;   // Text for the button inside the modal (e.g. "Написать в Telegram")
  created_at?: string;
  action_type?: 'link' | 'modal';
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
  tag?: string; // New field for badges like "HOT" or "Exclusive"
  details?: {
    title?: string;
    content: string[]; // Paragraphs
    list?: {
      title: string;
      items: string[];
    };
    footer?: string;
  };
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

export type HomeProject = {
  id: number;
  title: string;
  role: string;
  description: string;
  detailed_description?: string;
  link?: string;
  order: number;
  created_at?: string;
};

export const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    tag: "Инвестиции",
    title: "Инвестиции в автолизинг CityCar",
    description: "Компания с 9-летней историей и высоким рейтингом, в фазе активного роста и масштабирования; 12 месяцев, ежемесячные выплаты, залоговое обеспечение.",
    details: {
      title: "Инвестиционное предложение CityCar",
      content: [
        "CityCar — автолизинговая компания с 9-летней историей, активным портфелем около 350 млн ₽ и стабильным ростом выручки. В 2023–2025 годах компания демонстрирует опережающую динамику и планирует удвоить выручку в 2026 году. Под реализацию этих планов и масштабирование портфеля привлекаются дополнительные инвестиции."
      ],
      list: {
        title: "Ключевые параметры",
        items: [
          "Формат: инвестиции на 12 месяцев.",
          "Выплаты: ежемесячный доход инвестору.",
          "Обеспечение: залог с дисконтом к рыночной стоимости.",
          "Объём привлечения: 300 млн ₽.",
          "Минимальный вход: от 5 млн ₽.",
          "Доходность: фиксированная ставка с потенциалом дополнительного апсайда."
        ]
      },
      footer: "Детали залоговой базы, структура ставок, график выплат и траншей предоставляются по запросу."
    },
    date: "Сегодня",
    urgent: true,
    link: "https://t.me/oleg8383",
    button_text: "Подробнее",
    link_text: "Написать в Telegram",
    action_type: "modal"
  }
];

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    title: "ALUN Finance",
    description: [
      "Частное финансирование: займы от частных инвесторов под задачи бизнеса.",
      "Банковское финансирование: кредиты и банковские гарантии."
    ],
    icon: "landmark",
    action_type: "modal",
    action_text: "Займы",
    modal_id: "alun_finance_loans",
    role: "CEO и Со-Founder",
    secondary_action_text: "Банковские гарантии",
    secondary_action_type: "modal",
    secondary_modal_id: "bank_guarantees",
    order: 1
  },
  {
    id: 2,
    title: "Центр девелоперских решений",
    description: [
      "Подбор и купля-продажа земельных участков под застройку.",
      "Комплексное сопровождение девелоперских проектов.",
      "Партнёры с опытом работы в Минстрое и Правительстве Москвы."
    ],
    icon: "building",
    action_type: "modal",
    action_text: "Подробнее",
    role: "CEO и Со-Founder",
    modal_id: "developer_center",
    order: 2
  },
  {
    id: 3,
    title: "ALUN Capital",
    description: [
      "Привлечение инвестиций и упаковка инвестиционного предложения.",
      "Поиск и подбор инвесторов под профиль проекта.",
      "Организация переговоров и сопровождение сделки до закрытия."
    ],
    icon: "trending-up",
    action_type: "modal",
    action_text: "Подробнее",
    role: "Co-Founder",
    modal_id: "alun_capital",
    order: 3
  },
  {
    id: 4,
    title: "Global Finance",
    description: [
      "Платёжный агент для ВЭД.",
      "Оплата инвойсов и международные переводы.",
      "Сопровождение ВЭД на выгодных условиях."
    ],
    icon: "globe",
    action_type: "modal",
    action_text: "Подробнее",
    role: "CEO и Co-Founder",
    modal_id: "global_finance",
    order: 4
  },
  {
    id: 5,
    title: "ALUN Estate",
    description: [
      "Подбор премиальной жилой и коммерческой недвижимости.",
      "Сопровождение сделок купли-продажи «под ключ».",
      "Доступ к off-market объектам и преференциям от застройщиков.",
      "Безупречное юридическое сопровождение сделок."
    ],
    icon: "building",
    action_type: "modal",
    action_text: "Подробнее",
    role: "CEO и Со-Founder",
    modal_id: "alun_estate",
    order: 5
  },
  {
    id: 6,
    title: "Ivchenko.pro",
    description: [
      "Закрытые конфиденциальные запросы.",
      "Сложные ситуации в бизнесе.",
      "Поиск партнёров и подрядчиков.",
      "Тёплые выходы на нужных людей."
    ],
    icon: "lock",
    action_type: "modal",
    action_text: "Подробнее",
    modal_id: "ivchenko_pro",
    order: 6,
    tag: "Exclusive"
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

export const FALLBACK_HOME_PROJECTS: HomeProject[] = [
  {
    id: 1,
    title: "ALUN Capital",
    role: "Co-Founder",
    description: "Привлечение инвестиций",
    detailed_description:
      "Сервис по привлечению капитала под рост бизнеса, новые проекты и сделки M&A. Подбор релевантных инвесторов под конкретный проект, упаковка предложения и сопровождение сделки до закрытия.",
    order: 1
  },
  {
    id: 2,
    title: "Global Finance",
    role: "CEO и Co-Founder",
    description: "Кредиты, банковские гарантии, ВЭД",
    detailed_description:
      "Платёжный агент и партнёр по ВЭД-расчётам. Оплата инвойсов и международные переводы по понятным и безопасным схемам, с полным документальным сопровождением.",
    order: 2
  },
  {
    id: 3,
    title: "Центр девелоперских решений",
    role: "CEO и Co-Founder",
    description: "Земля под застройку и девелопмент",
    detailed_description:
      "Подбор и купля-продажа земельных участков под застройку с полным сопровождением девелоперских проектов. Команда с опытом в Минстрое, Правительстве Москвы и крупных девелоперских структурах.",
    order: 3
  },
  {
    id: 4,
    title: "ALUN Estate",
    role: "CEO и Co-Founder",
    description: "Премиальная жилая и коммерческая недвижимость",
    detailed_description:
      "Агентство по работе с премиальной недвижимостью и коммерческими объектами, включая готовые арендные бизнесы. Доступ к закрытым off-market предложениям и юридическое сопровождение.",
    order: 4
  },
  {
    id: 5,
    title: "Вице-президент ALUN",
    role: "",
    description: "Сообщество предпринимателей и инвесторов",
    detailed_description:
      "ALUN — Active Leaders United Network, сообщество предпринимателей, инвесторов, выпускников бизнес-школ и первых лиц компаний. Объединяет тысячи резидентов и усиливает проекты.",
    order: 5
  },
  {
    id: 6,
    title: "Международный трейдинг зерна",
    role: "Co-Founder",
    description: "Международный трейдинг зерна и связанные проекты",
    detailed_description:
      "Экспорт зерновых культур и участие в проекте управления международным портом.",
    order: 6
  }
];

export type LinkItem = {
  id: number;
  title: string;
  url: string;
  icon?: string;
  is_external: boolean;
  order: number;
  is_active: boolean;
  created_at?: string;
};

export const FALLBACK_LINKS: LinkItem[] = [];
