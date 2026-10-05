import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Luggage, Users, TrendingUp, Plus, Edit2, 
  Trash2, Eye, CheckCircle2, XCircle, Star, Phone, 
  Mail, Globe, MapPin, DollarSign, Calendar, Clock, 
  Search, Filter, ShieldCheck, ArrowUpRight, BarChart3, 
  Check, X, Sparkles, Navigation, Layers
} from '../icons';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export interface AgencyTour {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  priceUSD: number;
  published: boolean;
  views: number;
  inquiries: number;
  inclusions: {
    hotel: boolean;
    transfer: boolean;
    meals: boolean;
    guide: boolean;
  };
  image: string;
  rating: number;
}

export interface AgencyLead {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  tourOrDestination: string;
  travelDates: string;
  travelersCount: number;
  budgetUSD: number;
  status: 'New' | 'Contacted' | 'In Progress' | 'Booked' | 'Cancelled';
  createdAt: string;
}

const INITIAL_TOURS: AgencyTour[] = [
  {
    id: 'tour-1',
    title: 'Silk Road Grand Discovery (Samarkand & Bukhara)',
    destination: 'Uzbekistan',
    durationDays: 7,
    priceUSD: 850,
    published: true,
    views: 1420,
    inquiries: 38,
    inclusions: { hotel: true, transfer: true, meals: true, guide: true },
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    rating: 4.9
  },
  {
    id: 'tour-2',
    title: 'Sahara Agadez & Tenere Expedition',
    destination: 'Niger',
    durationDays: 6,
    priceUSD: 890,
    published: true,
    views: 890,
    inquiries: 19,
    inclusions: { hotel: true, transfer: true, meals: true, guide: true },
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9
  },
  {
    id: 'tour-3',
    title: 'Cappadocia Sunrise Hot Air Balloon & Valley Hike',
    destination: 'Turkey',
    durationDays: 4,
    priceUSD: 520,
    published: true,
    views: 2150,
    inquiries: 64,
    inclusions: { hotel: true, transfer: true, meals: true, guide: true },
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    rating: 5.0
  },
  {
    id: 'tour-4',
    title: 'Paris Art & Haute Gastronomy Immersion',
    destination: 'France',
    durationDays: 5,
    priceUSD: 1150,
    published: false,
    views: 310,
    inquiries: 8,
    inclusions: { hotel: true, transfer: true, meals: false, guide: true },
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    rating: 4.8
  }
];

const INITIAL_LEADS: AgencyLead[] = [
  {
    id: 'lead-1',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@gmail.com',
    travelerPhone: '+1 (555) 234-8901',
    tourOrDestination: 'Silk Road Grand Discovery',
    travelDates: 'May 12 – May 19, 2026',
    travelersCount: 2,
    budgetUSD: 1800,
    status: 'New',
    createdAt: '2 hours ago'
  },
  {
    id: 'lead-2',
    travelerName: 'Jean Dupont',
    travelerEmail: 'j.dupont@orange.fr',
    travelerPhone: '+33 6 12 34 56 78',
    tourOrDestination: 'Sahara Agadez & Tenere Expedition',
    travelDates: 'Nov 10 – Nov 16, 2026',
    travelersCount: 4,
    budgetUSD: 3600,
    status: 'In Progress',
    createdAt: '1 day ago'
  },
  {
    id: 'lead-3',
    travelerName: 'Tariq Al-Mansoor',
    travelerEmail: 'tariq@gulfmedia.ae',
    travelerPhone: '+971 50 889 1234',
    tourOrDestination: 'Cappadocia Sunrise Balloon & Valley Hike',
    travelDates: 'Jun 20 – Jun 24, 2026',
    travelersCount: 3,
    budgetUSD: 2100,
    status: 'Contacted',
    createdAt: '2 days ago'
  },
  {
    id: 'lead-4',
    travelerName: 'Elena Rostova',
    travelerEmail: 'elena.rost@yandex.ru',
    travelerPhone: '+7 916 555-0199',
    tourOrDestination: 'Silk Road Grand Discovery',
    travelDates: 'Sep 05 – Sep 12, 2026',
    travelersCount: 2,
    budgetUSD: 1700,
    status: 'Booked',
    createdAt: '3 days ago'
  }
];

