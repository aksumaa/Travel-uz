'use client';

import React from 'react';
import { 
  X, MapPin, Calendar, Users, DollarSign, Hotel, 
  Check, Edit2, Copy, Trash2, Eye, Globe, Phone, Mail, 
  Sparkles, Clock, MessageSquare 
} from '../../icons';
import { AgencyPackage } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

interface PackageDetailsModalProps {
  pkg: AgencyPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pkg: AgencyPackage) => void;
  onDuplicate: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  pkg,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onDelete,
}) => {
  const { formatPrice } = useCurrency();

  if (!isOpen || !pkg) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
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
        maxWidth: '820px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Hero Cover Image & Header */}
        <div style={{ position: 'relative', height: '220px', width: '100%', flexShrink: 0, background: '#0f172a' }}>
          <img
            src={pkg.coverImage || 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80'}
            alt={pkg.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: pkg.status === 'published' ? '#10b981' : '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {pkg.status}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} /> {pkg.destination}
              </div>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                {pkg.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Key Metrics Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            padding: '14px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>PRICE PER PERSON</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{formatPrice(pkg.priceUSD)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>GROUP SIZE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{pkg.groupSizeMin} – {pkg.groupSizeMax} pax</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>PAGE VIEWS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0284c7' }}>{pkg.viewsCount || 0} views</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>LEADS INQUIRIES</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>{pkg.leadsCount || 0} inquiries</div>
            </div>
          </div>

          {/* Description Narrative */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Tour Narrative & Overview</h3>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {pkg.fullDescription || pkg.shortDescription}
            </p>
          </div>

          {/* Accommodation & Inclusions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Hotel size={15} color="#0284c7" /> Accommodations
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>{pkg.hotelName || 'Curated Boutique Hotels'}</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                Category: {pkg.hotelCategory} • {pkg.roomType}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Package Inclusions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { label: 'Airport Transfer', active: pkg.inclusions?.transfer },
                  { label: 'Daily Meals', active: pkg.inclusions?.meals },
                  { label: 'Private Guide', active: pkg.inclusions?.guide },
                  { label: 'Entry Passes', active: pkg.inclusions?.activities }
                ].map((inc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: inc.active ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                    {inc.active ? <Check size={12} color="#059669" /> : <span>✕</span>} {inc.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary Schedule */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
              Day-by-Day Detailed Itinerary ({pkg.itinerary?.length || 0} Days)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pkg.itinerary?.map((day, idx) => (
                <div key={idx} style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    background: '#0284c7',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' }}>DAY</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>{day.day}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>{day.time || '09:00'}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{day.location}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {day.activity}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {day.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Contact Footer Info */}
          <div style={{
            padding: '14px',
            borderRadius: '12px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#0369a1', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} /> {pkg.contactPhone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} /> {pkg.contactEmail}
              </span>
              {pkg.contactTelegram && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={13} /> {pkg.contactTelegram}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>
              Marakanda Partner Package
            </span>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this package?')) {
                onDelete(pkg.id);
                onClose();
              }
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={13} /> Delete Package
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onDuplicate(pkg.id);
                onClose();
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Copy size={13} /> Duplicate
            </button>

            <button
              onClick={() => onTogglePublish(pkg.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: pkg.status === 'published' ? '#f8fafc' : '#059669',
                border: '1px solid #cbd5e1',
                color: pkg.status === 'published' ? '#475569' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {pkg.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(pkg);
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#0284c7',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Edit2 size={13} /> Edit Package
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
