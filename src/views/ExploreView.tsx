import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Star, Compass, Shield, Sparkles, 
  ArrowRight, CreditCard, Navigation, Coffee, Landmark 
} from '../icons';
import { useCurrency } from '../context/CurrencyContext';
import { PlaceDetailModal, type PlaceDetailData } from '../components/PlaceDetailModal';

interface ExploreViewProps {
  onPlanTrip: (destination: string) => void;
}

interface DestinationItem {
  id: string | number;
  name: string;
  region: string;
  country: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  startingPriceUSD: number;
  description: string;
  transitTip: string;
  paymentTip: string;
  etiquetteTip: string;
  diningTip: string;
  places: PlaceDetailData[];
}

const SEED_DESTINATIONS: DestinationItem[] = [
  {
    id: 'samarkand',
    name: 'Samarkand',
    region: 'Samarkand Region',
    country: 'Uzbekistan',
    category: 'Silk Road UNESCO Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 1420,
    startingPriceUSD: 45,
    description: 'The pearl of the Silk Road, renowned for azure mosaic domes, monumental madrasahs, and vibrant folk bazaars.',
    transitTip: 'Yandex Taxi is fast & cheap ($1-2 within center); Afrosiyob rail connects to Tashkent.',
    paymentTip: 'Cash (Uzbek Som) essential for bazaars; cards widely accepted at hotels and restaurants.',
    etiquetteTip: 'Modest dress covering shoulders/knees required inside sacred mausoleums & mosques.',
    diningTip: 'Traditional Samarkand Plov is served strictly between 11:30 and 13:30 at Osh Markazi.',
    places: [
      {
        id: 'registan',
        title: 'Registan Ensemble',
        category: 'attraction',
        location: 'Registan St, Samarkand',
        description: 'Tamerlane’s monumental public square bordered on three sides by three distinct madrasahs adorned with majolica and azure tilework.',
        cost: 6,
        duration: '2.5 hours',
        rating: 4.9,
        reviewsCount: 1200,
        openingHours: '08:00 – 20:00',
        tip: 'Best light for photography is at 08:30 AM through the Tilakori courtyard.',
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 39.6548,
        lng: 66.9757
      },
      {
        id: 'shahi-zinda',
        title: 'Shah-i-Zinda Necropolis',
        category: 'attraction',
        location: 'Shah-i-Zinda Ave, Samarkand',
        description: 'An ethereal stairway avenue of turquoise-tiled royal mausoleums dating back to the 11th–15th centuries.',
        cost: 4,
        duration: '2 hours',
        rating: 4.9,
        reviewsCount: 850,
        openingHours: '08:30 – 19:00',
        tip: 'Observe silence on the central stair path; respectful attire strictly enforced.',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 39.6631,
        lng: 66.9877
      },
      {
        id: 'siab-bazaar',
        title: 'Siab Folk Bazaar',
        category: 'shopping',
        location: 'Bibikhanum St, Samarkand',
        description: 'Centuries-old trade market filled with pyramids of dried apricots, almonds, halva, spices, and fresh non bread.',
        cost: 0,
        duration: '1.5 hours',
        rating: 4.8,
        reviewsCount: 640,
        openingHours: '07:00 – 18:00',
        tip: 'Sample dried fruits freely; gentle bargaining is polite and customary.',
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 39.6592,
        lng: 66.9805
      }
    ]
  },
  {
    id: 'bukhara',
    name: 'Bukhara',
    region: 'Bukhara Region',
    country: 'Uzbekistan',
    category: 'Living Medieval Center',
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 1150,
    startingPriceUSD: 40,
    description: 'An open-air living museum with more than 140 preserved architectural monuments, domed trading bazaars, and courtyard teahouses.',
    transitTip: 'Entire historic center is pedestrian-only; walking is by far the best modality.',
    paymentTip: 'Mastercard & Visa accepted in hotels; cash preferred in covered trading domes.',
    etiquetteTip: 'Sipping green tea slowly at Lyabi-Hauz while listening to local elder conversations is revered.',
    diningTip: 'Sample Bukhara skewered mutton kebab and Somsa baked in clay tandoors.',
    places: [
      {
        id: 'kalon-minaret',
        title: 'Kalon Minaret & Mosque',
        category: 'attraction',
        location: 'Kalon Square, Bukhara',
        description: 'A 48-meter 12th-century baked brick masterpiece that survived Genghis Khan’s invasion undamaged.',
        cost: 4,
        duration: '2 hours',
        rating: 4.9,
        reviewsCount: 920,
        openingHours: '08:00 – 19:30',
        tip: 'Visit at blue hour for magical floodlit photography.',
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 39.7758,
        lng: 64.4154
      },
      {
        id: 'ark-fortress',
        title: 'Ark of Bukhara',
        category: 'attraction',
        location: 'Registan Square, Bukhara',
        description: 'A massive 5th-century fortified citadel once serving as a city within a city for Bukhara’s Emirs.',
        cost: 5,
        duration: '2 hours',
        rating: 4.8,
        reviewsCount: 710,
        openingHours: '09:00 – 18:00',
        tip: 'Climb the upper terrace ramparts for panoramic views over Bukhara minarets.',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 39.7781,
        lng: 64.4109
      }
    ]
  },
  {
    id: 'khiva',
    name: 'Khiva',
    region: 'Khorezm Region',
    country: 'Uzbekistan',
    category: 'Intact Citadel Oasis',
    imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 880,
    startingPriceUSD: 38,
    description: 'The ancient walled fortress city of Itchan Kala, where mudbrick ramparts, minarets, and palaces remain completely preserved.',
    transitTip: 'Enclosed within ancient walls; compact 1km area completely walkable.',
    paymentTip: 'All-inclusive museum pass ticket available at West Gate kiosk.',
    etiquetteTip: 'Do not climb unstable clay wall ramparts except at designated lookout towers.',
    diningTip: 'Try Khorezmian green noodles (Shivit Oshi) and egg stuffed envelopes (Tuxum Barak).',
    places: [
      {
        id: 'kalta-minor',
        title: 'Kalta Minor Turquoise Minaret',
        category: 'attraction',
        location: 'Itchan Kala, Khiva',
        description: 'The iconic, stout minaret completely clad in glistening blue, green, and turquoise glazed tiles.',
        cost: 3,
        duration: '1 hour',
        rating: 4.9,
        reviewsCount: 580,
        openingHours: '08:00 – 21:00',
        tip: 'Most dramatic reflection shines during sunset.',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 41.3783,
        lng: 60.3582
      }
    ]
  },
  {
    id: 'tashkent',
    name: 'Tashkent',
    region: 'Tashkent Metro',
    country: 'Uzbekistan',
    category: 'Modern Metropolis & Metro Art',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 940,
    startingPriceUSD: 50,
    description: 'The sprawling Central Asian capital fusing Soviet modernist architecture, palatial underground metro stations, and tree-lined avenues.',
    transitTip: 'Tashkent Metro is an architectural marvel and costs ~$0.15 per ride via contactless card tap.',
    paymentTip: 'Apple Pay & international cards accepted at 90% of urban spots.',
    etiquetteTip: 'Photography inside metro stations is permitted and welcomed.',
    diningTip: 'Visit the legendary Central Asian Plov Center near the TV Tower at 12:00 sharp.',
    places: [
      {
        id: 'chorsu-bazaar',
        title: 'Chorsu Bazaar & Dome',
        category: 'shopping',
        location: 'Old City, Tashkent',
        description: 'A colossal turquoise-domed oriental market with traditional butcher rows, horse meat, nuts, spices, and pottery.',
        cost: 0,
        duration: '2 hours',
        rating: 4.8,
        reviewsCount: 890,
        openingHours: '06:00 – 19:00',
        tip: 'Try hot freshly fried Hanum (potato roll) with tomato sauce on the 2nd tier.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 41.3275,
        lng: 69.2348
      }
    ]
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    region: 'Marmara',
    country: 'Turkey',
    category: 'Crossroads of Continents',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 2200,
    startingPriceUSD: 70,
    description: 'Where Europe meets Asia across the Bosphorus, laden with Byzantine domes, Ottoman palaces, and ferry routes.',
    transitTip: 'Istanbulkart contactless card unlocks ferries, funiculars, trams, and metro lines.',
    paymentTip: 'Cards ubiquitous; small lira cash useful for tea gardens and street simit carts.',
    etiquetteTip: 'Remove shoes and wear head covering at Hagia Sophia and Blue Mosque.',
    diningTip: 'Balık ekmek (mackerel sandwich) by Eminönü and authentic Kadıköy meze.',
    places: [
      {
        id: 'hagia-sophia',
        title: 'Hagia Sophia Grand Mosque',
        category: 'attraction',
        location: 'Sultanahmet, Istanbul',
        description: '6th-century architectural marvel, previously the world’s largest cathedral before becoming a grand imperial mosque.',
        cost: 25,
        duration: '2 hours',
        rating: 4.9,
        reviewsCount: 3100,
        openingHours: '09:00 – 19:30',
        tip: 'Skip morning queues by visiting during early afternoon.',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80',
        isVerified: true,
        lat: 41.0086,
        lng: 28.9802
      }
    ]
  }
];

