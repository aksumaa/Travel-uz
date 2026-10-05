import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from '../icons';
import { api } from '../services/api';

export interface LeadItem {
  id: number;
  agency_id: number;
  client_name: string;
  client_contact: string;
  source: string;
  itinerary_id?: number | null;
  itinerary_title?: string | null;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
  notes?: string | null;
  created_at: string;
}

export const CrmPipelineView: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert to booking modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [finalPrice, setFinalPrice] = useState(1500);
  const [currency, setCurrency] = useState('USD');
  const [converting, setConverting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<LeadItem[]>('/leads');
      setLeads(data);
    } catch (err: any) {
      console.warn("Failed to fetch agency leads:", err);
      setError(err.message || "Failed to load CRM leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: number, newStatus: string) => {
    try {
      const updated = await api.patch<LeadItem>(`/leads/${leadId}`, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
    } catch (err: any) {
      alert(err.message || "Failed to update lead status");
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setConverting(true);
    try {
      await api.post(`/leads/${selectedLead.id}/convert-to-booking`, {
        final_price: finalPrice,
        currency
      });
      alert(`Booking confirmed for ${selectedLead.client_name}! Final Price: $${finalPrice}`);
      setSelectedLead(null);
      fetchLeads();
    } catch (err: any) {
      alert(err.message || "Failed to convert lead to booking.");
    } finally {
      setConverting(false);
    }
  };

  const columns = [
    { id: 'new', title: 'New Requests', color: '#0284c7' },
    { id: 'contacted', title: 'Contacted', color: '#8b5cf6' },
    { id: 'negotiating', title: 'Negotiating', color: '#f59e0b' },
    { id: 'won', title: 'Won (Booked)', color: '#10b981' },
    { id: 'lost', title: 'Lost', color: '#ef4444' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0 }}>
            Agency CRM & Lead Pipeline
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Real-time client inquiries submitted from shareable itinerary links
          </span>
        </div>
        <button
          onClick={fetchLeads}
          style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Error notification */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Kanban Board Columns */}
      <div className="crm-kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))', gap: '16px', minHeight: '500px', overflowX: 'auto', paddingBottom: '12px' }}>
        {columns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          return (
            <div
              key={col.id}
              className="glass-panel"
              style={{
                padding: '16px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: `2px solid ${col.color}` }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>
                  {col.title}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', background: 'var(--color-bg-subtle)', color: col.color }}>
                  {colLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
                {colLeads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    No leads in this stage
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        padding: '12px',
                        background: 'var(--color-bg-subtle)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{lead.client_name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{lead.source}</span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        📞 {lead.client_contact}
                      </div>

                      {lead.itinerary_title && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', padding: '4px 8px', borderRadius: '6px' }}>
                          🗺️ {lead.itinerary_title}
                        </div>
                      )}

                      {lead.notes && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
                          "{lead.notes}"
                        </p>
                      )}

                      {/* Action selector & Convert to Booking button */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--glass-border)' }}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'var(--color-bg-surface)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--color-text-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="new">Move to: New</option>
                          <option value="contacted">Move to: Contacted</option>
                          <option value="negotiating">Move to: Negotiating</option>
                          <option value="won">Move to: Won</option>
                          <option value="lost">Move to: Lost</option>
                        </select>

                        {lead.status !== 'won' && (
                          <button
                            onClick={() => setSelectedLead(lead)}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'rgba(16,185,129,0.15)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              color: '#10b981',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Confirm & Create Booking
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Confirm Booking */}
      {selectedLead && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
              Confirm Booking for {selectedLead.client_name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
              This will update lead status to <strong>Won</strong> and generate a verified Booking record in the database.
            </p>

            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Final Price</label>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="UZS">UZS (so'm)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '10px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {converting ? 'Saving...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
