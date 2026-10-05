import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Brain, TrendingUp, Save, Cpu, 
  Building2, Luggage, AlertTriangle, CheckCircle2, XCircle, 
  Search, Filter, Check, X, Eye, Flag, Layers, Lock
} from '../icons';
import { useLanguage } from '../context/LanguageContext';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Traveler' | 'Agency Owner' | 'Administrator';
  status: 'Active' | 'Premium' | 'Suspended';
  joinedDate: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  licenseNumber: string;
  ownerName: string;
  country: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  toursCount: number;
  submittedDate: string;
}

export interface AdminTourItem {
  id: string;
  title: string;
  agencyName: string;
  destination: string;
  priceUSD: number;
  moderationStatus: 'Approved' | 'Pending Review' | 'Flagged';
  published: boolean;
}

export interface ModerationItem {
  id: string;
  type: 'Tour Listing' | 'Traveler Review' | 'Agency Profile';
  itemTitle: string;
  reportedBy: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export const AdminView: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'agencies' | 'tours' | 'moderation'>('overview');

  // Stats
  const [stats] = useState({
    totalUsers: 14820,
    totalAgencies: 142,
    totalTours: 680,
    pendingVerifications: 6,
    pendingModeration: 4,
    apiLatency: '145ms',
    tokensUsed: '14.8M',
    cpuLoad: '12%',
    memoryUsed: '2.4 GB / 8.0 GB'
  });