export const AgencyDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'tours' | 'leads' | 'analytics' | 'profile'>('overview');

  // Tours state
  const [tours, setTours] = useState<AgencyTour[]>(INITIAL_TOURS);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);

  // Tour Form State
  const [tourFormTitle, setTourFormTitle] = useState('');
  const [tourFormDestination, setTourFormDestination] = useState('Uzbekistan');
  const [tourFormDuration, setTourFormDuration] = useState(5);
  const [tourFormPrice, setTourFormPrice] = useState(650);
  const [tourFormHotel, setTourFormHotel] = useState(true);
  const [tourFormTransfer, setTourFormTransfer] = useState(true);
  const [tourFormMeals, setTourFormMeals] = useState(true);
  const [tourFormGuide, setTourFormGuide] = useState(true);
  const [tourFormImage, setTourFormImage] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80');

  // Leads state
  const [leads, setLeads] = useState<AgencyLead[]>(INITIAL_LEADS);
  const [leadFilter, setLeadFilter] = useState<string>('all');

  // Profile state
  const [agencyProfile, setAgencyProfile] = useState({
    name: 'Marakanda Silk Road Travel Group',
    description: 'Premier licensed Silk Road and global destination DMC specializing in cultural expeditions, Sahara treks, and bespoke private journeys.',
    logoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    contactEmail: 'contact@marakandatravel.com',
    contactPhone: '+998 (78) 150-8800',
    website: 'https://marakandatravel.com',
    languages: 'English, French, Russian, Uzbek, Arabic',
    verificationStatus: 'Verified Partner',
    licenseNumber: 'UZ-TO-2024-8891'
  });

  // Calculate overview metrics
  const totalTours = tours.length;
  const publishedTours = tours.filter(t => t.published).length;
  const totalViews = tours.reduce((acc, t) => acc + t.views, 0);
  const totalLeads = leads.length;
  const conversionRate = totalViews > 0 ? ((leads.filter(l => l.status === 'Booked').length / totalLeads) * 100).toFixed(1) : '12.4';

  const togglePublishTour = (tourId: string) => {
    setTours(prev => prev.map(t => t.id === tourId ? { ...t, published: !t.published } : t));
  };

  const deleteTour = (tourId: string) => {
    if (confirm('Are you sure you want to delete this tour listing?')) {
      setTours(prev => prev.filter(t => t.id !== tourId));
    }
  };

  const openCreateTour = () => {
    setEditingTourId(null);
    setTourFormTitle('');
    setTourFormDestination('Uzbekistan');
    setTourFormDuration(5);
    setTourFormPrice(650);
    setTourFormHotel(true);
    setTourFormTransfer(true);
    setTourFormMeals(true);
    setTourFormGuide(true);
    setTourFormImage('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80');
    setIsTourModalOpen(true);
  };

  const openEditTour = (tour: AgencyTour) => {
    setEditingTourId(tour.id);
    setTourFormTitle(tour.title);
    setTourFormDestination(tour.destination);
    setTourFormDuration(tour.durationDays);
    setTourFormPrice(tour.priceUSD);
    setTourFormHotel(tour.inclusions.hotel);
    setTourFormTransfer(tour.inclusions.transfer);
    setTourFormMeals(tour.inclusions.meals);
    setTourFormGuide(tour.inclusions.guide);
    setTourFormImage(tour.image);
    setIsTourModalOpen(true);
  };

  const saveTourForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTourId) {
      setTours(prev => prev.map(t => t.id === editingTourId ? {
        ...t,
        title: tourFormTitle,
        destination: tourFormDestination,
        durationDays: tourFormDuration,
        priceUSD: tourFormPrice,
        image: tourFormImage,
        inclusions: {
          hotel: tourFormHotel,
          transfer: tourFormTransfer,
          meals: tourFormMeals,
          guide: tourFormGuide
        }
      } : t));
    } else {
      const newTour: AgencyTour = {
        id: `tour-${Date.now()}`,
        title: tourFormTitle || 'Bespoke Private Expedition',
        destination: tourFormDestination,
        durationDays: tourFormDuration,
        priceUSD: tourFormPrice,
        published: true,
        views: 0,
        inquiries: 0,
        image: tourFormImage,
        rating: 5.0,
        inclusions: {
          hotel: tourFormHotel,
          transfer: tourFormTransfer,
          meals: tourFormMeals,
          guide: tourFormGuide
        }
      };
      setTours(prev => [newTour, ...prev]);
    }
    setIsTourModalOpen(false);
  };

  const updateLeadStatus = (leadId: string, newStatus: AgencyLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const filteredLeads = leadFilter === 'all' ? leads : leads.filter(l => l.status.toLowerCase() === leadFilter.toLowerCase());

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* Top Header */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {agencyProfile.name}
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                padding: '3px 8px',
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={12} /> {agencyProfile.verificationStatus}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              TripMind Agency Partner Portal • License #{agencyProfile.licenseNumber}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={openCreateTour}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
          }}
        >
          <Plus size={16} />
          <span>Create New Tour</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex',
        gap: '28px'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: <Layers size={16} /> },
          { id: 'tours', label: `Tours (${totalTours})`, icon: <Luggage size={16} /> },
          { id: 'leads', label: `Traveler Leads (${totalLeads})`, icon: <Users size={16} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
          { id: 'profile', label: 'Agency Profile', icon: <Building2 size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '16px 4px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--color-accent, #2563eb)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-accent, #2563eb)' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px' }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Total Tours</span>
                  <div style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '8px', borderRadius: '10px' }}>
                    <Luggage size={18} />
                  </div>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 900 }}>{totalTours}</strong>
                <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                  {publishedTours} Published live
                </span>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Active Leads</span>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
                    <Users size={18} />
                  </div>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 900 }}>{totalLeads}</strong>
                <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                  +{leads.filter(l => l.status === 'New').length} New requests
                </span>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Total Tour Views</span>
                  <div style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '8px', borderRadius: '10px' }}>
                    <Eye size={18} />
                  </div>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 900 }}>{totalViews.toLocaleString()}</strong>
                <span style={{ fontSize: '0.72rem', color: '#7c3aed', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                  Across 3D globe & search
                </span>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Conversion Rate</span>
                  <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '8px', borderRadius: '10px' }}>
                    <TrendingUp size={18} />
                  </div>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 900 }}>{conversionRate}%</strong>
                <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                  High traveler interest
                </span>
              </div>
            </div>

            {/* Recent Leads & Quick Tour Performance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Recent Leads */}
              <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    Recent Traveler Leads
                  </h3>
                  <button onClick={() => setActiveTab('leads')} style={{ fontSize: '0.78rem', color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    View All Leads
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leads.slice(0, 3).map(lead => (
                    <div key={lead.id} style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary, rgba(15,23,42,0.03))',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ fontSize: '0.88rem', display: 'block' }}>{lead.travelerName}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {lead.tourOrDestination} • {lead.travelDates}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: lead.status === 'New' ? 'rgba(37,99,235,0.1)' : lead.status === 'Booked' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: lead.status === 'New' ? '#2563eb' : lead.status === 'Booked' ? '#10b981' : '#f59e0b'
                      }}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Tours Quick List */}
              <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    Top Performing Tours
                  </h3>
                  <button onClick={() => setActiveTab('tours')} style={{ fontSize: '0.78rem', color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    Manage Catalog
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tours.slice(0, 3).map(tour => (
                    <div key={tour.id} style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary, rgba(15,23,42,0.03))',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      <img src={tour.image} alt={tour.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.85rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tour.title}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {tour.destination} • {tour.durationDays} Days • {tour.views} views
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: '#10b981' }}>
                        {formatPrice(tour.priceUSD)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOURS */}
        {activeTab === 'tours' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Agency Tour Catalog
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Publish, edit, and price tours visible to international travelers on TripMind.
                </span>
              </div>
              <button
                onClick={openCreateTour}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={15} /> Add Tour
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {tours.map(tour => (
                <div key={tour.id} className="glass-panel" style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ height: '160px', position: 'relative' }}>
                    <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      display: 'flex',
                      gap: '6px'
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: tour.published ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.9)',
                        color: '#ffffff',
                        backdropFilter: 'blur(6px)'
                      }}>
                        {tour.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.25 }}>{tour.title}</strong>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                        <Star size={13} fill="#f59e0b" stroke="none" /> {tour.rating}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <span><MapPin size={13} style={{ verticalAlign: 'middle' }} /> {tour.destination}</span>
                      <span><Clock size={13} style={{ verticalAlign: 'middle' }} /> {tour.durationDays} Days</span>
                      <span><Eye size={13} style={{ verticalAlign: 'middle' }} /> {tour.views} views</span>
                    </div>

                    {/* Inclusions checklist */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {tour.inclusions.hotel && <span style={{ fontSize: '0.65rem', background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>🏨 Hotel</span>}
                      {tour.inclusions.transfer && <span style={{ fontSize: '0.65rem', background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>🚐 Transfer</span>}
                      {tour.inclusions.meals && <span style={{ fontSize: '0.65rem', background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>🍽️ Meals</span>}
                      {tour.inclusions.guide && <span style={{ fontSize: '0.65rem', background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>🧭 Guide</span>}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>Per Person</span>
                        <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{formatPrice(tour.priceUSD)}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => togglePublishTour(tour.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: 'var(--bg-secondary, rgba(15,23,42,0.06))',
                            border: '1px solid var(--border)',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          {tour.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => openEditTour(tour)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            background: 'rgba(37,99,235,0.1)',
                            border: 'none',
                            color: '#2563eb',
                            cursor: 'pointer'
                          }}
                          title="Edit Tour"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteTour(tour.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            background: 'rgba(239,68,68,0.1)',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Delete Tour"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEADS */}
        {activeTab === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Traveler Leads Pipeline
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Inquiries and bookings submitted by travelers worldwide.
                </span>
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['all', 'New', 'In Progress', 'Contacted', 'Booked'].map(status => (
                  <button
                    key={status}
                    onClick={() => setLeadFilter(status)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: leadFilter === status ? '1px solid #2563eb' : '1px solid var(--border)',
                      background: leadFilter === status ? '#2563eb' : 'var(--color-bg-surface)',
                      color: leadFilter === status ? '#ffffff' : 'var(--color-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {status === 'all' ? 'All Leads' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="glass-panel" style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Traveler</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Tour / Destination</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Travel Dates</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Party & Budget</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Status</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <strong style={{ display: 'block', fontSize: '0.88rem' }}>{lead.travelerName}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', gap: '8px' }}>
                            <span>{lead.travelerEmail}</span>
                            <span>{lead.travelerPhone}</span>
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <strong style={{ fontSize: '0.85rem' }}>{lead.tourOrDestination}</strong>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>Received {lead.createdAt}</span>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>
                          {lead.travelDates}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'block', fontSize: '0.82rem' }}>{lead.travelersCount} Guests</span>
                          <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>{formatPrice(lead.budgetUSD)}</strong>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: lead.status === 'New' ? 'rgba(37,99,235,0.1)' : lead.status === 'Booked' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                              color: lead.status === 'New' ? '#2563eb' : lead.status === 'Booked' ? '#10b981' : '#f59e0b',
                              border: '1px solid var(--border)',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Booked">Booked</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <a
                            href={`mailto:${lead.travelerEmail}?subject=TripMind Inquiry: ${lead.tourOrDestination}`}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: '#2563eb',
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Mail size={12} /> Contact
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                Agency Telemetry & Travel Demographics
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Monitor international impression rates, search queries, and booking velocity.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Tour Views Breakdown */}
              <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800 }}>Views per Tour Listing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {tours.map(tour => {
                    const percent = Math.min(100, Math.round((tour.views / 2500) * 100));
                    return (
                      <div key={tour.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700 }}>{tour.title}</span>
                          <strong style={{ color: '#2563eb' }}>{tour.views} views</strong>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(15,23,42,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Traveler Distribution */}
              <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800 }}>Lead Country Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { country: 'United States & Canada', share: '38%', flag: '🇺🇸' },
                    { country: 'European Union (France, Germany, Italy)', share: '32%', flag: '🇪🇺' },
                    { country: 'United Arab Emirates & GCC', share: '18%', flag: '🇦🇪' },
                    { country: 'United Kingdom & Other', share: '12%', flag: '🇬🇧' }
                  ].map((geo, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{geo.flag} {geo.country}</span>
                      <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>{geo.share}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="glass-panel" style={{ padding: '32px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '24px', maxWidth: '720px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
              Agency Profile & Verification
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '24px' }}>
              Update agency branding, traveler contact lines, and licensed operational details.
            </span>

            <form onSubmit={(e) => { e.preventDefault(); alert('Agency profile updated successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Agency Name</label>
                <input
                  type="text"
                  value={agencyProfile.name}
                  onChange={(e) => setAgencyProfile({ ...agencyProfile, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={3}
                  value={agencyProfile.description}
                  onChange={(e) => setAgencyProfile({ ...agencyProfile, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Contact Email</label>
                  <input
                    type="email"
                    value={agencyProfile.contactEmail}
                    onChange={(e) => setAgencyProfile({ ...agencyProfile, contactEmail: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Contact Phone</label>
                  <input
                    type="tel"
                    value={agencyProfile.contactPhone}
                    onChange={(e) => setAgencyProfile({ ...agencyProfile, contactPhone: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Supported Languages</label>
                <input
                  type="text"
                  value={agencyProfile.languages}
                  onChange={(e) => setAgencyProfile({ ...agencyProfile, languages: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Save Agency Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CREATE / EDIT TOUR MODAL */}
      <AnimatePresence>
        {isTourModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '100%',
                maxWidth: '560px',
                background: 'var(--color-bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                  {editingTourId ? 'Edit Tour Listing' : 'Create New Tour'}
                </h3>
                <button
                  onClick={() => setIsTourModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveTourForm} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Tour Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Silk Road Odyssey"
                    value={tourFormTitle}
                    onChange={(e) => setTourFormTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Destination</label>
                    <input
                      type="text"
                      required
                      value={tourFormDestination}
                      onChange={(e) => setTourFormDestination(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      required
                      value={tourFormDuration}
                      onChange={(e) => setTourFormDuration(parseInt(e.target.value) || 1)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Price (USD)</label>
                    <input
                      type="number"
                      min={10}
                      required
                      value={tourFormPrice}
                      onChange={(e) => setTourFormPrice(parseInt(e.target.value) || 10)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Cover Image URL</label>
                  <input
                    type="url"
                    value={tourFormImage}
                    onChange={(e) => setTourFormImage(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-secondary, #ffffff)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                {/* Inclusions checkboxes */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Included Services</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tourFormHotel} onChange={(e) => setTourFormHotel(e.target.checked)} />
                      <span>🏨 4★ / 5★ Hotel Lodging</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tourFormTransfer} onChange={(e) => setTourFormTransfer(e.target.checked)} />
                      <span>🚐 Airport & Intercity Transfer</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tourFormMeals} onChange={(e) => setTourFormMeals(e.target.checked)} />
                      <span>🍽️ Daily Breakfast & Dinners</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tourFormGuide} onChange={(e) => setTourFormGuide(e.target.checked)} />
                      <span>🧭 Certified Multilingual Guide</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsTourModalOpen(false)}
                    style={{ padding: '10px 16px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--color-text-secondary)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', borderRadius: '10px', background: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {editingTourId ? 'Save Changes' : 'Publish Tour'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
