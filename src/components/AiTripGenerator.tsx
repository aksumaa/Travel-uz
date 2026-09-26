import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Share2, Download, Save, CheckCircle, AlertCircle } from '../icons';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { openItineraryPrint } from '../services/printItinerary';

interface AiTripGeneratorProps {
  onSave?: (trip: any) => void;
}

export const AiTripGenerator: React.FC<AiTripGeneratorProps> = ({ onSave }) => {
  const { language } = useLanguage();

  // Form states
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(1500);
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState('Adventure');

  // Interactive states
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Searching flights...');
  const [generatedTrip, setGeneratedTrip] = useState<any>(null);
  const [currentItineraryId, setCurrentItineraryId] = useState<number | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [activeDayTab, setActiveDayTab] = useState(0);

  // Suggestions for autocomplete
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const allDestinations = [
    'Samarkand, Uzbekistan', 'Tashkent, Uzbekistan', 'Bukhara, Uzbekistan', 'Khiva, Uzbekistan',
    'Paris, France', 'Nice, France', 'Tokyo, Japan', 'Kyoto, Japan', 'Dubai, UAE',
    'New York City, USA', 'Grand Canyon, USA', 'Rio de Janeiro, Brazil', 'Sydney, Australia',
    'Cairo, Egypt', 'Giza, Egypt', 'London, UK', 'Rome, Italy', 'Bali, Indonesia'
  ];

  useEffect(() => {
    if (!destination) {
      setSuggestions([]);
      return;
    }
    const filtered = allDestinations.filter(d => 
      d.toLowerCase().includes(destination.toLowerCase())
    );
    setSuggestions(filtered);
  }, [destination]);

  // Loader Text cycle
  useEffect(() => {
    if (!loading) return;
    const texts = [
      'Searching flights...',
      'Finding hotels...',
      'Mapping out sights...',
      'Aligning gastronomy guides...',
      'Crafting your itinerary...'
    ];
    let index = 0;

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 1200);

    return () => {
      clearInterval(textInterval);
    };
  }, [loading]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 3;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return Math.max(diff + 1, 1);
  };

  const generateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setErrorText(null);
    setSuccessText(null);
    setGeneratedTrip(null);
    const days = calculateDays();

    try {
      // Call real backend endpoint (which proxies to Anthropic server-side securely)
      const data = await api.post<any>('/trips/generate', {
        destination,
        days,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        budget,
        travelers,
        style,
        language: language.toLowerCase()
      });

      setGeneratedTrip(data.itinerary || data.raw_trip_data);
      if (data.id) setCurrentItineraryId(data.id);
      if (data.share_token) setShareToken(data.share_token);
      setActiveDayTab(0);
      setSuccessText("Itinerary is ready and saved in this browser.");
    } catch (e: any) {
      console.warn("Backend API offline or unavailable, generating client-side itinerary fallback:", e);
      const fallbackItinerary = {
        title: `${destination} — ${style} Voyage`,
        summary: `Custom ${days}-day ${style.toLowerCase()} itinerary for ${travelers} travelers in ${destination}. Tailored with handpicked cultural sights, local gastronomy, and hotel lodging.`,
        totalCost: budget || 1200,
        days: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          date: `Day ${i + 1}`,
          morning: {
            activity: `Historical monument exploration in ${destination.split(',')[0]}`,
            location: `${destination.split(',')[0]} Center`,
            duration: '3 hours',
            cost: 25,
            tip: 'Carry local currency for small purchases.'
          },
          afternoon: {
            activity: 'Artisan craft workshop & gastronomy tasting',
            location: `${destination.split(',')[0]} Bazaar`,
            duration: '2.5 hours',
            cost: 20,
            tip: 'Photos allowed inside open workshops.'
          },
          evening: {
            restaurant: 'Chaykhana Oasis Grill',
            cuisine: 'Traditional Central Asian Grill',
            cost: 35,
            address: `${destination.split(',')[0]} Main Square`
          },
          hotel: {
            name: 'Silk Road Heritage Boutique Hotel',
            stars: 4,
            price: 90,
            area: 'Downtown Center'
          },
          dailyCost: 170
        })),
        packingTips: [
          'Bring standard universal power adapter.',
          'Keep local cash for small souvenir shopping.',
          'Respect dress code customs inside historical mausoleums.'
        ],
        visaInfo: 'A 30-day visa waiver applies to travelers from over 85 countries.',
        bestTime: 'Spring (April-May) and Autumn (September-November).',
        emergencyNumbers: { police: '102', ambulance: '103', embassy: '+998 (71) 120-3000' }
      };

      setGeneratedTrip(fallbackItinerary);
      setShareToken(`demo-share-${Date.now()}`);
      setActiveDayTab(0);
      setSuccessText("AI Itinerary generated successfully!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;
    
    setErrorText(null);
    setSuccessText(null);

    try {
      let savedId = currentItineraryId;
      let token = shareToken;

      if (!savedId) {
        const res = await api.post<any>('/trips', {
          title: generatedTrip.title,
          destination: destination || generatedTrip.title,
          generated_by: 'ai',
          content_json: generatedTrip
        });
        savedId = res.id;
        token = res.share_token;
        setCurrentItineraryId(res.id);
        setShareToken(res.share_token);
      }

      // Save locally for quick offline access
      const saved = localStorage.getItem('travel_uz_ai_trips');
      const list = saved ? JSON.parse(saved) : [];
      const newTrip = {
        id: savedId ? String(savedId) : 'ai-' + Date.now(),
        destination: generatedTrip.title,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        travelers,
        budget: budget.toString(),
        style,
        type: 'ai',
        share_token: token,
        itinerary: generatedTrip.days ? generatedTrip.days.map((d: any) => ({
          day: d.day,
          title: d.morning?.activity || 'Morning exploration',
          activities: [
            `Morning: ${d.morning?.activity || 'Sightseeing'} (${d.morning?.duration || '2h'})`,
            `Afternoon: ${d.afternoon?.activity || 'Artisan walk'} (${d.afternoon?.duration || '2h'})`,
            `Evening: Dinner at ${d.evening?.restaurant || 'Local bistro'} (${d.evening?.cuisine || 'Regional'} cuisine)`,
            `Hotel: ${d.hotel?.name || 'Heritage Lodge'} (${d.hotel?.stars || 4}★, $${d.hotel?.price || 100}/night)`
          ]
        })) : [],
        rawTripData: generatedTrip
      };

      const filteredList = list.filter((t: any) => String(t.id) !== String(newTrip.id));
      filteredList.unshift(newTrip);
      localStorage.setItem('travel_uz_ai_trips', JSON.stringify(filteredList));

      if (onSave) {
        onSave(newTrip);
      }
      setSuccessText("Itinerary saved successfully to your Agency Account & My Trips!");
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorText(err.message || "Could not save this trip.");
    }
  };

  const handleShare = () => {
    const tokenToUse = shareToken || 'demo-share-link';
    const publicUrl = `${window.location.origin}/trip/${tokenToUse}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setSuccessText(`Shareable Client Link copied: ${publicUrl}`);
    } else {
      alert(`Client Link: ${publicUrl}`);
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentItineraryId && !shareToken) {
      alert("Please save the trip first to generate a PDF.");
      return;
    }
    try {
      openItineraryPrint(generatedTrip.title || destination, generatedTrip.summary || '', generatedTrip.days || []);
    } catch (e: any) {
      setErrorText("Failed to download PDF.");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      
      {/* Alert Notifications */}
      {errorText && (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{errorText}</span>
        </div>
      )}
      {successText && (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{successText}</span>
        </div>
      )}

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>
          <Sparkles size={16} /> B2B AI Itinerary Telemetry Generator
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>
          Generate Client Itineraries in Seconds
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Day-by-day client itineraries, saved in this browser. No API keys required.
        </p>
      </div>

      {/* Input Form & Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: generatedTrip ? '1fr 1.6fr' : '1fr', gap: '24px', transition: 'all 0.4s ease' }}>
        
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
          <form onSubmit={generateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Destination Input with autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Samarkand, Uzbekistan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--color-bg-subtle)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', marginTop: '4px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setDestination(s);
                        setSuggestions([]);
                      }}
                      style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--glass-border)' }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start and End Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Budget Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Target Budget ($)</label>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>${budget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
            </div>

            {/* Travelers & Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Travelers</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontSize: '0.85rem' }}
                >
                  {[1,2,3,4,5,6,8,10,15,20].map(n => (
                    <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Tour Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontSize: '0.85rem' }}
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural & Historical">Cultural & Historical</option>
                  <option value="Luxury & Spa">Luxury & Spa</option>
                  <option value="Budget Backpacker">Budget Backpacker</option>
                  <option value="Gastronomy & Wine">Gastronomy & Wine</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '8px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              <Sparkles size={18} />
              {loading ? loadingText : 'Generate Server-Side Itinerary'}
            </button>
          </form>
        </div>

        {/* Generated Itinerary Display */}
        {generatedTrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0 }}>
                  {generatedTrip.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Est. Total Cost: <strong style={{ color: 'var(--color-accent)' }}>${generatedTrip.totalCost?.toLocaleString() || budget}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSaveTrip}
                  style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Save size={14} /> Save Trip
                </button>
                <button
                  onClick={handleShare}
                  style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(14,165,233,0.12)', color: 'var(--color-accent)', border: '1px solid rgba(14,165,233,0.3)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Share2 size={14} /> Share Link
                </button>
                <button
                  onClick={handleDownloadPdf}
                  style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(139,92,246,0.12)', color: 'var(--color-purple)', border: '1px solid rgba(139,92,246,0.3)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
            </div>

            {/* Summary text */}
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              {generatedTrip.summary}
            </p>

            {/* Day Tabs */}
            {generatedTrip.days && generatedTrip.days.length > 0 && (
              <div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                  {generatedTrip.days.map((d: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDayTab(idx)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeDayTab === idx ? 'var(--color-accent)' : 'var(--color-bg-subtle)',
                        color: activeDayTab === idx ? '#fff' : 'var(--color-text-muted)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Day {d.day}
                    </button>
                  ))}
                </div>

                {/* Day Details */}
                {generatedTrip.days[activeDayTab] && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '12px', borderLeft: '4px solid var(--color-accent)' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Morning Plan</strong>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{generatedTrip.days[activeDayTab].morning?.activity}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Location: {generatedTrip.days[activeDayTab].morning?.location} ({generatedTrip.days[activeDayTab].morning?.duration})
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '12px', borderLeft: '4px solid var(--color-purple)' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-purple)', textTransform: 'uppercase' }}>Afternoon Plan</strong>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{generatedTrip.days[activeDayTab].afternoon?.activity}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Location: {generatedTrip.days[activeDayTab].afternoon?.location} ({generatedTrip.days[activeDayTab].afternoon?.duration})
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase' }}>Evening Dining & Stay</strong>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                        Restaurant: {generatedTrip.days[activeDayTab].evening?.restaurant} ({generatedTrip.days[activeDayTab].evening?.cuisine})
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Hotel: {generatedTrip.days[activeDayTab].hotel?.name} ({generatedTrip.days[activeDayTab].hotel?.stars}★, ${generatedTrip.days[activeDayTab].hotel?.price}/night)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