  // Users Directory
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 'u-1', name: 'Muslima Shoabbosova', email: 'muslima@trip-mind.ai', role: 'Administrator', status: 'Active', joinedDate: '2026-01-15' },
    { id: 'u-2', name: 'Dilshod Akbarjonov', email: 'dilshod@marakandatravel.com', role: 'Agency Owner', status: 'Premium', joinedDate: '2026-02-10' },
    { id: 'u-3', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'Traveler', status: 'Active', joinedDate: '2026-04-12' },
    { id: 'u-4', name: 'Jean Dupont', email: 'j.dupont@orange.fr', role: 'Traveler', status: 'Premium', joinedDate: '2026-05-01' },
    { id: 'u-5', name: 'Amadou Oumarou', email: 'amadou@sahelexpeditions.ne', role: 'Agency Owner', status: 'Active', joinedDate: '2026-06-18' }
  ]);

  // Agencies Directory
  const [agencies, setAgencies] = useState<AdminAgency[]>([
    { id: 'a-1', name: 'Marakanda Silk Road Travel', licenseNumber: 'UZ-TO-2024-8891', ownerName: 'Dilshod Akbarjonov', country: 'Uzbekistan', status: 'Verified', toursCount: 12, submittedDate: '2026-02-10' },
    { id: 'a-2', name: 'Sahel Nomads & Sahara Tours', licenseNumber: 'NER-AG-2025-014', ownerName: 'Amadou Oumarou', country: 'Niger', status: 'Pending', toursCount: 4, submittedDate: '2026-06-18' },
    { id: 'a-3', name: 'Anatolia Balloon Club', licenseNumber: 'TUR-DMC-9941', ownerName: 'Kemal Yilmaz', country: 'Turkey', status: 'Verified', toursCount: 8, submittedDate: '2026-03-22' },
    { id: 'a-4', name: 'Lumière Paris Experiences', licenseNumber: 'FRA-TO-8812', ownerName: 'Claire Laurent', country: 'France', status: 'Verified', toursCount: 6, submittedDate: '2026-04-05' },
    { id: 'a-5', name: 'Nippon Heritage Tours', licenseNumber: 'JPN-DMC-5520', ownerName: 'Kenji Sato', country: 'Japan', status: 'Pending', toursCount: 5, submittedDate: '2026-06-25' }
  ]);

  // Tours Moderation Catalog
  const [tours, setTours] = useState<AdminTourItem[]>([
    { id: 't-1', title: 'Silk Road Grand Discovery (Samarkand & Bukhara)', agencyName: 'Marakanda Silk Road Travel', destination: 'Uzbekistan', priceUSD: 850, moderationStatus: 'Approved', published: true },
    { id: 't-2', title: 'Sahara Agadez & Tenere Expedition', agencyName: 'Sahel Nomads & Sahara Tours', destination: 'Niger', priceUSD: 890, moderationStatus: 'Approved', published: true },
    { id: 't-3', title: 'Cappadocia Sunrise Balloon & Valley Hike', agencyName: 'Anatolia Balloon Club', destination: 'Turkey', priceUSD: 520, moderationStatus: 'Approved', published: true },
    { id: 't-4', title: 'Tokyo Hidden Izakayas & Cyberpunk Night Tour', agencyName: 'Nippon Heritage Tours', destination: 'Japan', priceUSD: 240, moderationStatus: 'Pending Review', published: false },
    { id: 't-5', title: 'Extreme Unlicensed Desert Off-Road 4x4', agencyName: 'Unknown Safari Co', destination: 'Egypt', priceUSD: 150, moderationStatus: 'Flagged', published: false }
  ]);

  // Moderation Queue
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([
    { id: 'm-1', type: 'Agency Profile', itemTitle: 'Sahel Nomads & Sahara Tours', reportedBy: 'System Auto-Verification', reason: 'Government travel license verification pending document review.', status: 'Pending', date: '2026-06-18' },
    { id: 'm-2', type: 'Tour Listing', itemTitle: 'Extreme Unlicensed Desert Off-Road 4x4', reportedBy: 'Traveler safety flag', reason: 'Missing mandatory licensed safety briefing and medical insurance.', status: 'Pending', date: '2026-06-20' },
    { id: 'm-3', type: 'Traveler Review', itemTitle: 'Review on Samarkand Tour #442', reportedBy: 'Marakanda Travel', reason: 'Spam promotional link in review comment.', status: 'Pending', date: '2026-06-22' }
  ]);

  const handleAgencyAction = (agencyId: string, newStatus: 'Verified' | 'Rejected') => {
    setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, status: newStatus } : a));
  };

  const handleTourModeration = (tourId: string, status: 'Approved' | 'Flagged') => {
    setTours(prev => prev.map(t => t.id === tourId ? { ...t, moderationStatus: status, published: status === 'Approved' } : t));
  };

  const handleModerationAction = (itemId: string, action: 'Approved' | 'Rejected') => {
    setModerationItems(prev => prev.map(m => m.id === itemId ? { ...m, status: action } : m));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              TripMind Admin & Moderation Console
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Platform governance, agency verification, user accounts, and AI operations.
            </span>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 12px', borderRadius: '100px', fontWeight: 800 }}>
          ● System All Healthy
        </span>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview & Telemetry', icon: <Activity size={15} /> },
          { id: 'users', label: `Users (${users.length})`, icon: <Users size={15} /> },
          { id: 'agencies', label: `Agencies (${agencies.length})`, icon: <Building2 size={15} /> },
          { id: 'tours', label: `Tours (${tours.length})`, icon: <Luggage size={15} /> },
          { id: 'moderation', label: `Moderation Queue (${moderationItems.filter(m => m.status === 'Pending').length})`, icon: <Flag size={15} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: activeTab === tab.id ? '1px solid #2563eb' : '1px solid transparent',
              background: activeTab === tab.id ? 'rgba(37,99,235,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#2563eb' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Telemetry stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '18px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Total Users</span>
              <strong style={{ display: 'block', fontSize: '1.4rem', marginTop: '4px' }}>{stats.totalUsers.toLocaleString()}</strong>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>+420 this week</span>
            </div>

            <div className="glass-panel" style={{ padding: '18px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Partner Agencies</span>
              <strong style={{ display: 'block', fontSize: '1.4rem', marginTop: '4px' }}>{stats.totalAgencies}</strong>
              <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700 }}>{stats.pendingVerifications} Pending review</span>
            </div>

            <div className="glass-panel" style={{ padding: '18px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Live Tour Listings</span>
              <strong style={{ display: 'block', fontSize: '1.4rem', marginTop: '4px' }}>{stats.totalTours}</strong>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Verified global inventory</span>
            </div>

            <div className="glass-panel" style={{ padding: '18px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>API Response Latency</span>
              <strong style={{ display: 'block', fontSize: '1.4rem', marginTop: '4px', color: '#10b981' }}>{stats.apiLatency}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>AI inference edge</span>
            </div>
          </div>

          {/* Quick Action Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800 }}>Pending Agency Applications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {agencies.filter(a => a.status === 'Pending').map(agency => (
                  <div key={agency.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderRadius: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{agency.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{agency.country} • Lic #{agency.licenseNumber}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleAgencyAction(agency.id, 'Verified')} style={{ padding: '4px 8px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleAgencyAction(agency.id, 'Rejected')} style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800 }}>Active Moderation Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {moderationItems.filter(m => m.status === 'Pending').map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderRadius: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block' }}>{item.itemTitle}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{item.type} • {item.reason}</span>
                    </div>
                    <button onClick={() => setActiveTab('moderation')} style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Review</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Global User Directory</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{users.length} accounts listed</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Joined Date</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <strong style={{ display: 'block', fontSize: '0.88rem' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: u.role === 'Administrator' ? 'rgba(124,58,237,0.1)' : u.role === 'Agency Owner' ? 'rgba(37,99,235,0.1)' : 'rgba(100,116,139,0.1)',
                        color: u.role === 'Administrator' ? '#7c3aed' : u.role === 'Agency Owner' ? '#2563eb' : 'var(--color-text-secondary)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: u.status === 'Active' || u.status === 'Premium' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: u.status === 'Active' || u.status === 'Premium' ? '#10b981' : '#ef4444'
                      }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {u.joinedDate}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x));
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: u.status === 'Active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color: u.status === 'Active' ? '#ef4444' : '#10b981',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AGENCIES */}
      {activeTab === 'agencies' && (
        <div className="glass-panel" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Agency Verification & Licenses</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{agencies.length} agencies registered</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Agency Name</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>License & Country</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Tours</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <strong style={{ display: 'block', fontSize: '0.88rem' }}>{a.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Owner: {a.ownerName}</span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ display: 'block', fontSize: '0.82rem' }}>{a.licenseNumber}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{a.country}</span>
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700 }}>
                      {a.toursCount} Tours
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: a.status === 'Verified' ? 'rgba(16,185,129,0.1)' : a.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: a.status === 'Verified' ? '#10b981' : a.status === 'Pending' ? '#f59e0b' : '#ef4444'
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleAgencyAction(a.id, 'Verified')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAgencyAction(a.id, 'Rejected')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TOURS */}
      {activeTab === 'tours' && (
        <div className="glass-panel" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Platform Tour Moderation</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{tours.length} tours indexed</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary, rgba(15,23,42,0.03))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Tour Title</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Agency</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Destination & Price</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {tours.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <strong style={{ display: 'block', fontSize: '0.88rem' }}>{t.title}</strong>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '0.82rem' }}>
                      {t.agencyName}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ display: 'block', fontSize: '0.82rem' }}>{t.destination}</span>
                      <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>${t.priceUSD}</strong>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: t.moderationStatus === 'Approved' ? 'rgba(16,185,129,0.1)' : t.moderationStatus === 'Pending Review' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: t.moderationStatus === 'Approved' ? '#10b981' : t.moderationStatus === 'Pending Review' ? '#f59e0b' : '#ef4444'
                      }}>
                        {t.moderationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleTourModeration(t.id, 'Approved')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTourModeration(t.id, 'Flagged')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Flag
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="glass-panel" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Content Moderation & Incident Queue</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Review reported content and safety compliance</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
            {moderationItems.map(item => (
              <div key={item.id} style={{
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary, rgba(15,23,42,0.02))',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                      {item.type}
                    </span>
                    <strong style={{ fontSize: '0.92rem' }}>{item.itemTitle}</strong>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <strong>Reason:</strong> {item.reason}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    Reported by {item.reportedBy} • {item.date}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleModerationAction(item.id, 'Approved')}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: '#10b981', color: '#ffffff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Approve & Dismiss
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'Rejected')}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: '#ef4444', color: '#ffffff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Remove Content
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.status === 'Approved' ? '#10b981' : '#ef4444' }}>
                      Resolved: {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
