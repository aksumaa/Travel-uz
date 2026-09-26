import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Compass, Download, Plus, 
  Trash2, Edit3, MapPin, Star, AlertTriangle, CloudRain, Wind, Thermometer, 
  Check, X, FileText, CheckCircle2, RefreshCw
} from '../icons';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

// Declare global types for Google Maps namespace
declare global {
  interface Window {
    google: any;
  }
}
declare var google: any;

interface TripDetailsViewProps {
  tripId: string;
  onBack: () => void;
}

export const TripDetailsView: React.FC<TripDetailsViewProps> = ({ tripId, onBack }) => {
  const { language, t } = useLanguage();
  
  // Localized dictionary for component-specific terms
  const getLocalText = (key: string) => {
    const dict: Record<string, Record<'uz' | 'ru' | 'en', string>> = {
      'Morning Plan': { en: 'Morning Plan', ru: 'Утренний план', uz: 'Ertamgi reja' },
      'Afternoon Plan': { en: 'Afternoon Plan', ru: 'Дневной план', uz: 'Kunduzgi reja' },
      'Evening Dining': { en: 'Evening Dining', ru: 'Вечерний ужин', uz: 'Kechki ovqat' },
      'Lodging Stay': { en: 'Lodging Stay', ru: 'Проживание', uz: 'Turar joy' },
      'Add Activity': { en: 'Add Activity', ru: 'Добавить активность', uz: 'Reja qo‘shish' },
      'Activity Name': { en: 'Activity Name', ru: 'Название активности', uz: 'Faoliyat nomi' },
      'Location': { en: 'Location', ru: 'Местоположение', uz: 'Manzil' },
      'Duration': { en: 'Duration', ru: 'Длительность', uz: 'Davomiyligi' },
      'Cost': { en: 'Cost', ru: 'Стоимость', uz: 'Narxi' },
      'Notes/Tips': { en: 'Notes/Tips', ru: 'Заметки/Советы', uz: 'Eslatma/Maslahat' },
      'Budget Limit': { en: 'Budget Limit', ru: 'Лимит бюджета', uz: 'Byudjet chegarasi' },
      'Total Expenses': { en: 'Total Expenses', ru: 'Всего расходов', uz: 'Jami xarajatlar' },
      'Remaining': { en: 'Remaining', ru: 'Осталось', uz: 'Qoldi' },
      'Daily Weather Forecast': { en: 'Daily Weather Forecast', ru: 'Прогноз погоды', uz: 'Kunlik ob-havo' },
      'Rain Probability': { en: 'Rain Probability', ru: 'Вероятность дождя', uz: 'Yog‘ingarchilik' },
      'Wind Speed': { en: 'Wind Speed', ru: 'Скорость ветра', uz: 'Shamol tezligi' },
      'Severe Alert': { en: 'Severe Alert: High temperature peak. Carry water.', ru: 'Предупреждение: Высокая температура. Пейте воду.', uz: 'Ogohlantirish: Yuqori issiqlik darajasi. Suv iching.' },
      'Embassy': { en: 'Consular Assistance', ru: 'Консульство', uz: 'Konsullik ko‘mak' },
      'Edit activity details': { en: 'Edit Activity Details', ru: 'Изменить детали', uz: 'Tahrirlash' },
      'Save Itinerary Changes': { en: 'Save Itinerary Changes', ru: 'Сохранить изменения', uz: 'Marshrutni saqlash' },
      'Regenerate Day Itinerary': { en: 'Regenerate Day Itinerary', ru: 'Пересоздать день с ИИ', uz: 'Kunni qayta tuzish' },
      'Clone Draft': { en: 'Clone Draft', ru: 'Создать дубликат', uz: 'Nusxa olish' }
    };
    return dict[key]?.[language] || key;
  };

  const [trip, setTrip] = useState<any>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  
  // Modals / Editors state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<{ dayIdx: number; section: 'morning' | 'afternoon' | 'evening' | 'hotel'; data: any } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customActivity, setCustomActivity] = useState({
    section: 'morning',
    activity: '',
    location: '',
    duration: '2 hours',
    cost: 0,
    tip: ''
  });

  // Google Maps and dynamic route telemetry
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Load trip data from LocalStorage on mount
  useEffect(() => {
    const localTripsSaved = localStorage.getItem('travel_uz_ai_trips');
    if (localTripsSaved) {
      const parsed = JSON.parse(localTripsSaved);
      const found = parsed.find((t: any) => String(t.id) === String(tripId));
      if (found) {
        // If there's no rawTripData (e.g. legacy mock trips), create one dynamically
        if (!found.rawTripData) {
          const daysCount = found.itinerary ? found.itinerary.length : 3;
          found.rawTripData = {
            title: found.destination,
            summary: `Premium detailed schedule planned for ${found.travelers || 2} travelers. Custom style: ${found.style || 'Adventure'}.`,
            totalCost: found.totalCost || Number(found.budget) || 1200,
            days: Array.from({ length: daysCount }, (_, i) => ({
              day: i + 1,
              date: `Day ${i + 1}`,
              morning: {
                activity: found.itinerary?.[i]?.activities?.[0]?.replace('Morning: ', '') || 'Historical monument walking exploration.',
                location: found.destination?.split(',')[0] + ' center',
                duration: '3 hours',
                cost: 20,
                tip: 'Wear sunscreen and comfortable shoes.'
              },
              afternoon: {
                activity: found.itinerary?.[i]?.activities?.[1]?.replace('Afternoon: ', '') || 'Gastronomic tasting and market walk.',
                location: found.destination?.split(',')[0] + ' bazaar',
                duration: '2.5 hours',
                cost: 15,
                tip: 'Taxis accept cash primarily.'
              },
              evening: {
                restaurant: found.itinerary?.[i]?.activities?.[2]?.replace('Evening: Dinner at ', '')?.split(' (')[0] || 'Grand Oasis Chaykhana',
                cuisine: 'Traditional Grill',
                cost: 30,
                address: found.destination?.split(',')[0] + ' Main Square'
              },
              hotel: {
                name: found.itinerary?.[i]?.activities?.[3]?.replace('Hotel: ', '')?.split(' (')[0] || 'Silk Road Plaza Hotel',
                stars: 4,
                price: 80,
                area: 'Downtown Center'
              },
              dailyCost: 145
            })),
            packingTips: [
              'Bring standard universal power adapter plug types C & F.',
              'Keep local cash (Uzbekistan Som) for small souvenir shopping.',
              'Respect dress code customs inside historical mausoleums.'
            ],
            visaInfo: 'A 30-day visa waiver applies to travelers from over 85 countries. Check specific passport visa conditions.',
            bestTime: 'Spring (April-May) and Autumn (September-November) feature ideal coordinates of 22°C.',
            emergencyNumbers: {
              police: '102',
              ambulance: '103',
              embassy: '+998 (71) 120-3000'
            }
          };
        }
        setTrip(found);
      }
    }
  }, [tripId]);

  // Load Google Maps API script or fallback
  useEffect(() => {
    if (!trip) return;
    
    const key = '';
    if (!key) {
      setIsMapLoaded(false);
      return;
    }

    const scriptId = 'google-maps-script-loader';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const activeDay = trip.rawTripData.days[activeDayIdx];
      // Simulated coordinates for routing depending on the city name
      const coords = getCityCoordinates(trip.destination);
      
      const map = new google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 13,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1e293b' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#334155' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] }
        ]
      });

      // Markers for Morning, Afternoon, Evening, and Hotel
      const locations = [
        { label: 'M', title: activeDay.morning.activity, desc: activeDay.morning.location, offset: { x: 0.005, y: 0.005 } },
        { label: 'A', title: activeDay.afternoon.activity, desc: activeDay.afternoon.location, offset: { x: -0.005, y: -0.005 } },
        { label: 'E', title: `Dinner: ${activeDay.evening.restaurant}`, desc: activeDay.evening.address, offset: { x: 0.007, y: -0.002 } },
        { label: 'H', title: `Hotel: ${activeDay.hotel.name}`, desc: activeDay.hotel.area, offset: { x: -0.002, y: 0.006 } }
      ];

      const pathCoords: { lat: number; lng: number }[] = [];

      locations.forEach((loc) => {
        const pinLatLng = { 
          lat: coords.lat + loc.offset.x, 
          lng: coords.lng + loc.offset.y 
        };
        pathCoords.push(pinLatLng);

        const marker = new google.maps.Marker({
          position: pinLatLng,
          map,
          label: {
            text: loc.label,
            color: '#ffffff',
            fontWeight: '900'
          },
          title: loc.title,
          animation: google.maps.Animation.DROP
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="color: #0f172a; padding: 6px; font-family: sans-serif;">
            <strong style="display:block;margin-bottom:2px;">${loc.title}</strong>
            <span style="font-size:0.75rem;color:#475569;">📍 ${loc.desc}</span>
          </div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Draw polyline route connecting day events
      new google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#0ea5e9',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map
      });

      setIsMapLoaded(true);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', initMap);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initMap);
      }
    };
  }, [trip, activeDayIdx]);

  // Helper coordinate mapper
  const getCityCoordinates = (destName: string) => {
    const lower = destName.toLowerCase();
    if (lower.includes('samarkand')) return { lat: 39.6542, lng: 66.9597 };
    if (lower.includes('bukhara')) return { lat: 39.7747, lng: 64.4286 };
    if (lower.includes('khiva')) return { lat: 41.3783, lng: 60.3639 };
    if (lower.includes('paris')) return { lat: 48.8566, lng: 2.3522 };
    if (lower.includes('tokyo')) return { lat: 35.6762, lng: 139.6503 };
    if (lower.includes('dubai')) return { lat: 25.2048, lng: 55.2708 };
    return { lat: 41.2995, lng: 69.2401 }; // Tashkent default
  };

  if (!trip) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--color-text-muted)' }}>
        <LoaderComponent />
      </div>
    );
  }

  // Calculate Itinerary Cost metrics
  const activeDay = trip.rawTripData.days[activeDayIdx];
  const totalSpent = trip.rawTripData.days.reduce((acc: number, d: any) => {
    return acc + (Number(d.morning.cost) || 0) + (Number(d.afternoon.cost) || 0) + (Number(d.evening.cost) || 0) + (Number(d.hotel.price) || 0);
  }, 0);
  const budgetLimit = Number(trip.budget) || trip.rawTripData.totalCost || 2000;
  const remaining = budgetLimit - totalSpent;
  const progressPercent = Math.min((totalSpent / budgetLimit) * 100, 100);

  // Day Regeneration simulated via API/mock
  const handleRegenerateDay = async () => {
    if (confirm(t('common.confirm') + '?')) {
      alert('AI Copilot is rewriting details for Day ' + activeDay.day + '...');
      // Simulated new activities
      const updated = { ...trip };
      updated.rawTripData.days[activeDayIdx] = {
        ...activeDay,
        morning: {
          activity: 'Premium morning museum archive gallery visit',
          location: 'City Gallery Hall',
          duration: '3 hours',
          cost: 15,
          tip: 'No photography allowed inside.'
        },
        afternoon: {
          activity: 'Local handcraft workshop experience',
          location: 'Master artisan district',
          duration: '2 hours',
          cost: 25,
          tip: 'Perfect place to buy authentic gifts.'
        }
      };
      setTrip(updated);
      saveTripToDatabase(updated);
    }
  };

  // Node editing actions
  const handleOpenEdit = (section: 'morning' | 'afternoon' | 'evening' | 'hotel') => {
    setEditingNode({
      dayIdx: activeDayIdx,
      section,
      data: { ...activeDay[section] }
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingNode) return;
    const { section, data } = editingNode;
    const updated = { ...trip };
    updated.rawTripData.days[activeDayIdx][section] = data;
    
    // Update legacy text descriptions as well to synchronize with MyTrips card previews
    const activities = [
      `Morning: ${updated.rawTripData.days[activeDayIdx].morning.activity}`,
      `Afternoon: ${updated.rawTripData.days[activeDayIdx].afternoon.activity}`,
      `Evening: Dinner at ${updated.rawTripData.days[activeDayIdx].evening.restaurant || updated.rawTripData.days[activeDayIdx].evening.activity}`,
      `Hotel: ${updated.rawTripData.days[activeDayIdx].hotel.name}`
    ];
    if (updated.itinerary?.[activeDayIdx]) {
      updated.itinerary[activeDayIdx].activities = activities;
    }

    setTrip(updated);
    saveTripToDatabase(updated);
    setIsEditModalOpen(false);
    setEditingNode(null);
  };

  // Add Custom activity actions
  const handleAddActivity = () => {
    const updated = { ...trip };
    const targetSection = customActivity.section as 'morning' | 'afternoon';
    
    updated.rawTripData.days[activeDayIdx][targetSection] = {
      activity: customActivity.activity || 'Custom Walk',
      location: customActivity.location || 'Local street area',
      duration: customActivity.duration,
      cost: Number(customActivity.cost) || 0,
      tip: customActivity.tip || 'No special requirements.'
    };

    setTrip(updated);
    saveTripToDatabase(updated);
    setIsAddModalOpen(false);
    setCustomActivity({
      section: 'morning',
      activity: '',
      location: '',
      duration: '2 hours',
      cost: 0,
      tip: ''
    });
  };

  // Delete node details
  const handleDeleteNode = (section: 'morning' | 'afternoon') => {
    if (confirm('Delete activity?')) {
      const updated = { ...trip };
      updated.rawTripData.days[activeDayIdx][section] = {
        activity: 'Rest block / Open schedule slot',
        location: 'Hotel vicinity',
        duration: 'N/A',
        cost: 0,
        tip: 'Relax or explore nearby spots at your leisure.'
      };
      setTrip(updated);
      saveTripToDatabase(updated);
    }
  };

  // Write updated trip record to LocalStorage and trigger Supabase proxy if configured
  const saveTripToDatabase = async (updatedTrip: any) => {
    // 1. Sync local
    const saved = localStorage.getItem('travel_uz_ai_trips');
    if (saved) {
      const list = JSON.parse(saved);
      const filtered = list.filter((t: any) => String(t.id) !== String(updatedTrip.id));
      filtered.unshift(updatedTrip);
      localStorage.setItem('travel_uz_ai_trips', JSON.stringify(filtered));
    }

    // 2. Sync FastAPI backend
    try {
      if (updatedTrip.id && !String(updatedTrip.id).startsWith('t-') && !String(updatedTrip.id).startsWith('ai-')) {
        await api.put(`/trips/${updatedTrip.id}`, {
          title: updatedTrip.destination,
          content_json: updatedTrip.rawTripData
        });
      }
    } catch (err) {
      console.warn('Backend database sync error:', err);
    }
  };

  // Clone trip draft
  const handleCloneTrip = () => {
    const cloned = {
      ...trip,
      id: 'clone-' + Date.now(),
      destination: `${trip.destination} (Copy)`
    };
    const saved = localStorage.getItem('travel_uz_ai_trips');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(cloned);
    localStorage.setItem('travel_uz_ai_trips', JSON.stringify(list));
    alert('Itinerary cloned successfully as a new copy.');
  };

  // Export printable Itinerary window
  const handleExportPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const styleBlock = `
      body { font-family: 'Plus Jakarta Sans', sans-serif; background: #ffffff; color: #0f172a; padding: 40px; }
      h1 { font-size: 2.2rem; color: #1e3a8a; margin-bottom: 6px; }
      .meta { font-size: 0.9rem; color: #64748b; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
      .day-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
      .day-title { font-size: 1.3rem; font-weight: 800; color: #0369a1; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px; }
      .activity { margin-bottom: 14px; }
      .act-time { font-size: 0.75rem; font-weight: bold; color: #0ea5e9; text-transform: uppercase; }
      .act-title { font-size: 1rem; font-weight: 700; margin: 2px 0; }
      .act-desc { font-size: 0.85rem; color: #475569; }
      .price { color: #10b981; font-weight: bold; }
    `;

    const bodyHtml = `
      <h1>${trip.rawTripData.title}</h1>
      <div class="meta">
        Style: ${trip.style || 'Custom'} | Budget Limit: $${budgetLimit} | Total Est Expense: $${totalSpent}
      </div>
      <div>
        ${trip.rawTripData.days.map((d: any) => `
          <div class="day-card">
            <div class="day-title">Day ${d.day} — Itinerary</div>
            <div class="activity">
              <span class="act-time">Morning Plan</span>
              <div class="act-title">${d.morning.activity}</div>
              <div class="act-desc">📍 Location: ${d.morning.location} • Cost: <span class="price">$${d.morning.cost}</span></div>
            </div>
            <div class="activity">
              <span class="act-time">Afternoon Highlight</span>
              <div class="act-title">${d.afternoon.activity}</div>
              <div class="act-desc">📍 Location: ${d.afternoon.location} • Cost: <span class="price">$${d.afternoon.cost}</span></div>
            </div>
            <div class="activity">
              <span class="act-time">Dinner</span>
              <div class="act-title">Dining at ${d.evening.restaurant} (${d.evening.cuisine} Cuisine)</div>
              <div class="act-desc">📍 Address: ${d.evening.address} • Cost: <span class="price">$${d.evening.cost}</span></div>
            </div>
            <div class="activity">
              <span class="act-time">Accommodation</span>
              <div class="act-title">${d.hotel.name} (${d.hotel.stars}★)</div>
              <div class="act-desc">📍 Area: ${d.hotel.area} • Night Rate: <span class="price">$${d.hotel.price}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    printWindow.document.write(`<html><head><title>Itinerary Print</title><style>${styleBlock}</style></head><body>${bodyHtml}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trip.rawTripData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${trip.destination.replace(/[\s,]+/g, '_')}_itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadBackendPdf = () => {
    handleExportPrint();
  };

  return (
    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header section with actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <button 
          onClick={onBack} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDownloadBackendPdf} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} />
            Download PDF
          </button>
          <button onClick={handleCloneTrip} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} />
            {getLocalText('Clone Draft')}
          </button>
          <button onClick={handleExportPrint} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} />
            Print Brochure
          </button>
          <button onClick={handleExportJson} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} />
            JSON
          </button>
        </div>
      </div>

      {/* Main Info Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent)', background: 'var(--color-accent-glow)', padding: '4px 10px', borderRadius: '6px' }}>
              {trip.style || 'Adventure'} Plan
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)', marginTop: '8px', marginBottom: 0, fontFamily: 'var(--font-heading)' }}>
              {trip.destination}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginTop: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {trip.startDate}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {trip.travelers || 2} Pax</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {trip.rawTripData.summary}
        </p>
      </div>

      {/* Grid: Timeline and widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }} className="details-main-grid">
        
        {/* Left pane: Day selector & Day Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Day selection pill tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
            {trip.rawTripData.days.map((day: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveDayIdx(idx)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: activeDayIdx === idx ? 'var(--color-accent-glow)' : 'var(--color-bg-surface)',
                  color: activeDayIdx === idx ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Current Day Schedule Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Timeline header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                Day {activeDay.day} Schedule
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.75rem', color: 'var(--color-accent)', background: 'var(--color-accent-glow)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  <Plus size={14} /> {getLocalText('Add Activity')}
                </button>
                <button 
                  onClick={handleRegenerateDay}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.75rem', color: 'var(--color-purple)', background: 'rgba(139,92,246,0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  <RefreshCw size={12} /> AI Rewrite
                </button>
              </div>
            </div>

            {/* Timeline nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '16px', borderLeft: '2px dashed var(--glass-border)' }}>
              
              {/* Event 1: Morning */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  background: 'var(--color-bg-surface)', 
                  border: hoveredLocation === 'morning' ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)', 
                  display: 'flex', 
                  gap: '16px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredLocation('morning')}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-accent)', padding: '10px', borderRadius: '12px', height: 'fit-content' }}>
                  <Compass size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {getLocalText('Morning Plan')}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--color-text-primary)' }}>
                        {activeDay.morning.activity}
                      </h4>
                    </div>
                    
                    {/* Node Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEdit('morning')} style={{ color: 'var(--color-purple)', padding: '4px' }}><Edit3 size={14} /></button>
                      <button onClick={() => handleDeleteNode('morning')} style={{ color: '#ef4444', padding: '4px' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    📍 {getLocalText('Location')}: {activeDay.morning.location} • ⏱️ {activeDay.morning.duration} • 💰 ${activeDay.morning.cost}
                  </span>
                  {activeDay.morning.tip && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px', fontStyle: 'italic' }}>
                      💡 Tip: {activeDay.morning.tip}
                    </span>
                  )}
                </div>
              </div>

              {/* Event 2: Afternoon */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  background: 'var(--color-bg-surface)', 
                  border: hoveredLocation === 'afternoon' ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)', 
                  display: 'flex', 
                  gap: '16px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredLocation('afternoon')}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', padding: '10px', borderRadius: '12px', height: 'fit-content' }}>
                  <Star size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {getLocalText('Afternoon Plan')}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--color-text-primary)' }}>
                        {activeDay.afternoon.activity}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEdit('afternoon')} style={{ color: 'var(--color-purple)', padding: '4px' }}><Edit3 size={14} /></button>
                      <button onClick={() => handleDeleteNode('afternoon')} style={{ color: '#ef4444', padding: '4px' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    📍 {getLocalText('Location')}: {activeDay.afternoon.location} • ⏱️ {activeDay.afternoon.duration} • 💰 ${activeDay.afternoon.cost}
                  </span>
                  {activeDay.afternoon.tip && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px', fontStyle: 'italic' }}>
                      💡 Tip: {activeDay.afternoon.tip}
                    </span>
                  )}
                </div>
              </div>

              {/* Event 3: Dinner (Evening) */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  background: 'var(--color-bg-surface)', 
                  border: hoveredLocation === 'evening' ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)', 
                  display: 'flex', 
                  gap: '16px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredLocation('evening')}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent-gold)', padding: '10px', borderRadius: '12px', height: 'fit-content' }}>
                  <MapPin size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {getLocalText('Evening Dining')}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--color-text-primary)' }}>
                        Dinner at {activeDay.evening.restaurant}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEdit('evening')} style={{ color: 'var(--color-purple)', padding: '4px' }}><Edit3 size={14} /></button>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    🍽️ Cuisine: {activeDay.evening.cuisine} • 📍 Address: {activeDay.evening.address} • 💰 Est Cost: ${activeDay.evening.cost}
                  </span>
                </div>
              </div>

              {/* Event 4: Hotel Lodging */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  background: 'var(--color-bg-surface)', 
                  border: hoveredLocation === 'hotel' ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)', 
                  display: 'flex', 
                  gap: '16px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredLocation('hotel')}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '12px', height: 'fit-content' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                        {getLocalText('Lodging Stay')}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--color-text-primary)' }}>
                        {activeDay.hotel.name}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEdit('hotel')} style={{ color: 'var(--color-purple)', padding: '4px' }}><Edit3 size={14} /></button>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                    📍 Area: {activeDay.hotel.area} • 🏨 Stars: {activeDay.hotel.stars}★ • 💰 Night Rate: ${activeDay.hotel.price}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right pane: Map, Weather & Budget charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Map widget */}
          <div className="glass-panel" style={{ height: '320px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', overflow: 'hidden', position: 'relative' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            {!isMapLoaded && (
              /* Simulated vector mapping background fallback if API key not present */
              <div style={{ position: 'absolute', inset: 0, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--glass-border) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.7 }} />
                
                {/* SVG Route Visualization */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                  {/* polyline paths connecting nodes */}
                  <motion.path 
                    d="M 20 80 Q 40 40 50 30 T 80 50" 
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Node Pins */}
                  <circle cx="20" cy="80" r="3" fill={hoveredLocation === 'morning' ? 'var(--color-accent)' : '#94a3b8'} style={{ transition: 'all 0.2s' }} />
                  <circle cx="40" cy="45" r="3" fill={hoveredLocation === 'afternoon' ? 'var(--color-purple)' : '#94a3b8'} style={{ transition: 'all 0.2s' }} />
                  <circle cx="50" cy="30" r="3" fill={hoveredLocation === 'evening' ? '#f59e0b' : '#94a3b8'} style={{ transition: 'all 0.2s' }} />
                  <circle cx="80" cy="50" r="3" fill={hoveredLocation === 'hotel' ? '#10b981' : '#94a3b8'} style={{ transition: 'all 0.2s' }} />
                </svg>

                <div style={{ zIndex: 5, textAlign: 'center', pointerEvents: 'none' }}>
                  <MapPin size={24} style={{ color: 'var(--color-accent)', margin: '0 auto 6px auto' }} />
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Interactive Route Telemetry</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Simulating routing coordinates for {trip.destination.split(',')[0]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Budget ring stats */}
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Budget Overview
            </h4>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {/* SVG donut chart */}
              <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                <svg width="100%" height="100%" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--glass-border)" strokeWidth="3" />
                  {/* Progress Circle */}
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.91" 
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth="3" 
                    strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                    strokeDashoffset="25"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                  <span>{Math.round(progressPercent)}%</span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>Spent</span>
                </div>
              </div>

              {/* Data list */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{getLocalText('Budget Limit')}:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>${budgetLimit}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{getLocalText('Total Expenses')}:</span>
                  <strong style={{ color: '#10b981' }}>${totalSpent}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{getLocalText('Remaining')}:</span>
                  <strong style={{ color: remaining < 0 ? '#ef4444' : 'var(--color-accent)' }}>${remaining}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Weather widget */}
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {getLocalText('Daily Weather Forecast')}
            </h4>

            {/* Weather highlights */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                <Thermometer size={28} style={{ color: '#f59e0b' }} />
                <span>24°C</span>
              </div>
              <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CloudRain size={12} /> {getLocalText('Rain Probability')}: 15%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wind size={12} /> {getLocalText('Wind Speed')}: 12 km/h</span>
              </div>
            </div>

            {/* Warning alert warning block */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', padding: '10px 14px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <AlertTriangle size={16} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: '#d97706', lineHeight: 1.4 }}>
                {getLocalText('Severe Alert')}
              </span>
            </div>
          </div>

          {/* Flight preview info */}
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Domestic Flight Routing
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>Uzbekistan Airways (HY-102)</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>TAS ➡️ SKD • Gate 4B</span>
              </div>
              <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>$45</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Activity Modal overlay */}
      {isEditModalOpen && editingNode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '460px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0 }}>
                {getLocalText('Edit activity details')}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Activity / Title field */}
              {editingNode.section !== 'evening' && editingNode.section !== 'hotel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Activity Name')}</label>
                  <input 
                    type="text" 
                    value={editingNode.data.activity} 
                    onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, activity: e.target.value } })}
                    style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  />
                </div>
              )}

              {/* Specific fields for Evening restaurant */}
              {editingNode.section === 'evening' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Restaurant Name</label>
                    <input 
                      type="text" 
                      value={editingNode.data.restaurant} 
                      onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, restaurant: e.target.value } })}
                      style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cuisine Type</label>
                    <input 
                      type="text" 
                      value={editingNode.data.cuisine} 
                      onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, cuisine: e.target.value } })}
                      style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Address</label>
                    <input 
                      type="text" 
                      value={editingNode.data.address} 
                      onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, address: e.target.value } })}
                      style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </>
              )}

              {/* Specific fields for Hotel stay */}
              {editingNode.section === 'hotel' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hotel Name</label>
                    <input 
                      type="text" 
                      value={editingNode.data.name} 
                      onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, name: e.target.value } })}
                      style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Area Neighborhood</label>
                    <input 
                      type="text" 
                      value={editingNode.data.area} 
                      onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, area: e.target.value } })}
                      style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Night Rate ($)</label>
                      <input 
                        type="number" 
                        value={editingNode.data.price} 
                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, price: Number(e.target.value) } })}
                        style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Stars rating</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={editingNode.data.stars} 
                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, stars: Number(e.target.value) } })}
                        style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Standard location, duration, cost and tip fields */}
              {editingNode.section !== 'hotel' && (
                <>
                  {editingNode.section !== 'evening' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Location')}</label>
                      <input 
                        type="text" 
                        value={editingNode.data.location} 
                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, location: e.target.value } })}
                        style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {editingNode.section !== 'evening' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Duration')}</label>
                        <input 
                          type="text" 
                          value={editingNode.data.duration} 
                          onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, duration: e.target.value } })}
                          style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Cost')} ($)</label>
                      <input 
                        type="number" 
                        value={editingNode.data.cost} 
                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, cost: Number(e.target.value) } })}
                        style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  </div>

                  {editingNode.section !== 'evening' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Notes/Tips')}</label>
                      <textarea 
                        value={editingNode.data.tip} 
                        onChange={(e) => setEditingNode({ ...editingNode, data: { ...editingNode.data, tip: e.target.value } })}
                        rows={2}
                        style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)', resize: 'none' }}
                      />
                    </div>
                  )}
                </>
              )}

            </div>

            <button 
              onClick={handleSaveEdit}
              className="btn-premium"
              style={{ width: '100%', padding: '12px', border: 'none', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Check size={16} /> Save Node Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* Add Custom Activity Modal Overlay */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '440px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0 }}>
                {getLocalText('Add Activity')}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Target Time block</label>
                <select 
                  value={customActivity.section}
                  onChange={(e) => setCustomActivity({ ...customActivity, section: e.target.value })}
                  style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)', fontSize: '0.9rem' }}
                >
                  <option value="morning">Morning block</option>
                  <option value="afternoon">Afternoon block</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Activity Name')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Visit Chorsu dome bazaar"
                  value={customActivity.activity}
                  onChange={(e) => setCustomActivity({ ...customActivity, activity: e.target.value })}
                  style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Location')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tashkent Old City"
                  value={customActivity.location}
                  onChange={(e) => setCustomActivity({ ...customActivity, location: e.target.value })}
                  style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Duration')}</label>
                  <input 
                    type="text" 
                    value={customActivity.duration}
                    onChange={(e) => setCustomActivity({ ...customActivity, duration: e.target.value })}
                    style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Cost')} ($)</label>
                  <input 
                    type="number" 
                    value={customActivity.cost}
                    onChange={(e) => setCustomActivity({ ...customActivity, cost: Number(e.target.value) })}
                    style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{getLocalText('Notes/Tips')}</label>
                <textarea 
                  placeholder="Additional advices..."
                  value={customActivity.tip}
                  onChange={(e) => setCustomActivity({ ...customActivity, tip: e.target.value })}
                  rows={2}
                  style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--color-text-primary)', resize: 'none' }}
                />
              </div>

            </div>

            <button 
              onClick={handleAddActivity}
              className="btn-premium"
              style={{ width: '100%', padding: '12px', border: 'none', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Append to Timeline
            </button>
          </motion.div>
        </div>
      )}

      {/* Responsive details style injections */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 992px) {
          .details-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

    </div>
  );
};

// Loader asset inside component
const LoaderComponent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
    <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', width: '36px', height: '36px' }} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span style={{ fontSize: '0.85rem' }}>Loading active trip details...</span>
  </div>
);
