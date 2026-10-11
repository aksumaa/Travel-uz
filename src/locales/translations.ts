export type Language = 'en' | 'uz' | 'ru';

export interface TranslationDictionary {
  nav: {
    explore: string;
    destinations: string;
    planner: string;
    howItWorks: string;
    trips: string;
    about: string;
    faq: string;
    login: string;
    getStarted: string;
    darkMode: string;
    lightMode: string;
    dashboard: string;
    agencyPortal: string;
    adminConsole: string;
    signOut: string;
  };
  hero: {
    badge: string;
    headline: string;
    titleLine1: string;
    titleLine2: string;
    subheadline: string;
    subtitle: string;
    startPlanning: string;
    startExploring: string;
    watchDemo: string;
    exploreWorld: string;
    searchPlaceholder: string;
    interactiveHubs: string;
  };
  stats: {
    countries: string;
    countriesDesc: string;
    destinations: string;
    destinationsDesc: string;
    travelers: string;
    travelersDesc: string;
    support: string;
    countriesNum: string;
    destinationsNum: string;
    travelersNum: string;
    supportText: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step1PromptInput: string;
    step1VerifiedNlp: string;
    step1SamplePrompt: string;
    step1Tag1: string;
    step1Tag2: string;
    step1Tag3: string;
    step2Title: string;
    step2Desc: string;
    step2Generating: string;
    step2Optimized: string;
    step2MockDay: string;
    step2MockDaySub: string;
    step2MockHotel: string;
    step2MockHotelSub: string;
    step3Title: string;
    step3Desc: string;
    step3SyncShare: string;
    step3LiveOffline: string;
    step3OfflineSynced: string;
    step3AppleWallet: string;
    step3SharedTrip: string;
    step3CoTravelers: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
  };
  storytelling: {
    badge: string;
    title: string;
    estimatedBudget: string;
    perPerson: string;
    exploreCountry: string;
    curatedOdyssey: string;
    prev: string;
    next: string;
    destinations: Record<string, {
      cities: string;
      tagline: string;
      description: string;
      category: string;
      duration: string;
      bestSeason: string;
      highlights: string[];
    }>;
  };
  destExplorer: {
    badge: string;
    title: string;
    subtitle: string;
    continents: {
      all: string;
      europe: string;
      asia: string;
      africa: string;
      northAmerica: string;
      southAmerica: string;
      oceania: string;
    };
    reviews: string;
    capital: string;
    bestTime: string;
    weather: string;
    budgetPerDay: string;
    exploreCountryBtn: string;
    savedToast: string;
    removedToast: string;
  };
  aiPlannerSection: {
    badge: string;
    title: string;
    subtitle: string;
    destLabel: string;
    durationLabel: string;
    budgetLabel: string;
    styleLabel: string;
    interestsLabel: string;
    days: string;
    estimated: string;
    recommendedStay: string;
    transitPass: string;
    bookItinerary: string;
    generateAi: string;
    styles: {
      culture: string;
      food: string;
      nature: string;
      coastal: string;
    };
    interestTags: {
      food: string;
      culture: string;
      nature: string;
      history: string;
      adventure: string;
      relaxation: string;
    };
  };
  why: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      itineraries: {
        title: string;
        desc: string;
      };
      recommendations: {
        title: string;
        desc: string;
      };
      destinationInfo: {
        title: string;
        desc: string;
      };
      savedDestinations: {
        title: string;
        desc: string;
      };
      tripManagement: {
        title: string;
        desc: string;
      };
      smartSearch: {
        title: string;
        desc: string;
      };
    };
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
  productPreview: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: {
      explore: string;
      myTrips: string;
      planner: string;
      country: string;
    };
    exploreTitle: string;
    exploreSub: string;
    trendingHub: string;
    topRated: string;
    culturalGem: string;
    myTripsTitle: string;
    confirmedVoyages: string;
    amalfiTrip: string;
    amalfiTripSub: string;
    vouchersReady: string;
    wizardTitle: string;
    step2of3: string;
    datesLabel: string;
    datesValue: string;
    budgetMax: string;
    styleValue: string;
    dossierTitle: string;
    visaFree90: string;
    capital: string;
    tashkent: string;
    currency: string;
    bestSeason: string;
    springAutumn: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
  demoModal: {
    badge: string;
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    tryPlannerBtn: string;
  };
  footer: {
    tagline: string;
    company: string;
    help: string;
    resources: string;
    download: string;
    about: string;
    blog: string;
    adminPanel: string;
    careers: string;
    faq: string;
    support: string;
    privacy: string;
    terms: string;
    ios: string;
    android: string;
    copyright: string;
    scrollToTop: string;
  };
  countryInfo: {
    selectCountry: string;
    selectCountryDesc: string;
    countryTelemetry: string;
    destinationsTab: string;
    capital: string;
    officialLanguage: string;
    currency: string;
    timezone: string;
    visaRegulations: string;
    weatherInfo: string;
    bestTimeToVisit: string;
    topAttractions: string;
    famousLocalFoods: string;
    createTrip: string;
    exploreDestinations: string;
    savedInVault: string;
    saveCountry: string;
    closePanel: string;
    averageBudget: string;
  };
  search: {
    placeholder: string;
    hint: string;
    noResults: string;
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
  appDownload: {
    title: string;
    subtitle: string;
  };
  auth: {
    email: string;
    password: string;
    forgotPassword: string;
    loading: string;
    signIn: string;
    signInGoogle: string;
    signInApple: string;
    orEmail: string;
    terms: string;
    privacy: string;
    welcome: string;
    subtitle: string;
    successLogin: string;
    successRegister: string;
    errorFields: string;
  };
    dashboard: {
      home: string;
      explore: string;
      planner: string;
      myTrips: string;
      tours: string;
      readyTrips: string;
      flights: string;
      hotels: string;
      attractions: string;
      saved: string;
      community: string;
      assistant: string;
      messages: string;
      profile: string;
      settings: string;
      language: string;
      currency: string;
      theme: string;
      myDestinations: string;
      interactiveHub: string;
      tapPins: string;
      instantGenerator: string;
      aiPlanner: string;
      aiPlannerPrompt: string;
      searchPlaceholder: string;
      exploreWorld: string;
      exploreWorldSubtitle: string;
      planWithAi: string;
      goPremium: string;
      upgrade: string;
      myTripsTitle: string;
      myTripsSubtitle: string;
      flightTitle: string;
      flightSubtitle: string;
      hotelTitle: string;
      hotelSubtitle: string;
      attractionTitle: string;
      attractionSubtitle: string;
      assistantTitle: string;
      assistantSubtitle: string;
      chatPlaceholder: string;
      settingsTitle: string;
      settingsSubtitle: string;
      popularDestinations: string;
      verifiedTelemetry: string;
      swipeToExplore: string;
    };
    country: {
      capital: string;
      population: string;
      language: string;
      currency: string;
      timezone: string;
      visa: string;
      weather: string;
      bestTime: string;
      avgBudget: string;
      attractions: string;
      foods: string;
      createTrip: string;
      planTrip: string;
      explore: string;
      save: string;
      saved: string;
      destinationsIn: string;
      swipeToExplore: string;
      eVisa: string;
      visaRequired: string;
      visaFree: string;
      seeAll: string;
      countries: {
        france: string;
        niger: string;
        uzbekistan: string;
        japan: string;
        italy: string;
        turkey: string;
        usa: string;
        uae: string;
        egypt: string;
        germany: string;
        brazil: string;
        uk: string;
      };
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
  en: {
    nav: {
      explore: 'Explore',
      destinations: 'Destinations',
      planner: 'AI Planner',
      howItWorks: 'How it works',
      trips: 'My Trips',
      about: 'About',
      faq: 'FAQ',
      login: 'Sign In',
      getStarted: 'Get started',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      dashboard: 'Traveler Dashboard',
      agencyPortal: 'Agency Portal',
      adminConsole: 'Admin Console',
      signOut: 'Sign Out',
    },
    hero: {
      badge: 'EXPLORE THE WORLD',
      headline: 'Your world. Your next story.',
      titleLine1: 'Your world.',
      titleLine2: 'Your next story.',
      subheadline: 'AI-powered journeys built around you.',
      subtitle: 'AI-powered journeys built around you.',
      startPlanning: 'Start exploring',
      startExploring: 'Start exploring',
      watchDemo: 'Watch how it works',
      exploreWorld: 'EXPLORE THE WORLD',
      searchPlaceholder: 'Search countries, cities, landmarks on Globe...',
      interactiveHubs: 'Interactive Hubs:',
    },
    stats: {
      countries: 'Countries',
      countriesDesc: 'Global verified travel destinations',
      destinations: 'Destinations',
      destinationsDesc: 'Boutique stays & curated sights',
      travelers: 'Travelers',
      travelersDesc: 'Empowered voyages worldwide',
      support: 'Customer Support',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: '24/7 Instant Help',
    },
    howItWorks: {
      badge: 'EFFORTLESS JOURNEY CRAFTING',
      title: 'How it works',
      subtitle: 'From your raw travel dreams to a verified minute-by-minute itinerary in three seamless steps.',
      step1Title: 'Tell us what you want.',
      step1Desc: 'Specify your destination, length of stay, exact budget, and vibe — from foodie hotspots to beach escapes.',
      step1PromptInput: 'PROMPT INPUT',
      step1VerifiedNlp: 'Verified Natural Language',
      step1SamplePrompt: '"7 days in France with $1,800 budget, love art & vineyards"',
      step1Tag1: '🎨 Art Museums',
      step1Tag2: '🍷 Wine Tasting',
      step1Tag3: '🚆 High Speed Rail',
      step2Title: 'TripMind builds your itinerary.',
      step2Desc: 'Our travel intelligence models craft daily plans, bookable hotel recommendations, transit routes, and cost projections.',
      step2Generating: 'GENERATING ITINERARY',
      step2Optimized: '100% Optimized',
      step2MockDay: 'Day 2: Louvre & Seine Sunset Cruise',
      step2MockDaySub: '10:00 AM • Skip-the-line pass included',
      step2MockHotel: 'Hotel Saint-Germain Boutique',
      step2MockHotelSub: '$135/night • 4.9 ★ verified',
      step3Title: 'Explore, save and travel.',
      step3Desc: 'Adjust any activity on the fly, export to mobile with offline sync, invite travel partners, and enjoy your journey.',
      step3SyncShare: 'SYNC & SHARE',
      step3LiveOffline: 'Live Offline Access',
      step3OfflineSynced: '✓ Offline Synced',
      step3AppleWallet: 'Apple Wallet & PDF',
      step3SharedTrip: '👥 Shared Trip',
      step3CoTravelers: '3 Co-travelers',
      step4Title: 'Book and plan',
      step4Desc: 'Manage flights, hotels, and detailed itineraries all in one place.',
      step5Title: 'Save your personal route',
      step5Desc: 'All your plans are securely saved in your personal account.',
      step6Title: 'Enjoy your journey',
      step6Desc: 'Embark on unforgettable adventures with TripMind.',
    },
    storytelling: {
      badge: 'EXPLORE THE WORLD',
      title: 'Explore destinations that stay with you.',
      estimatedBudget: 'Estimated Budget',
      perPerson: '/ person',
      exploreCountry: 'Explore {country}',
      curatedOdyssey: 'TripMind Curated Odyssey',
      prev: 'Previous destination',
      next: 'Next destination',
      destinations: {
        france: {
          cities: 'Paris · Nice · Bordeaux',
          tagline: 'Art, food and coastal elegance.',
          description: 'Wander through the golden halls of the Louvre, savor vintage Grand Crus among Bordeaux vineyards, and bask in the timeless azure glow of the French Riviera.',
          category: 'Art & Gastronomy',
          duration: '7–10 Days',
          bestSeason: 'May – October',
          highlights: ['Louvre Private Tour', 'Bordeaux Vineyard Tasting', 'Nice Promenade des Anglais']
        },
        japan: {
          cities: 'Tokyo · Kyoto · Mount Fuji',
          tagline: 'Tradition meets tomorrow.',
          description: 'Immerse yourself in neon-lit futuristic metropolises, tranquil moss-carpeted Shinto shrines, Shinkansen bullet train crossings, and Michelin-starred culinary artistry.',
          category: 'Culture & Modernity',
          duration: '9–14 Days',
          bestSeason: 'March – May, Oct – Nov',
          highlights: ['Shibuya Sky Observation', 'Kyoto Fushimi Inari Torii', 'Lake Kawaguchiko Fuji View']
        },
        morocco: {
          cities: 'Marrakech · Chefchaouen · Sahara',
          tagline: 'Vibrant spice medinas and starlit dunes.',
          description: 'Discover labyrinthine ancient spice souks, peaceful courtyard riads adorned with zellij tilework, and unforgettable desert camps under infinite Saharan starlight.',
          category: 'Desert & Heritage',
          duration: '6–9 Days',
          bestSeason: 'September – April',
          highlights: ['Jemaa el-Fnaa Night Market', 'Merzouga Sahara Stargazing', 'Chefchaouen Blue Alleys']
        },
        iceland: {
          cities: 'Reykjavik · Vik · Blue Lagoon',
          tagline: 'Nordic fire and ice odyssey.',
          description: 'Witness roaring glacial waterfalls, geothermal mineral springs, volcanic black sand shores, and the celestial dancing ribbons of the Aurora Borealis.',
          category: 'Adventure & Nature',
          duration: '5–8 Days',
          bestSeason: 'Year-round (Auroras Sep–Mar)',
          highlights: ['Geysir & Gullfoss Golden Circle', 'Reynisfjara Black Beach', 'Silfra Glacial Snorkeling']
        },
        italy: {
          cities: 'Amalfi Coast · Rome · Florence',
          tagline: 'Sun-drenched cliffs and timeless Renaissance.',
          description: 'Cruise along pastel Mediterranean coastal cliffs, walk among ancient Roman coliseums, and indulge in artisanal gelato and handmade pasta under olive groves.',
          category: 'Romance & Food',
          duration: '7–12 Days',
          bestSeason: 'April – October',
          highlights: ['Positano Cliffside Cruise', 'Vatican & Colosseum Walk', 'Tuscan Hilltown Wine Route']
        },
        uzbekistan: {
          cities: 'Samarkand · Bukhara · Khiva',
          tagline: 'Turquoise domes along the Silk Road.',
          description: 'Marvel at the majestic tiled madrasahs of Registan Square, explore thousand-year-old desert fortress cities, and experience legendary Silk Road hospitality.',
          category: 'Ancient Silk Road',
          duration: '6–10 Days',
          bestSeason: 'April – June, Sep – Nov',
          highlights: ['Registan Golden Hour Tour', 'Bukhara Ark Citadel', 'Khiva Ichan Kala Ancient City']
        }
      }
    },
    destExplorer: {
      badge: 'DESTINATION EXPLORER',
      title: 'Explore iconic destinations worldwide',
      subtitle: 'Interactive travel intelligence across six continents. Hover for 3D tilt, zoom in, and tap to unlock detailed verified guides.',
      continents: {
        all: 'All',
        europe: 'Europe',
        asia: 'Asia',
        africa: 'Africa',
        northAmerica: 'North America',
        southAmerica: 'South America',
        oceania: 'Oceania'
      },
      reviews: 'reviews',
      capital: 'Capital:',
      bestTime: 'Best Time',
      weather: 'Weather',
      budgetPerDay: '/ day',
      exploreCountryBtn: 'Explore Country',
      savedToast: 'Saved to your travel vault ❤️',
      removedToast: 'Removed from saved'
    },
    aiPlannerSection: {
      badge: 'AI TRAVEL ENGINE',
      title: 'Build your dream trip in seconds',
      subtitle: 'Choose a destination, adjust duration and budget, and let our travel intelligence generate your verified daily itinerary.',
      destLabel: '1. Select Destination',
      durationLabel: '2. Trip Duration',
      budgetLabel: '3. Target Budget',
      styleLabel: '4. Travel Style',
      interestsLabel: '5. Focus Interests',
      days: 'days',
      estimated: 'estimated',
      recommendedStay: 'Recommended Stay',
      transitPass: 'High-Speed Transit',
      bookItinerary: 'Customize & Book This Itinerary →',
      generateAi: 'Generate Full Itinerary with AI',
      styles: {
        culture: 'Culture & History',
        food: 'Food & Wine',
        nature: 'Nature & Adventure',
        coastal: 'Coastal & Leisure'
      },
      interestTags: {
        food: 'Food',
        culture: 'Culture',
        nature: 'Nature',
        history: 'History',
        adventure: 'Adventure',
        relaxation: 'Relaxation'
      }
    },
    why: {
      badge: 'Built For Modern Travelers',
      title: 'Why TripMind',
      subtitle: 'Everything you need for seamless travel, powered by precision intelligence and verified global data.',
      pillars: {
        itineraries: {
          title: 'AI-powered itineraries',
          desc: 'Tailored hour-by-hour schedules that automatically balance travel times, opening hours, weather forecasts, and pacing.'
        },
        recommendations: {
          title: 'Personalized recommendations',
          desc: 'Learns your unique travel preferences, dietary tastes, physical activity style, and exact budget comfort zones.'
        },
        destinationInfo: {
          title: 'Real destination information',
          desc: 'Live verified visa requirements, emergency contacts, local currencies, language essentials, and real-time transit status.'
        },
        savedDestinations: {
          title: 'Saved destinations',
          desc: 'Bookmark dream destinations, curate custom collections, and organize shared wishlists with your travel companions.'
        },
        tripManagement: {
          title: 'Trip management',
          desc: 'Keep all your flight boarding passes, hotel reservations, activity vouchers, and luggage lists organized in one synced hub.'
        },
        smartSearch: {
          title: 'Smart search',
          desc: 'Multi-modal natural language search that understands complex requests across flights, hotels, restaurants, and guided tours.'
        }
      },
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
      card8Desc: 'Your personal travel companion, helping you 24/7.'
    },
    productPreview: {
      badge: 'Live Platform Experience',
      title: 'Product preview',
      subtitle: 'Explore the powerful modules crafted to elevate every dimension of your journey.',
      tabs: {
        explore: 'Explore dashboard',
        myTrips: 'My Trips',
        planner: 'AI Planner',
        country: 'Country details'
      },
      exploreTitle: '🌍 Global Explore Feed',
      exploreSub: '195+ Countries Live',
      trendingHub: 'Trending Hub',
      topRated: 'Top Rated',
      culturalGem: 'Cultural Gem',
      myTripsTitle: '🧳 Active Upcoming Journeys',
      confirmedVoyages: '2 Confirmed Voyages',
      amalfiTrip: '7-Day Amalfi Coast & Capri Escape',
      amalfiTripSub: 'June 12 - June 19 • 2 Travelers • $1,380 spent',
      vouchersReady: '✓ Vouchers Ready',
      wizardTitle: '🤖 AI Journey Generator Wizard',
      step2of3: 'Step 2 of 3',
      datesLabel: 'DATES',
      datesValue: 'Oct 15 - Oct 22',
      budgetMax: '$1,500 Max',
      styleValue: 'Gastronomy + Beach',
      dossierTitle: '🇺🇿 Uzbekistan — Destination Dossier',
      visaFree90: 'Visa-Free for 90+ Countries',
      capital: 'Capital',
      tashkent: 'Tashkent',
      currency: 'Currency',
      bestSeason: 'Best Season',
      springAutumn: 'Spring & Autumn'
    },
    faq: {
      badge: 'Got Questions?',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about TripMind and how our AI travel engine powers your journeys.',
      items: [
        {
          q: 'How does TripMind work?',
          a: 'TripMind combines state-of-the-art AI travel models with verified real-world tourism databases. You simply describe your dream vacation, budget, dates, or travel style in plain language, and TripMind synthesizes a minute-by-minute itinerary, flight paths, hotels, and transport connections.'
        },
        {
          q: 'Can TripMind create a complete itinerary?',
          a: 'Yes! TripMind builds complete end-to-end itineraries covering morning, afternoon, and evening activities, meal recommendations, transit directions between locations, tickets, and estimated costs.'
        },
        {
          q: 'Can I set my budget?',
          a: 'Absolutely. You can set an exact budget limit in USD, EUR, or your local currency. TripMind distributes your budget across accommodations, transport, meals, and activities while alerting you to savings opportunities.'
        },
        {
          q: 'Can I save destinations?',
          a: 'Yes. With one click, you can save countries, cities, boutique hotels, and restaurant recommendations to your personal Saved Collections for later viewing or co-planning.'
        },
        {
          q: 'Can I change my trip later?',
          a: 'Yes. Every itinerary generated by TripMind is 100% customizable. You can drag and drop days, swap activities, adjust dates, or ask the AI assistant to re-optimize any portion of your journey.'
        },
        {
          q: 'Does TripMind use AI?',
          a: 'Yes. TripMind leverages advanced LLM architecture and neural routing algorithms to analyze millions of travel combinations, travel times, reviews, and seasonal patterns in seconds.'
        },
        {
          q: 'Can I use TripMind on mobile?',
          a: 'Yes! TripMind is fully mobile-responsive and functions seamlessly on iOS, Android, and tablets with offline sync for boarding passes and daily itineraries.'
        },
        {
          q: 'Which countries are supported?',
          a: 'TripMind supports 195+ sovereign countries worldwide, featuring in-depth travel intelligence, visa rules, curated sights, and cultural guidelines across Europe, Asia, the Americas, Africa, and Oceania.'
        }
      ]
    },
    cta: {
      title: 'The world is waiting.',
      subtitle: 'Where will you go next?',
      primaryButton: 'Start planning',
      secondaryButton: 'Create with AI'
    },
    demoModal: {
      badge: 'TripMind Interactive Walkthrough',
      title: 'How TripMind Crafts Your Journey',
      step1Title: 'Describe your dream trip',
      step1Desc: 'Type naturally: "10 days in Japan in spring, budget $2500, love culinary & temples".',
      step2Title: 'AI routes flights, stays & daily plans',
      step2Desc: 'Calculates optimal pacing, verified boutique hotels, opening hours and transit routes.',
      step3Title: '1-Click sync & offline access',
      step3Desc: 'Export directly to Apple Wallet or PDF, and share a live collaborate link with partners.',
      tryPlannerBtn: 'Try AI Planner Now →'
    },
    footer: {
      tagline: 'The smartest way to design and coordinate travel workflows in the modern era.',
      company: 'Company',
      help: 'Help Desk',
      resources: 'Resources',
      download: 'Download App',
      about: 'About Us',
      blog: 'Blog Articles',
      adminPanel: 'Admin panel',
      careers: 'Careers',
      faq: 'FAQs',
      support: 'Support Center',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      ios: 'App Store (iOS)',
      android: 'Play Store (Android)',
      copyright: 'All rights reserved.',
      scrollToTop: 'Scroll to Top'
    },
    countryInfo: {
      selectCountry: 'Select a Country',
      selectCountryDesc: 'Click on the 3D globe or search for any country to load verified travel telemetry and destinations.',
      countryTelemetry: 'Country Telemetry',
      destinationsTab: 'Destinations',
      capital: 'Capital',
      officialLanguage: 'Official Language',
      currency: 'Currency',
      timezone: 'Timezone',
      visaRegulations: 'Visa Regulations',
      weatherInfo: 'Weather Info',
      bestTimeToVisit: 'Best Time to Visit',
      topAttractions: 'Top Attractions',
      famousLocalFoods: 'Famous Local Foods',
      createTrip: 'Create Trip',
      exploreDestinations: 'Explore Destinations',
      savedInVault: 'Saved in vault',
      saveCountry: 'Save Country',
      closePanel: 'Close panel',
      averageBudget: 'Average Budget'
    },
    search: {
      placeholder: 'Search countries, cities, landmarks on Globe...',
      hint: 'Try searching: Paris, Japan, Samarkand, Italy, Dubai...',
      noResults: 'No destinations found',
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
      date: 'Date'
    },
    categories: {
      flights: 'Flight Tickets',
      hotels: 'Stays',
      restaurants: 'Dining',
      planner: 'AI Itinerary',
      assistant: 'AI Copilot',
      saved: 'Saved Places'
    },
    destinations: {
      title: 'Popular Global Destinations',
      seeAll: 'See all',
      from: 'from',
      rating: 'Rating'
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
      result: 'Your Custom Itinerary'
    },
    userStories: {
      title: 'How do travelers use it?',
      subtitle: 'Thousands of users are crafting their dream vacations with TripMind.',
      card1Title: 'Create an account',
      card1Desc: 'Register in a matter of seconds and build your custom profile.',
      card2Title: 'Generate Dream Trip',
      card2Desc: 'Get an exclusive custom itinerary tailored to you by our AI.',
      card3Title: 'Book and Travel',
      card3Desc: 'Manage flights, hotel details, and travel events in a single dashboard.'
    },
    appDownload: {
      title: 'Download the TripMind mobile app',
      subtitle: 'Manage your travel plans anywhere, use it offline, and receive real-time notifications.'
    },
    auth: {
      email: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      loading: 'Signing in...',
      signIn: 'Sign In',
      signInGoogle: 'Sign In with Google',
      signInApple: 'Sign In with Apple',
      orEmail: 'Or use your Email address',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      welcome: 'Welcome Back',
      subtitle: 'Unlock seamless custom travel workflows with TripMind.',
      successLogin: 'Successfully signed in!',
      successRegister: 'Account created successfully!',
      errorFields: 'Please check your inputs and try again.'
    },
    dashboard: {
      home: 'Home',
      explore: 'Explore',
      planner: 'AI Planner',
      myTrips: 'My Trips',
      tours: 'Tours',
      readyTrips: 'Ready Tours',
      flights: 'Flight Search',
      hotels: 'Hotel Search',
      attractions: 'Points of Interest',
      saved: 'Saved',
      community: 'Community',
      assistant: 'Messages',
      messages: 'Messages',
      profile: 'Profile',
      settings: 'Settings',
      language: 'Language',
      currency: 'Currency',
      theme: 'Theme',
      myDestinations: 'My Destinations',
      interactiveHub: 'Interactive 3D Earth Hub',
      tapPins: 'Tap pins to explore',
      instantGenerator: 'Instant Itinerary Generator',
      aiPlanner: 'AI Trip Planner',
      aiPlannerPrompt: 'Tell me where you want to go, your dates, budget and travel style.',
      searchPlaceholder: 'Search countries, cities, landmarks (e.g. Dubai, France, Burj Khalifa)...',
      exploreWorld: 'Explore the world',
      exploreWorldSubtitle: 'Discover countries, plan trips and get personalized AI recommendations.',
      planWithAi: 'Plan with AI',
      goPremium: 'Go Premium',
      upgrade: 'Upgrade Now',
      myTripsTitle: 'My Trips & Expeditions',
      myTripsSubtitle: 'Access and modify your planned journeys, offline passes, and custom itineraries.',
      flightTitle: 'Global Flights & Routes',
      flightSubtitle: 'Explore live routes, carrier details, and real-time flight estimates worldwide.',
      hotelTitle: 'Curated Hotels & Stays',
      hotelSubtitle: 'Boutique properties, luxury resorts, and verified accommodations for every destination.',
      attractionTitle: 'Points of Interest & Landmarks',
      attractionSubtitle: 'Discover must-see architectural wonders, cultural sites, and hidden local gems.',
      assistantTitle: 'TripMind AI Assistant',
      assistantSubtitle: 'Ask questions, optimize daily schedules, or generate custom travel recommendations.',
      chatPlaceholder: 'Ask anything about destinations, local customs, best seasons...',
      settingsTitle: 'Account & Preferences',
      settingsSubtitle: 'Manage your profile, preferred currencies, and regional settings.',
      popularDestinations: 'Popular Destinations',
      verifiedTelemetry: 'Verified Regional Telemetry',
      swipeToExplore: 'Swipe to explore',
    },
    country: {
      capital: 'Capital',
      population: 'Population',
      language: 'Language',
      currency: 'Currency',
      timezone: 'Timezone',
      visa: 'Visa Regulations',
      weather: 'Weather',
      bestTime: 'Best time',
      avgBudget: 'Avg budget',
      attractions: 'Top Attractions',
      foods: 'Famous Local Foods',
      createTrip: 'Create Trip',
      planTrip: 'Plan a trip',
      explore: 'Explore',
      save: 'Save',
      saved: 'Saved',
      destinationsIn: 'Destinations in',
      swipeToExplore: 'Swipe to explore',
      eVisa: 'e-Visa / On Arrival',
      visaRequired: 'Visa Required',
      visaFree: 'Visa Free Stays',
      seeAll: 'See all',
      countries: {
        france: 'France',
        niger: 'Niger',
        uzbekistan: 'Uzbekistan',
        japan: 'Japan',
        italy: 'Italy',
        turkey: 'Turkey',
        usa: 'USA',
        uae: 'UAE',
        egypt: 'Egypt',
        germany: 'Germany',
        brazil: 'Brazil',
        uk: 'UK'
      }
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
      learnMore: 'Learn more info'
    }
  },
  uz: {
    nav: {
      explore: 'Kashf etish',
      destinations: 'Yo‘nalishlar',
      planner: 'AI Planner',
      howItWorks: 'Qanday ishlaydi',
      trips: 'Sayohatlarim',
      about: 'Biz haqimizda',
      faq: 'FAQ',
      login: 'Kirish',
      getStarted: 'Boshlash',
      darkMode: 'Tungi rejim',
      lightMode: 'Kunduzgi rejim',
      dashboard: 'Sayohatchi paneli',
      agencyPortal: 'Agentlik portali',
      adminConsole: 'Admin konsoli',
      signOut: 'Chiqish',
    },
    hero: {
      badge: 'DUNYONI KASHF ETING',
      headline: 'Sizning olamingiz. Sizning navbatdagi hikoyangiz.',
      titleLine1: 'Sizning olamingiz.',
      titleLine2: 'Sizning navbatdagi hikoyangiz.',
      subheadline: 'Siz uchun maxsus yaratilgan sun’iy intellektli sayohatlar.',
      subtitle: 'Siz uchun maxsus yaratilgan sun’iy intellektli sayohatlar.',
      startPlanning: 'Kashf qilishni boshlang',
      startExploring: 'Kashf qilishni boshlang',
      watchDemo: 'Qanday ishlashini ko‘ring',
      exploreWorld: 'DUNYONI KASHF ETING',
      searchPlaceholder: 'Globusda davlatlar, shaharlar yoki obidalarni qidiring...',
      interactiveHubs: 'Interaktiv markazlar:',
    },
    stats: {
      countries: 'Mamlakatlar',
      countriesDesc: 'Tekshirilgan global sayohat yo‘nalishlari',
      destinations: 'Yo‘nalishlar',
      destinationsDesc: 'Eksklyuziv mehmonxonalar va maskanlar',
      travelers: 'Sayohatchilar',
      travelersDesc: 'Dunyo bo‘ylab unutilmas sayohatlar',
      support: 'Mijozlarni qo‘llab-quvvatlash',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: '24/7 yordam xizmati',
    },
    howItWorks: {
      badge: 'OSON VA TEZKOR SAYOHAT REJASI',
      title: 'Qanday ishlaydi',
      subtitle: 'Orzuingizdagi sayohatdan daqiqama-daqiqa tuzilgan aniq rejagacha — atigi uch oddiy qadamda.',
      step1Title: 'Istaklaringizni bildiring.',
      step1Desc: 'Yo‘nalish, muddat, aniq byudjet va sayohat uslubingizni ko‘rsating — taomlar lazzatidan sokin plyajlargacha.',
      step1PromptInput: 'SO‘ROV MATNI',
      step1VerifiedNlp: 'Tabiiy til tahlili',
      step1SamplePrompt: '"Fransiyada 7 kun $1,800 byudjet bilan, san’at va uzumzorlarni yoqtiraman"',
      step1Tag1: '🎨 San’at muzeylari',
      step1Tag2: '🍷 Vino tatish',
      step1Tag3: '🚆 Poyezd marshruti',
      step2Title: 'TripMind marshrutingizni tuzadi.',
      step2Desc: 'Sun’iy intellekt kunlik rejalar, tavsiya etilgan mehmonxonalar, transport marshrutlari va xarajatlar hisobini shakllantiradi.',
      step2Generating: 'MARSHRUT TUZILMOQDA',
      step2Optimized: '100% Optimallashtirilgan',
      step2MockDay: '2-kun: Luvr va Sena bo‘ylab kechki sayr',
      step2MockDaySub: '10:00 • Navbatsiz kirish chiptasi kiritilgan',
      step2MockHotel: 'Hotel Saint-Germain Boutique',
      step2MockHotelSub: 'Kechesi $135 • 4.9 ★ tasdiqlangan',
      step3Title: 'Kashf eting, saqlang va sayohat qiling.',
      step3Desc: 'Istalgan vaqtda marshrutni o‘zgartiring, oflayn rejimda telefonga yuklang, hamrohlarni taklif qiling va sayohatdan rohatlaning.',
      step3SyncShare: 'SINXRONLASH VA ULASHISH',
      step3LiveOffline: 'Oflayn kirish imkoniyati',
      step3OfflineSynced: '✓ Oflayn saqlandi',
      step3AppleWallet: 'Apple Wallet va PDF',
      step3SharedTrip: '👥 Birgalikdagi sayohat',
      step3CoTravelers: '3 nafar hamroh',
      step4Title: 'Bron qiling va rejalashtiring',
      step4Desc: 'Parvozlar, mehmonxonalar va marshrutlarni bir joydan boshqaring.',
      step5Title: 'Shaxsiy marshrutingizni saqlang',
      step5Desc: 'Barcha rejalaringiz akkauntingizda xavfsiz saqlanadi.',
      step6Title: 'Sayohatdan zavqlaning',
      step6Desc: 'TripMind bilan unutilmas sarguzashtlarni boshlang.',
    },
    storytelling: {
      badge: 'DUNYONI KASHF ETING',
      title: 'Xotirangizda mangu qoladigan yo‘nalishlar.',
      estimatedBudget: 'Taxminiy byudjet',
      perPerson: '/ kishi boshiga',
      exploreCountry: '{country}ni kashf eting',
      curatedOdyssey: 'TripMind saralangan sayohati',
      prev: 'Oldingi yo‘nalish',
      next: 'Keyingi yo‘nalish',
      destinations: {
        france: {
          cities: 'Parij · Nissa · Bordo',
          tagline: 'San’at, nafis taomlar va sohil chiroyi.',
          description: 'Luvrning oltin zallarini kezing, Bordo uzumzorlarida elita vinolarini tatib ko‘ring va Fransuz Rivyerasining moviy jozibasidan bahramand bo‘ling.',
          category: 'San’at va Gastronomiya',
          duration: '7–10 Kun',
          bestSeason: 'May – Oktabr',
          highlights: ['Luvr shaxsiy ekskursiyasi', 'Bordo vino degustatsiyasi', 'Nissa Angliya qirg‘og‘i']
        },
        japan: {
          cities: 'Tokio · Kioto · Fuji tog‘i',
          tagline: 'Qadimiy an’analar va kelajak texnologiyasi.',
          description: 'Neon chiroqlarga to‘la osmono‘par shaharlar, sokin Shinto ibodatxonalari, Shinkansen tezyurar poyezdlari va Mishelin darajasidagi taomlar.',
          category: 'Madaniyat va Zamonaviylik',
          duration: '9–14 Kun',
          bestSeason: 'Mart – May, Okt – Noy',
          highlights: ['Shibuya Sky panoramasi', 'Kioto Fushimi Inari', 'Kavaguchiko ko‘li va Fuji']
        },
        morocco: {
          cities: 'Marrakesh · Shefshauen · Saxroi Kabir',
          tagline: 'Ziravorlar bozori va yulduzli qumtepalar.',
          description: 'Qadimiy madinalar, zellij naqshli sokin riadlar va Sahroyi Kabir osmoni ostidagi unutilmas chodir lagerlari.',
          category: 'Sahro va Madaniy Meros',
          duration: '6–9 Kun',
          bestSeason: 'Sentabr – Aprel',
          highlights: ['Jemaa el-Fnaa tungi bozori', 'Merzuga yulduzlar kechasi', 'Shefshauen moviy ko‘chalari']
        },
        iceland: {
          cities: 'Reykyavik · Vik · Moviy Laguna',
          tagline: 'Olov va muz mamlakatiga sayohat.',
          description: 'Hayqiriqli muzlik sharsharalari, issiq geotermal buloqlar, qora vulqon qumlari va sehrli Shimol yog‘dusi raqsi.',
          category: 'Sarguzasht va Tabiat',
          duration: '5–8 Kun',
          bestSeason: 'Yil davomida (Yog‘du Sen–Mar)',
          highlights: ['Oltin Halqa va Geyzerlar', 'Reynisfjara qora sohili', 'Silfra muzlik sho‘ng‘ishi']
        },
        italy: {
          cities: 'Amalfi sohili · Rim · Florensiya',
          tagline: 'Quyoshli qoyalar va Uyg‘onish davri sehri.',
          description: 'O‘rta yer dengizining rang-barang qoyalari bo‘ylab suzing, Rim kolizeyini kezing va zaytun bog‘larida qo‘lda tayyorlangan pastadan bahra oling.',
          category: 'Romantika va Oshxona',
          duration: '7–12 Kun',
          bestSeason: 'Aprel – Oktabr',
          highlights: ['Pozitano qayiq sayri', 'Vatikan va Kolizey', 'Toskana vino vodiylari']
        },
        uzbekistan: {
          cities: 'Samarqand · Buxoro · Xiva',
          tagline: 'Buyuk Ipak yo‘lidagi feruza gumbazlar.',
          description: 'Registon maydonining naqshinkor madrasalari, ming yillik sahro qal’alari va Ipak yo‘lining afsonaviy mehmondo‘stligi.',
          category: 'Qadimiy Ipak Yo‘li',
          duration: '6–10 Kun',
          bestSeason: 'Aprel – Iyun, Sen – Noy',
          highlights: ['Registon Oltin soat sayohati', 'Buxoro Ark qal’asi', 'Xiva Ichan Qal’a qadim shahri']
        }
      }
    },
    destExplorer: {
      badge: 'YO‘NALISHLAR GIDI',
      title: 'Dunyoning mashhur maskanlarini o‘rganing',
      subtitle: 'Olti qit’a bo‘ylab interaktiv sayohat ma’lumotlari. 3D kartalarni aylantiring va tasdiqlangan yo‘riqnomalarni oching.',
      continents: {
        all: 'Barchasi',
        europe: 'Yevropa',
        asia: 'Osiyo',
        africa: 'Afrika',
        northAmerica: 'Shimoliy Amerika',
        southAmerica: 'Janubiy Amerika',
        oceania: 'Okeaniya'
      },
      reviews: 'sharhlar',
      capital: 'Poytaxt:',
      bestTime: 'Eng yaxshi vaqt',
      weather: 'Ob-havo',
      budgetPerDay: '/ kuniga',
      exploreCountryBtn: 'Mamlakatni ko‘rish',
      savedToast: 'Sayohatlar xazinasiga saqlandi ❤️',
      removedToast: 'Saqlanganlardan o‘chirildi'
    },
    aiPlannerSection: {
      badge: 'AI SAYOHAT MOTOR',
      title: 'Orzuingizdagi sayohatni soniyalarda yarating',
      subtitle: 'Manzilni tanlang, muddat va byudjetni belgilang — sun’iy intellekt sizga kunlik to‘liq marshrutni tuzib beradi.',
      destLabel: '1. Yo‘nalishni tanlang',
      durationLabel: '2. Sayohat muddati',
      budgetLabel: '3. Rejalashtirilgan byudjet',
      styleLabel: '4. Sayohat uslubi',
      interestsLabel: '5. Qiziqishlar',
      days: 'kun',
      estimated: 'taxminiy',
      recommendedStay: 'Tavsiya etilgan turar joy',
      transitPass: 'Tezkor transport',
      bookItinerary: 'Marshrutni moslash va bron qilish →',
      generateAi: 'AI bilan to‘liq marshrut tuzish',
      styles: {
        culture: 'Madaniyat va tarix',
        food: 'Gastronomiya va taomlar',
        nature: 'Tabiat va sarguzasht',
        coastal: 'Sohil va dam olish'
      },
      interestTags: {
        food: 'Taomlar',
        culture: 'Madaniyat',
        nature: 'Tabiat',
        history: 'Tarix',
        adventure: 'Sarguzasht',
        relaxation: 'Hordiq'
      }
    },
    why: {
      badge: 'ZAMONAVIY SAYOHATCHILAR UCHUN',
      title: 'Nima uchun aynan TripMind?',
      subtitle: 'Mukammal sayohat uchun kerak bo‘lgan barcha vositalar — aqlli tizim va tasdiqlangan global ma’lumotlar asosida.',
      pillars: {
        itineraries: {
          title: 'AI asosidagi marshrutlar',
          desc: 'Yo‘l vaqti, ish soatlari, ob-havo va dam olish me’yorini hisobga olgan soatma-soat shaxsiy jadval.'
        },
        recommendations: {
          title: 'Shaxsiy tavsiyalar',
          desc: 'Sizning didingiz, taom afzalliklaringiz, faollik darajangiz va byudjet chegaralaringizga moslashadi.'
        },
        destinationInfo: {
          title: 'Aniq yo‘nalish ma’lumotlari',
          desc: 'Viza talablari, favqulodda raqamlar, valyuta, til qoidalari va transport holati doimiy yangilanib turadi.'
        },
        savedDestinations: {
          title: 'Saqlangan yo‘nalishlar',
          desc: 'Orzudagi maskanlarni saqlang, shaxsiy to‘plamlar tuzing va hamrohlaringiz bilan ulashing.'
        },
        tripManagement: {
          title: 'Sayohatni boshqarish',
          desc: 'Aviachiptalar, mehmonxona bronlari, vaucherlar va yuk ro‘yxatini bitta qulay joyda saqlang.'
        },
        smartSearch: {
          title: 'Aqlli qidiruv',
          desc: 'Parvozlar, mehmonxonalar, restoranlar va turlar bo‘yicha murakkab so‘rovlarni tushunadigan tabiiy qidiruv.'
        }
      },
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
      card8Desc: '24/7 rejimda sizga yordam beradi.'
    },
    productPreview: {
      badge: 'PLATFORMA IMKONIYATLARI',
      title: 'Mahsulot ko‘rinishi',
      subtitle: 'Sayohatning har bir bosqichini osonlashtirish uchun yaratilgan kuchli vositalarni o‘rganing.',
      tabs: {
        explore: 'Kashfiyot paneli',
        myTrips: 'Sayohatlarim',
        planner: 'AI Planner',
        country: 'Mamlakat ma’lumotlari'
      },
      exploreTitle: '🌍 Global kashfiyot lentasi',
      exploreSub: '195+ mamlakat mavjud',
      trendingHub: 'Ommabop markaz',
      topRated: 'Yuqori baholangan',
      culturalGem: 'Madaniy meros',
      myTripsTitle: '🧳 Kutilayotgan faol sayohatlar',
      confirmedVoyages: '2 ta tasdiqlangan sayohat',
      amalfiTrip: 'Amalfi sohili va Kaprida 7 kunlik dam olish',
      amalfiTripSub: '12-19 iyun • 2 nafar sayohatchi • $1,380 sarflandi',
      vouchersReady: '✓ Vaucherlar tayyor',
      wizardTitle: '🤖 AI Sayohat yaratuvchi ustasi',
      step2of3: '2/3 qadam',
      datesLabel: 'SANALAR',
      datesValue: '15 - 22 oktabr',
      budgetMax: 'Maks. $1,500',
      styleValue: 'Gastronomiya + Plyaj',
      dossierTitle: '🇺🇿 O‘zbekiston — Mamlakat dosyesi',
      visaFree90: '90+ davlat uchun vizasiz',
      capital: 'Poytaxt',
      tashkent: 'Toshkent',
      currency: 'Valyuta',
      bestSeason: 'Eng yaxshi mavsum',
      springAutumn: 'Bahor va Kuz'
    },
    faq: {
      badge: 'SAVOLLARINGIZ BORMI?',
      title: 'Ko‘p beriladigan savollar',
      subtitle: 'TripMind platformasi va uning sun’iy intellekt tizimi haqida barcha muhim ma’lumotlar.',
      items: [
        {
          q: 'TripMind qanday ishlaydi?',
          a: 'TripMind ilg‘or sun’iy intellekt sayohat modellari va tasdiqlangan global turizm ma’lumotlar bazasini birlashtiradi. Siz orzuingizdagi ta’til, byudjet, sanalar yoki sayohat uslubingizni erkin tilda yozasiz, tizim esa daqiqama-daqiqa marshrut, parvozlar, mehmonxonalar va transport yo‘llarini shakllantiradi.'
        },
        {
          q: 'TripMind to‘liq tayyor sayohat rejasini tuza oladimi?',
          a: 'Ha! TripMind ertalabki, kunduzgi va kechki mashg‘ulotlar, milliy taomlar restorani tavsiyalari, manzillar orasidagi transport yo‘nalishlari va kutilayotgan xarajatlarni to‘liq qamrab oladi.'
        },
        {
          q: 'O‘z byudjetimni belgilashim mumkinmi?',
          a: 'Albatta. Siz USD, EUR yoki mahalliy valyutada aniq byudjet miqdorini kiritishingiz mumkin. TripMind mablag‘ingizni turar joy, transport, ovqatlanish va ko‘ngilochar tadbirlar bo‘yicha oqilona taqsimlaydi.'
        },
        {
          q: 'Yoqqan joylarni saqlab qo‘yish mumkinmi?',
          a: 'Ha. Birgina tugma orqali mamlakatlar, shaharlar, mehmonxonalar va qiziqarli joylarni shaxsiy Saqlanganlar ro‘yxatiga kiritishingiz va hamrohlaringiz bilan birgalikda rejalashtirishingiz mumkin.'
        },
        {
          q: 'Keyinchalik sayohat rejasini o‘zgartira olamanmi?',
          a: 'Ha. TripMind yaratgan har bir marshrut 100% tahrirlanadi. Kunlar tartibini o‘zgartirishingiz, mashg‘ulotlarni almashtirishingiz yoki AI yordamchisidan marshrutni qayta optimallashtirishni so‘rashingiz mumkin.'
        },
        {
          q: 'TripMind haqiqatan ham sun’iy intellektdan foydalanadimi?',
          a: 'Ha. TripMind zamonaviy LLM arxitekturasi va neyron algoritmlari yordamida millionlab sayohat variantlari, real sharhlar va mavsumiy ko‘rsatkichlarni bir necha soniyada tahlil qiladi.'
        },
        {
          q: 'TripMind mobil telefonda ishlaydimi?',
          a: 'Ha! TripMind iOS, Android va planshetlarda to‘liq moslashuvchan ishlaydi hamda chiptalar va marshrutlarni oflayn rejimda ko‘rish imkoniyatiga ega.'
        },
        {
          q: 'Qaysi mamlakatlar qo‘llab-quvvatlanadi?',
          a: 'TripMind dunyoning 190 dan ortiq suveren davlatlarini qo‘llab-quvvatlaydi va viza qoidalari, diqqatga sazovor joylar hamda madaniy xususiyatlarni taqdim etadi.'
        }
      ]
    },
    cta: {
      title: 'Dunyo sizni kutmoqda.',
      subtitle: 'Navbatdagi manzilingiz qayer?',
      primaryButton: 'Rejalashtirishni boshlash',
      secondaryButton: 'AI bilan yaratish'
    },
    demoModal: {
      badge: 'TripMind interaktiv tanishtiruvi',
      title: 'TripMind sayohatingizni qanday yaratadi',
      step1Title: 'Orzuingizdagi sayohatni tasvirlang',
      step1Desc: 'Erkin yozing: "Bahorda Yaponiyada 10 kun, byudjet $2500, taomlar va ibodatxonalarni yoqtiraman".',
      step2Title: 'AI reyslar, mehmonxonalar va kunlik rejalarni tuzadi',
      step2Desc: 'Eng ma’qul marshrut, tasdiqlangan mehmonxonalar, ish soatlari va transport yo‘llarini hisoblaydi.',
      step3Title: '1 tugma bilan sinxronlash va oflayn kirish',
      step3Desc: 'To‘g‘ridan-to‘g‘ri Apple Wallet yoki PDF ga eksport qiling va hamrohlaringiz bilan birga boshqaring.',
      tryPlannerBtn: 'AI Plannerni sinab ko‘rish →'
    },
    footer: {
      tagline: 'Zamonaviy davrda sayohatlarni rejalashtirishning eng aqlli va qulay usuli.',
      company: 'Kompaniya',
      help: 'Yordam',
      resources: 'Manbalar',
      download: 'Yuklab olish',
      about: 'Biz haqimizda',
      blog: 'Blog maqolalari',
      adminPanel: 'Admin paneli',
      careers: 'Karyera',
      faq: 'Ko‘p beriladigan savollar',
      support: 'Qo‘llab-quvvatlash',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      ios: 'App Store (iOS)',
      android: 'Google Play (Android)',
      copyright: 'Barcha huquqlar himoyalangan.',
      scrollToTop: 'Yuqoriga qaytish'
    },
    countryInfo: {
      selectCountry: 'Mamlakatni tanlang',
      selectCountryDesc: 'Globus ustiga bosing yoki istalgan mamlakatni qidirib ma’lumotlarni ko‘ring.',
      countryTelemetry: 'Mamlakat ma’lumotlari',
      destinationsTab: 'Manzillar',
      capital: 'Poytaxt',
      officialLanguage: 'Davlat tili',
      currency: 'Valyuta',
      timezone: 'Vaqt mintaqasi',
      visaRegulations: 'Viza tartibi',
      weatherInfo: 'Ob-havo',
      bestTimeToVisit: 'Tashrif uchun eng yaxshi vaqt',
      topAttractions: 'Asosiy diqqatga sazovor joylar',
      famousLocalFoods: 'Mashhur milliy taomlar',
      createTrip: 'Sayohat yaratish',
      exploreDestinations: 'Manzillarni ko‘rish',
      savedInVault: 'Xazinada saqlandi',
      saveCountry: 'Mamlakatni saqlash',
      closePanel: 'Yopish',
      averageBudget: 'O‘rtacha byudjet'
    },
    search: {
      placeholder: 'Globusda davlatlar, shaharlar yoki obidalarni qidiring...',
      hint: 'Qidirib ko‘ring: Parij, Yaponiya, Samarqand, Italiya, Dubay...',
      noResults: 'Hech qanday manzil topilmadi',
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
      date: 'Sana'
    },
    categories: {
      flights: 'Aviachiptalar',
      hotels: 'Turar joylar',
      restaurants: 'Oshxonalar',
      planner: 'AI Rejalashtiruvchi',
      assistant: 'AI Yordamchi',
      saved: 'Saqlanganlar'
    },
    destinations: {
      title: 'Mashhur global yo‘nalishlar',
      seeAll: 'Barchasini ko‘rish',
      from: 'dan boshlab',
      rating: 'Reyting'
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
      result: 'Siz uchun tayyorlangan marshrut'
    },
    userStories: {
      title: 'Sayohatchilar qanday foydalanadi?',
      subtitle: 'TripMind bilan minglab foydalanuvchilar o\'z orzularidagi sayohatni yaratmoqda.',
      card1Title: 'Akkaunt yarating',
      card1Desc: 'Bir necha soniyada ro\'yxatdan o\'ting va shaxsiy profilingizni yarating.',
      card2Title: 'Dream Trip yarating',
      card2Desc: 'AI yordamida sizga mos eksklyuziv sayohat rejasini oling.',
      card3Title: 'Bron qiling va sayohat qiling',
      card3Desc: 'Parvoz, mehmonxona va marshrutni bir joydan boshqaring.'
    },
    appDownload: {
      title: 'TripMind mobil ilovasini yuklab oling',
      subtitle: 'Sayohat rejalaringizni istalgan joyda boshqaring, offline foydalaning va real vaqt bildirishnomalarini qabul qiling.'
    },
    auth: {
      email: 'Elektron pochta manzili',
      password: 'Parol',
      forgotPassword: 'Parolni unutdingizmi?',
      loading: 'Kirilmoqda...',
      signIn: 'Kirish',
      signInGoogle: 'Google orqali kirish',
      signInApple: 'Apple orqali kirish',
      orEmail: 'Yoki elektron pochta orqali',
      terms: 'Foydalanish shartlari',
      privacy: 'Maxfiylik siyosati',
      welcome: 'Xush kelibsiz',
      subtitle: 'TripMind orqali dunyo sayohatlarini osonlashtiring.',
      successLogin: 'Tizimga muvaffaqiyatli kirildi!',
      successRegister: 'Akkaunt muvaffaqiyatli yaratildi!',
      errorFields: 'Iltimos, ma’lumotlarni tekshiring va qayta urinib ko‘ring.'
    },
    dashboard: {
      home: 'Bosh sahifa',
      explore: 'Kashf etish',
      planner: 'AI Planner',
      myTrips: 'Sayohatlarim',
      tours: 'Tayyor turlar',
      readyTrips: 'Tayyor turlar',
      flights: 'Aviachiptalar',
      hotels: 'Mehmonxonalar',
      attractions: 'Diqqatga sazovor joylar',
      saved: 'Saqlanganlar',
      community: 'Hamjamiyat',
      assistant: 'Xabarlar',
      messages: 'Xabarlar',
      profile: 'Profilim',
      settings: 'Sozlamalar',
      language: 'Til',
      currency: 'Valyuta',
      theme: 'Mavzu',
      myDestinations: 'Mening yo‘nalishlarim',
      interactiveHub: 'Interaktiv 3D Yer markazi',
      tapPins: 'O‘rganish uchun belgilarni bosing',
      instantGenerator: 'Tezkor marshrut yaratuvchi',
      aiPlanner: 'AI Sayohat Rejalashtiruvchisi',
      aiPlannerPrompt: 'Qayerga bormoqchisiz, sanalar, byudjet va sayohat uslubingizni ayting.',
      searchPlaceholder: 'Mamlakatlar, shaharlar va diqqatga sazovor joylarni qidiring...',
      exploreWorld: 'Dunyoni kashf eting',
      exploreWorldSubtitle: 'Mamlakatlarni kashf eting, sayohatlarni rejalashtiring va moslashtirilgan AI tavsiyalarini oling.',
      planWithAi: 'AI bilan rejalashtirish',
      goPremium: 'Premiumga o‘tish',
      upgrade: 'Hozir yangilash',
      myTripsTitle: 'Mening Sayohatlarim',
      myTripsSubtitle: 'Rejalashtirilgan marshrutlar, chiptalar va sayohat rejalaringizni boshqaring.',
      flightTitle: 'Global Parvozlar va Yo‘nalishlar',
      flightSubtitle: 'To‘g‘ridan-to‘g‘ri parvozlar, aviakompaniyalar va narxlarni real vaqtda ko‘ring.',
      hotelTitle: 'Saralangan Mehmonxonalar',
      hotelSubtitle: 'Har bir manzil uchun qulay butik mehmonxonalar va dam olish maskanlari.',
      attractionTitle: 'Diqqatga Sazovor Joylar va Obidalar',
      attractionSubtitle: 'Mashhur tarixiy obidalar, muzeylar va go‘zal go‘shalarni kashf eting.',
      assistantTitle: 'TripMind AI Sayohat Yordamchisi',
      assistantSubtitle: 'Savollar bering, kunlik rejalarni optimallashtiring yoki maxsus tavsiyalar oling.',
      chatPlaceholder: 'Manzillar, mahalliy an’analar, mavsumlar haqida istalgan narsani so‘rang...',
      settingsTitle: 'Hisob va Qulaylik Sozlamalari',
      settingsSubtitle: 'Profilingiz, qulay valyuta va mintaqaviy sozlamalarni boshqaring.',
      popularDestinations: 'Ommabop yo‘nalishlar',
      verifiedTelemetry: 'Tekshirilgan mintaqaviy ma’lumotlar',
      swipeToExplore: 'Ko‘rish uchun suring',
    },
    country: {
      capital: 'Poytaxt',
      population: 'Aholi',
      language: 'Rasmiy til',
      currency: 'Valyuta',
      timezone: 'Vaqt zonasi',
      visa: 'Viza tartibi',
      weather: 'Ob-havo',
      bestTime: 'Sayohat uchun eng yaxshi vaqt',
      avgBudget: 'O‘rtacha byudjet',
      attractions: 'Diqqatga sazovor joylar',
      foods: 'Mashhur taomlar',
      createTrip: 'Sayohat yaratish',
      planTrip: 'Sayohatni rejalashtirish',
      explore: 'Kashf etish',
      save: 'Saqlash',
      saved: 'Saqlangan',
      destinationsIn: 'Yo‘nalishlar:',
      swipeToExplore: 'Ko‘rish uchun suring',
      eVisa: 'Elektron viza / Borishda viza',
      visaRequired: 'Viza talab etiladi',
      visaFree: 'Vizashiz rejim',
      seeAll: 'Barchasini ko‘rish',
      countries: {
        france: 'Fransiya',
        niger: 'Niger',
        uzbekistan: 'O‘zbekiston',
        japan: 'Yaponiya',
        italy: 'Italiya',
        turkey: 'Turkiya',
        usa: 'AQSH',
        uae: 'BAA',
        egypt: 'Misr',
        germany: 'Germaniya',
        brazil: 'Braziliya',
        uk: 'Buyuk Britaniya'
      }
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
      learnMore: 'Batafsil ma’lumot'
    }
  },
  ru: {
    nav: {
      explore: 'Исследовать',
      destinations: 'Направления',
      planner: 'ИИ-Планировщик',
      howItWorks: 'Как это работает',
      trips: 'Мои поездки',
      about: 'О сервисе',
      faq: 'Частые вопросы',
      login: 'Войти',
      getStarted: 'Начать',
      darkMode: 'Темная тема',
      lightMode: 'Светлая тема',
      dashboard: 'Панель путешественника',
      agencyPortal: 'Портал агентств',
      adminConsole: 'Консоль админа',
      signOut: 'Выйти',
    },
    hero: {
      badge: 'ИССЛЕДУЙТЕ МИР',
      headline: 'Ваш мир. Ваша новая история.',
      titleLine1: 'Ваш мир.',
      titleLine2: 'Ваша новая история.',
      subheadline: 'Путешествия на базе ИИ, созданные специально для вас.',
      subtitle: 'Путешествия на базе ИИ, созданные специально для вас.',
      startPlanning: 'Начать исследование',
      startExploring: 'Начать исследование',
      watchDemo: 'Посмотреть как работает',
      exploreWorld: 'ИССЛЕДУЙТЕ МИР',
      searchPlaceholder: 'Поиск стран, городов и мест на глобусе...',
      interactiveHubs: 'Интерактивные центры:',
    },
    stats: {
      countries: 'Стран',
      countriesDesc: 'Проверенных туристических направлений',
      destinations: 'Локаций',
      destinationsDesc: 'Бутик-отели и избранные места',
      travelers: 'Путешественников',
      travelersDesc: 'Вдохновленных поездок по всему миру',
      support: 'Служба поддержки',
      countriesNum: '190+',
      destinationsNum: '2,500+',
      travelersNum: '150K+',
      supportText: 'Помощь 24/7',
    },
    howItWorks: {
      badge: 'БЕЗУПРЕЧНОЕ ПЛАНИРОВАНИЕ',
      title: 'Как это работает',
      subtitle: 'От мечты о поездке до проверенного поминутного маршрута всего за три простых шага.',
      step1Title: 'Опишите ваши пожелания.',
      step1Desc: 'Укажите направление, длительность, бюджет и формат — от гастротуров до пляжного отдыха.',
      step1PromptInput: 'ВВОД ЗАПРОСА',
      step1VerifiedNlp: 'Распознавание естественного языка',
      step1SamplePrompt: '"7 дней во Франции с бюджетом $1,800, люблю искусство и виноградники"',
      step1Tag1: '🎨 Музеи искусств',
      step1Tag2: '🍷 Дегустация вин',
      step1Tag3: '🚆 Скоростные поезда',
      step2Title: 'TripMind строит ваш маршрут.',
      step2Desc: 'Модели ИИ создают планы по дням, подбирают отели, логистику и рассчитывают расходы.',
      step2Generating: 'ГЕНЕРАЦИЯ МАРШРУТА',
      step2Optimized: '100% Оптимизировано',
      step2MockDay: 'День 2: Лувр и круиз по Сене на закате',
      step2MockDaySub: '10:00 • Билет без очереди включен',
      step2MockHotel: 'Отель Saint-Germain Boutique',
      step2MockHotelSub: '$135/ночь • 4.9 ★ проверено',
      step3Title: 'Исследуйте, сохраняйте и путешествуйте.',
      step3Desc: 'Меняйте активности на лету, сохраняйте офлайн на телефон, приглашайте друзей и наслаждайтесь поездкой.',
      step3SyncShare: 'СИНХРОНИЗАЦИЯ И ДОСТУП',
      step3LiveOffline: 'Офлайн-доступ',
      step3OfflineSynced: '✓ Офлайн синхронизировано',
      step3AppleWallet: 'Apple Wallet и PDF',
      step3SharedTrip: '👥 Совместная поездка',
      step3CoTravelers: '3 попутчика',
      step4Title: 'Бронируйте и планируйте',
      step4Desc: 'Управляйте рейсами, отелями и маршрутами в одном удобном месте.',
      step5Title: 'Сохраняйте личные маршруты',
      step5Desc: 'Все ваши планы и поездки будут надежно сохранены в вашем профиле.',
      step6Title: 'Наслаждайтесь путешествием',
      step6Desc: 'Начните свое незабываемое приключение вместе с TripMind.',
    },
    storytelling: {
      badge: 'ИССЛЕДУЙТЕ МИР',
      title: 'Направления, которые остаются в сердце.',
      estimatedBudget: 'Ориентировочный бюджет',
      perPerson: '/ на человека',
      exploreCountry: 'Исследовать {country}',
      curatedOdyssey: 'Избранное путешествие TripMind',
      prev: 'Предыдущее направление',
      next: 'Следующее направление',
      destinations: {
        france: {
          cities: 'Париж · Ницца · Бордо',
          tagline: 'Искусство, высокая кухня и лазурный берег.',
          description: 'Прогуляйтесь по залам Лувра, продегустируйте винтажные вина в Бордо и насладитесь лазурным сиянием Французской Ривьеры.',
          category: 'Искусство и Гастрономия',
          duration: '7–10 Дней',
          bestSeason: 'Май – Октябрь',
          highlights: ['Приватный тур по Лувру', 'Дегустация вин в Бордо', 'Английская набережная в Ницце']
        },
        japan: {
          cities: 'Токио · Киото · Гора Фудзи',
          tagline: 'Традиции встречают будущее.',
          description: 'Погрузитесь в футуристические неоновые мегаполисы, тихие синтоистские святилища, поездки на Синкансэне и мишленовские кулинарные шедевры.',
          category: 'Культура и Будущее',
          duration: '9–14 Дней',
          bestSeason: 'Март – Май, Окт – Ноя',
          highlights: ['Смотровая площадка Shibuya Sky', 'Храм Фусими Инари в Киото', 'Вид на Фудзи с озера Кавагутико']
        },
        morocco: {
          cities: 'Марракеш · Шефшауэн · Сахара',
          tagline: 'Ароматные медины и песчаные дюны.',
          description: 'Исследуйте древние восточные базары, уютные риады с мозаикой и проведите волшебную ночь в пустыне под бескрайним звездным небом Сахары.',
          category: 'Пустыня и Наследие',
          duration: '6–9 Дней',
          bestSeason: 'Сентябрь – Апрель',
          highlights: ['Ночной рынок Джемаа аль-Фна', 'Звезды над Сахарой в Мерзуге', 'Синие улочки Шефшауэна']
        },
        iceland: {
          cities: 'Рейкьявик · Вик · Голубая Лагуна',
          tagline: 'Одиссея льда и вулканического огня.',
          description: 'Увидьте грандиозные ледниковые водопады, геотермальные источники, пляжи с черным вулканическим песком и завораживающее Северное сияние.',
          category: 'Приключения и Природа',
          duration: '5–8 Дней',
          bestSeason: 'Круглый год (Сияние Сен–Мар)',
          highlights: ['Золотое кольцо и гейзеры', 'Черный пляж Рейнисфьяра', 'Сноркелинг в разломе Сильфра']
        },
        italy: {
          cities: 'Амальфи · Рим · Флоренция',
          tagline: 'Солнечные скалы и вечный Ренессанс.',
          description: 'Прокатитесь вдоль пастельных средиземноморских утесов, прикоснитесь к древней истории Рима и насладитесь настоящей пастой в оливковых садах.',
          category: 'Романтика и Вкус',
          duration: '7–12 Дней',
          bestSeason: 'Апрель – Октябрь',
          highlights: ['Круиз вдоль скал Позитано', 'Ватикан и Колизей', 'Винные холмы Тосканы']
        },
        uzbekistan: {
          cities: 'Самарканд · Бухара · Хива',
          tagline: 'Бирюзовые купола Великого Шелкового пути.',
          description: 'Восхититесь мозаичными медресе площади Регистан, исследуйте тысячелетние крепости в пустыне и ощутите легендарное восточное гостеприимство.',
          category: 'Шелковый Путь',
          duration: '6–10 Дней',
          bestSeason: 'Апрель – Июнь, Сен – Ноя',
          highlights: ['Тур по Регистану в золотой час', 'Крепость Арк в Бухаре', 'Древний город Ичан-Кала в Хиве']
        }
      }
    },
    destExplorer: {
      badge: 'ГИД ПО НАПРАВЛЕНИЯМ',
      title: 'Исследуйте легендарные места по всему миру',
      subtitle: 'Интерактивная информация по шести континентам. Наклоняйте 3D-карточки и открывайте проверенные гиды.',
      continents: {
        all: 'Все',
        europe: 'Европа',
        asia: 'Азия',
        africa: 'Африка',
        northAmerica: 'Северная Америка',
        southAmerica: 'Южная Америка',
        oceania: 'Океания'
      },
      reviews: 'отзывов',
      capital: 'Столица:',
      bestTime: 'Лучшее время',
      weather: 'Погода',
      budgetPerDay: '/ в день',
      exploreCountryBtn: 'Подробнее о стране',
      savedToast: 'Сохранено в избранное ❤️',
      removedToast: 'Удалено из сохраненных'
    },
    aiPlannerSection: {
      badge: 'ДВИЖОК ИИ-ПУТЕШЕСТВИЙ',
      title: 'Создайте поездку мечты за секунды',
      subtitle: 'Выберите направление, укажите длительность и бюджет, а ИИ сформирует готовый план на каждый день.',
      destLabel: '1. Выберите направление',
      durationLabel: '2. Длительность поездки',
      budgetLabel: '3. Планируемый бюджет',
      styleLabel: '4. Стиль путешествия',
      interestsLabel: '5. Фокус интересов',
      days: 'дней',
      estimated: 'оценочно',
      recommendedStay: 'Рекомендуемое проживание',
      transitPass: 'Скоростной транспорт',
      bookItinerary: 'Настроить и забронировать →',
      generateAi: 'Сгенерировать полный маршрут с ИИ',
      styles: {
        culture: 'Культура и история',
        food: 'Гастрономия и вина',
        nature: 'Природа и приключения',
        coastal: 'Пляж и отдых'
      },
      interestTags: {
        food: 'Еда',
        culture: 'Культура',
        nature: 'Природа',
        history: 'История',
        adventure: 'Приключения',
        relaxation: 'Отдых'
      }
    },
    why: {
      badge: 'ДЛЯ СОВРЕМЕННЫХ ПУТЕШЕСТВЕННИКОВ',
      title: 'Почему именно TripMind?',
      subtitle: 'Все необходимое для идеальных путешествий на базе точного интеллекта и проверенных данных.',
      pillars: {
        itineraries: {
          title: 'Маршруты на базе ИИ',
          desc: 'Почасовые планы с учетом времени в пути, часов работы, прогноза погоды и оптимального темпа.'
        },
        recommendations: {
          title: 'Персональные рекомендации',
          desc: 'Учитывает ваши предпочтения, вкусы в еде, уровень активности и комфортный бюджет.'
        },
        destinationInfo: {
          title: 'Достоверная информация',
          desc: 'Актуальные визовые правила, контакты экстренных служб, валюты, базовые фразы и статус транспорта.'
        },
        savedDestinations: {
          title: 'Сохраненные места',
          desc: 'Добавляйте места в закладки, создавайте коллекции и делитесь списками с попутчиками.'
        },
        tripManagement: {
          title: 'Управление поездками',
          desc: 'Все посадочные талоны, брони отелей, ваучеры и списки вещей в одном синхронизированном хабе.'
        },
        smartSearch: {
          title: 'Умный поиск',
          desc: 'Поиск на естественном языке, понимающий сложные запросы по рейсам, отелям, ресторанам и турам.'
        }
      },
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
      card8Desc: 'Круглосуточная поддержка 24/7 по любым вопросам.'
    },
    productPreview: {
      badge: 'ВОЗМОЖНОСТИ ПЛАТФОРМЫ',
      title: 'Обзор платформы',
      subtitle: 'Познакомьтесь с модулями, созданными для безупречной организации путешествий.',
      tabs: {
        explore: 'Панель исследования',
        myTrips: 'Мои поездки',
        planner: 'ИИ-Планировщик',
        country: 'Детали страны'
      },
      exploreTitle: '🌍 Глобальная лента локаций',
      exploreSub: '195+ стран онлайн',
      trendingHub: 'Популярный хаб',
      topRated: 'Высокий рейтинг',
      culturalGem: 'Культурная жемчужина',
      myTripsTitle: '🧳 Предстоящие поездки',
      confirmedVoyages: '2 подтвержденные поездки',
      amalfiTrip: '7 дней на побережье Амальфи и Капри',
      amalfiTripSub: '12–19 июня • 2 путешественника • $1,380 потрачено',
      vouchersReady: '✓ Ваучеры готовы',
      wizardTitle: '🤖 Мастер генерации путешествий с ИИ',
      step2of3: 'Шаг 2 из 3',
      datesLabel: 'ДАТЫ',
      datesValue: '15–22 октября',
      budgetMax: 'Макс. $1,500',
      styleValue: 'Гастрономия + Пляж',
      dossierTitle: '🇺🇿 Узбекистан — Досье страны',
      visaFree90: 'Безвизовый въезд для 90+ стран',
      capital: 'Столица',
      tashkent: 'Ташкент',
      currency: 'Валюта',
      bestSeason: 'Лучший сезон',
      springAutumn: 'Весна и Осень'
    },
    faq: {
      badge: 'ЕСТЬ ВОПРОСЫ?',
      title: 'Часто задаваемые вопросы',
      subtitle: 'Все, что вам нужно знать о TripMind и алгоритмах ИИ для планирования поездок.',
      items: [
        {
          q: 'Как работает TripMind?',
          a: 'TripMind объединяет передовые модели ИИ для путешествий с проверенными мировыми базами данных туризма. Вы описываете поездку мечты, бюджет, даты или стиль отдыха обычными словами, а система мгновенно строит поминутный план, подбирает перелеты, отели и логистику.'
        },
        {
          q: 'Может ли TripMind составить полный готовый маршрут?',
          a: 'Да! TripMind формирует детальный план на утро, день и вечер, включая рекомендации ресторанов, маршруты между локациями, билеты и расчет расходов.'
        },
        {
          q: 'Можно ли указать точный бюджет?',
          a: 'Конечно. Вы можете задать лимит в USD, EUR или другой валюте. TripMind распределит средства на отели, транспорт, питание и развлечения, подсказывая возможности сэкономить.'
        },
        {
          q: 'Можно ли сохранять понравившиеся места?',
          a: 'Да. В один клик сохраняйте страны, города, бутик-отели и рестораны в личные коллекции для последующего просмотра и совместного планирования.'
        },
        {
          q: 'Можно ли изменить маршрут позже?',
          a: 'Да. Каждый сгенерированный маршрут полностью редактируется. Вы можете менять порядок дней, заменять активности или просить ИИ-ассистента пересчитать план.'
        },
        {
          q: 'TripMind действительно использует искусственный интеллект?',
          a: 'Да. TripMind применяет современные нейросетевые модели и алгоритмы маршрутизации для анализа миллионов вариантов, отзывов и сезонных данных за секунды.'
        },
        {
          q: 'Работает ли сервис на смартфонах?',
          a: 'Да! TripMind полностью оптимизирован для iOS, Android и планшетов, с поддержкой офлайн-доступа к билетам и маршрутам.'
        },
        {
          q: 'Какие страны поддерживаются?',
          a: 'TripMind поддерживает более 190 стран мира, предоставляя подробную информацию о визовых правилах, достопримечательностях и обычаях.'
        }
      ]
    },
    cta: {
      title: 'Мир ждет вас.',
      subtitle: 'Куда вы отправитесь дальше?',
      primaryButton: 'Начать планирование',
      secondaryButton: 'Создать с помощью ИИ'
    },
    demoModal: {
      badge: 'Интерактивный обзор TripMind',
      title: 'Как TripMind создает ваше путешествие',
      step1Title: 'Опишите путешествие мечты',
      step1Desc: 'Пишите свободно: «10 дней в Японии весной, бюджет $2500, люблю еду и храмы».',
      step2Title: 'ИИ подбирает рейсы, отели и планы на каждый день',
      step2Desc: 'Рассчитывает оптимальный темп, проверенные отели, часы работы и логистику.',
      step3Title: 'Синхронизация в 1 клик и офлайн-доступ',
      step3Desc: 'Экспортируйте в Apple Wallet или PDF и делитесь ссылкой для совместного планирования.',
      tryPlannerBtn: 'Попробовать ИИ-Планировщик →'
    },
    footer: {
      tagline: 'Самый умный способ планирования и организации путешествий в современную эпоху.',
      company: 'Компания',
      help: 'Поддержка',
      resources: 'Ресурсы',
      download: 'Скачать',
      about: 'О нас',
      blog: 'Блог',
      adminPanel: 'Панель администратора',
      careers: 'Карьера',
      faq: 'Частые вопросы',
      support: 'Техподдержка',
      privacy: 'Конфиденциальность',
      terms: 'Условия использования',
      ios: 'App Store (iOS)',
      android: 'Google Play (Android)',
      copyright: 'Все права защищены.',
      scrollToTop: 'Наверх'
    },
    countryInfo: {
      selectCountry: 'Выберите страну',
      selectCountryDesc: 'Нажмите на 3D-глобус или найдите страну через поиск, чтобы загрузить данные.',
      countryTelemetry: 'Данные страны',
      destinationsTab: 'Локации',
      capital: 'Столица',
      officialLanguage: 'Официальный язык',
      currency: 'Валюта',
      timezone: 'Часовой пояс',
      visaRegulations: 'Визовый режим',
      weatherInfo: 'Погода',
      bestTimeToVisit: 'Лучшее время для визита',
      topAttractions: 'Главные достопримечательности',
      famousLocalFoods: 'Популярные блюда',
      createTrip: 'Создать поездку',
      exploreDestinations: 'Смотреть локации',
      savedInVault: 'Сохранено в избранном',
      saveCountry: 'Сохранить страну',
      closePanel: 'Закрыть',
      averageBudget: 'Средний бюджет'
    },
    search: {
      placeholder: 'Поиск стран, городов и мест на глобусе...',
      hint: 'Попробуйте найти: Париж, Япония, Самарканд, Италия, Дубай...',
      noResults: 'Ничего не найдено',
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
      date: 'Дата'
    },
    categories: {
      flights: 'Авиарейсы',
      hotels: 'Отели',
      restaurants: 'Рестораны',
      planner: 'ИИ-Планировщик',
      assistant: 'ИИ-Ассистент',
      saved: 'Избранное'
    },
    destinations: {
      title: 'Популярные направления в мире',
      seeAll: 'Смотреть все',
      from: 'от',
      rating: 'Рейтинг'
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
      result: 'Ваш готовый маршрут'
    },
    userStories: {
      title: 'Как путешественники используют сервис?',
      subtitle: 'Тысячи пользователей уже создают свои поездки мечты вместе с TripMind.',
      card1Title: 'Создайте аккаунт',
      card1Desc: 'Зарегистрируйтесь за несколько секунд и настройте свой профиль.',
      card2Title: 'Создайте Dream Trip',
      card2Desc: 'Получите эксклюзивный план путешествия, созданный искусственным интеллектом.',
      card3Title: 'Бронируйте и отправляйтесь',
      card3Desc: 'Управляйте билетами, отелями и графиком поездки в одном месте.'
    },
    appDownload: {
      title: 'Скачайте мобильное приложение TripMind',
      subtitle: 'Управляйте планами поездок в любом месте, пользуйтесь офлайн-доступом и получайте уведомления в реальном времени.'
    },
    auth: {
      email: 'Электронная почта',
      password: 'Пароль',
      forgotPassword: 'Забыли пароль?',
      loading: 'Вход...',
      signIn: 'Войти',
      signInGoogle: 'Войти через Google',
      signInApple: 'Войти через Apple',
      orEmail: 'Или через эл. почту',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      welcome: 'С возвращением',
      subtitle: 'Сделайте планирование поездок простым с TripMind.',
      successLogin: 'Успешный вход в аккаунт!',
      successRegister: 'Аккаунт успешно создан!',
      errorFields: 'Пожалуйста, проверьте введенные данные.'
    },
    dashboard: {
      home: 'Главная',
      explore: 'Исследовать',
      planner: 'ИИ-Планировщик',
      myTrips: 'Мои поездки',
      tours: 'Туры',
      readyTrips: 'Готовые туры',
      flights: 'Авиабилеты',
      hotels: 'Отели',
      attractions: 'Интересные места',
      saved: 'Избранное',
      community: 'Сообщество',
      assistant: 'Сообщения',
      messages: 'Сообщения',
      profile: 'Мой профиль',
      settings: 'Настройки',
      language: 'Язык',
      currency: 'Валюта',
      theme: 'Тема',
      myDestinations: 'Мои направления',
      interactiveHub: 'Интерактивный 3D Хаб Земли',
      tapPins: 'Нажмите на метку для изучения',
      instantGenerator: 'Мгновенный генератор маршрутов',
      aiPlanner: 'ИИ-Планировщик путешествий',
      aiPlannerPrompt: 'Расскажите, куда вы хотите поехать, даты, бюджет и стиль путешествия.',
      searchPlaceholder: 'Поиск стран, городов, достопримечательностей (например: Дубай, Франция, Бурдж-Халифа)...',
      exploreWorld: 'Исследуйте мир',
      exploreWorldSubtitle: 'Открывайте страны, планируйте поездки и получайте персонализированные рекомендации ИИ.',
      planWithAi: 'Спланировать с ИИ',
      goPremium: 'Перейти на Premium',
      upgrade: 'Обновить сейчас',
      myTripsTitle: 'Мои поездки и экспедиции',
      myTripsSubtitle: 'Управляйте маршрутами, билетами и планами путешествий.',
      flightTitle: 'Международные авиарейсы и маршруты',
      flightSubtitle: 'Актуальные рейсы, авиакомпании и цены в реальном времени.',
      hotelTitle: 'Подобранные отели и проживание',
      hotelSubtitle: 'Бутик-отели, курорты и проверенные апартаменты в любой точке мира.',
      attractionTitle: 'Достопримечательности и памятники',
      attractionSubtitle: 'Открывайте шедевры архитектуры, музеи и уникальные локации.',
      assistantTitle: 'TripMind ИИ-Помощник',
      assistantSubtitle: 'Задавайте вопросы, оптимизируйте расписание или получайте персональные советы.',
      chatPlaceholder: 'Спросите о направлениях, местных обычаях, лучших сезонах...',
      settingsTitle: 'Настройки аккаунта и интерфейса',
      settingsSubtitle: 'Управляйте профилем, предпочитаемой валютой и региональными настройками.',
      popularDestinations: 'Популярные направления',
      verifiedTelemetry: 'Проверенные региональные данные',
      swipeToExplore: 'Листайте для просмотра',
    },
    country: {
      capital: 'Столица',
      population: 'Население',
      language: 'Язык',
      currency: 'Валюта',
      timezone: 'Часовой пояс',
      visa: 'Визовый режим',
      weather: 'Погода',
      bestTime: 'Лучшее время',
      avgBudget: 'Средний бюджет',
      attractions: 'Достопримечательности',
      foods: 'Популярные блюда',
      createTrip: 'Создать поездку',
      planTrip: 'Спланировать поездку',
      explore: 'Исследовать',
      save: 'Сохранить',
      saved: 'Сохранено',
      destinationsIn: 'Направления в',
      swipeToExplore: 'Листайте для просмотра',
      eVisa: 'Электронная виза / Виза по прибытии',
      visaRequired: 'Требуется виза',
      visaFree: 'Безвизовый режим',
      seeAll: 'Смотреть все',
      countries: {
        france: 'Франция',
        niger: 'Нигер',
        uzbekistan: 'Узбекистан',
        japan: 'Япония',
        italy: 'Италия',
        turkey: 'Турция',
        usa: 'США',
        uae: 'ОАЭ',
        egypt: 'Египет',
        germany: 'Германия',
        brazil: 'Бразилия',
        uk: 'Великобритания'
      }
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
      learnMore: 'Подробнее'
    }
  }
};
