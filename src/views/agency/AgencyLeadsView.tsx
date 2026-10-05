'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  MapPin, DollarSign, MessageSquare, CheckCircle2, 
  Clock, ArrowRight, Tag, Sparkles 
} from '../../icons';
import { leadService } from '../../lib/agency/lead-service';
import { AgencyLead, LeadStatus } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

interface AgencyLeadsViewProps {
  onSelectLead: (lead: AgencyLead) => void;
}

export const AgencyLeadsView: React.FC<AgencyLeadsViewProps> = ({ onSelectLead }) => {
  const { formatPrice } = useCurrency();
  const [leads, setLeads] = useState<AgencyLead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAll = () => {
    setLeads(leadService.getLeads());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: LeadStatus, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const updated = leadService.updateStatus(id, newStatus);
    if (updated) {
      loadAll();
      showToast(`Lead marked as ${newStatus}.`);
    }
  };

  // Filter & search
  const filtered = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSearch = 
      lead.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.travelerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'contacted': return { bg: '#fef3c7', color: '#b45309' };
      case 'qualified': return { bg: '#ede9fe', color: '#6d28d9' };
      case 'closed': return { bg: '#d1fae5', color: '#047857' };
      case 'archived': return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1100,
          fontSize: '0.84rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #38bdf8'
        }}>
          <Sparkles size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Bar: Search & Status Filters */}
      <div style={{
        padding: '16px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '8px 14px',
          width: '100%',
          maxWidth: '340px'
        }}>
          <Search size={16} style={{ color: '#64748b', marginRight: '8px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search traveler, tour, or email..."
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.84rem',
              color: '#0f172a'
            }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${leads.length})` },
            { id: 'new', label: `New (${leads.filter(l => l.status === 'new').length})` },
            { id: 'contacted', label: `Contacted (${leads.filter(l => l.status === 'contacted').length})` },
            { id: 'qualified', label: `Qualified (${leads.filter(l => l.status === 'qualified').length})` },
            { id: 'closed', label: `Closed (${leads.filter(l => l.status === 'closed').length})` },
            { id: 'archived', label: `Archived (${leads.filter(l => l.status === 'archived').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: statusFilter === tab.id ? '#0284c7' : '#f1f5f9',
                color: statusFilter === tab.id ? '#ffffff' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Card */}
      <div style={{
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📬</div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>No Leads Found</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              No traveler inquiries match the selected filters.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Traveler</th>
                  <th style={{ padding: '14px 16px' }}>Interested Package</th>
                  <th style={{ padding: '14px 16px' }}>Travel Dates & Pax</th>
                  <th style={{ padding: '14px 16px' }}>Budget</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{lead.travelerName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lead.travelerEmail}</div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#334155' }}>{lead.packageName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>{lead.destination}</div>
                      </td>

                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        <div>{lead.travelDates}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lead.travelersCount} Travelers</div>
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                        {formatPrice(lead.budgetUSD)}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus, e)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: badge.bg,
                            color: badge.color,
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed (Won)</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(lead);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Inspect Lead
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
