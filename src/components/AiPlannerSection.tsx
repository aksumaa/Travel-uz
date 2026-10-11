'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, Compass, ArrowRight, Check, Brain, Clock, Plane, Utensils, Hotel } from '../icons';
import { useLanguage } from '../context/LanguageContext';

interface AiPlannerSectionProps {
  onBuildTrip: (planData: { destination: string; duration: string; budget: string; style: string }) => void;
}

export const AiPlannerSection: React.FC<AiPlannerSectionProps> = ({ onBuildTrip }) => {
  const { t, language } = useLanguage();

  const PRESET_DESTINATIONS = [
    { name: 'Japan', defaultDays: `10 ${t('aiPlannerSection.days')}`, defaultBudget: '$2,200', style: t('aiPlannerSection.styles.culture') },
    { name: 'France', defaultDays: `7 ${t('aiPlannerSection.days')}`, defaultBudget: '$1,800', style: t('aiPlannerSection.styles.food') },
    { name: 'Italy', defaultDays: `7 ${t('aiPlannerSection.days')}`, defaultBudget: '$1,500', style: t('aiPlannerSection.styles.food') },
    { name: 'Uzbekistan', defaultDays: `6 ${t('aiPlannerSection.days')}`, defaultBudget: '$850', style: t('aiPlannerSection.styles.culture') },
    { name: 'Morocco', defaultDays: `7 ${t('aiPlannerSection.days')}`, defaultBudget: '$950', style: t('aiPlannerSection.styles.nature') },
    { name: 'Iceland', defaultDays: `8 ${t('aiPlannerSection.days')}`, defaultBudget: '$1,900', style: t('aiPlannerSection.styles.nature') }
  ];

  const DURATION_OPTIONS = [
    `5 ${t('aiPlannerSection.days')}`,
    `7 ${t('aiPlannerSection.days')}`,
    `10 ${t('aiPlannerSection.days')}`,
    `14 ${t('aiPlannerSection.days')}`
  ];
  const BUDGET_OPTIONS = ['$850', '$1,500', '$2,500', '$4,000+'];
  const STYLE_OPTIONS = [
    { id: 'culture', label: t('aiPlannerSection.styles.culture'), icon: '🏛️' },
    { id: 'food', label: t('aiPlannerSection.styles.food'), icon: '🍷' },
    { id: 'nature', label: t('aiPlannerSection.styles.nature'), icon: '🏔️' },
    { id: 'coastal', label: t('aiPlannerSection.styles.coastal'), icon: '🏖️' }
  ];

  const [selectedDestination, setSelectedDestination] = useState('Japan');
  const [selectedDuration, setSelectedDuration] = useState(`7 ${t('aiPlannerSection.days')}`);
  const [selectedBudget, setSelectedBudget] = useState('$1,500');
  const [selectedStyle, setSelectedStyle] = useState(t('aiPlannerSection.styles.food'));
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    t('aiPlannerSection.interestTags.food'),
    t('aiPlannerSection.interestTags.culture'),
    t('aiPlannerSection.interestTags.nature')
  ]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const getDynamicItinerary = () => {
    if (language === 'uz') {
      switch (selectedDestination) {
        case 'Japan':
          return {
            title: 'Tokio va Kioto — Gastronomik va Madaniy Sayohat',
            budgetEstimate: `${selectedBudget} taxminiy`,
            stay: 'Park Hotel Tokyo • Ginza Skyline View',
            transport: 'JR Shinkansen Tezyurar poyezd chiptasi',
            days: [
              { day: '1-kun', title: 'Tokio neon chiroqlari va Tsukiji tashqi bozori', activity: 'Ertalab yangi sushi nonushtasi, teamLab raqamli muzeyi va Shibuya chorrahasi' },
              { day: '2-kun', title: 'Tarixiy Asakusa va Akihabara texnomarkazi', activity: 'Senso-ji ibodatxonasi, an’anaviy matcha marosimi va kechki ramen tatish' },
              { day: '3-kun', title: 'Kioto shahriga Shinkansen poyezdida sayohat', activity: 'Fushimi Inari 10,000 qizil torii darvozalari va Gion milliy kechki ovqati' },
              { day: '4-kun', title: 'Arashiyama bambukzor o‘rmoni va Tenryu-ji', activity: 'Zen bog‘ida meditatsiya, riksha sayri va daryo bo‘yida kaiseki ziyafati' }
            ]
          };
        case 'France':
          return {
            title: 'Parij san’ati va Bordo uzumzorlari',
            budgetEstimate: `${selectedBudget} taxminiy`,
            stay: 'Hôtel Saint-Germain Boutique • Parij',
            transport: 'TGV Tezyurar poyezdi + Metro cheksiz',
            days: [
              { day: '1-kun', title: 'Parijga kelish va Sena daryosida kechki sayr', activity: 'Xususiy daryo qayig‘i, Eyfel minorasi yoritilishi va bistro kechki ovqati' },
              { day: '2-kun', title: 'Luvr durdonalari va Mare kvartali', activity: 'Mona Liza navbatsiz chiptasi, vintage butiklar va patisseriya shirinliklari' },
              { day: '3-kun', title: 'Tezyurar TGV da Bordo vino o‘lkasiga sayohat', activity: 'Grand Cru uzumzorlarida degustatsiya, Saint-Émilion qadimiy shaharchasi' },
              { day: '4-kun', title: 'Gastronomik oshpazlik mahorat darsi', activity: 'Mishelin oshpazi bilan bozordan olingan mahsulotlar asosida taom tayyorlash' }
            ]
          };
        case 'Italy':
          return {
            title: 'Amalfi sohili va Rim Uyg‘onish merosi',
            budgetEstimate: `${selectedBudget} taxminiy`,
            stay: 'Villa TreVille Cliff Resort • Pozitano',
            transport: 'Frecciarossa tezyurar poyezdi + Sohildagi paromlar',
            days: [
              { day: '1-kun', title: 'Neapol tarixiy markazi va Pozitano quyosh botishi', activity: 'Sohil bo‘ylab go‘zal yo‘l, dengiz manzarasida kutib olish ichimligi' },
              { day: '2-kun', title: 'Kapri orolida shaxsiy qayiq sayohati', activity: 'Moviy grotto g‘orida cho‘milish va qoyalar orasida dam olish' },
              { day: '3-kun', title: 'Xudolar yo‘li panoramik tog‘ so‘qmog‘i', activity: 'Bomeranodan Nocellegacha sohil bo‘yi manzarali piyoda sayohat' },
              { day: '4-kun', title: 'Rim forumi va Trastevere kechki sayri', activity: 'Kolizey oltin soat sayohati va haqiqiy italyancha pasta' }
            ]
          };
        case 'Uzbekistan':
          return {
            title: 'Samarqand feruza gumbazlari va Ipak yo‘li',
            budgetEstimate: `${selectedBudget} taxminiy`,
            stay: 'Hotel Minor Boutique • Registon',
            transport: 'Afrosiyob Tezyurar elektropoyezdi',
            days: [
              { day: '1-kun', title: 'Toshkentdan Samarqandga Afrosiyobda sayohat', activity: 'Afrosiyob tezyurar poyezdi, mehmonxonaga joylashish va kechki Registon nurlari' },
              { day: '2-kun', title: 'Registon maydoni va Go‘ri Amir maqbarasi', activity: 'Tarixchi gid bilan moviy mozaikali gumbazlar sirlarini o‘rganish' },
              { day: '3-kun', title: 'Siyob milliy bozori va Samarqand noni', activity: 'Kulolchilik ustaxonalari, quruq mevalar tatish va Samarqand oshi tayyorlash' },
              { day: '4-kun', title: 'Buxoroi Sharif qadimiy obidalari', activity: 'Ark qal’asi, Minorai Kalon va qadimiy savdo gumbazlari bo‘ylab sayr' }
            ]
          };
        default:
          return {
            title: 'Islandiya vulqon va muzlik odisseyasi',
            budgetEstimate: `${selectedBudget} taxminiy`,
            stay: 'ION Luxury Adventure Hotel • Thingvellir',
            transport: '4WD Maxsus Super-Jeep',
            days: [
              { day: '1-kun', title: 'Reykyavik qirg‘og‘i va Moviy Laguna', activity: 'Geotermal mineralli iliq suv havzasi va dengiz taomlari kechki ovqati' },
              { day: '2-kun', title: 'Oltin halqa geyzerlari va Gullfoss', activity: 'Strokkur geyzerining otilishi va tektonik yoriqlar bo‘ylab sayr' },
              { day: '3-kun', title: 'Janubiy sohil sharsharalari va Qora qumlar', activity: 'Seljalandsfoss sharsharasi orqasidan yurish va Reynisfjara qoyalari' },
              { day: '4-kun', title: 'Muzlik lagunasi va Shimol yog‘dusi ovlash', activity: 'Aysberglar orasida qayiq sayri va kechki Shimol yog‘dusi tomoshasi' }
            ]
          };
      }
    } else if (language === 'ru') {
      switch (selectedDestination) {
        case 'Japan':
          return {
            title: 'Токио и Киото — Гастрономическое путешествие',
            budgetEstimate: `${selectedBudget} оценочно`,
            stay: 'Park Hotel Tokyo • Ginza Skyline View',
            transport: 'Проездной JR Shinkansen по всей Японии',
            days: [
              { day: 'День 1', title: 'Неоновый Токио и рынок Цукидзи', activity: 'Свежайшие суши на завтрак, цифровой музей teamLab и перекресток Сибуя' },
              { day: 'День 2', title: 'Историческая Асакуса и Акихабара', activity: 'Храм Сенсо-дзи, чайная церемония маття и вечерний тур по рамэнным' },
              { day: 'День 3', title: 'Синкансэн в Киото и Фусими Инари', activity: '10 000 алых ворот тории в сумерках и традиционный ужин в районе Гион' },
              { day: 'День 4', title: 'Бамбуковая роща Арасияма и Тэнрю-дзи', activity: 'Медитация в саду Дзен, прогулка на рикше и банкет кайсэки' }
            ]
          };
        case 'France':
          return {
            title: 'Искусство Парижа и виноградники Бордо',
            budgetEstimate: `${selectedBudget} оценочно`,
            stay: 'Hôtel Saint-Germain Boutique • Париж',
            transport: 'Скоростной поезд TGV + Безлимитное метро',
            days: [
              { day: 'День 1', title: 'Прибытие в Париж и круиз по Сене', activity: 'Приватная прогулка на катере, иллюминация Эйфелевой башни и ужин в бистро' },
              { day: 'День 2', title: 'Шедевры Лувра и квартал Марэ', activity: 'Билеты без очереди к Моне Лизе, винтажные бутики и авторские кондитерские' },
              { day: 'День 3', title: 'Скоростной TGV в винный регион Бордо', activity: 'Дегустация Grand Cru и прогулка по средневековому Сент-Эмильону' },
              { day: 'День 4', title: 'Гастрономический мастер-класс', activity: 'Приготовление обеда из свежих продуктов с рынка под руководством шефа' }
            ]
          };
        case 'Italy':
          return {
            title: 'Побережье Амальфи и вечный Рим',
            budgetEstimate: `${selectedBudget} оценочно`,
            stay: 'Villa TreVille Cliff Resort • Позитано',
            transport: 'Скоростной поезд Frecciarossa + Морские паромы',
            days: [
              { day: 'День 1', title: 'Исторический Неаполь и закат в Позитано', activity: 'Панорамная дорога вдоль скал и приветственный бокал просекко с видом на море' },
              { day: 'День 2', title: 'Остров Капри на приватном катере', activity: 'Купание в уединенных бухтах, Голубой грот и лимонные сады на скалах' },
              { day: 'День 3', title: 'Тропа Богов над Средиземным морем', activity: 'Живописный хайкинг от Бомерано до Ночелле с местным пикником' },
              { day: 'День 4', title: 'Римский форум и вечерний Трастевере', activity: 'Колизей в золотой час и настоящая домашняя карбонара' }
            ]
          };
        case 'Uzbekistan':
          return {
            title: 'Бирюзовый Самарканд и оазисы Шелкового пути',
            budgetEstimate: `${selectedBudget} оценочно`,
            stay: 'Hotel Minor Boutique • Регистан',
            transport: 'Скоростной поезд Афросиаб',
            days: [
              { day: 'День 1', title: 'Из Ташкента в Самарканд на Афросиабе', activity: 'Поездка на скоростном поезде, заселение и вечерняя подсветка Регистана' },
              { day: 'День 2', title: 'Площадь Регистан и мавзолей Гур-Эмир', activity: 'Исследование мозаичных куполов с персональным историком' },
              { day: 'День 3', title: 'Колоритный Сиабский базар и пекарни', activity: 'Гончарные мастерские, дегустация сладостей и мастер-класс по плову' },
              { day: 'День 4', title: 'Древняя Бухара и минарет Калян', activity: 'Прогулка по 2000-летним торговым куполам и атмосферным чайханам' }
            ]
          };
        default:
          return {
            title: 'Исландия — Одиссея гейзеров и Северного сияния',
            budgetEstimate: `${selectedBudget} оценочно`,
            stay: 'ION Luxury Adventure Hotel • Тингведлир',
            transport: 'Внедорожный супер-джип 4WD',
            days: [
              { day: 'День 1', title: 'Набережная Рейкьявика и Голубая Лагуна', activity: 'Геотермальные минеральные ванны и ужин из свежих морепродуктов' },
              { day: 'День 2', title: 'Золотое кольцо: гейзеры и водопад Гюдльфосс', activity: 'Извержение гейзера Строккур и прогулка по разлому тектонических плит' },
              { day: 'День 3', title: 'Водопады южного берега и черный пляж', activity: 'Прогулка за водопадом Сельяландсфосс и базальтовые колонны Рейнисфьяра' },
              { day: 'День 4', title: 'Ледниковая лагуна и охота за сиянием', activity: 'Прогулка на лодке среди айсбергов и вечернее наблюдение Авроры' }
            ]
          };
      }
    }

    // Default English
    switch (selectedDestination) {
      case 'Japan':
        return {
          title: 'Tokyo & Kyoto Epicurean Journey',
          budgetEstimate: `${selectedBudget} estimated`,
          stay: 'Park Hotel Tokyo • Ginza Skyline View',
          transport: 'JR All-Japan High-Speed Shinkansen Pass',
          days: [
            { day: 'Day 1', title: 'Tokyo Neon & Tsukiji Outer Market', activity: 'Morning sushi breakfast, teamLab digital art museum & Shibuya Crossing' },
            { day: 'Day 2', title: 'Historic Asakusa & Akihabara Tech', activity: 'Senso-ji temple stroll, matcha ceremony & evening ramen crawl' },
            { day: 'Day 3', title: 'Shinkansen to Kyoto & Fushimi Inari', activity: '10,000 vermilion torii gates at twilight & Gion traditional dinner' },
            { day: 'Day 4', title: 'Arashiyama Bamboo Grove & Tenryu-ji', activity: 'Zen garden meditation, rickshaw tour & riverside kaiseki banquet' }
          ]
        };
      case 'France':
        return {
          title: 'Paris Art & Bordeaux Vineyard Escape',
          budgetEstimate: `${selectedBudget} estimated`,
          stay: 'Hôtel Saint-Germain Boutique • Paris 6th',
          transport: 'TGV High-Speed Rail + Metro Unlimited',
          days: [
            { day: 'Day 1', title: 'Arrival in Paris & Seine Sunset Cruise', activity: 'Private river cruise, Eiffel Tower illumination & bistro dinner' },
            { day: 'Day 2', title: 'Louvre VIP Masterpieces & Marais Walk', activity: 'Skip-the-line Mona Lisa pass, vintage boutiques & artisan patisseries' },
            { day: 'Day 3', title: 'High-Speed TGV to Bordeaux Wine Country', activity: 'Grand Cru vineyard tasting, medieval Saint-Émilion exploration' },
            { day: 'Day 4', title: 'Gastronomic Cooking Masterclass', activity: 'Market-to-table culinary workshop with Michelin-trained chef' }
          ]
        };
      case 'Italy':
        return {
          title: 'Amalfi Coast & Roman Heritage Voyage',
          budgetEstimate: `${selectedBudget} estimated`,
          stay: 'Villa TreVille Cliff Resort • Positano',
          transport: 'Frecciarossa High-Speed Rail + Coastal Ferries',
          days: [
            { day: 'Day 1', title: 'Naples Historic Center & Positano Sunset', activity: 'Scenic cliffside drive, welcome prosecco overlooking the sea' },
            { day: 'Day 2', title: 'Capri Island Private Skipper Boat', activity: 'Secluded swim coves, Faraglioni rocks & cliffside lemon groves' },
            { day: 'Day 3', title: 'Path of the Gods Panoramic Ridge', activity: 'Scenic hiking trail from Bomerano to Nocelle with local picnic' },
            { day: 'Day 4', title: 'Roman Forum & Trastevere Wine Crawl', activity: 'Colosseum golden hour tour and authentic handmade carbonara' }
          ]
        };
      case 'Uzbekistan':
        return {
          title: 'Samarkand Turquoise Domes & Silk Road Oases',
          budgetEstimate: `${selectedBudget} estimated`,
          stay: 'Hotel Minor Boutique • Samarkand Registan',
          transport: 'Afrosiyob High-Speed Bullet Trains',
          days: [
            { day: 'Day 1', title: 'Tashkent to Samarkand by Bullet Train', activity: 'High-speed Afrosiyob rail, hotel check-in & evening Registan lights' },
            { day: 'Day 2', title: 'Registan Square & Gur-e-Amir Mausoleum', activity: 'Turquoise mosaic dome exploration with private Silk Road historian' },
            { day: 'Day 3', title: 'Siab Traditional Spice & Bread Bazaar', activity: 'Ceramic artisan workshops, dried fruit tasting & plov masterclass' },
            { day: 'Day 4', title: 'Bukhara Ancient Fortress & Kalyan Minaret', activity: 'Wander 2,000-year-old trading domes and historic tea houses' }
          ]
        };
      default:
        return {
          title: 'Icelandic Geothermal & Aurora Odyssey',
          budgetEstimate: `${selectedBudget} estimated`,
          stay: 'ION Luxury Adventure Hotel • Thingvellir',
          transport: '4WD Glacier Vehicle & Super-Jeep Transfers',
          days: [
            { day: 'Day 1', title: 'Reykjavik Waterfront & Blue Lagoon', activity: 'Geothermal silica mineral bath, coastal design walk & seafood dinner' },
            { day: 'Day 2', title: 'Golden Circle Geysers & Gullfoss', activity: 'Strokkur geyser eruption, tectonic plate rift & volcanic bakeries' },
            { day: 'Day 3', title: 'South Coast Waterfalls & Black Sands', activity: 'Walk behind Seljalandsfoss, Reynisfjara basalt columns at dusk' },
            { day: 'Day 4', title: 'Jökulsárlón Glacier Lagoon & Auroras', activity: 'Zodiac boat between icebergs, evening Aurora Borealis hunt' }
          ]
        };
    }
  };

  const plan = getDynamicItinerary();

  return (
    <section 
      id="ai-planner"
      style={{
        padding: '100px 24px',
        maxWidth: '1360px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(1000px, 90vw)',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 5 }}>
        
        {/* Editorial Section Headline */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 50px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
            color: 'var(--accent, #2563EB)',
            padding: '6px 18px',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid var(--accent-subtle, rgba(37, 99, 235, 0.25))'
          }}>
            <Sparkles size={14} />
            <span>{t('aiPlannerSection.badge')}</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display, 'DM Serif Display', 'Playfair Display', serif)",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            margin: '0 0 16px 0',
            textTransform: 'uppercase'
          }}>
            {t('aiPlannerSection.title')}
          </h2>

          <p style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            {t('aiPlannerSection.subtitle')}
          </p>
        </div>

        {/* Realistic Interactive Planner Panel Container */}
        <div style={{
          background: 'var(--color-bg-surface)',
          borderRadius: '32px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          padding: 'clamp(24px, 4vw, 44px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          backdropFilter: 'blur(16px)'
        }}>
          
          {/* Left Column: Interactive Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Field 1: Where do you want to go? */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '12px'
              }}>
                <MapPin size={16} style={{ color: 'var(--accent, #2563EB)' }} />
                <span>{t('aiPlannerSection.destLabel')}</span>
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px'
              }}>
                {PRESET_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestination === dest.name;
                  return (
                    <button
                      key={dest.name}
                      onClick={() => {
                        setSelectedDestination(dest.name);
                        setSelectedDuration(dest.defaultDays);
                        setSelectedBudget(dest.defaultBudget);
                        setSelectedStyle(dest.style);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--accent, #2563EB)' : 'var(--color-bg)',
                        color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                        border: isSelected ? '1px solid var(--accent, #2563EB)' : '1px solid var(--border)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      {dest.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 2 & 3: When (Duration) and Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              {/* Duration */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px'
                }}>
                  <Calendar size={14} style={{ color: 'var(--accent, #2563EB)' }} />
                  <span>{t('aiPlannerSection.durationLabel')}</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {DURATION_OPTIONS.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedDuration(dur)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '10px',
                        background: selectedDuration === dur ? 'var(--accent, #2563EB)' : 'var(--color-bg)',
                        color: selectedDuration === dur ? '#ffffff' : 'var(--color-text-secondary)',
                        border: selectedDuration === dur ? '1px solid var(--accent, #2563EB)' : '1px solid var(--border)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px'
                }}>
                  <DollarSign size={14} style={{ color: '#10B981' }} />
                  <span>{t('aiPlannerSection.budgetLabel')}</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBudget(b)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '10px',
                        background: selectedBudget === b ? '#10B981' : 'var(--color-bg)',
                        color: selectedBudget === b ? '#ffffff' : 'var(--color-text-secondary)',
                        border: selectedBudget === b ? '1px solid #10B981' : '1px solid var(--border)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 4: Travel style */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.86rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}>
                <Compass size={15} style={{ color: '#7C3AED' }} />
                <span>{t('aiPlannerSection.styleLabel')}</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {STYLE_OPTIONS.map((st) => {
                  const isSelected = selectedStyle === st.label;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStyle(st.label)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(124, 58, 237, 0.15)' : 'var(--color-bg)',
                        color: isSelected ? '#7C3AED' : 'var(--color-text-secondary)',
                        border: isSelected ? '2px solid #7C3AED' : '1px solid var(--border)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{st.icon}</span>
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Key Interests */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}>
                {t('aiPlannerSection.interestsLabel')}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  t('aiPlannerSection.interestTags.food'),
                  t('aiPlannerSection.interestTags.culture'),
                  t('aiPlannerSection.interestTags.nature'),
                  t('aiPlannerSection.interestTags.history'),
                  t('aiPlannerSection.interestTags.adventure'),
                  t('aiPlannerSection.interestTags.relaxation')
                ].map((tag) => {
                  const isChecked = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        background: isChecked ? 'var(--accent-subtle, rgba(37, 99, 235, 0.12))' : 'var(--color-bg)',
                        color: isChecked ? 'var(--accent, #2563EB)' : 'var(--color-text-muted)',
                        border: isChecked ? '1px solid var(--accent, #2563EB)' : '1px solid var(--border)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isChecked && <Check size={12} />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Build Trip CTA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBuildTrip({
                destination: selectedDestination,
                duration: selectedDuration,
                budget: selectedBudget,
                style: selectedStyle
              })}
              style={{
                padding: '16px 28px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--accent, #2563EB) 0%, #7C3AED 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                fontFamily: "var(--font-sans, 'Inter', sans-serif)"
              }}
            >
              <Sparkles size={18} />
              <span>{t('aiPlannerSection.generateAi')} →</span>
            </motion.button>
          </div>

          {/* Right Column: Live Calculated Journey Preview Card */}
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            padding: 'clamp(20px, 3vw, 28px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '16px'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent, #2563EB)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  <Brain size={14} />
                  <span>{t('planner.result')}</span>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display, 'DM Serif Display', serif)",
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}>
                  {plan.title}
                </h3>
              </div>
              <span style={{
                background: '#10B981',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '50px'
              }}>
                {t('howItWorks.step2Optimized')}
              </span>
            </div>

            {/* Quick Metadata Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{
                background: 'var(--color-bg-surface)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hotel size={13} style={{ color: 'var(--accent, #2563EB)' }} />
                  <span>{t('aiPlannerSection.recommendedStay')}</span>
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {plan.stay}
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-surface)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plane size={13} style={{ color: '#7C3AED' }} />
                  <span>{t('aiPlannerSection.transitPass')}</span>
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {plan.transport}
                </p>
              </div>
            </div>

            {/* Daily Schedule Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.days.map((d, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--color-bg-surface)',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        background: idx === 0 ? 'var(--accent, #2563EB)' : 'var(--color-bg)',
                        color: idx === 0 ? '#ffffff' : 'var(--color-text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: idx === 0 ? 'none' : '1px solid var(--border)'
                      }}>
                        {d.day}
                      </span>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-primary)' }}>
                        {d.title}
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {d.activity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
