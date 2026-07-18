export type Language = 'uz' | 'ru' | 'en';

export interface TranslationDictionary {
  nav: {
    explore: string;
    planner: string;
    trips: string;
    about: string;
    login: string;
    getStarted: string;
    darkMode: string;
    lightMode: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    startPlanning: string;
    exploreWorld: string;
    searchPlaceholder: string;
  };
  search: {
    flights: string;
    hotels: string;
    restaurants: string;
    from: string;
    to: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    travelers: string;
    class: string;
    economy: string;
    business: string;
    first: string;
    search: string;
    find: string;
    city: string;
    cuisine: string;
    date: string;
  };
  categories: {
    flights: string;
    hotels: string;
    restaurants: string;
    planner: string;
    assistant: string;
    saved: string;
  };
  stats: {
    countries: string;
    destinations: string;
    travelers: string;
    support: string;
    countriesNum: string;
    destinationsNum: string;
    travelersNum: string;
    supportText: string;
  };
  destinations: {
    title: string;
    seeAll: string;
    from: string;
    rating: string;
  };
  planner: {
    title: string;
    subtitle: string;
    where: string;
    dates: string;
    travelers: string;
    budget: string;
    style: string;
    adventure: string;
    relaxation: string;
    culture: string;
    food: string;
    luxury: string;
    generate: string;
    generating: string;
    result: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
  };
  why: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    card5Title: string;
    card5Desc: string;
    card6Title: string;
    card6Desc: string;
    card7Title: string;
    card7Desc: string;
    card8Title: string;
    card8Desc: string;
  };
  userStories: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
  appDownload: {
    title: string;
    subtitle: string;
  };
  footer: {
    tagline: string;
    company: string;
    help: string;
    resources: string;
    download: string;
    about: string;
    blog: string;
    careers: string;
    faq: string;
    support: string;
    privacy: string;
    terms: string;
    ios: string;
    android: string;
    copyright: string;
  };
  auth: {
    signInGoogle: string;
    signInApple: string;
    orEmail: string;
    terms: string;
    privacy: string;
    welcome: string;
    subtitle: string;
  };
  dashboard: {
    explore: string;
    planner: string;
    myTrips: string;
    readyTrips: string;
    flights: string;
    hotels: string;
    attractions: string;
    saved: string;
    assistant: string;
    profile: string;
    settings: string;
    goPremium: string;
    upgrade: string;
  };
  country: {
    capital: string;
    language: string;
    currency: string;
    timezone: string;
    visa: string;
    weather: string;
    bestTime: string;
    attractions: string;
    foods: string;
    createTrip: string;
    eVisa: string;
    visaRequired: string;
    visaFree: string;
    seeAll: string;
  };
  common: {
    loading: string;
    error: string;
    save: string;
    saved: string;
    back: string;
    close: string;
    share: string;
    export: string;
    edit: string;
    delete: string;
    confirm: string;
    cancel: string;
    next: string;
    prev: string;
    seeAll: string;
    learnMore: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  uz: {
    nav: {
      explore: 'Kashf etish',
      planner: 'AI Planner',
      trips: 'Sayohatlarim',
      about: 'Biz haqimizda',
      login: 'Kirish',
      getStarted: 'Boshlash',
      darkMode: 'Tungi rejim',
      lightMode: 'Kunduzgi rejim',
    },
    hero: {
      headline: 'Sun’iy intellekt bilan mukammal sayohatni rejalang',
      subheadline: '3D globusda mamlakat ko‘rsatkichlarini o‘rganing, shaxsiy kunlik sayohat rejasini oling va ta’tilni bron qiling.',
      startPlanning: 'Rejalashni boshlash',
      exploreWorld: 'Dunyoni kashf etish',
      searchPlaceholder: 'Mamlakat, shahar yoki mehmonxonalarni qidiring...',
    },
    search: {
      flights: 'Parvozlar',
      hotels: 'Mehmonxonalar',
      restaurants: 'Restoranlar',
      from: 'Qayerdan',
      to: 'Qayerga',
      checkIn: 'Kelish sanasi',
      checkOut: 'Ketish sanasi',
      guests: 'Mehmonlar',
      travelers: 'Sayohatchilar',
      class: 'Klass',
      economy: 'Ekonom',
      business: 'Biznes',
      first: 'Birinchi klass',
      search: 'Qidiruv',
      find: 'Topish',
      city: 'Shahar',
      cuisine: 'Oshxona',
      date: 'Sana',
    },
    categories: {
      flights: 'Aviachiptalar',
      hotels: 'Turar joylar',
      restaurants: 'Oshxonalar',
      planner: 'AI Rejalashtiruvchi',
      assistant: 'AI Yordamchi',
      saved: 'Saqlanganlar',
    },
    stats: {
      countries: 'Kuzatilayotgan davlatlar',
      destinations: 'Mashhur yo‘nalishlar',
      travelers: 'Faol sayohatchilar',
      support: 'Mijozlarni qo‘llab-quvvatlash',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: '24/7 yordam xizmati',
    },
    destinations: {
      title: 'Mashhur global yo‘nalishlar',
      seeAll: 'Barchasini ko‘rish',
      from: 'dan boshlab',
      rating: 'Reyting',
    },
    planner: {
      title: 'AI Sayohat Planner',
      subtitle: 'Tizimga sayohat afzalliklarini kiriting va kunlik batafsil sayohat rejasini lahzalarda oling.',
      where: 'Qayerga sayohat qilmoqchisiz?',
      dates: 'Sayohat sanalari',
      travelers: 'Sayohatchilar soni',
      budget: 'Budjet darajasi',
      style: 'Sayohat uslubi',
      adventure: 'Sarguzasht / Faol',
      relaxation: 'Hordiq chiqarish',
      culture: 'Madaniy / Tarixiy',
      food: 'Gastronomik / Oshxona',
      luxury: 'Premium / Lyuks',
      generate: 'Sayohat rejasini tuzish',
      generating: 'AI sayohat rejasini tuzmoqda...',
      result: 'Siz uchun tayyorlangan marshrut',
    },
    howItWorks: {
      title: 'Qanday ishlaydi?',
      subtitle: 'Atigi bir necha qadam orqali o\'zingizga mos sayohatni yarating.',
      step1Title: '🌍 TravelUZ ga kiring yoki akkaunt yarating',
      step1Desc: 'Google, Apple yoki email orqali bir necha soniyada ro\'yxatdan o\'ting.',
      step2Title: '🤖 AI yordamida Dream Trip yarating',
      step2Desc: 'Sun\'iy intellekt sizning byudjetingiz, qiziqishlaringiz va sanalaringiz asosida ideal sayohat yaratadi.',
      step3Title: '✈️ Tayyor yo\'nalishlarni kashf eting',
      step3Desc: 'Minglab tayyor sayohatlar orasidan o\'zingizga mos variantni tanlang.',
      step4Title: '🏨 Bron qiling va rejalashtiring',
      step4Desc: 'Parvozlar, mehmonxonalar va marshrutlarni bir joydan boshqaring.',
      step5Title: '🧳 Shaxsiy marshrutingizni saqlang',
      step5Desc: 'Barcha rejalaringiz akkauntingizda xavfsiz saqlanadi.',
      step6Title: '🌟 Sayohatdan zavqlaning',
      step6Desc: 'TravelUZ bilan unutilmas sarguzashtlarni boshlang.',
    },
    why: {
      title: 'Nima uchun aynan TravelUZ?',
      subtitle: 'TravelUZ har bir sayohatchi uchun individual va zamonaviy sayohat tajribasini yaratadi.',
      card1Title: '🤖 AI Dream Planner',
      card1Desc: 'Shaxsiy qiziqishlaringiz asosida ideal sayohat yaratadi.',
      card2Title: '🌍 Individual Marshrutlar',
      card2Desc: 'Har bir foydalanuvchi uchun maxsus yo\'nalishlar.',
      card3Title: '✈️ Eksklyuziv Takliflar',
      card3Desc: 'Eng yaxshi narxlar va maxsus chegirmalar.',
      card4Title: '🏨 Premium Mehmonxonalar',
      card4Desc: 'Dunyoning eng yaxshi mehmonxonalari bir joyda.',
      card5Title: '🗺️ Interaktiv 3D Globe',
      card5Desc: 'Davlatlarni 3D globus orqali kashf qiling.',
      card6Title: '🛡️ Xavfsiz Bronlash',
      card6Desc: 'Barcha ma\'lumotlar zamonaviy himoya bilan saqlanadi.',
      card7Title: '🌐 Ko\'p Tillik Platforma',
      card7Desc: 'O\'zbek, Ingliz va Rus tillarini qo\'llab-quvvatlaydi.',
      card8Title: '💬 AI Sayohat Yordamchisi',
      card8Desc: '24/7 rejimda sizga yordam beradi.',
    },
    userStories: {
      title: 'Sayohatchilar qanday foydalanadi?',
      subtitle: 'TravelUZ bilan minglab foydalanuvchilar o\'z orzularidagi sayohatni yaratmoqda.',
      card1Title: 'Akkaunt yarating',
      card1Desc: 'Bir necha soniyada ro\'yxatdan o\'ting va shaxsiy profilingizni yarating.',
      card2Title: 'Dream Trip yarating',
      card2Desc: 'AI yordamida sizga mos eksklyuziv sayohat rejasini oling.',
      card3Title: 'Bron qiling va sayohat qiling',
      card3Desc: 'Parvoz, mehmonxona va marshrutni bir joydan boshqaring.',
    },
    cta: {
      title: 'Orzuyingizdagi sayohatni bugunoq boshlang',
      subtitle: 'Sun\'iy intellekt yordamida sizga mos, unutilmas va eksklyuziv sayohat yarating.',
      primaryButton: 'Sayohatni boshlash',
      secondaryButton: 'AI bilan yaratish',
    },
    appDownload: {
      title: 'TravelUZ mobil ilovasini yuklab oling',
      subtitle: 'Sayohat rejalaringizni istalgan joyda boshqaring, offline foydalaning va real vaqt bildirishnomalarini qabul qiling.',
    },
    footer: {
      tagline: 'Sayohatni rejalashtirishning eng aqlli va zamonaviy usuli.',
      company: 'Kompaniya',
      help: 'Yordam',
      resources: 'Manbalar',
      download: 'Yuklab olish',
      about: 'Biz haqimizda',
      blog: 'Blog',
      careers: 'Karyera',
      faq: 'Ko‘p beriladigan savollar',
      support: 'Qo‘llab-quvvatlash',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      ios: 'iOS ilovasi',
      android: 'Android ilovasi',
      copyright: 'Barcha huquqlar himoyalangan.',
    },
    auth: {
      signInGoogle: 'Google orqali kirish',
      signInApple: 'Apple orqali kirish',
      orEmail: 'Yoki elektron pochta orqali',
      terms: 'Foydalanish shartlari',
      privacy: 'Maxfiylik siyosati',
      welcome: 'Xush kelibsiz',
      subtitle: 'TravelUZ orqali dunyo sayohatlarini osonlashtiring.',
    },
    dashboard: {
      explore: 'Yo‘nalishlar',
      planner: 'AI Sayohat Planner',
      myTrips: 'Sayohatlarim',
      readyTrips: 'Tayyor turlar',
      flights: 'Aviachiptalar',
      hotels: 'Mehmonxonalar',
      attractions: 'Diqqatga sazovor joylar',
      saved: 'Saqlanganlar',
      assistant: 'AI Yordamchi',
      profile: 'Profilim',
      settings: 'Sozlamalar',
      goPremium: 'Premiumga o‘tish',
      upgrade: 'Hozir yangilash',
    },
    country: {
      capital: 'Poytaxt',
      language: 'Rasmiy til',
      currency: 'Valyuta',
      timezone: 'Vaqt zonasi',
      visa: 'Viza tartibi',
      weather: 'Ob-havo',
      bestTime: 'Sayohat uchun eng yaxshi vaqt',
      attractions: 'Diqqatga sazovor joylar',
      foods: 'Mashhur taomlar',
      createTrip: 'Sayohat yaratish',
      eVisa: 'Elektron viza / Borishda viza',
      visaRequired: 'Viza talab etiladi',
      visaFree: 'Vizashiz rejim',
      seeAll: 'Barchasini ko‘rish',
    },
    common: {
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi',
      save: 'Saqlash',
      saved: 'Saqlandi',
      back: 'Orqaga',
      close: 'Yopish',
      share: 'Ulashish',
      export: 'Eksport',
      edit: 'Tahrirlash',
      delete: 'O‘chirish',
      confirm: 'Tasdiqlash',
      cancel: 'Bekor qilish',
      next: 'Keyingi',
      prev: 'Oldingi',
      seeAll: 'Barchasini ko‘rish',
      learnMore: 'Batafsil ma’lumot',
    },
  },
  ru: {
    nav: {
      explore: 'Исследовать',
      planner: 'ИИ-Планировщик',
      trips: 'Мои поездки',
      about: 'О нас',
      login: 'Войти',
      getStarted: 'Начать',
      darkMode: 'Темная тема',
      lightMode: 'Светлая тема',
    },
    hero: {
      headline: 'Планируйте идеальные поездки с помощью ИИ',
      subheadline: 'Изучайте метрики стран прямо на 3D-глобусе, получайте персональные маршруты поездок и бронируйте отдых.',
      startPlanning: 'Начать планирование',
      exploreWorld: 'Исследовать мир',
      searchPlaceholder: 'Ищите страны, города или отели...',
    },
    search: {
      flights: 'Авиабилеты',
      hotels: 'Отели',
      restaurants: 'Рестораны',
      from: 'Откуда',
      to: 'Куда',
      checkIn: 'Дата заезда',
      checkOut: 'Дата выезда',
      guests: 'Гости',
      travelers: 'Путешественники',
      class: 'Класс',
      economy: 'Эконом',
      business: 'Бизнес',
      first: 'Первый класс',
      search: 'Поиск',
      find: 'Найти',
      city: 'Город',
      cuisine: 'Кухня',
      date: 'Дата',
    },
    categories: {
      flights: 'Авиарейсы',
      hotels: 'Отели',
      restaurants: 'Рестораны',
      planner: 'ИИ-Планировщик',
      assistant: 'ИИ-Ассистент',
      saved: 'Избранное',
    },
    stats: {
      countries: 'Отслеживаемых стран',
      destinations: 'Популярных направлений',
      travelers: 'Активных пользователей',
      support: 'Служба поддержки',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: 'Помощь 24/7',
    },
    destinations: {
      title: 'Популярные направления в мире',
      seeAll: 'Смотреть все',
      from: 'от',
      rating: 'Рейтинг',
    },
    planner: {
      title: 'ИИ-Планировщик туров',
      subtitle: 'Укажите свои предпочтения для мгновенного построения детального плана поездки по дням.',
      where: 'Куда вы хотите отправиться?',
      dates: 'Даты поездки',
      travelers: 'Количество путешественников',
      budget: 'Уровень бюджета',
      style: 'Стиль путешествия',
      adventure: 'Приключения / Активный',
      relaxation: 'Спокойный отдых',
      culture: 'Культурный / Исторический',
      food: 'Гастрономический',
      luxury: 'Премиум / Люкс',
      generate: 'Создать маршрут',
      generating: 'ИИ создает ваш маршрут...',
      result: 'Ваш готовый маршрут',
    },
    howItWorks: {
      title: 'Как это работает?',
      subtitle: 'Создайте свое идеальное путешествие всего за несколько простых шагов.',
      step1Title: '🌍 Войдите или создайте аккаунт в TravelUZ',
      step1Desc: 'Зарегистрируйтесь за пару секунд через Google, Apple или почту.',
      step2Title: '🤖 Создайте Dream Trip с помощью ИИ',
      step2Desc: 'Искусственный интеллект разработает идеальный маршрут на основе вашего бюджета, интересов и дат.',
      step3Title: '✈️ Исследуйте готовые маршруты',
      step3Desc: 'Выбирайте подходящий вариант из тысяч готовых путешествий.',
      step4Title: '🏨 Бронируйте и планируйте',
      step4Desc: 'Управляйте рейсами, отелями и маршрутами в одном удобном месте.',
      step5Title: '🧳 Сохраняйте личные маршруты',
      step5Desc: 'Все ваши планы и поездки будут надежно сохранены в вашем профиле.',
      step6Title: '🌟 Наслаждайтесь путешествием',
      step6Desc: 'Начните свое незабываемое приключение вместе с TravelUZ.',
    },
    why: {
      title: 'Почему именно TravelUZ?',
      subtitle: 'TravelUZ создает уникальный и современный опыт путешествий для каждого.',
      card1Title: '🤖 AI Dream Planner',
      card1Desc: 'Создает идеальные поездки на основе ваших персональных предпочтений.',
      card2Title: '🌍 Индивидуальные маршруты',
      card2Desc: 'Специально подобранные направления для каждого путешественника.',
      card3Title: '✈️ Эксклюзивные предложения',
      card3Desc: 'Лучшие тарифы и специальные скидки на поездки.',
      card4Title: '🏨 Премиум отели',
      card4Desc: 'Лучшие отели мира собраны в одной платформе.',
      card5Title: '🗺️ Интерактивный 3D-глобус',
      card5Desc: 'Исследуйте страны и их особенности с помощью 3D-глобуса.',
      card6Title: '🛡️ Безопасное бронирование',
      card6Desc: 'Все ваши данные и платежи защищены современными технологиями.',
      card7Title: '🌐 Многоязычная платформа',
      card7Desc: 'Полная поддержка узбекского, английского и русского языков.',
      card8Title: '💬 AI-помощник в поездках',
      card8Desc: 'Круглосуточная поддержка 24/7 по любым вопросам.',
    },
    userStories: {
      title: 'Как путешественники используют сервис?',
      subtitle: 'Тысячи пользователей уже создают свои поездки мечты вместе с TravelUZ.',
      card1Title: 'Создайте аккаунт',
      card1Desc: 'Зарегистрируйтесь за несколько секунд и настройте свой профиль.',
      card2Title: 'Создайте Dream Trip',
      card2Desc: 'Получите эксклюзивный план путешествия, созданный искусственным интеллектом.',
      card3Title: 'Бронируйте и отправляйтесь',
      card3Desc: 'Управляйте билетами, отелями и графиком поездки в одном месте.',
    },
    cta: {
      title: 'Начните путешествие вашей мечты уже сегодня',
      subtitle: 'Создайте индивидуальный, незабываемый и эксклюзивный маршрут с помощью ИИ.',
      primaryButton: 'Начать путешествие',
      secondaryButton: 'Создать с помощью ИИ',
    },
    appDownload: {
      title: 'Скачайте мобильное приложение TravelUZ',
      subtitle: 'Управляйте планами поездок в любом месте, пользуйтесь офлайн-доступом и получайте уведомления в реальном времени.',
    },
    footer: {
      tagline: 'Самый умный способ планирования путешествий в современную эпоху.',
      company: 'Компания',
      help: 'Поддержка',
      resources: 'Ресурсы',
      download: 'Скачать',
      about: 'О нас',
      blog: 'Блог',
      careers: 'Карьера',
      faq: 'Вопросы и ответы',
      support: 'Техподдержка',
      privacy: 'Конфиденциальность',
      terms: 'Условия использования',
      ios: 'Приложение для iOS',
      android: 'Приложение для Android',
      copyright: 'Все права защищены.',
    },
    auth: {
      signInGoogle: 'Войти через Google',
      signInApple: 'Войти через Apple',
      orEmail: 'Или через эл. почту',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      welcome: 'С возвращением',
      subtitle: 'Сделайте планирование поездок простым с TravelUZ.',
    },
    dashboard: {
      explore: 'Направления',
      planner: 'ИИ-Планировщик',
      myTrips: 'Мои поездки',
      readyTrips: 'Готовые туры',
      flights: 'Авиабилеты',
      hotels: 'Отели',
      attractions: 'Интересные места',
      saved: 'Избранное',
      assistant: 'ИИ-Помощник',
      profile: 'Мой профиль',
      settings: 'Настройки',
      goPremium: 'Перейти на Premium',
      upgrade: 'Обновить сейчас',
    },
    country: {
      capital: 'Столица',
      language: 'Официальный язык',
      currency: 'Валюта',
      timezone: 'Часовой пояс',
      visa: 'Визовый режим',
      weather: 'Погода',
      bestTime: 'Лучшее время для визита',
      attractions: 'Достопримечательности',
      foods: 'Популярные блюда',
      createTrip: 'Создать поездку',
      eVisa: 'Электронная виза / Виза по прибытии',
      visaRequired: 'Требуется виза',
      visaFree: 'Безвизовый режим',
      seeAll: 'Смотреть все',
    },
    common: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      save: 'Сохранить',
      saved: 'Сохранено',
      back: 'Назад',
      close: 'Закрыть',
      share: 'Поделиться',
      export: 'Экспорт',
      edit: 'Редактировать',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      cancel: 'Отмена',
      next: 'Вперед',
      prev: 'Назад',
      seeAll: 'Смотреть все',
      learnMore: 'Подробнее',
    },
  },
  en: {
    nav: {
      explore: 'Explore',
      planner: 'AI Planner',
      trips: 'My Trips',
      about: 'About Us',
      login: 'Sign In',
      getStarted: 'Get Started',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
    },
    hero: {
      headline: 'Plan Your Perfect Journey with AI',
      subheadline: 'Explore country metrics on the 3D globe, generate detailed travel itineraries, and book your next vacation instantly.',
      startPlanning: 'Start Planning',
      exploreWorld: 'Explore the World',
      searchPlaceholder: 'Search countries, cities, or hotels...',
    },
    search: {
      flights: 'Flights',
      hotels: 'Hotels',
      restaurants: 'Restaurants',
      from: 'From',
      to: 'To',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      travelers: 'Travelers',
      class: 'Class',
      economy: 'Economy',
      business: 'Business',
      first: 'First Class',
      search: 'Search',
      find: 'Find',
      city: 'City',
      cuisine: 'Cuisine',
      date: 'Date',
    },
    categories: {
      flights: 'Flight Tickets',
      hotels: 'Stays',
      restaurants: 'Dining',
      planner: 'AI Itinerary',
      assistant: 'AI Copilot',
      saved: 'Saved Places',
    },
    stats: {
      countries: 'Countries Tracked',
      destinations: 'Global Hotspots',
      travelers: 'Active Users',
      support: 'Customer Support',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: '24/7 Instant Help',
    },
    destinations: {
      title: 'Popular Global Destinations',
      seeAll: 'See all',
      from: 'from',
      rating: 'Rating',
    },
    planner: {
      title: 'AI Destination Planner',
      subtitle: 'Configure your travel variables and generate a detailed custom itinerary instantly.',
      where: 'Where would you like to travel?',
      dates: 'Travel Dates',
      travelers: 'Traveler Count',
      budget: 'Budget Level',
      style: 'Travel Style',
      adventure: 'Adventure / Active',
      relaxation: 'Relaxed / Leisure',
      culture: 'Cultural / Historical',
      food: 'Gastronomy / Culinary',
      luxury: 'Luxury / Premium',
      generate: 'Generate Itinerary',
      generating: 'AI is crafting your itinerary...',
      result: 'Your Custom Itinerary',
    },
    howItWorks: {
      title: 'How It Works?',
      subtitle: 'Create your custom itinerary in just a few steps.',
      step1Title: '🌍 Sign in or create a TravelUZ account',
      step1Desc: 'Sign up in seconds via Google, Apple, or email.',
      step2Title: '🤖 Create a Dream Trip with AI',
      step2Desc: 'AI crafts your ideal travel itinerary based on your budget, interests, and dates.',
      step3Title: '✈️ Explore ready-made routes',
      step3Desc: 'Choose the perfect match for you from thousands of ready-made trips.',
      step4Title: '🏨 Book and plan',
      step4Desc: 'Manage flights, hotels, and detailed itineraries all in one place.',
      step5Title: '🧳 Save your personal route',
      step5Desc: 'All your plans are securely saved in your personal account.',
      step6Title: '🌟 Enjoy your journey',
      step6Desc: 'Embark on unforgettable adventures with TravelUZ.',
    },
    why: {
      title: 'Why choose TravelUZ?',
      subtitle: 'TravelUZ delivers a customized and modern travel experience for every explorer.',
      card1Title: '🤖 AI Dream Planner',
      card1Desc: 'Generates the ideal trip tailored to your individual interests.',
      card2Title: '🌍 Individual Routes',
      card2Desc: 'Custom itineraries built specifically for each user.',
      card3Title: '✈️ Exclusive Offers',
      card3Desc: 'Access the best prices and special travel discounts.',
      card4Title: '🏨 Premium Hotels',
      card4Desc: 'The world\'s best boutique hotels and stays in one place.',
      card5Title: '🗺️ Interactive 3D Globe',
      card5Desc: 'Explore countries and flight networks via our interactive 3D globe.',
      card6Title: '🛡️ Secure Booking',
      card6Desc: 'Your payment and personal data are protected by modern encryption.',
      card7Title: '🌐 Multi-language Platform',
      card7Desc: 'Fully supports Uzbek, English, and Russian languages.',
      card8Title: '💬 AI Travel Assistant',
      card8Desc: 'Your personal travel companion, helping you 24/7.',
    },
    userStories: {
      title: 'How do travelers use it?',
      subtitle: 'Thousands of users are crafting their dream vacations with TravelUZ.',
      card1Title: 'Create an account',
      card1Desc: 'Register in a matter of seconds and build your custom profile.',
      card2Title: 'Generate Dream Trip',
      card2Desc: 'Get an exclusive custom itinerary tailored to you by our AI.',
      card3Title: 'Book and Travel',
      card3Desc: 'Manage flights, hotel details, and travel events in a single dashboard.',
    },
    cta: {
      title: 'Start your dream vacation today',
      subtitle: 'Design a custom, unforgettable, and exclusive trip using artificial intelligence.',
      primaryButton: 'Start Planning',
      secondaryButton: 'Create with AI',
    },
    appDownload: {
      title: 'Download the TravelUZ mobile app',
      subtitle: 'Manage your travel plans anywhere, use it offline, and receive real-time notifications.',
    },
    footer: {
      tagline: 'The smartest way to design and coordinate travel workflows in the modern era.',
      company: 'Company',
      help: 'Help Desk',
      resources: 'Resources',
      download: 'Download App',
      about: 'About Us',
      blog: 'Blog Articles',
      careers: 'Careers',
      faq: 'FAQs',
      support: 'Support Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      ios: 'App Store (iOS)',
      android: 'Play Store (Android)',
      copyright: 'All rights reserved.',
    },
    auth: {
      signInGoogle: 'Sign In with Google',
      signInApple: 'Sign In with Apple',
      orEmail: 'Or use your Email address',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      welcome: 'Welcome Back',
      subtitle: 'Unlock seamless custom travel workflows with TravelUZ.',
    },
    dashboard: {
      explore: 'Destinations',
      planner: 'AI Trip Planner',
      myTrips: 'My Trips',
      readyTrips: 'Ready Trips',
      flights: 'Flight Search',
      hotels: 'Hotel Search',
      attractions: 'Points of Interest',
      saved: 'Saved Catalog',
      assistant: 'AI Copilot',
      profile: 'User Profile',
      settings: 'Settings Control',
      goPremium: 'Go Premium',
      upgrade: 'Upgrade Now',
    },
    country: {
      capital: 'Capital',
      language: 'Official Language',
      currency: 'Currency',
      timezone: 'Timezone',
      visa: 'Visa Regulations',
      weather: 'Weather Info',
      bestTime: 'Best Time to Visit',
      attractions: 'Top Attractions',
      foods: 'Famous Local Foods',
      createTrip: 'Create Trip',
      eVisa: 'e-Visa / On Arrival',
      visaRequired: 'Visa Required',
      visaFree: 'Visa Free Stays',
      seeAll: 'See all',
    },
    common: {
      loading: 'Loading content...',
      error: 'An error occurred',
      save: 'Save',
      saved: 'Saved successfully',
      back: 'Back',
      close: 'Close',
      share: 'Share',
      export: 'Export file',
      edit: 'Edit Details',
      delete: 'Delete Record',
      confirm: 'Confirm Action',
      cancel: 'Cancel Action',
      next: 'Next Step',
      prev: 'Previous Step',
      seeAll: 'See all options',
      learnMore: 'Learn more info',
    },
  },
};
