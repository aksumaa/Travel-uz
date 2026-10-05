'use client';

import React, { useState } from 'react';
import { 
  X, User, Mail, Phone, Calendar, DollarSign, 
  MapPin, MessageSquare, Send, CheckCircle2, Clock, 
  ShieldCheck, Tag, Plus 
} from '../../icons';
import { AgencyLead, LeadStatus } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

interface LeadDetailDrawerProps {
  lead: AgencyLead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onAddNote: (id: string, noteText: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onAddNote,
}) => {
  const { formatPrice } = useCurrency();
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !lead) return null;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'new': return { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' };
      case 'contacted': return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'qualified': return { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' };
      case 'closed': return { bg: '#d1fae5', color: '#047857', border: '#a7f3d0' };
      case 'archived': return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const badge = getStatusBadgeStyle(lead.status);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        height: '100%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Traveler Lead Details
            </div>
            <h2 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              {lead.travelerName}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Selector Bar */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: badge.color, textTransform: 'uppercase' }}>
              Current Status: {lead.status}
            </span>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed (Won)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Traveler Quick Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ESTIMATED BUDGET</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {formatPrice(lead.budgetUSD)}
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>PARTY SIZE</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {lead.travelersCount} Travelers
              </div>
            </div>
          </div>

          {/* Inquiry Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
              Inquiry Information
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
              <MapPin size={15} color="#0284c7" />
              <span>Target Destination: <strong>{lead.destination}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
              <Calendar size={15} color="#0284c7" />
              <span>Travel Dates: <strong>{lead.travelDates}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
              <Tag size={15} color="#0284c7" />
              <span>Package: <strong>{lead.packageName}</strong></span>
            </div>
          </div>

          {/* Contact Direct Actions */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
              Direct Traveler Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a
                href={`mailto:${lead.travelerEmail}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0284c7',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Mail size={14} /> Send Email ({lead.travelerEmail})
              </a>

              <a
                href={`tel:${lead.travelerPhone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#059669',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Phone size={14} /> Call Traveler ({lead.travelerPhone})
              </a>
            </div>
          </div>

          {/* Traveler Message */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Traveler Message / Notes
            </div>
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: '#f1f5f9',
              fontSize: '0.82rem',
              color: '#334155',
              lineHeight: 1.5,
              border: '1px solid #e2e8f0'
            }}>
              "{lead.message || 'Interested in booking customized itinerary.'}"
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Internal Staff Notes & Log ({lead.notes?.length || 0})
            </div>

            <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add team note (e.g. Sent hotel quote)..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lead.notes?.map((n) => (
                <div key={n.id} style={{ padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                    <strong>{n.author}</strong>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#1e293b', marginTop: '4px' }}>
                    {n.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Close Lead Details
          </button>
        </div>

      </div>
    </div>
  );
};
