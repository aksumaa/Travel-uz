import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Compass, Download, Plus, 
  Trash2, Edit3, MapPin, Star, AlertTriangle, CloudRain, 
  Wind, Thermometer, Check, X, FileText, CheckCircle2, 
  RefreshCw, Shield, Sparkles, Coffee, Utensils, Hotel, 
  Car, ShoppingBag, Music, Navigation, Share2, Layers, 
  Zap, Clock, DollarSign, ChevronRight, Landmark 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { TripMap, type MapPoint } from '../components/TripMap';
import { PlaceDetailModal, type PlaceDetailData } from '../components/PlaceDetailModal';
import { ReadyToursSection } from '../components/ReadyToursSection';
import type { ActivityCategory } from '../types/travel';

interface TripDetailsViewProps {
  tripId: string;
  onBack: () => void;
}

type WorkspaceViewMode = 'timeline' | 'calendar' | 'map';

export const TripDetailsView: React.FC<TripDetailsViewProps> = ({ tripId, onBack }) => {
  const { formatPrice, currency } = useCurrency();

  const [trip, setTrip] = useState<any>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('timeline');
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<PlaceDetailData | null>(null);

  // In-Trip Real-Time AI Adaptation Drawer State
  const [showAdaptationDrawer, setShowAdaptationDrawer] = useState(false);
  const [activeAdaptationPrompt, setActiveAdaptationPrompt] = useState<string | null>(null);
  const [adaptationDiff, setAdaptationDiff] = useState<{
    prompt: string;
    reason: string;
    removing: string[];
    adding: string[];
    costImpactUSD: number;
    walkingSavedKm: number;
  } | null>(null);

  // Add Custom Activity Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customActivity, setCustomActivity] = useState({
    section: 'morning' as 'morning' | 'afternoon' | 'evening',
    category: 'attraction' as ActivityCategory,
    activity: '',
    location: '',
    duration: '2 hours',
    cost: 10,
    tip: ''
  });

  // Inline Title Editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');

  // Load trip from localStorage or backend
  useEffect(() => {
    const localTripsSaved = localStorage.getItem('travel_uz_ai_trips');
    if (localTripsSaved) {
      const parsed = JSON.parse(localTripsSaved);
      const found = parsed.find((t: any) => String(t.id) === String(tripId));
      if (found) {
        if (!found.rawTripData) {
          const daysCount = found.itinerary ? found.itinerary.length : 3;
          found.rawTripData = {
            title: found.destination,
            summary: `Tailored itinerary for ${found.travelers || 2} travelers. Style: ${found.style || 'Balanced'}.`,
            totalCost: found.totalCost || Number(found.budget) || 1200,
            days: Array.from({ length: daysCount }, (_, i) => ({
              day: i + 1,
              date: `Day ${i + 1}`,
              morning: {
                activity: found.itinerary?.[i]?.activities?.[0]?.replace('Morning: ', '') || 'Registan Square & Sher-Dor Madrasah',
                category: 'attraction',
                location: `${found.destination?.split(',')[0] || 'Samarkand'} Center`,
                duration: '2.5 hours',
                cost: 8,
                tip: 'Wear comfortable shoes and sun protection.',
                isVerified: true,
                rating: 4.9,
                reviewsCount: 1200,
                lat: 39.6548,
                lng: 66.9757
              },
              lunch: {
                restaurant: 'Bibikhanum Chaykhana',
                cuisine: 'Traditional Samarkand Plov',
                cost: 10,
                address: 'Tashkent St',
                rating: 4.8,
                isVerified: true,
                category: 'food'
              },
              afternoon: {
                activity: found.itinerary?.[i]?.activities?.[1]?.replace('Afternoon: ', '') || 'Siab Folk Bazaar Walk',
                category: 'shopping',
                location: 'Bazaar Gate',
                duration: '2.5 hours',
                cost: 5,
                tip: 'Sample dried fruits and sweet halva freely.',
                isVerified: true,
                rating: 4.7,
                reviewsCount: 650,
                lat: 39.6592,
                lng: 66.9805
              },
              evening: {
                restaurant: found.itinerary?.[i]?.activities?.[2]?.replace('Evening: Dinner at ', '')?.split(' (')[0] || 'Grand Oasis Chaykhana',
                cuisine: 'Traditional Shashlik & Salad',
                cost: 25,
                address: 'Historic Quarter',
                rating: 4.8,
                isVerified: true,
                category: 'food'
              },
              hotel: {
                name: found.itinerary?.[i]?.activities?.[3]?.replace('Hotel: ', '')?.split(' (')[0] || 'Silk Road Heritage Boutique Hotel',
                stars: 4,
                price: 85,
                area: 'Historic Old City',
                rating: 4.9
              },
              dailyCost: 133
            })),
            packingTips: ['Universal adapter plug', 'Local cash for bazaars', 'Scarf for holy places']
          };
        }
        setTrip(found);
        setEditableTitle(found.rawTripData.title || found.destination);
      }
    }
  }, [tripId]);

  if (!trip) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p>Loading Trip Workspace...</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '12px', padding: '8px 16px' }}>
          Back to My Trips
        </button>
      </div>
    );
  }

  const activeDay = trip.rawTripData.days[activeDayIdx] || trip.rawTripData.days[0];

  // Helper to extract category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'attraction': return <Landmark size={15} style={{ color: '#2563eb' }} />;
      case 'food': return <Utensils size={15} style={{ color: '#f59e0b' }} />;
      case 'cafe': return <Coffee size={15} style={{ color: '#d97706' }} />;
      case 'transport': return <Car size={15} style={{ color: '#06b6d4' }} />;
      case 'shopping': return <ShoppingBag size={15} style={{ color: '#ec4899' }} />;
      case 'entertainment': return <Music size={15} style={{ color: '#8b5cf6' }} />;
      case 'lodging': return <Hotel size={15} style={{ color: '#10b981' }} />;
      default: return <Compass size={15} style={{ color: '#2563eb' }} />;
    }
  };

  // Convert current day schedule items into MapPoints for TripMap
  const mapPoints: MapPoint[] = [
    {
      id: 'morning-node',
      title: activeDay.morning.activity,
      category: activeDay.morning.category || 'attraction',
      lat: activeDay.morning.lat || 39.6548,
      lng: activeDay.morning.lng || 66.9757,
      timeSlot: 'Morning (09:00 - 12:30)',
      cost: activeDay.morning.cost,
      address: activeDay.morning.location,
      isVerified: activeDay.morning.isVerified ?? true
    },
    {
      id: 'lunch-node',
      title: activeDay.lunch ? `Lunch: ${activeDay.lunch.restaurant}` : 'Local Lunch Break',
      category: 'food',
      lat: (activeDay.morning.lat || 39.6548) + 0.003,
      lng: (activeDay.morning.lng || 66.9757) + 0.002,
      timeSlot: 'Lunch (12:30 - 14:00)',
      cost: activeDay.lunch?.cost || 10,
      address: activeDay.lunch?.address || 'City Center',
      isVerified: true
    },
    {
      id: 'afternoon-node',
      title: activeDay.afternoon.activity,
      category: activeDay.afternoon.category || 'shopping',
      lat: activeDay.afternoon.lat || 39.6592,
      lng: activeDay.afternoon.lng || 66.9805,
      timeSlot: 'Afternoon (14:00 - 17:30)',
      cost: activeDay.afternoon.cost,
      address: activeDay.afternoon.location,
      isVerified: activeDay.afternoon.isVerified ?? true
    },
    {
      id: 'evening-node',
      title: `Dinner: ${activeDay.evening.restaurant}`,
      category: 'food',
      lat: (activeDay.afternoon.lat || 39.6592) - 0.002,
      lng: (activeDay.afternoon.lng || 66.9805) + 0.004,
      timeSlot: 'Evening (18:00 - 21:00)',
      cost: activeDay.evening.cost,
      address: activeDay.evening.address,
      isVerified: true
    }
  ];

  // Save changes to localStorage
  const persistTrip = (updatedTrip: any) => {
    setTrip(updatedTrip);
    const localTripsSaved = localStorage.getItem('travel_uz_ai_trips');
    if (localTripsSaved) {
      const parsed = JSON.parse(localTripsSaved);
      const idx = parsed.findIndex((t: any) => String(t.id) === String(trip.id));
      if (idx !== -1) {
        parsed[idx] = updatedTrip;
        localStorage.setItem('travel_uz_ai_trips', JSON.stringify(parsed));
      }
    }
  };

  // Title Save
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (!editableTitle.trim()) return;
    const updated = {
      ...trip,
      rawTripData: {
        ...trip.rawTripData,
        title: editableTitle
      }
    };
    persistTrip(updated);
  };

  // Add Day
  const handleAddDay = () => {
    const newDayNum = trip.rawTripData.days.length + 1;
    const newDay = {
      day: newDayNum,
      date: `Day ${newDayNum}`,
      morning: {
        activity: 'Morning Sightseeing & Cultural Discovery',
        category: 'attraction',
        location: `${trip.destination?.split(',')[0]} Historic Quarter`,
        duration: '2.5 hours',
        cost: 10,
        tip: 'Check morning ticket queues early.',
        isVerified: true,
        rating: 4.8
      },
      lunch: {
        restaurant: 'Local Artisan Cafe',
        cuisine: 'Regional Specialty & Tea',
        cost: 12,
        address: 'Bazaar Promenade',
        isVerified: true
      },
      afternoon: {
        activity: 'Afternoon Craft Quarter & Panoramic Viewpoint',
        category: 'shopping',
        location: 'Old Town Promenade',
        duration: '2 hours',
        cost: 5,
        tip: 'Great photo vantage point during afternoon light.',
        isVerified: true
      },
      evening: {
        restaurant: 'Courtyard Grill & Teahouse',
        cuisine: 'Traditional Grill & Bread',
        cost: 20,
        address: 'Old City Center',
        isVerified: true
      },
      hotel: activeDay.hotel,
      dailyCost: 120
    };

    const updated = {
      ...trip,
      rawTripData: {
        ...trip.rawTripData,
        days: [...trip.rawTripData.days, newDay]
      }
    };
    persistTrip(updated);
    setActiveDayIdx(newDayNum - 1);
  };

  // PDF Export
  const handleDownloadPdf = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.open(`${baseUrl}/trips/${trip.id}/pdf`, '_blank');
  };

  // Share Public Link
  const handleShareLink = () => {
    const token = trip.share_token || 'public-trip-share';
    const url = `${window.location.origin}/trip/${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert(`Public share link copied to clipboard:\n${url}`);
    } else {
      prompt('Copy share link:', url);
    }
  };

  // Trigger Adaptation Options
  const handleTriggerAdaptation = (promptKey: string) => {
    setActiveAdaptationPrompt(promptKey);

    let diff = {
      prompt: promptKey,
      reason: 'User fatigue / high walking distance reported',
      removing: ['14:30 – High-exertion 3km walking tour of outer quarters'],
      adding: ['14:30 – Traditional hammam relaxation & shaded teahouse garden lounge (Chaykhana Oasis)'],
      costImpactUSD: -5,
      walkingSavedKm: 2.8
    };

    if (promptKey === 'raining') {
      diff = {
        prompt: 'It is raining',
        reason: 'Precipitation detected in itinerary area',
        removing: ['14:30 – Open-air boulevard park & architectural garden walk'],
        adding: ['14:30 – Covered historical domed bazaar (Taqi Zargaron) & indoor carpet museum'],
        costImpactUSD: 2,
        walkingSavedKm: 1.5
      };
    } else if (promptKey === 'budget') {
      diff = {
        prompt: '$40 remaining today',
        reason: 'Budget constraint optimization applied',
        removing: ['19:00 – Premium multi-course rooftop banquet ($35/person)'],
        adding: ['19:00 – Legendary family somsa & tandoor grill lokanta ($7/person) + free evening park stroll'],
        costImpactUSD: -28,
        walkingSavedKm: 0.2
      };
    } else if (promptKey === 'cluster') {
      diff = {
        prompt: 'Move activities closer',
        reason: 'Transit fatigue minimization',
        removing: ['15:30 – Outlying observatory 6km across city'],
        adding: ['15:30 – Adjacent 15th-century madrasah courtyard within 300m walking radius'],
        costImpactUSD: 0,
        walkingSavedKm: 4.2
      };
    }

    setAdaptationDiff(diff);
    setShowAdaptationDrawer(true);
  };

  // Apply Adaptation Swap
  const handleApplyAdaptation = () => {
    if (!adaptationDiff) return;

    const currentDays = [...trip.rawTripData.days];
    const targetDay = { ...currentDays[activeDayIdx] };

    if (adaptationDiff.prompt.includes('rain') || adaptationDiff.prompt === 'raining') {
      targetDay.afternoon = {
        ...targetDay.afternoon,
        activity: 'Covered Historical Domed Bazaar & Carpet Museum',
        category: 'shopping',
        tip: 'Completely indoor & rain-sheltered. Free tea inside craft stalls.',
        cost: 4
      };
    } else if (adaptationDiff.prompt.includes('tired')) {
      targetDay.afternoon = {
        ...targetDay.afternoon,
        activity: 'Traditional Hammam & Shaded Teahouse Lounge',
        category: 'entertainment',
        tip: 'Resting tea ceremony with herbal infusion and sweets.',
        cost: 15
      };
    } else if (adaptationDiff.prompt.includes('budget')) {
      targetDay.evening = {
        ...targetDay.evening,
        restaurant: 'Family Tandoor Somsa & Plov Lokanta',
        cost: 8,
        cuisine: 'Fresh clay-baked somsa and spiced tea'
      };
    }

    currentDays[activeDayIdx] = targetDay;
    const updated = {
      ...trip,
      rawTripData: {
        ...trip.rawTripData,
        days: currentDays
      }
    };
    persistTrip(updated);
    setShowAdaptationDrawer(false);
    setAdaptationDiff(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      
      {/* Top Breadcrumb & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary, #94a3b8)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Trips</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleTriggerAdaptation('tired')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Zap size={14} />
            <span>"I'm Tired"</span>
          </button>

          <button
            onClick={() => handleTriggerAdaptation('raining')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              background: 'rgba(6, 182, 212, 0.1)',
              color: '#06b6d4',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <CloudRain size={14} />
            <span>"It's Raining"</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleShareLink}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Share2 size={14} />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Header Banner */}
      <div
        style={{
          background: 'var(--color-bg-surface, #0f172a)',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
          borderRadius: '24px',
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--color-accent, #2563eb)',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {trip.style || 'Balanced'} Strategy
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)' }}>
                📍 {trip.destination}
              </span>
            </div>

            {/* Editable Title */}
            {isEditingTitle ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    background: 'var(--color-bg, #090d1a)',
                    border: '1px solid var(--color-accent, #2563eb)',
                    borderRadius: '8px',
                    padding: '4px 12px',
                  }}
                />
                <button
                  onClick={handleSaveTitle}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Save
                </button>
              </div>
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                style={{
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary, #ffffff)',
                  fontFamily: 'var(--font-heading, sans-serif)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                title="Click to edit trip title"
              >
                <span>{trip.rawTripData.title || trip.destination}</span>
                <Edit3 size={16} style={{ opacity: 0.4 }} />
              </h1>
            )}
          </div>

          {/* Telemetry Chips & Budget Health */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div
              style={{
                background: 'var(--color-bg, #090d1a)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
              <span>{trip.rawTripData.days?.length || 5} Days ({trip.startDate || 'Upcoming'})</span>
            </div>

            <div
              style={{
                background: 'var(--color-bg, #090d1a)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <User size={14} style={{ color: '#8b5cf6' }} />
              <span>{trip.travelers || 2} Travelers</span>
            </div>

            <div
              style={{
                background: 'var(--color-bg, #090d1a)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
              }}
            >
              <DollarSign size={14} style={{ color: '#10b981' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>Est. Total:</span>
              <strong style={{ color: '#10b981' }}>{formatPrice(trip.rawTripData.totalCost || 1200)}</strong>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border, rgba(255,255,255,0.06))', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--color-bg, #090d1a)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            {[
              { id: 'timeline', label: '📋 Timeline (List)' },
              { id: 'calendar', label: '📅 Calendar View' },
              { id: 'map', label: '🗺️ Map View' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id as WorkspaceViewMode)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: viewMode === m.id ? 'var(--color-accent, #2563eb)' : 'transparent',
                  color: viewMode === m.id ? '#ffffff' : 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Day selection pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {trip.rawTripData.days.map((day: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveDayIdx(idx)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: activeDayIdx === idx ? '1px solid var(--color-accent, #2563eb)' : '1px solid var(--glass-border)',
                  background: activeDayIdx === idx ? 'rgba(37, 99, 235, 0.15)' : 'var(--color-bg, #090d1a)',
                  color: activeDayIdx === idx ? '#ffffff' : 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Day {day.day}
              </button>
            ))}

            <button
              onClick={handleAddDay}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px dashed var(--glass-border)',
                background: 'transparent',
                color: 'var(--color-accent)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={14} /> Add Day
            </button>
          </div>
        </div>
      </div>

      {/* ==================== WORKSPACE MODE 1: TIMELINE (LIST) ==================== */}
      {viewMode === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="workspace-split-grid">
          
          {/* Left Column: Sequential Day Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                  Day {activeDay.day} Schedule
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Estimated daily spend: <strong style={{ color: '#10b981' }}>{formatPrice(activeDay.dailyCost || 135)}</strong>
                </span>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--color-accent, #2563eb)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>Add Stop</span>
              </button>
            </div>

            {/* 1. MORNING BLOCK */}
            <div
              onClick={() => setSelectedPlaceForModal(activeDay.morning)}
              style={{
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: 'rgba(37, 99, 235, 0.15)',
                      color: 'var(--color-accent, #2563eb)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    🌅 09:00 - 12:30 • MORNING
                  </span>
                  {activeDay.morning.isVerified && (
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Shield size={10} /> Verified POI
                    </span>
                  )}
                </div>
                <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>
                  {activeDay.morning.cost === 0 ? 'Free' : formatPrice(activeDay.morning.cost || 8)}
                </strong>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getCategoryIcon(activeDay.morning.category)}
                  <span>{activeDay.morning.activity}</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} style={{ color: 'var(--color-accent)' }} />
                  {activeDay.morning.location} • Dwell: {activeDay.morning.duration || '2.5 hrs'}
                </span>
              </div>

              {activeDay.morning.tip && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                  💡 {activeDay.morning.tip}
                </div>
              )}
            </div>

            {/* TRANSIT INTERSTITIAL (Walking) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>
              <Navigation size={12} style={{ color: 'var(--color-accent)' }} />
              <span>12 min walk (950m) through pedestrian park to lunch spot</span>
            </div>

            {/* 2. LUNCH BREAK */}
            <div
              onClick={() => setSelectedPlaceForModal(activeDay.lunch || {
                title: 'Chaykhana Oasis',
                category: 'food',
                location: 'Main Bazaar',
                cost: 10,
                rating: 4.8
              })}
              style={{
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  🍲 12:30 - 14:00 • LUNCH
                </span>
                <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>
                  {formatPrice(activeDay.lunch?.cost || 10)}
                </strong>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getCategoryIcon('food')}
                  <span>{activeDay.lunch?.restaurant || 'Traditional Silk Road Chaykhana'}</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {activeDay.lunch?.cuisine || 'Authentic Samarkand Plov, Achichuk Salad & Green Tea'}
                </span>
              </div>
            </div>

            {/* TRANSIT INTERSTITIAL (Taxi) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>
              <Car size={12} style={{ color: '#06b6d4' }} />
              <span>5 min taxi ride (~$1.50) to afternoon heritage quarter</span>
            </div>

            {/* 3. AFTERNOON BLOCK */}
            <div
              onClick={() => setSelectedPlaceForModal(activeDay.afternoon)}
              style={{
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: 'rgba(236, 72, 153, 0.15)',
                      color: '#ec4899',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    ☀️ 14:00 - 17:30 • AFTERNOON
                  </span>
                  {activeDay.afternoon.isVerified && (
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Shield size={10} /> Verified POI
                    </span>
                  )}
                </div>
                <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>
                  {activeDay.afternoon.cost === 0 ? 'Free Entry' : formatPrice(activeDay.afternoon.cost || 5)}
                </strong>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeDay.afternoon.activity}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} style={{ color: '#ec4899' }} />
                  {activeDay.afternoon.location} • Dwell: {activeDay.afternoon.duration || '2.5 hrs'}
                </span>
              </div>

              {activeDay.afternoon.tip && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                  💡 {activeDay.afternoon.tip}
                </div>
              )}
            </div>

            {/* 4. EVENING DINING BLOCK */}
            <div
              onClick={() => setSelectedPlaceForModal({
                title: activeDay.evening.restaurant,
                category: 'food',
                location: activeDay.evening.address,
                cost: activeDay.evening.cost,
                rating: 4.8
              })}
              style={{
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#a855f7',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  🌙 18:00 - 21:00 • DINNER
                </span>
                <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>
                  {formatPrice(activeDay.evening.cost || 25)}
                </strong>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeDay.evening.restaurant}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {activeDay.evening.cuisine} • {activeDay.evening.address}
                </span>
              </div>
            </div>

            {/* 5. HOTEL LODGING NODE */}
            {activeDay.hotel && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    🏨 NIGHT LODGING
                  </span>
                  <h4 style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                    {activeDay.hotel.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {activeDay.hotel.stars}★ Boutique • {activeDay.hotel.area}
                  </span>
                </div>
                <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>
                  {formatPrice(activeDay.hotel.price || 85)} / night
                </strong>
              </div>
            )}

          </div>

          {/* Right Column: Synchronized Sticky Map */}
          <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 130px)', minHeight: '520px' }}>
            <TripMap
              locations={mapPoints}
              interactive={true}
              height="100%"
              onSelectLocation={(id) => {
                const match = mapPoints.find((m) => m.id === id);
                if (match) {
                  setSelectedPlaceForModal({
                    title: match.title,
                    category: match.category,
                    location: match.address,
                    cost: match.cost,
                    isVerified: match.isVerified
                  });
                }
              }}
            />
          </div>

        </div>
      )}

      {/* ==================== WORKSPACE MODE 2: CALENDAR VIEW ==================== */}
      {viewMode === 'calendar' && (
        <div
          style={{
            background: 'var(--color-bg-surface, #0f172a)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Day {activeDay.day} Hourly Calendar Timeline
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Standard operating slots 08:30 – 21:30
            </span>
          </div>

          {/* Time Block Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { time: '08:30 - 09:30', title: 'Breakfast at Boutique Hotel', cat: 'food', color: '#f59e0b', cost: 0 },
              { time: '09:30 - 12:30', title: activeDay.morning.activity, cat: 'attraction', color: '#2563eb', cost: activeDay.morning.cost },
              { time: '12:30 - 14:00', title: `Lunch: ${activeDay.lunch?.restaurant || 'Traditional Chaykhana'}`, cat: 'food', color: '#f59e0b', cost: activeDay.lunch?.cost || 10 },
              { time: '14:00 - 14:15', title: 'Walking / Taxi Transit Gap', cat: 'transport', color: '#06b6d4', cost: 1.5 },
              { time: '14:15 - 17:30', title: activeDay.afternoon.activity, cat: 'shopping', color: '#ec4899', cost: activeDay.afternoon.cost },
              { time: '17:30 - 18:30', title: 'Rest & Hotel Refreshment Buffer', cat: 'lodging', color: '#10b981', cost: 0 },
              { time: '18:30 - 21:00', title: `Dinner: ${activeDay.evening.restaurant}`, cat: 'food', color: '#8b5cf6', cost: activeDay.evening.cost }
            ].map((slot, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr 100px',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--color-bg, #090d1a)',
                  border: '1px solid var(--glass-border)',
                  borderLeft: `4px solid ${slot.color}`,
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                  {slot.time}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {slot.title}
                </span>
                <strong style={{ fontSize: '0.85rem', color: '#10b981', textAlign: 'right' }}>
                  {slot.cost === 0 ? 'Included' : formatPrice(slot.cost)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== WORKSPACE MODE 3: FULL MAP VIEW ==================== */}
      {viewMode === 'map' && (
        <div style={{ height: '70vh', minHeight: '480px' }}>
          <TripMap
            locations={mapPoints}
            interactive={true}
            height="100%"
            onSelectLocation={(id) => {
              const match = mapPoints.find((m) => m.id === id);
              if (match) {
                setSelectedPlaceForModal({
                  title: match.title,
                  category: match.category,
                  location: match.address,
                  cost: match.cost,
                  isVerified: match.isVerified
                });
              }
            }}
          />
        </div>
      )}

      {/* ==================== EMBEDDED READY TOURS SECTION ==================== */}
      <div style={{ marginTop: '24px' }}>
        <ReadyToursSection
          destination={trip.destination}
          durationDays={trip.rawTripData.days?.length || 5}
          travelersCount={trip.travelers || 2}
          estimatedBudgetUSD={trip.rawTripData.totalCost || 1200}
          showComparisonOption={true}
        />
      </div>

      {/* ==================== PLACE DETAIL MODAL ==================== */}
      {selectedPlaceForModal && (
        <PlaceDetailModal
          place={selectedPlaceForModal}
          isOpen={Boolean(selectedPlaceForModal)}
          onClose={() => setSelectedPlaceForModal(null)}
          onAddToTrip={() => {
            alert('Added to your day itinerary!');
            setSelectedPlaceForModal(null);
          }}
        />
      )}

      {/* ==================== IN-TRIP ADAPTATION DIFF DRAWER ==================== */}
      {showAdaptationDrawer && adaptationDiff && (
        <AnimatePresence>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1200,
              padding: '16px',
            }}
            onClick={() => setShowAdaptationDrawer(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'var(--color-bg-surface, #0f172a)',
                border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#f59e0b' }}>
                    Live In-Trip Adaptation
                  </span>
                </div>
                <button
                  onClick={() => setShowAdaptationDrawer(false)}
                  style={{ color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                  Proposed Day {activeDay.day} Schedule Rebalance
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {activeAdaptationPrompt ? `Triggered by: "${activeAdaptationPrompt}" • ` : ''}Reason: {adaptationDiff.reason}. The adaptation engine reorganizes remaining slots without wiping booked hotel nights:
                </p>
              </div>

              {/* Diff Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                    🔴 Removing Outdoor / High-Exertion Slot:
                  </span>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '2px' }}>
                    {adaptationDiff.removing[0]}
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 12px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    🟢 Substituting Sheltered / Relaxed Alternative:
                  </span>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '2px' }}>
                    {adaptationDiff.adding[0]}
                  </div>
                </div>
              </div>

              {/* Metrics impact */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>💰 Budget impact: {adaptationDiff.costImpactUSD <= 0 ? 'Saved' : '+'} {formatPrice(Math.abs(adaptationDiff.costImpactUSD))}</span>
                <span>🚶 Walking saved: {adaptationDiff.walkingSavedKm} km</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => setShowAdaptationDrawer(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Discard & Keep Original
                </button>
                <button
                  onClick={handleApplyAdaptation}
                  className="btn-premium"
                  style={{
                    flex: 1.4,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Apply Schedule Swap
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* ==================== ADD ACTIVITY MODAL ==================== */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'var(--color-bg-surface, #0f172a)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'left',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Add Activity to Day {activeDay.day}
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Activity Title
              </label>
              <input
                type="text"
                placeholder="e.g. Gur-e-Amir Night Illumination"
                value={customActivity.activity}
                onChange={(e) => setCustomActivity({ ...customActivity, activity: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={customActivity.category}
                onChange={(e) => setCustomActivity({ ...customActivity, category: e.target.value as ActivityCategory })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
              >
                <option value="attraction">Attraction / Monument</option>
                <option value="food">Restaurant / Food</option>
                <option value="cafe">Cafe / Teahouse</option>
                <option value="shopping">Shopping / Bazaar</option>
                <option value="entertainment">Entertainment / Show</option>
                <option value="transport">Transport / Transfer</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Slot
                </label>
                <select
                  value={customActivity.section}
                  onChange={(e) => setCustomActivity({ ...customActivity, section: e.target.value as any })}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Cost ({currency})
                </label>
                <input
                  type="number"
                  value={customActivity.cost}
                  onChange={(e) => setCustomActivity({ ...customActivity, cost: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!customActivity.activity.trim()) return;
                  const currentDays = [...trip.rawTripData.days];
                  const d = { ...currentDays[activeDayIdx] };
                  if (customActivity.section === 'morning') {
                    d.morning = {
                      activity: customActivity.activity,
                      category: customActivity.category,
                      location: `${trip.destination?.split(',')[0]} Center`,
                      duration: customActivity.duration,
                      cost: customActivity.cost,
                      isVerified: false
                    };
                  } else if (customActivity.section === 'afternoon') {
                    d.afternoon = {
                      activity: customActivity.activity,
                      category: customActivity.category,
                      location: `${trip.destination?.split(',')[0]} Center`,
                      duration: customActivity.duration,
                      cost: customActivity.cost,
                      isVerified: false
                    };
                  }
                  currentDays[activeDayIdx] = d;
                  persistTrip({ ...trip, rawTripData: { ...trip.rawTripData, days: currentDays } });
                  setIsAddModalOpen(false);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Layout CSS helper */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .workspace-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

    </div>
  );
};
