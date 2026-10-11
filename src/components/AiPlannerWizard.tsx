import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Compass, Calendar, Users, DollarSign,
  ArrowRight, ArrowLeft, Check, RefreshCw, Share2, 
  Save, Edit3, MapPin, Star, Hotel, Utensils, 
  Car, Clock, CheckCircle2, AlertCircle, Plus, Trash2, Heart
} from '../icons';
import { useCurrency, type CurrencyCode } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  plannerService, 
  type PlannerInput, 
  type GeneratedTripResult, 
  type TravelStyle, 
  type TimeSlotActivity 
} from '../services/plannerService';

interface AiPlannerWizardProps {
  initialDestination?: string;
  onTripGenerated?: (trip: any) => void;
  onNavigateToMyTrips?: () => void;
}

const POPULAR_DESTINATIONS = [
  { name: 'Samarkand, Uzbekistan', flag: '🇺🇿', popular: true },
  { name: 'Bukhara, Uzbekistan', flag: '🇺🇿', popular: true },
  { name: 'Khiva, Uzbekistan', flag: '🇺🇿', popular: true },
  { name: 'Tashkent, Uzbekistan', flag: '🇺🇿', popular: true },
  { name: 'Paris, France', flag: '🇫🇷', popular: true },
  { name: 'Tokyo, Japan', flag: '🇯🇵', popular: true },
  { name: 'Rome, Italy', flag: '🇮🇹', popular: true },
  { name: 'Istanbul, Turkey', flag: '🇹🇷', popular: true },
  { name: 'Dubai, UAE', flag: '🇦🇪', popular: true },
  { name: 'Bali, Indonesia', flag: '🇮🇩', popular: true },
  { name: 'Cairo, Egypt', flag: '🇪🇬', popular: false },
  { name: 'New York City, USA', flag: '🇺🇸', popular: false }
];

const TRAVEL_STYLES: Array<{
  id: TravelStyle;
  label: string;
  icon: string;
  tagline: string;
  description: string;
}> = [
  { id: 'Relaxation', label: 'Relaxation', icon: '🧘', tagline: 'Unwind & Recharge', description: 'Leisurely pace, scenic parks, peaceful wellness spas & cozy teahouses.' },
  { id: 'Adventure', label: 'Adventure', icon: '🧗', tagline: 'Thrills & Exploration', description: 'Active mountain trails, outdoor excursions, hidden ruins & discovery.' },
  { id: 'Food', label: 'Food & Gastronomy', icon: '🍲', tagline: 'Culinary Journey', description: 'Authentic local bazaars, traditional plov centers, tastings & rooftop dining.' },
  { id: 'Culture', label: 'Culture & Heritage', icon: '🏛️', tagline: 'History & Marvels', description: 'UNESCO World Heritage monuments, ancient madrasahs, artisan crafts & museums.' },
  { id: 'Nature', label: 'Nature & Scenic', icon: '🌲', tagline: 'Wild Landscapes', description: 'Pristine mountain passes, tranquil oasis lakes, desert dunes & flora.' },
  { id: 'Luxury', label: 'Luxury & VIP', icon: '✨', tagline: 'Premium Indulgence', description: 'Boutique heritage suites, private air-conditioned transit & five-star dining.' },
  { id: 'Budget', label: 'Budget Explorer', icon: '🏷️', tagline: 'Smart & High Value', description: 'Authentic local stays, public transit routes, street dining & maximum savings.' },
  { id: 'Family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦', tagline: 'Comfort for All Ages', description: 'Kid-friendly sights, spacious pacing, shaded rests & accessible transport.' }
];

const INTEREST_OPTIONS = [
  { id: 'Food', icon: '🍲', label: 'Food & Gastronomy', desc: 'Culinary tours, local bazaars & Michelin dining' },
  { id: 'Culture', icon: '🏛️', label: 'Culture & Arts', desc: 'Museums, historic monuments & traditions' },
  { id: 'Nature', icon: '🌲', label: 'Nature & Scenic', desc: 'National parks, mountain trails & lakes' },
  { id: 'Adventure', icon: '🧗', label: 'Adventure & Outdoor', desc: 'Hiking, kayaking, expeditions & adrenaline' },
  { id: 'Luxury', icon: '✨', label: 'Luxury & VIP', desc: 'Boutique suites, private transfers & fine dining' },
  { id: 'Nightlife', icon: '🍸', label: 'Nightlife & Lounges', desc: 'Rooftop bars, vibrant clubs & evening social' },
  { id: 'Shopping', icon: '🛍️', label: 'Shopping & Bazaars', desc: 'Artisan markets, luxury boutiques & crafts' },
  { id: 'History', icon: '📜', label: 'History & UNESCO', desc: 'Ancient ruins, palaces & world heritage' }
];

