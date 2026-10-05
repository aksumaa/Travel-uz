import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Plane, Hotel, Star, Compass, Heart, 
  Send, Trash2, Edit3, Share2, User, MapPin, Loader2 
} from '../icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';

interface MyTripsViewProps {
  onViewTrip?: (id: string) => void;
}

// ==================== MY TRIPS VIEW ====================
export const MyTripsView: React.FC<MyTripsViewProps> = ({ onViewTrip }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'upcoming' | 'completed' | 'draft'>('all');
  
  const [trips, setTrips] = useState<any[]>(() => {
    const aiSaved = localStorage.getItem('travel_uz_ai_trips');
    const aiList = aiSaved ? JSON.parse(aiSaved) : [];
    
    // Default fallback mock trip if empty
    if (aiList.length === 0) {
      return [
        {
          id: 't-1',
          destination: 'Registan Expedition, Samarkand',
          startDate: '2026-09-15',
          endDate: '2026-09-22',
          travelers: 2,
          budget: 'Medium',
          style: 'Cultural',
          status: 'Upcoming',
          totalCost: 1200,
          image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 't-2',
          destination: 'Eiffel Tower Romantic Weekend, Paris',
          startDate: '2026-05-10',
          endDate: '2026-05-14',
          travelers: 2,
          budget: 'High',
          style: 'Luxury',
          status: 'Completed',
          totalCost: 3200,
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'
        }
      ];
    }
    return aiList.map((t: any) => ({
      id: t.id,
      destination: t.destination,
      startDate: t.startDate,
      endDate: t.endDate,
      travelers: t.travelers,
      budget: t.budget,
      style: t.style,
      status: new Date(t.startDate) > new Date() ? 'Upcoming' : 'Completed',
      totalCost: t.totalCost || 1500,
      image: t.image || 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80'
    }));
  });

  // Fetch remote trips from FastAPI backend on mount
  React.useEffect(() => {
    const fetchBackendTrips = async () => {
      if (!user) return;
      try {
        const data = await api.get<any[]>('/trips');
        if (data && Array.isArray(data)) {
          const remoteTrips = data.map((t: any) => ({
            id: t.id,
            destination: t.title || t.destination,
            startDate: t.content_json?.startDate || new Date().toISOString().split('T')[0],
            endDate: t.content_json?.endDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
            travelers: t.content_json?.travelers || 2,
            budget: t.content_json?.budget || 'Medium',
            style: t.content_json?.style || 'Adventure',
            status: new Date(t.content_json?.startDate || Date.now()) > new Date() ? 'Upcoming' : 'Completed',
            totalCost: t.content_json?.totalCost || 1500,
            share_token: t.share_token,
            image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80'
          }));

          setTrips(prev => {
            const combined = [...prev];
            remoteTrips.forEach((st: any) => {
              if (!combined.some(ct => String(ct.id) === String(st.id))) {
                combined.unshift(st);
              }
            });
            return combined;
          });
        }
      } catch (err) {
        console.warn('Failed to fetch trips from backend:', err);
      }
    };
    fetchBackendTrips();
  }, [user]);

  const handleDelete = async (id: string | number) => {
    const filtered = trips.filter(t => t.id !== id);
    setTrips(filtered);
    
    // Sync local back
    const aiSaved = localStorage.getItem('travel_uz_ai_trips');
    if (aiSaved) {
      const list = JSON.parse(aiSaved);
      localStorage.setItem('travel_uz_ai_trips', JSON.stringify(list.filter((t: any) => t.id !== id)));
    }

    // Sync remote delete
    try {
      if (typeof id === 'number' || (!String(id).startsWith('t-') && !String(id).startsWith('ai-'))) {
        await api.delete(`/trips/${id}`);
      }
    } catch (err) {
      console.warn('Failed to delete trip from backend:', err);
    }
    alert('Itinerary removed successfully.');
  };

  const filteredTrips = trips.filter(t => {
    if (activeSubTab === 'all') return true;
    return t.status.toLowerCase() === activeSubTab;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        {t('dashboard.myTripsTitle')}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        {t('dashboard.myTripsSubtitle')}
      </p>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '24px' }}>
        {(['all', 'upcoming', 'completed', 'draft'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: activeSubTab === tab ? 'var(--color-accent-glow)' : 'transparent',
              color: activeSubTab === tab ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredTrips.map(trip => (
          <div key={trip.id} className="glass-panel" style={{ overflow: 'hidden', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)' }}>
            <div style={{ height: '180px', position: 'relative' }}>
              <img src={trip.image} alt={trip.destination} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: trip.status === 'Upcoming' ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.9)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {trip.status}
              </div>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-purple)', textTransform: 'uppercase' }}>
                {trip.style} Trip
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>{trip.destination}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {trip.startDate}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {trip.travelers} Traveler(s)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '8px' }}>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{formatPrice(trip.totalCost)}</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onViewTrip ? onViewTrip(String(trip.id)) : alert('Inspecting trip map details...')} style={{ padding: '6px', color: 'var(--color-accent)' }} title="View"><Compass size={16} /></button>
                  <button onClick={() => onViewTrip ? onViewTrip(String(trip.id)) : alert('Editing itinerary schedule...')} style={{ padding: '6px', color: 'var(--color-purple)' }} title="Edit"><Edit3 size={16} /></button>
                  <button onClick={() => alert('Sharing itinerary URL...')} style={{ padding: '6px', color: 'var(--color-text-muted)' }} title="Share"><Share2 size={16} /></button>
                  <button onClick={() => handleDelete(trip.id)} style={{ padding: '6px', color: '#ef4444' }} title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTrips.length === 0 && (
          <div style={{ gridColumn: 'span 3', padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No trips found in this category.
          </div>
        )}
      </div>
    </motion.div>
  );
};


// ==================== FLIGHTS VIEW ====================
export const FlightsView: React.FC = () => {
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [classType, setClassType] = useState('Economy');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // Sorting / Filtering state
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');
  const [maxStops, setMaxStops] = useState<'all' | 'direct' | '1stop'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Mock flights lists
    const data = [
      { id: 'f-1', airline: 'Uzbekistan Airways', logo: '🇺🇿', code: 'HY-102', dep: '09:00 AM', arr: '02:30 PM', duration: '5.5h', stops: 0, price: 420 },
      { id: 'f-2', airline: 'Turkish Airlines', logo: '🇹🇷', code: 'TK-368', dep: '11:15 AM', arr: '08:45 PM', duration: '9.5h', stops: 1, price: 540 },
      { id: 'f-3', airline: 'Emirates', logo: '🇦🇪', code: 'EK-234', dep: '06:30 PM', arr: '04:10 AM', duration: '9.7h', stops: 1, price: 680 },
      { id: 'f-4', airline: 'FlyDubai', logo: '🇦🇪', code: 'FZ-712', dep: '02:10 AM', arr: '09:40 AM', duration: '7.5h', stops: 1, price: 390 },
      { id: 'f-5', airline: 'Lufthansa', logo: '🇩🇪', code: 'LH-402', dep: '05:30 AM', arr: '12:00 PM', duration: '6.5h', stops: 0, price: 620 }
    ];
    setResults(data);
  };

  const handleBook = (flight: any) => {
    const saved = localStorage.getItem('travel_uz_bookings');
    const bookings = saved ? JSON.parse(saved) : [];
    bookings.unshift({
      id: 'bk-' + Date.now(),
      type: 'flight',
      title: `${flight.airline} (${flight.code})`,
      details: `${from || 'Tashkent'} to ${to || 'Paris'} • Stops: ${flight.stops} • Class: ${classType}`,
      price: `$${flight.price}`,
      date: date || new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('travel_uz_bookings', JSON.stringify(bookings));
    alert('Flight ticket reserved successfully! Synced to My Trips bookings.');
  };

  // Apply sorting and filtering
  const processedFlights = results.filter(f => {
    if (maxStops === 'direct') return f.stops === 0;
    if (maxStops === '1stop') return f.stops <= 1;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    // duration sorting mock
    return parseFloat(a.duration) - parseFloat(b.duration);
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: searched ? '240px 1fr' : '1fr', gap: '32px' }}
      className="flights-view-layout"
    >
      {/* Filter Sidebar */}
      {searched && (
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filters & Sort</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Sort By</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '100%', fontSize: '0.85rem' }}>
              <option value="price">Cheapest Price</option>
              <option value="duration">Fastest Duration</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Stops</span>
            <select value={maxStops} onChange={(e) => setMaxStops(e.target.value as any)} style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '100%', fontSize: '0.85rem' }}>
              <option value="all">All Stops</option>
              <option value="direct">Direct Only</option>
              <option value="1stop">Max 1 Stop</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
          {t('dashboard.flightTitle')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          {t('dashboard.flightSubtitle')}
        </p>

        {/* Form */}
        <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', alignItems: 'end', background: 'var(--color-bg-surface)', marginBottom: '32px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>From Airport</label>
            <input type="text" required placeholder="Tashkent (TAS)" value={from} onChange={(e) => setFrom(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>To Airport</label>
            <input type="text" required placeholder="Paris (CDG)" value={to} onChange={(e) => setTo(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Departure Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--color-text-primary)' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Class</label>
            <select value={classType} onChange={(e) => setClassType(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }}>
              <option>Economy</option>
              <option>Business</option>
              <option>First</option>
            </select>
          </div>
          <button type="submit" className="btn-premium" style={{ height: '42px', border: 'none', width: '100%' }}>Search</button>
        </form>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {searched ? processedFlights.map(flight => (
            <div key={flight.id} className="glass-panel" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', alignItems: 'center', gap: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{flight.logo}</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{flight.airline}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{flight.code}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 800, display: 'block' }}>DEP TIME</span>
                <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{flight.dep}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 800, display: 'block' }}>DURATION</span>
                <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{flight.duration}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 800, display: 'block' }}>TRANSIT</span>
                <strong style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>${flight.price}</strong>
                <button onClick={() => handleBook(flight)} className="btn-premium" style={{ padding: '8px 16px', fontSize: '0.75rem', textTransform: 'none', border: 'none' }}>Book</button>
              </div>
            </div>
          )) : (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)' }}>
              <Plane size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto 8px auto' }} />
              Perform a flight parameters query to search ticket inventory.
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .flights-view-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </motion.div>
  );
};