export const ExploreView: React.FC<ExploreViewProps> = ({ onPlanTrip }) => {
  const { formatPrice } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailData | null>(null);

  // Filtered list
  const filteredDestinations = SEED_DESTINATIONS.filter(dest => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && dest.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
      
      {/* Header & Search */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.08))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)' }}>
            Destination Intelligence Directory
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading, sans-serif)' }}>
            Explore Verified Global Hubs & City Guides
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary, #94a3b8)' }}>
            Adaptive guides with verified heritage monuments, transit specs, payment norms, and local customs.
          </p>
        </div>

        {/* Search input & category filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              flex: '1 1 300px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--color-bg, #090d1a)',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
              borderRadius: '100px',
              padding: '10px 18px',
            }}
          >
            <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by city, country or cultural theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem', color: '#ffffff' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'Silk Road', 'UNESCO', 'Citadel', 'Metropolis'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: selectedCategory === cat ? '1px solid var(--color-accent, #2563eb)' : '1px solid var(--glass-border)',
                  background: selectedCategory === cat ? 'var(--color-accent, #2563eb)' : 'var(--color-bg, #090d1a)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            style={{
              background: 'var(--color-bg-surface, #0f172a)',
              border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Top Grid: Hero banner + Adaptive City Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.08))' }}>
              
              {/* Left: Destination Photo & Title */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, transparent 60%)' }} />

                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ffffff', background: 'var(--color-accent, #2563eb)', padding: '4px 10px', borderRadius: '100px' }}>
                    {dest.category}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px' }}>
                    <Star size={12} fill="#f59e0b" stroke="none" />
                    <span>{dest.rating} ({dest.reviewsCount} reviews)</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                    {dest.name}, <span style={{ color: 'var(--color-text-secondary)' }}>{dest.country}</span>
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                    From {formatPrice(dest.startingPriceUSD)} / day estimated
                  </span>
                </div>
              </div>

              {/* Right: Adaptive City Guidance Bar */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', background: 'var(--color-bg, #090d1a)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent, #2563eb)', textTransform: 'uppercase' }}>
                    🌐 Adaptive City Specifications
                  </span>
                  <p style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary, #94a3b8)', lineHeight: 1.5 }}>
                    {dest.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Navigation size={12} /> Transit:
                      </strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{dest.transitTip}</span>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={12} /> Payments:
                      </strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{dest.paymentTip}</span>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Landmark size={12} /> Etiquette:
                      </strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{dest.etiquetteTip}</span>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Coffee size={12} /> Dining:
                      </strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{dest.diningTip}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
                  <button
                    onClick={() => onPlanTrip(`${dest.name}, ${dest.country}`)}
                    className="btn-premium"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Plan Trip to {dest.name}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Verified Places in this City */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Shield size={14} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  Signature Verified Places ({dest.places.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>— Click to view opening hours, entry fees & insider tips</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {dest.places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    style={{
                      background: 'var(--color-bg, #090d1a)',
                      border: '1px solid var(--glass-border, rgba(255,255,255,0.06))',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img
                      src={place.image}
                      alt={place.title}
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {place.title}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {place.duration || '2 hours'} • {place.cost === 0 ? 'Free' : formatPrice(place.cost || 0)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Star size={10} fill="#f59e0b" stroke="none" /> {place.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          isOpen={Boolean(selectedPlace)}
          onClose={() => setSelectedPlace(null)}
          onAddToTrip={() => {
            setSelectedPlace(null);
            onPlanTrip('Samarkand, Uzbekistan');
          }}
        />
      )}

    </div>
  );
};
