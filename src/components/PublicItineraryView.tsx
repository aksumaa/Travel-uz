import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Download, Send, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { api } from '../services/api';

interface PublicItineraryViewProps {
  shareToken: string;
}

export const PublicItineraryView: React.FC<PublicItineraryViewProps> = ({ shareToken }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inquiry modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  useEffect(() => {
    const fetchItinerary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<any>(`/trips/share/${shareToken}`);
        setData(res);
      } catch (err: any) {
        console.error("Failed to load public itinerary:", err);
        setError(err.message || "Failed to load itinerary. Please verify the share link.");
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [shareToken]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim()) return;

    setSubmittingInquiry(true);
    try {
      await api.post('/leads/public', {
        share_token: shareToken,
        client_name: clientName,
        client_contact: clientContact,
        notes: notes
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setShowInquiryModal(false);
        setInquirySuccess(false);
        setClientName('');
        setClientContact('');
        setNotes('');
      }, 2500);
    } catch (err: any) {
      alert(err.message || "Failed to submit request.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)', color: 'var(--color-accent)' }}>
        <div style={{ textAlign: 'center' }}>
          <Compass size={40} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '12px' }} />
          <p style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Loading Custom Tour Itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)' }}>
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px', textAlign: 'center', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '8px' }}>Link Expired or Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error}</p>
          <a href="/" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none', borderRadius: '10px', fontWeight: 700 }}>
            Back to TravelUZ
          </a>
        </div>
      </div>
    );
  }

  const itin = data.content_json || {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)', paddingBottom: '60px' }}>
      
      {/* Agency Branding Header Bar */}
      <header style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--color-bg-surface)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {data.agency_logo ? (
              <img src={data.agency_logo} alt={data.agency_name} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }} />
            ) : (
              <div style={{ background: 'var(--color-accent)', color: '#fff', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                {data.agency_name?.charAt(0)}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--color-text-primary)' }}>
                {data.agency_name}
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Verified Travel Agency Partner • Direct Client Portal
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const pdfUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/trips/${data.id}/pdf`;
                window.open(pdfUrl, '_blank');
              }}
              style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Download size={16} /> PDF Brochure
            </button>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Send size={16} /> Request Quote / Book Trip
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1100px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        
        {/* Banner Card */}
        <div className="glass-panel" style={{ padding: '32px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', padding: '4px 12px', borderRadius: '14px', background: 'rgba(14,165,233,0.1)', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
            <Shield size={14} /> Curated Client Itinerary
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px 0', fontFamily: 'var(--font-heading)' }}>
            {data.title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', margin: '0 0 20px 0', lineHeight: 1.6 }}>
            {itin.summary}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Destination</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{data.destination}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Duration</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>{itin.days?.length || 3} Days</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Total Package Cost</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>${itin.totalCost?.toLocaleString() || '1,500'}</strong>
            </div>
          </div>
        </div>

        {/* Day-by-Day Schedule */}
        {itin.days && itin.days.length > 0 && (
          <div className="glass-panel" style={{ padding: '28px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>
              Day-by-Day Travel Telemetry
            </h3>

            {/* Day selector tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
              {itin.days.map((d: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIdx(idx)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeDayIdx === idx ? 'var(--color-accent)' : 'var(--color-bg-subtle)',
                    color: activeDayIdx === idx ? '#fff' : 'var(--color-text-muted)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Selected day content */}
            {itin.days[activeDayIdx] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: '14px', borderLeft: '4px solid var(--color-accent)' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>Morning Activity</strong>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{itin.days[activeDayIdx].morning?.activity}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Location: {itin.days[activeDayIdx].morning?.location} ({itin.days[activeDayIdx].morning?.duration})
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: '14px', borderLeft: '4px solid var(--color-purple)' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-purple)', textTransform: 'uppercase', marginBottom: '4px' }}>Afternoon Activity</strong>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{itin.days[activeDayIdx].afternoon?.activity}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Location: {itin.days[activeDayIdx].afternoon?.location} ({itin.days[activeDayIdx].afternoon?.duration})
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: '14px', borderLeft: '4px solid #f59e0b' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '4px' }}>Evening Dining & Hotel Stay</strong>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Dinner at {itin.days[activeDayIdx].evening?.restaurant} ({itin.days[activeDayIdx].evening?.cuisine})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Hotel: {itin.days[activeDayIdx].hotel?.name} ({itin.days[activeDayIdx].hotel?.stars}★, ${itin.days[activeDayIdx].hotel?.price}/night)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={54} style={{ color: '#10b981', marginBottom: '14px' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>Request Submitted!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {data.agency_name} has received your inquiry and will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0 }}>
                  Book this Trip with {data.agency_name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Enter your details below. The tour agency staff will be notified instantly!
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Contact Info (Phone / Email / Telegram)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +998 90 123 45 67 or @john_telegram"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Special Requests / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Preferred dates, dietary requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="btn-primary"
                    style={{ flex: 2, padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {submittingInquiry ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