export const AiPlannerWizard: React.FC<AiPlannerWizardProps> = ({
  initialDestination = '',
  onTripGenerated,
  onNavigateToMyTrips
}) => {
  const { formatPrice, currency, setCurrency, currencies } = useCurrency();
  const { language } = useLanguage();

  // Wizard Navigation: Steps 1 to 7, Step 8 = Generating, Step 9 = Result View
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Destination
  const [destination, setDestination] = useState(initialDestination || 'Samarkand, Uzbekistan');
  const [destSuggestions, setDestSuggestions] = useState<typeof POPULAR_DESTINATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // STEP 2: Dates & Duration
  const [dateType, setDateType] = useState<'flexible' | 'dates'>('flexible');
  const [flexibleDuration, setFlexibleDuration] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [seasonPreference, setSeasonPreference] = useState<string>('Spring / Autumn');

  // STEP 3: Travelers
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // STEP 4: Budget & Currency
  const [budgetUSD, setBudgetUSD] = useState<number>(1200);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury' | 'custom'>('moderate');

  // STEP 5: Travel Style
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Culture');

  // STEP 6: Interests (multi-select)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Architecture & Mosques',
    'History & UNESCO Sites',
    'Local Gastronomy',
    'Artisan Bazaars'
  ]);

  // STEP 7 / Result States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('Searching verified sights...');
  const [generationProgress, setGenerationProgress] = useState(15);
  const [generatedTrip, setGeneratedTrip] = useState<GeneratedTripResult | null>(null);
  
  // Interactive Result UI States
  const [selectedDayTab, setSelectedDayTab] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToMyTrips, setIsAddedToMyTrips] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [activeEditingActivity, setActiveEditingActivity] = useState<{ dayIdx: number; slot: 'morning' | 'afternoon' | 'evening' } | null>(null);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  // Handle autocomplete matching
  useEffect(() => {
    if (!destination.trim()) {
      setDestSuggestions([]);
      return;
    }
    const matches = POPULAR_DESTINATIONS.filter(d => 
      d.name.toLowerCase().includes(destination.toLowerCase())
    );
    setDestSuggestions(matches);
  }, [destination]);

  // Sync dates duration when specific dates are picked
  useEffect(() => {
    if (dateType === 'dates' && startDate && endDate) {
      const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1;
      if (diff > 0) {
        setFlexibleDuration(Math.min(Math.max(diff, 1), 21));
      }
    }
  }, [startDate, endDate, dateType]);

  // Toggle interest item
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== interestId));
      }
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  // Quick budget presets
  const handleBudgetTierChange = (tier: 'budget' | 'moderate' | 'luxury') => {
    setBudgetTier(tier);
    const totalTravelers = adults + children;
    const days = flexibleDuration;
    if (tier === 'budget') {
      setBudgetUSD(Math.round(days * 80 * totalTravelers));
    } else if (tier === 'moderate') {
      setBudgetUSD(Math.round(days * 160 * totalTravelers));
    } else if (tier === 'luxury') {
      setBudgetUSD(Math.round(days * 350 * totalTravelers));
    }
  };

  // Execute trip generation
  const handleGenerateTrip = async () => {
    setIsGenerating(true);
    setCurrentStep(6); // Generation loading screen
    setGenerationProgress(15);
    setGenerationStage('Understanding preferences...');

    const milestones = [
      { text: 'Understanding preferences...', pct: 20 },
      { text: 'Exploring destinations...', pct: 45 },
      { text: 'Building your route...', pct: 70 },
      { text: 'Optimizing your budget...', pct: 90 },
      { text: 'Your trip is ready.', pct: 100 }
    ];

    let mIdx = 0;
    const interval = setInterval(() => {
      if (mIdx < milestones.length) {
        setGenerationStage(milestones[mIdx].text);
        setGenerationProgress(milestones[mIdx].pct);
        mIdx++;
      }
    }, 700);

    const input: PlannerInput = {
      destination,
      dateType,
      flexibleDuration,
      startDate: dateType === 'dates' ? startDate : undefined,
      endDate: dateType === 'dates' ? endDate : undefined,
      travelers: { adults, children },
      currency,
      budget: budgetUSD,
      budgetTier,
      style: travelStyle,
      interests: selectedInterests
    };

    try {
      const result = await plannerService.generateTrip(input);
      clearInterval(interval);
      setGeneratedTrip(result);
      setCustomTitle(result.title);
      setIsSaved(false);
      setIsAddedToMyTrips(false);
      setSelectedDayTab(0);

      // Save automatically to local storage cache
      saveTripToLocalStorage(result);

      if (onTripGenerated) {
        onTripGenerated(result);
      }

      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStep(7); // Show Result View
      }, 500);

    } catch (err) {
      console.error('Failed to generate trip:', err);
      clearInterval(interval);
      setIsGenerating(false);
      setCurrentStep(5);
    }
  };

  // Save trip to localStorage & backend
  const saveTripToLocalStorage = (trip: GeneratedTripResult) => {
    try {
      const saved = localStorage.getItem('travel_uz_ai_trips');
      const list = saved ? JSON.parse(saved) : [];
      const filtered = list.filter((t: any) => String(t.id) !== String(trip.id));
      filtered.unshift({
        id: trip.id,
        destination: trip.destination,
        title: trip.title,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers.total,
        budget: String(trip.budgetBreakdown.total),
        style: trip.style,
        type: 'ai',
        status: 'Upcoming',
        share_token: trip.shareToken,
        totalCost: trip.budgetBreakdown.total,
        rawTripData: trip
      });
      localStorage.setItem('travel_uz_ai_trips', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  };

  const handleSaveTrip = () => {
    if (!generatedTrip) return;
    saveTripToLocalStorage(generatedTrip);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleAddToMyTrips = () => {
    if (!generatedTrip) return;
    saveTripToLocalStorage(generatedTrip);
    setIsAddedToMyTrips(true);
    if (onTripGenerated) {
      onTripGenerated(generatedTrip);
    }
  };

  const handleShareTrip = () => {
    if (!generatedTrip) return;
    const url = `${window.location.origin}/trip/${generatedTrip.shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }).catch(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    });
  };

  // Edit Activity Slot
  const handleUpdateActivity = (dayIdx: number, slot: 'morning' | 'afternoon' | 'evening', updated: Partial<TimeSlotActivity>) => {
    if (!generatedTrip) return;
    const newDays = [...generatedTrip.days];
    newDays[dayIdx] = {
      ...newDays[dayIdx],
      [slot]: {
        ...newDays[dayIdx][slot],
        ...updated
      }
    };
    const updatedTrip = {
      ...generatedTrip,
      days: newDays
    };
    setGeneratedTrip(updatedTrip);
    saveTripToLocalStorage(updatedTrip);
    setActiveEditingActivity(null);
  };

  // STEP WIZARD PROGRESS BAR (Steps 1 to 5)
  const renderStepIndicator = () => {
    if (currentStep > 5) return null;
    const stepLabels = [
      { num: 1, name: 'Where to go', code: '01' },
      { num: 2, name: 'When traveling', code: '02' },
      { num: 3, name: 'Target budget', code: '03' },
      { num: 4, name: 'What you love', code: '04' },
      { num: 5, name: 'Travel style', code: '05' },
    ];

    return (
      <div
        style={{
          background: 'var(--color-bg-surface, #ffffff)',
          border: '1px solid var(--border, rgba(0,0,0,0.08))',
          borderRadius: '16px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 900,
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            color: 'var(--color-accent, #2563eb)',
            background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
            padding: '4px 10px',
            borderRadius: '8px',
            whiteSpace: 'nowrap'
          }}>
            0{currentStep} / 05
          </span>
        </div>

        {stepLabels.map((s, idx) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => { if (isDone || isCurrent) setCurrentStep(s.num); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: isDone || isCurrent ? 'pointer' : 'default',
                  opacity: isDone || isCurrent ? 1 : 0.45,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: isDone ? '#10b981' : isCurrent ? 'var(--color-accent, #2563eb)' : 'var(--bg-subtle, rgba(0,0,0,0.06))',
                    color: isDone || isCurrent ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isDone ? <Check size={13} /> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  {s.name}
                </span>
              </button>
              {idx < stepLabels.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    minWidth: '12px',
                    height: '2px',
                    background: isDone ? '#10b981' : 'var(--border, rgba(0,0,0,0.08))',
                    transition: 'background 0.3s'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              background: '#10b981',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.35)'
            }}
          >
            <CheckCircle2 size={18} />
            <span>Trip shareable link copied to clipboard!</span>
          </motion.div>
        )}

        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              background: 'var(--color-accent, #2563eb)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)'
            }}
          >
            <CheckCircle2 size={18} />
            <span>Trip successfully saved to your profile!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Progress Indicator */}
      {renderStepIndicator()}

      {/* ========================================================================= */}
      {/* STEP 1: WHERE DO YOU WANT TO GO? (01 / 05)                                */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: 'clamp(16px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Step 1 of 5 (01 / 05)
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Where do you want to go?
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Search any city, verified country, or iconic world destination.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--color-bg, #f8fafc)',
                border: '2px solid var(--color-accent, #2563eb)',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
              }}
            >
              <MapPin size={22} style={{ color: 'var(--color-accent, #2563eb)', flexShrink: 0 }} />
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search destination (e.g. Paris, Tokyo, Dubai, Samarkand, Rome)..."
                style={{
                  flex: 1,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && destSuggestions.length > 0 && destination !== destSuggestions[0]?.name && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--color-bg-surface, #ffffff)',
                  border: '1px solid var(--border, rgba(0,0,0,0.12))',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 50,
                  overflow: 'hidden'
                }}
              >
                {destSuggestions.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => { setDestination(item.name); setShowSuggestions(false); }}
                    style={{
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.04))',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-subtle, rgba(37, 99, 235, 0.08))'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{item.flag}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Destinations Quick Chips */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              Popular Travel Destinations
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {POPULAR_DESTINATIONS.filter(d => d.popular).map((item) => {
                const isSelected = destination.toLowerCase().includes(item.name.toLowerCase().split(',')[0]);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => { setDestination(item.name); setShowSuggestions(false); }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '100px',
                      border: isSelected ? '1.5px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.1))',
                      background: isSelected ? 'var(--accent-subtle, rgba(37, 99, 235, 0.12))' : 'var(--color-bg, #f8fafc)',
                      color: isSelected ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name.split(',')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
            <button
              type="button"
              disabled={!destination.trim()}
              onClick={() => setCurrentStep(2)}
              className="btn-premium"
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: destination.trim() ? 'pointer' : 'not-allowed',
                opacity: destination.trim() ? 1 : 0.5
              }}
            >
              <span>Next: When Are You Traveling?</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: WHEN ARE YOU TRAVELING? (02 / 05)                                 */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: 'clamp(16px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Step 2 of 5 (02 / 05)
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              When are you traveling?
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Choose between flexible duration or exact calendar travel dates.
            </p>
          </div>

          {/* Toggle Date Type: Flexible vs Exact */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'var(--color-bg, #f8fafc)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid var(--border, rgba(0,0,0,0.08))'
            }}
          >
            <button
              type="button"
              onClick={() => setDateType('flexible')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: dateType === 'flexible' ? 'var(--color-bg-surface, #ffffff)' : 'transparent',
                color: dateType === 'flexible' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-secondary)',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: dateType === 'flexible' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>⚡ Flexible Duration</span>
            </button>

            <button
              type="button"
              onClick={() => setDateType('dates')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: dateType === 'dates' ? 'var(--color-bg-surface, #ffffff)' : 'transparent',
                color: dateType === 'dates' ? 'var(--color-accent, #2563eb)' : 'var(--color-text-secondary)',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: dateType === 'dates' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={18} />
              <span>Select Exact Dates</span>
            </button>
          </div>

          {/* Conditional View: Flexible Slider */}
          {dateType === 'flexible' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.08))',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    Trip Duration
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent, #2563eb)' }}>
                    {flexibleDuration} Days <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>({flexibleDuration - 1} Nights)</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="14"
                  value={flexibleDuration}
                  onChange={(e) => setFlexibleDuration(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent, #2563eb)', cursor: 'pointer' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  <span>1 Day (Day trip)</span>
                  <span>3-4 Days (Weekend)</span>
                  <span>7 Days (1 Week)</span>
                  <span>14 Days (Grand Tour)</span>
                </div>
              </div>

              {/* Season Selection */}
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                  Preferred Season or Window
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'Next 30 Days', label: '🚀 Next 30 Days' },
                    { id: 'Spring / Autumn', label: '🌸 Spring / Autumn (Best)' },
                    { id: 'Summer Vacation', label: '☀️ Summer' },
                    { id: 'Winter Getaway', label: '❄️ Winter' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeasonPreference(s.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: seasonPreference === s.id ? '1.5px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.08))',
                        background: seasonPreference === s.id ? 'var(--accent-subtle, rgba(37, 99, 235, 0.1))' : 'var(--color-bg, #f8fafc)',
                        color: seasonPreference === s.id ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Exact Date Pickers */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                background: 'var(--color-bg, #f8fafc)',
                border: '1px solid var(--border, rgba(0,0,0,0.08))',
                borderRadius: '16px',
                padding: '24px'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Departure Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.15))',
                    background: 'var(--color-bg-surface, #ffffff)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.15))',
                    background: 'var(--color-bg-surface, #ffffff)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-premium"
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Next: What's Your Budget?</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: WHAT'S YOUR BUDGET? (03 / 05)                                     */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: 'clamp(16px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Step 3 of 5 (03 / 05)
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              What's your budget?
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Configure your spending limit, currency preference, and traveler count.
            </p>
          </div>

          {/* Travelers Counter */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {/* Adults */}
            <div
              style={{
                background: 'var(--color-bg, #f8fafc)',
                border: '1px solid var(--border, rgba(0,0,0,0.08))',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  🧑 Adults
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Age 13+</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  disabled={adults <= 1}
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 800,
                    cursor: adults > 1 ? 'pointer' : 'not-allowed',
                    opacity: adults > 1 ? 1 : 0.4
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, minWidth: '20px', textAlign: 'center', color: 'var(--color-text-primary)' }}>
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-accent, #2563eb)',
                    background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
                    color: 'var(--color-accent, #2563eb)',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div
              style={{
                background: 'var(--color-bg, #f8fafc)',
                border: '1px solid var(--border, rgba(0,0,0,0.08))',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  👶 Children
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Age 0–12</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  disabled={children <= 0}
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 800,
                    cursor: children > 0 ? 'pointer' : 'not-allowed',
                    opacity: children > 0 ? 1 : 0.4
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, minWidth: '20px', textAlign: 'center', color: 'var(--color-text-primary)' }}>
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-accent, #2563eb)',
                    background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
                    color: 'var(--color-accent, #2563eb)',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Currency Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              💱 Currency Selector
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currencies.map((c) => {
                const isActive = currency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code as CurrencyCode)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.12))',
                      background: isActive ? 'var(--accent-subtle, rgba(37, 99, 235, 0.12))' : 'var(--color-bg, #f8fafc)',
                      color: isActive ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{c.symbol}</span>
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Preset Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { id: 'budget', label: '🏷️ Budget Explorer', desc: 'Authentic local stays & high value' },
              { id: 'moderate', label: '⚖️ Comfortable', desc: 'Boutique hotels & curated tours' },
              { id: 'luxury', label: '✨ Luxury VIP', desc: '5-star suites & private transfers' }
            ].map((tier) => (
              <div
                key={tier.id}
                onClick={() => handleBudgetTierChange(tier.id as any)}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: budgetTier === tier.id ? '2px solid #10b981' : '1px solid var(--border, rgba(0,0,0,0.08))',
                  background: budgetTier === tier.id ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-bg, #f8fafc)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.92rem', color: budgetTier === tier.id ? '#10b981' : 'var(--color-text-primary)' }}>
                  {tier.label}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '4px' }}>
                  {tier.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Range Slider */}
          <div
            style={{
              background: 'var(--color-bg, #f8fafc)',
              border: '1px solid var(--border, rgba(0,0,0,0.08))',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                Total Target Budget
              </span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#10b981' }}>
                  {formatPrice(budgetUSD)}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  ~{formatPrice(Math.round(budgetUSD / flexibleDuration / (adults + children)))} / person / day
                </span>
              </div>
            </div>

            <input
              type="range"
              min="200"
              max="6000"
              step="50"
              value={budgetUSD}
              onChange={(e) => {
                setBudgetUSD(Number(e.target.value));
                setBudgetTier('custom');
              }}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              <span>{formatPrice(200)} (Light)</span>
              <span>{formatPrice(1500)} (Moderate)</span>
              <span>{formatPrice(3500)} (Comfort)</span>
              <span>{formatPrice(6000)}+ (Luxury)</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="btn-premium"
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Next: What Do You Love?</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: WHAT DO YOU LOVE? (04 / 05)                                       */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <motion.div
          key="step4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: 'clamp(16px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Step 4 of 5 (04 / 05)
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              What do you love?
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Select experiences you want included in your itinerary (Food, Culture, Nature, Adventure, Luxury, Nightlife, Shopping, History).
            </p>
          </div>

          {/* 8 Categories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.08))',
                    background: isSelected ? 'var(--accent-subtle, rgba(37, 99, 235, 0.12))' : 'var(--color-bg, #f8fafc)',
                    color: isSelected ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.98rem' }}>{item.label}</strong>
                      {isSelected && <Check size={18} style={{ color: 'var(--color-accent, #2563eb)' }} />}
                    </div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="btn-premium"
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Next: Travel Style</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: TRAVEL STYLE (05 / 05) & DIRECT GENERATION                        */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <motion.div
          key="step5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: 'clamp(16px, 4vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Step 5 of 5 (05 / 05)
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              What is your travel style?
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Select the primary vibe and pace for your journey.
            </p>
          </div>

          {/* Travel Style Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {TRAVEL_STYLES.map((style) => {
              const isSelected = travelStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.08))',
                    background: isSelected ? 'var(--accent-subtle, rgba(37, 99, 235, 0.08))' : 'var(--color-bg, #f8fafc)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: isSelected ? '0 8px 24px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem' }}>{style.icon}</span>
                    {isSelected && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--color-accent, #2563eb)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>

                  <div>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: isSelected ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)' }}>
                      {style.label}
                    </strong>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      {style.tagline}
                    </span>
                  </div>

                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                    {style.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateTrip}
              className="btn-premium"
              style={{
                padding: '16px 38px',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Sparkles size={20} />
              <span>Build My Itinerary</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: GENERATING LOADING STATE (5 Sequential States)                    */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <motion.div
          key="generating"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--color-bg-surface, #ffffff)',
            border: '1px solid var(--border, rgba(0,0,0,0.08))',
            borderRadius: '24px',
            padding: '56px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent, #2563eb), #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 35px rgba(37, 99, 235, 0.45)',
              animation: 'pulse 1.8s infinite'
            }}
          >
            <Sparkles size={40} />
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.7rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Synthesizing your {destination.split(',')[0]} Itinerary
            </h3>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent, #2563eb)' }}>
              {generationStage}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '8px',
              background: 'var(--color-bg, #f1f5f9)',
              borderRadius: '100px',
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(to right, var(--color-accent, #2563eb), #7c3aed)',
                borderRadius: '100px'
              }}
              animate={{ width: `${generationProgress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            TripMind AI Engine • Analyzing verified routes, venues, distances & schedules
          </span>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: FULL TRIP RESULT ITINERARY VIEW                                   */}
      {/* ========================================================================= */}
      {currentStep === 7 && generatedTrip && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Top Banner Card: Trip Title, Destination, Dates & Quick Controls */}
          <div
            style={{
              background: 'var(--color-bg-surface, #ffffff)',
              border: '1px solid var(--border, rgba(0,0,0,0.08))',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'var(--accent-subtle, rgba(37, 99, 235, 0.1))',
                      color: 'var(--color-accent, #2563eb)',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}
                  >
                    📍 {generatedTrip.destination}
                  </span>
                  <span
                    style={{
                      background: 'var(--bg-subtle, #f1f5f9)',
                      color: 'var(--color-text-secondary)',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    📅 {generatedTrip.durationDays} Days ({generatedTrip.startDate} – {generatedTrip.endDate})
                  </span>
                  <span
                    style={{
                      background: 'var(--bg-subtle, #f1f5f9)',
                      color: 'var(--color-text-secondary)',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    👥 {generatedTrip.travelers.adults} Adults{generatedTrip.travelers.children > 0 ? `, ${generatedTrip.travelers.children} Children` : ''}
                  </span>
                  <span
                    style={{
                      background: 'rgba(124, 58, 237, 0.1)',
                      color: '#7c3aed',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}
                  >
                    🎭 {generatedTrip.style}
                  </span>
                </div>

                {editTitleMode ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-accent, #2563eb)',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: 'var(--color-text-primary)',
                        flex: 1
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratedTrip({ ...generatedTrip, title: customTitle });
                        setEditTitleMode(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'var(--color-accent, #2563eb)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
                      {generatedTrip.title}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setEditTitleMode(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Edit trip title"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Top Action Buttons (Save, Share, Regenerate, Add to My Trips) */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSaveTrip}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.12))',
                    background: 'var(--color-bg, #f8fafc)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={15} />
                  <span>Save Trip</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTrip}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.12))',
                    background: 'var(--color-bg, #f8fafc)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateTrip}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.12))',
                    background: 'var(--color-bg, #f8fafc)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToMyTrips}
                  className="btn-premium"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{isAddedToMyTrips ? 'Added to My Trips!' : 'Add to My Trips'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ESTIMATED TOTAL BUDGET & BREAKDOWN SECTION                                */}
          {/* ========================================================================= */}
          <div
            style={{
              background: 'var(--color-bg-surface, #ffffff)',
              border: '1px solid var(--border, rgba(0,0,0,0.08))',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                  Budget Breakdown & Cost Estimates
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                  Estimated Total Budget: <span style={{ color: '#10b981' }}>{formatPrice(generatedTrip.budgetBreakdown.total)}</span>
                </h3>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                ~{formatPrice(Math.round(generatedTrip.budgetBreakdown.total / generatedTrip.durationDays / generatedTrip.travelers.total))} / person / day
              </div>
            </div>

            {/* 5 Pillar Budget Cards: Flights, Accommodation, Food, Transport, Activities */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {/* Flights */}
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.06))',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>✈️</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Flights</span>
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontWeight: 900 }}>
                  {formatPrice(generatedTrip.budgetBreakdown.flights)}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Roundtrip estimate</span>
              </div>

              {/* Accommodation */}
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.06))',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🏨</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Accommodation</span>
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontWeight: 900 }}>
                  {formatPrice(generatedTrip.budgetBreakdown.accommodation)}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{generatedTrip.durationDays - 1} nights hotel stay</span>
              </div>

              {/* Food */}
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.06))',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🍲</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Food & Dining</span>
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontWeight: 900 }}>
                  {formatPrice(generatedTrip.budgetBreakdown.food)}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Daily meals & chaykhanas</span>
              </div>

              {/* Transport */}
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.06))',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🚕</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Transport</span>
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontWeight: 900 }}>
                  {formatPrice(generatedTrip.budgetBreakdown.transport)}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>High-speed rail & local taxis</span>
              </div>

              {/* Activities */}
              <div
                style={{
                  background: 'var(--color-bg, #f8fafc)',
                  border: '1px solid var(--border, rgba(0,0,0,0.06))',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎟️</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Activities</span>
                </div>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontWeight: 900 }}>
                  {formatPrice(generatedTrip.budgetBreakdown.activities)}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Tickets, entry fees & tours</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DAILY ITINERARY SECTION (Day 1: Morning, Afternoon, Evening)              */}
          {/* ========================================================================= */}
          <div
            style={{
              background: 'var(--color-bg-surface, #ffffff)',
              border: '1px solid var(--border, rgba(0,0,0,0.08))',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent, #2563eb)', letterSpacing: '0.5px' }}>
                Curated Daily Schedule
              </span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading, sans-serif)' }}>
                Day-by-Day Itinerary
              </h3>
            </div>

            {/* Day Switcher Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {generatedTrip.days.map((day, dIdx) => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayTab(dIdx)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: selectedDayTab === dIdx ? '2px solid var(--color-accent, #2563eb)' : '1px solid var(--border, rgba(0,0,0,0.08))',
                    background: selectedDayTab === dIdx ? 'var(--accent-subtle, rgba(37, 99, 235, 0.12))' : 'var(--color-bg, #f8fafc)',
                    color: selectedDayTab === dIdx ? 'var(--color-accent, #2563eb)' : 'var(--color-text-primary)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>Day {day.dayNumber}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{day.dateStr.slice(5)}</span>
                </button>
              ))}
            </div>

            {/* Active Day Detail Card */}
            {generatedTrip.days[selectedDayTab] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle, rgba(0,0,0,0.06))', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                    {generatedTrip.days[selectedDayTab].title}
                  </h4>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                    Est. Daily Spend: {formatPrice(generatedTrip.days[selectedDayTab].dailyCost)}
                  </span>
                </div>

                {/* 3 Slot Timeline: Morning, Afternoon, Evening */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* MORNING */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      background: 'var(--color-bg, #f8fafc)',
                      border: '1px solid var(--border, rgba(0,0,0,0.06))',
                      borderRadius: '16px',
                      padding: '20px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#d97706',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '90px'
                      }}
                    >
                      <span>🌅 Morning</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{generatedTrip.days[selectedDayTab].morning.time}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                            {generatedTrip.days[selectedDayTab].morning.title}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            <MapPin size={14} style={{ color: 'var(--color-accent, #2563eb)' }} />
                            <span>{generatedTrip.days[selectedDayTab].morning.location}</span>
                            <span>•</span>
                            <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span>{generatedTrip.days[selectedDayTab].morning.duration}</span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                          {formatPrice(generatedTrip.days[selectedDayTab].morning.estimatedCost)}
                        </span>
                      </div>

                      {generatedTrip.days[selectedDayTab].morning.tip && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--color-bg-surface, #ffffff)', fontSize: '0.78rem', color: 'var(--color-text-muted)', border: '1px solid var(--border, rgba(0,0,0,0.06))' }}>
                          💡 <strong>Insider Tip:</strong> {generatedTrip.days[selectedDayTab].morning.tip}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AFTERNOON */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      background: 'var(--color-bg, #f8fafc)',
                      border: '1px solid var(--border, rgba(0,0,0,0.06))',
                      borderRadius: '16px',
                      padding: '20px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(37, 99, 235, 0.12)',
                        color: 'var(--color-accent, #2563eb)',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '90px'
                      }}
                    >
                      <span>☀️ Afternoon</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{generatedTrip.days[selectedDayTab].afternoon.time}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                            {generatedTrip.days[selectedDayTab].afternoon.title}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            <MapPin size={14} style={{ color: 'var(--color-accent, #2563eb)' }} />
                            <span>{generatedTrip.days[selectedDayTab].afternoon.location}</span>
                            <span>•</span>
                            <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span>{generatedTrip.days[selectedDayTab].afternoon.duration}</span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                          {formatPrice(generatedTrip.days[selectedDayTab].afternoon.estimatedCost)}
                        </span>
                      </div>

                      {generatedTrip.days[selectedDayTab].afternoon.tip && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--color-bg-surface, #ffffff)', fontSize: '0.78rem', color: 'var(--color-text-muted)', border: '1px solid var(--border, rgba(0,0,0,0.06))' }}>
                          💡 <strong>Insider Tip:</strong> {generatedTrip.days[selectedDayTab].afternoon.tip}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EVENING */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      background: 'var(--color-bg, #f8fafc)',
                      border: '1px solid var(--border, rgba(0,0,0,0.06))',
                      borderRadius: '16px',
                      padding: '20px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(124, 58, 237, 0.12)',
                        color: '#7c3aed',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '90px'
                      }}
                    >
                      <span>🌙 Evening</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{generatedTrip.days[selectedDayTab].evening.time}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                            {generatedTrip.days[selectedDayTab].evening.title}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            <Utensils size={14} style={{ color: '#7c3aed' }} />
                            <span>{generatedTrip.days[selectedDayTab].evening.cuisine}</span>
                            <span>•</span>
                            <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span>{generatedTrip.days[selectedDayTab].evening.location}</span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                          {formatPrice(generatedTrip.days[selectedDayTab].evening.estimatedCost)}
                        </span>
                      </div>

                      {generatedTrip.days[selectedDayTab].evening.tip && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--color-bg-surface, #ffffff)', fontSize: '0.78rem', color: 'var(--color-text-muted)', border: '1px solid var(--border, rgba(0,0,0,0.06))' }}>
                          💡 <strong>Dining Note:</strong> {generatedTrip.days[selectedDayTab].evening.tip}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RECOMMENDED HOTEL CARD */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--accent-subtle, rgba(37, 99, 235, 0.06))',
                      border: '1px solid rgba(37, 99, 235, 0.15)',
                      borderRadius: '14px',
                      padding: '14px 20px',
                      marginTop: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Hotel size={22} style={{ color: 'var(--color-accent, #2563eb)' }} />
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                          Lodging: {generatedTrip.days[selectedDayTab].hotel.name}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          {'⭐'.repeat(generatedTrip.days[selectedDayTab].hotel.stars)} • {generatedTrip.days[selectedDayTab].hotel.area}
                        </span>
                      </div>
                    </div>

                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-accent, #2563eb)' }}>
                      ~{formatPrice(generatedTrip.days[selectedDayTab].hotel.pricePerNight)} / night
                    </strong>
                  </div>

                </div>
              </div>
            )}

            {/* Bottom Action Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.06))' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border, rgba(0,0,0,0.12))',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} />
                <span>Start New Trip</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSaveTrip}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border, rgba(0,0,0,0.12))',
                    background: 'var(--color-bg, #f8fafc)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={16} />
                  <span>Save Trip</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToMyTrips}
                  className="btn-premium"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{isAddedToMyTrips ? 'Added to My Trips!' : 'Add to My Trips'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