// ==================== HOTELS VIEW ====================
export const HotelsView: React.FC = () => {
  const { t } = useLanguage();
  const [city, setCity] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [mapToggle, setMapToggle] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const data = [
      { id: 'h-1', name: 'Grand Hyatt Executive Resort', stars: 5, price: 180, rating: 4.8, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', amenities: ['WiFi', 'Pool', 'Gym', 'Spa'] },
      { id: 'h-2', name: 'Boutique Heritage Silk Lodge', stars: 4, price: 95, rating: 4.7, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', amenities: ['WiFi', 'Breakfast', 'Garden'] },
      { id: 'h-3', name: 'Aetheria Sky Heights Suites', stars: 5, price: 280, rating: 4.9, img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80', amenities: ['WiFi', 'Rooftop Bar', 'Spa', 'Pool'] }
    ];
    setResults(data);
  };

  const handleBook = (hotel: any) => {
    const saved = localStorage.getItem('travel_uz_bookings');
    const bookings = saved ? JSON.parse(saved) : [];
    bookings.unshift({
      id: 'bk-' + Date.now(),
      type: 'hotel',
      title: hotel.name,
      details: `${city || 'Paris'} Hotel Room reservation • ${hotel.stars} Stars`,
      price: `$${hotel.price} / night`,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('travel_uz_bookings', JSON.stringify(bookings));
    alert('Hotel booking confirmed! Details synced to bookings list.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
            {t('dashboard.hotelTitle')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('dashboard.hotelSubtitle')}
          </p>
        </div>
        {searched && (
          <button 
            onClick={() => setMapToggle(!mapToggle)} 
            className="btn-secondary" 
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            {mapToggle ? 'Grid View' : 'Map View'}
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '14px', alignItems: 'end', background: 'var(--color-bg-surface)', marginBottom: '32px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Search Location</label>
          <input type="text" required placeholder="e.g. Samarkand, Paris, Tokyo" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem' }} />
        </div>
        <button type="submit" className="btn-premium" style={{ height: '42px', border: 'none', padding: '0 24px' }}>Find Stays</button>
      </form>

      {/* Results grid or Map view */}
      {searched ? (
        mapToggle ? (
          /* Simulated Map */
          <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-surface)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--glass-border) 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.5 }} />
            <div style={{ zIndex: 10, textAlign: 'center' }}>
              <MapPin size={32} style={{ color: 'var(--color-accent)', margin: '0 auto 8px auto' }} />
              <strong style={{ color: 'var(--color-text-primary)' }}>Simulated Hotel Coordinate Maps</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Pins generated successfully bordering {city || 'search region'}.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {results.map(hotel => (
              <div key={hotel.id} className="glass-panel" style={{ overflow: 'hidden', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px' }}>
                  <img src={hotel.img} alt={hotel.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>{hotel.name}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} fill="#f59e0b" stroke="none" /> {hotel.rating}</span>
                  </div>
                  
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                    {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" stroke="none" />)}
                  </div>

                  {/* Amenities */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                    {hotel.amenities.map((am: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--color-bg)', borderRadius: '6px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        {am}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: 'auto' }}>
                    <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>${hotel.price} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/ night</span></strong>
                    <button onClick={() => handleBook(hotel)} className="btn-premium" style={{ padding: '8px 16px', fontSize: '0.75rem', textTransform: 'none', border: 'none' }}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)' }}>
          <Hotel size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto 8px auto' }} />
          Input coordinates to search for stays.
        </div>
      )}
    </motion.div>
  );
};


// ==================== ATTRACTIONS VIEW ====================
export const AttractionsView: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'historical' | 'nature' | 'food'>('all');

  const attractions = [
    { name: 'Registan Square', country: 'Uzbekistan', category: 'historical', score: '4.9', img: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=300&q=80' },
    { name: 'Chorsu Dome Bazaar', country: 'Uzbekistan', category: 'food', score: '4.8', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80' },
    { name: 'Eiffel Tower View', country: 'France', category: 'historical', score: '4.8', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80' },
    { name: 'Mount Fuji Trek', country: 'Japan', category: 'nature', score: '4.9', img: 'https://images.unsplash.com/photo-1490761908851-21209e858a63?auto=format&fit=crop&w=300&q=80' },
    { name: 'Monaco Harbor', country: 'France', category: 'nature', score: '4.7', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kyoto Bamboo Forest', country: 'Japan', category: 'nature', score: '4.8', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80' }
  ];

  const filtered = attractions.filter(a => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const handleSavePlace = (name: string) => {
    const saved = localStorage.getItem('travel_uz_saved_places');
    let list = saved ? JSON.parse(saved) : [];
    if (list.includes(name)) {
      list = list.filter((p: string) => p !== name);
      alert('Place removed from Saved.');
    } else {
      list.push(name);
      alert('Place added to Saved places.');
    }
    localStorage.setItem('travel_uz_saved_places', JSON.stringify(list));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        {t('dashboard.attractionTitle')}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        {t('dashboard.attractionSubtitle')}
      </p>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'historical', 'nature', 'food'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: filter === cat ? 'var(--color-accent-glow)' : 'var(--color-bg-surface)',
              color: filter === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {filtered.map((att, idx) => (
          <div key={idx} className="glass-panel" style={{ overflow: 'hidden', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)' }}>
            <div style={{ height: '160px', position: 'relative' }}>
              <img src={att.img} alt={att.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => handleSavePlace(att.name)}
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', color: '#ef4444' }}
              >
                <Heart size={14} fill="#ef4444" stroke="none" />
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase' }}>
                {att.country} • {att.category}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>{att.name}</h4>
              <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} fill="#f59e0b" stroke="none" /> {att.score} Rating</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


// ==================== SAVED MULTI-ENTITY VAULT ====================
export const SavedView: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [category, setCategory] = useState<'all' | 'trips' | 'tours' | 'hotels' | 'food' | 'attractions'>('all');
  const [savedDestinationFilter, setSavedDestinationFilter] = useState('All');

  const [savedItems, setSavedItems] = useState([
    {
      id: 's-1',
      title: 'Registan Ensemble & Sher-Dor',
      type: 'attractions',
      location: 'Samarkand, Uzbekistan',
      rating: 4.9,
      price: 8,
      imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80',
      badge: 'UNESCO Heritage'
    },
    {
      id: 's-2',
      title: 'Marakanda Silk Road 5-Day Tour',
      type: 'tours',
      location: 'Samarkand & Bukhara',
      rating: 4.9,
      price: 520,
      imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=400&q=80',
      badge: '95% Match'
    },
    {
      id: 's-3',
      title: 'Bibikhanum Folk Chaykhana',
      type: 'food',
      location: 'Samarkand Old Town',
      rating: 4.8,
      price: 12,
      imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80',
      badge: 'Authentic Plov'
    },
    {
      id: 's-4',
      title: 'Silk Road Heritage Boutique Hotel',
      type: 'hotels',
      location: 'Samarkand Historic Center',
      rating: 4.9,
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
      badge: '4★ Boutique'
    },
    {
      id: 's-5',
      title: 'Eiffel Tower View Suite',
      type: 'hotels',
      location: 'Paris, France',
      rating: 4.8,
      price: 240,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
      badge: 'Balcony View'
    }
  ]);

  const handleRemoveItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const filteredItems = savedItems.filter(item => {
    if (category !== 'all' && item.type !== category) return false;
    if (savedDestinationFilter !== 'All' && !item.location.toLowerCase().includes(savedDestinationFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Heart size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#ef4444' }}>
            Universal Bookmark Vault
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
          Saved Collections
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
          Your bookmarked trips, verified agency tours, boutique hotels, restaurants, and cultural sights.
        </p>
      </div>

      {/* 5-Category Tabs & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {[
            { id: 'all', label: `All (${savedItems.length})` },
            { id: 'trips', label: '🗺️ Trips' },
            { id: 'tours', label: '🎒 Tours' },
            { id: 'hotels', label: '🏨 Hotels' },
            { id: 'food', label: '🍽️ Food' },
            { id: 'attractions', label: '🏛️ Sights' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCategory(t.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                border: 'none',
                background: category === t.id ? 'var(--color-accent)' : 'transparent',
                color: category === t.id ? '#ffffff' : 'var(--color-text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter by destination */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Samarkand', 'Paris'].map(city => (
            <button
              key={city}
              onClick={() => setSavedDestinationFilter(city)}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                border: savedDestinationFilter === city ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                background: savedDestinationFilter === city ? 'rgba(37,99,235,0.15)' : 'var(--color-bg)',
                color: savedDestinationFilter === city ? '#ffffff' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {category === 'trips' ? (
        <MyTripsView />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: 'rgba(0,0,0,0.65)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {item.badge}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Remove from saved"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} style={{ color: 'var(--color-accent)' }} />
                    {item.location}
                  </span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>{formatPrice(item.price)}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 800 }}>
                    <Star size={12} fill="#f59e0b" stroke="none" /> {item.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ gridColumn: 'span 3', padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Heart size={32} style={{ opacity: 0.3, margin: '0 auto 12px auto' }} />
              <p style={{ margin: 0 }}>No saved items found in this category.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};


// ==================== AI ASSISTANT VIEW ====================
export const AIAssistantView: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([
    { sender: 'assistant', text: 'Hello! I am your TripMind AI Copilot. How can I guide your journey details today?' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input;
    setInput('');
    setSending(true);

    const updatedMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMsgs);

    try {
      const data = await api.post<any>('/trips/generate', {
        destination: userText,
        days: 3
      });
      const itin = data.itinerary || data.raw_trip_data;
      const botText = itin?.summary || `I generated a custom itinerary for ${userText}! Estimated cost: $${itin?.totalCost || 1500}`;
      setMessages([...updatedMsgs, { sender: 'assistant', text: botText }]);
    } catch (err) {
      console.warn('Backend query fallback:', err);
      let reply = 'I am looking up meteorological trends and visa requirements for your query. Let me know which coordinates you want to map out!';
      const textLower = userText.toLowerCase();
      if (textLower.includes('samarkand') || textLower.includes('uzbekistan')) {
        reply = 'Uzbekistan Golden Loop: Autumn is the best season (September-November), weather is 22°C. Over 80 countries have a 30-day visa waiver. Definitely try traditional Samarkand plov!';
      } else if (textLower.includes('weather') || textLower.includes('best time')) {
        reply = 'For European routes, visit in Summer (June-August). For Central Asian coordinates, choose Spring or Autumn to avoid extreme desert heat indices.';
      } else if (textLower.includes('visa')) {
        reply = 'Visa regulations can be verified directly on our 3D Globe drawer. Click a country to inspect safety scores, visas, and capital metadata.';
      }
      setMessages([...updatedMsgs, { sender: 'assistant', text: reply }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '750px', margin: '0 auto' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        {t('dashboard.assistantTitle')}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        {t('dashboard.assistantSubtitle')}
      </p>

      {/* Messages Window */}
      <div 
        className="glass-panel" 
        style={{
          flex: 1,
          minHeight: '320px',
          background: 'var(--color-bg-surface)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          marginBottom: '20px'
        }}
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              background: m.sender === 'user' ? 'linear-gradient(135deg, var(--color-accent), var(--color-purple))' : 'var(--color-bg)',
              color: m.sender === 'user' ? '#ffffff' : 'var(--color-text-primary)',
              padding: '12px 18px',
              borderRadius: '16px',
              borderBottomRightRadius: m.sender === 'user' ? '2px' : '16px',
              borderBottomLeftRadius: m.sender === 'assistant' ? '2px' : '16px',
              maxWidth: '80%',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              border: m.sender === 'user' ? 'none' : '1px solid var(--glass-border)'
            }}
          >
            {m.text}
          </div>
        ))}
        {sending && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            <Loader2 size={14} className="animate-spin" /> Claude is crafting a response...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('dashboard.chatPlaceholder')}
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '100px',
            border: '1px solid var(--glass-border)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem'
          }}
        />
        <button 
          type="submit" 
          className="btn-premium" 
          style={{ padding: '12px 24px', borderRadius: '100px', border: 'none' }}
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};


// ==================== PROFILE VIEW ====================
export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  
  const [name, setName] = useState(user?.name || 'Traveler');
  const [email, setEmail] = useState(user?.email || 'traveler@tripmind.com');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80');
  const [dietary, setDietary] = useState('Halal & Traditional');
  const [preferredPace, setPreferredPace] = useState('Balanced');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, avatar });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', maxWidth: '640px', margin: '0 auto' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        Traveler Profile & Preferences
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        Manage your profile, preferred currency, dietary preferences, and pacing.
      </p>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '32px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={avatar} alt="User Avatar" loading="lazy" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)' }} />
          <button 
            type="button"
            onClick={() => setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString()}`)}
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Change Avatar
          </button>
        </div>

        {/* Input Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Full Name
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }} />
        </div>

        {/* Input Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Email Address
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }} />
        </div>

        {/* Currency Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Preferred Currency Display
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dietary Preference */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Dietary Requirements
          </label>
          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
          >
            <option value="Halal & Traditional">Halal Certified & Traditional Food</option>
            <option value="Vegetarian">Vegetarian Friendly</option>
            <option value="Vegan">Vegan Only</option>
            <option value="Gluten-Free">Gluten-Free / Celiac</option>
            <option value="No Restrictions">No Restrictions</option>
          </select>
        </div>

        {/* Default Pacing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Default Travel Pacing
          </label>
          <select
            value={preferredPace}
            onChange={(e) => setPreferredPace(e.target.value)}
            style={{ padding: '12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
          >
            <option value="Relaxed">Relaxed (1-2 places/day, ample leisure)</option>
            <option value="Balanced">Balanced (3-4 places/day, steady rhythm)</option>
            <option value="Packed">Packed / Fast-Paced (5+ sights/day, maximum coverage)</option>
          </select>
        </div>

        {savedSuccess && (
          <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }}>
            ✓ Profile preferences saved successfully!
          </div>
        )}

        <button type="submit" className="btn-premium" style={{ width: '100%', padding: '12px', border: 'none', marginTop: '10px' }}>
          Save Preferences
        </button>
      </form>
    </motion.div>
  );
};


// ==================== SETTINGS VIEW ====================
export const SettingsView: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings state synced successfully.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        {t('dashboard.settingsTitle')}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        {t('dashboard.settingsSubtitle')}
      </p>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '32px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Appearance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'block' }}>Appearance Mode</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Toggle between light and dark space themes</span>
          </div>
          <button 
            type="button"
            onClick={toggleTheme}
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'block' }}>System Language</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Choose dictionary translation locale</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([
              { id: 'EN', label: '🇬🇧 English' },
              { id: 'RU', label: '🇷🇺 Русский' },
              { id: 'UZ', label: '🇺🇿 O‘zbekcha' }
            ] as const).map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id.toLowerCase() as any)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: language === l.id.toLowerCase() ? 'var(--color-accent-glow)' : 'var(--color-bg)',
                  color: language === l.id.toLowerCase() ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flex: 1
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Notifications</strong>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} style={{ width: '16px', height: '16px' }} />
            <span>Send trip updates and reminders via email</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} style={{ width: '16px', height: '16px' }} />
            <span>Enable browser push alerts for live updates</span>
          </label>
        </div>

        {/* Security / Dangerous actions */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: '#ef4444', display: 'block' }}>Delete Account</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Permanently erase your data logs</span>
          </div>
          <button 
            type="button" 
            onClick={() => {
              if (confirm('Are you absolutely sure you want to delete your TripMind account?')) {
                alert('Account deleted.');
              }
            }} 
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            Delete
          </button>
        </div>

        <button type="submit" className="btn-premium" style={{ width: '100%', padding: '12px', border: 'none' }}>
          Save System Settings
        </button>
      </form>
    </motion.div>
  );
};
