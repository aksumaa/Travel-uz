'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Image as ImageIcon, MapPin, 
  Calendar, DollarSign, Hotel, Check, Sparkles, Luggage 
} from '../../icons';
import { AgencyPackage, PackageItineraryDay, HotelCategory, PackageStatus } from '../../lib/agency/types';

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkgData: any) => void;
  initialData?: AgencyPackage | null;
}

export const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'pricing' | 'hotel' | 'services' | 'itinerary' | 'media' | 'contact'>('basic');

  // Form states
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupSizeMin, setGroupSizeMin] = useState(2);
  const [groupSizeMax, setGroupSizeMax] = useState(10);
  const [priceUSD, setPriceUSD] = useState(850);
  const [currency, setCurrency] = useState('USD');
  const [hotelName, setHotelName] = useState('');
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>('4-star');
  const [roomType, setRoomType] = useState('Deluxe King');
  const [transfer, setTransfer] = useState(true);
  const [meals, setMeals] = useState(true);
  const [guide, setGuide] = useState(true);
  const [activities, setActivities] = useState(true);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('+998 66 233 4545');
  const [contactEmail, setContactEmail] = useState('tours@marakandatravel.uz');
  const [contactWebsite, setContactWebsite] = useState('https://marakandatravel.uz');
  const [contactTelegram, setContactTelegram] = useState('@MarakandaToursBot');
  const [status, setStatus] = useState<PackageStatus>('published');

  // Itinerary days
  const [itinerary, setItinerary] = useState<PackageItineraryDay[]>([
    { day: 1, time: '09:00', activity: 'Arrival & Welcome City Tour', location: 'City Center', description: 'Meet private guide at airport, transfer to hotel, and explore historical downtown.' },
    { day: 2, time: '10:00', activity: 'Heritage Sights & Culinary Workshop', location: 'Old Quarter', description: 'Guided walking tour through ancient monuments followed by traditional dinner.' },
    { day: 3, time: '09:00', activity: 'Scenic Nature Excursion & Leisure', location: 'Mountain Oasis', description: 'Day trip to panoramic lookout point with outdoor picnic.' },
  ]);

  // Populate on initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDestination(initialData.destination);
      setShortDescription(initialData.shortDescription);
      setFullDescription(initialData.fullDescription);
      setDurationDays(initialData.durationDays);
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
      setGroupSizeMin(initialData.groupSizeMin || 2);
      setGroupSizeMax(initialData.groupSizeMax || 10);
      setPriceUSD(initialData.priceUSD);
      setCurrency(initialData.currency || 'USD');
      setHotelName(initialData.hotelName || '');
      setHotelCategory(initialData.hotelCategory || '4-star');
      setRoomType(initialData.roomType || 'Deluxe King');
      setTransfer(initialData.inclusions?.transfer ?? true);
      setMeals(initialData.inclusions?.meals ?? true);
      setGuide(initialData.inclusions?.guide ?? true);
      setActivities(initialData.inclusions?.activities ?? true);
      setCoverImage(initialData.coverImage || '');
      setGalleryImages(initialData.galleryImages || []);
      setContactPhone(initialData.contactPhone || '');
      setContactEmail(initialData.contactEmail || '');
      setContactWebsite(initialData.contactWebsite || '');
      setContactTelegram(initialData.contactTelegram || '');
      setStatus(initialData.status);
      setItinerary(initialData.itinerary && initialData.itinerary.length > 0 ? initialData.itinerary : [
        { day: 1, time: '09:00', activity: 'Arrival & City Orientation', location: initialData.destination, description: 'Hotel check-in and welcome dinner.' }
      ]);
    } else {
      // Reset defaults for new package
      setTitle('');
      setDestination('');
      setShortDescription('');
      setFullDescription('');
      setDurationDays(5);
      setPriceUSD(750);
      setHotelName('Registan Heritage Hotel');
      setHotelCategory('4-star');
      setRoomType('Standard Double');
      setStatus('published');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      { day: nextDayNum, time: '09:00', activity: `Day ${nextDayNum} Exploration`, location: destination || 'Highlight Location', description: 'Detailed itinerary activities and scheduled transport.' }
    ]);
    setDurationDays(nextDayNum);
  };

  const handleRemoveDay = (index: number) => {
    const updated = itinerary.filter((_, idx) => idx !== index).map((day, idx) => ({
      ...day,
      day: idx + 1
    }));
    setItinerary(updated);
    setDurationDays(updated.length);
  };

  const handleDayChange = (index: number, field: keyof PackageItineraryDay, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (targetStatus?: PackageStatus) => {
    if (!title.trim() || !destination.trim()) {
      alert('Please provide at least a Package Title and Destination.');
      return;
    }

    const payload = {
      title,
      destination,
      shortDescription: shortDescription || `${durationDays}-day curated tour in ${destination}`,
      fullDescription: fullDescription || shortDescription,
      durationDays: Number(durationDays),
      startDate,
      endDate,
      groupSizeMin: Number(groupSizeMin),
      groupSizeMax: Number(groupSizeMax),
      priceUSD: Number(priceUSD),
      currency,
      hotelName,
      hotelCategory,
      roomType,
      inclusions: { transfer, meals, guide, activities },
      itinerary,
      coverImage,
      galleryImages,
      contactPhone,
      contactEmail,
      contactWebsite,
      contactTelegram,
      status: targetStatus || status,
    };

    onSave(payload);
    onClose();
  };

  const sections = [
    { id: 'basic', label: '1. Basic Info' },
    { id: 'details', label: '2. Trip Details' },
    { id: 'pricing', label: '3. Pricing' },
    { id: 'hotel', label: '4. Accommodation' },
    { id: 'services', label: '5. Services' },
    { id: 'itinerary', label: '6. Day Itinerary' },
    { id: 'media', label: '7. Media' },
    { id: 'contact', label: '8. Contact' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              {initialData ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              Publish verified multi-day itineraries to the TripMind traveler ecosystem.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '10px 20px',
          background: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeSection === s.id ? '#0284c7' : 'transparent',
                color: activeSection === s.id ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SECTION 1: BASIC INFO */}
          {activeSection === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Package Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Silk Road Grand Discovery: Samarkand & Bukhara"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Destination / Country *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Uzbekistan, Samarkand, Cappadocia"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Short Summary (Catalog Preview)
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A brief 1-2 sentence hook highlighting key monuments, lodging, or transport perks."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Trip Description
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed tour narrative, background history, traveler recommendations..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>
          )}

          {/* SECTION 2: TRIP DETAILS */}
          {activeSection === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Group Size (Min - Max Travelers)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    min={1}
                    value={groupSizeMin}
                    onChange={(e) => setGroupSizeMin(Number(e.target.value))}
                    placeholder="Min"
                    style={{ width: '50%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                  <input
                    type="number"
                    min={1}
                    value={groupSizeMax}
                    onChange={(e) => setGroupSizeMax(Number(e.target.value))}
                    placeholder="Max"
                    style={{ width: '50%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Season Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Season End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>
            </div>
          )}

          {/* SECTION 3: PRICING */}
          {activeSection === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Base Price Per Person (USD) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Display Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600 }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="UZS">UZS (soʻm)</option>
                    <option value="AED">AED (AED)</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
                💡 <strong>Notice:</strong> TripMind MVP manages inquiries and quote confirmations. Final payments are processed directly with your agency via your preferred bank/gateway.
              </div>
            </div>
          )}

          {/* SECTION 4: ACCOMMODATION */}
          {activeSection === 'hotel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Hotel / Property Name
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="e.g. Orient Star Heritage Hotel, Samarkand"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Lodging Category
                  </label>
                  <select
                    value={hotelCategory}
                    onChange={(e) => setHotelCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  >
                    <option value="3-star">3-Star Standard</option>
                    <option value="4-star">4-Star Superior</option>
                    <option value="5-star">5-Star Luxury</option>
                    <option value="Boutique">Boutique Concept</option>
                    <option value="Heritage Riad">Heritage Riad / Traditional Madrasah</option>
                    <option value="Resort">Resort & Spa</option>
                    <option value="Eco-Lodge">Desert / Eco-Lodge</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Room Specifications
                  </label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    placeholder="e.g. Deluxe King with Courtyard Garden View"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SERVICES & INCLUSIONS */}
          {activeSection === 'services' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { key: 'transfer', label: 'Airport & Inter-City Transfers', state: transfer, setter: setTransfer, icon: '🚐' },
                { key: 'meals', label: 'Breakfast & Gourmet Meals Included', state: meals, setter: setMeals, icon: '🍽️' },
                { key: 'guide', label: 'Certified Private Heritage Guide', state: guide, setter: setGuide, icon: '🧭' },
                { key: 'activities', label: 'Museum Passes & Activities', state: activities, setter: setActivities, icon: '🎟️' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => item.setter(!item.state)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: item.state ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                    background: item.state ? '#f0f9ff' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: item.state ? '#0369a1' : '#334155' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {item.state ? 'Included in price' : 'Not included (Optional add-on)'}
                    </div>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: item.state ? 'none' : '1px solid #cbd5e1',
                    background: item.state ? '#0ea5e9' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    {item.state && <Check size={14} />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 6: DAY-BY-DAY ITINERARY EDITOR */}
          {activeSection === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  {itinerary.length} Day Schedule Configuration
                </span>
                <button
                  type="button"
                  onClick={handleAddDay}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> Add Day {itinerary.length + 1}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map((day, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        Day {day.day}
                      </span>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        value={day.time || '09:00'}
                        onChange={(e) => handleDayChange(idx, 'time', e.target.value)}
                        placeholder="Time"
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', color: '#0f172a' }}
                      />
                      <input
                        type="text"
                        value={day.activity}
                        onChange={(e) => handleDayChange(idx, 'activity', e.target.value)}
                        placeholder="Activity Headline *"
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}
                      />
                      <input
                        type="text"
                        value={day.location}
                        onChange={(e) => handleDayChange(idx, 'location', e.target.value)}
                        placeholder="Location / City *"
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', color: '#0f172a' }}
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={day.description}
                      onChange={(e) => handleDayChange(idx, 'description', e.target.value)}
                      placeholder="Detailed schedule notes, tickets included, restaurant stop..."
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', color: '#0f172a' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: MEDIA */}
          {activeSection === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.84rem' }}
                />
                {coverImage && (
                  <div style={{ marginTop: '10px', width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Add Gallery Image URL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.84rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                    {galleryImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '90px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                        <img src={img} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 8: CONTACT */}
          {activeSection === 'contact' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Agency Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Inquiry Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Agency Website
                </label>
                <input
                  type="text"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Telegram Bot / Admin handle
                </label>
                <input
                  type="text"
                  value={contactTelegram}
                  onChange={(e) => setContactTelegram(e.target.value)}
                  placeholder="@AgencyBot"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a' }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
            >
              {initialData ? 'Update & Publish' : 'Publish Package'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
