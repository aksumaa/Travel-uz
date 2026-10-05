'use client';

import React, { useState, useEffect } from 'react';
import { 
  Luggage, Plus, Search, Filter, Edit2, Copy, 
  Trash2, Eye, MapPin, Calendar, Users, DollarSign, 
  Check, Hotel, Sparkles, AlertCircle 
} from '../../icons';
import { packageService } from '../../lib/agency/package-service';
import { AgencyPackage, PackageStatus } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

interface AgencyPackagesViewProps {
  onCreatePackage: () => void;
  onEditPackage: (pkg: AgencyPackage) => void;
  onViewPackage: (pkg: AgencyPackage) => void;
}

export const AgencyPackagesView: React.FC<AgencyPackagesViewProps> = ({
  onCreatePackage,
  onEditPackage,
  onViewPackage,
}) => {
  const { formatPrice } = useCurrency();
  const [packages, setPackages] = useState<AgencyPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PackageStatus>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAll = () => {
    setPackages(packageService.getPackages());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = packageService.togglePublish(id);
    if (updated) {
      loadAll();
      showToast(`Package status updated to ${updated.status}.`);
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = packageService.duplicatePackage(id);
    if (dup) {
      loadAll();
      showToast('Package duplicated successfully.');
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this tour package?')) {
      packageService.deletePackage(id);
      loadAll();
      showToast('Package deleted.');
    }
  };

  // Filter & search
  const filtered = packages.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

      {/* Action Bar: Search, Status Filter Tabs, Create Button */}
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
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '8px 14px',
          width: '100%',
          maxWidth: '320px'
        }}>
          <Search size={16} style={{ color: '#64748b', marginRight: '8px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages by destination or title..."
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
            { id: 'all', label: `All (${packages.length})` },
            { id: 'published', label: `Published (${packages.filter(p => p.status === 'published').length})` },
            { id: 'draft', label: `Drafts (${packages.filter(p => p.status === 'draft').length})` },
            { id: 'unpublished', label: `Unpublished (${packages.filter(p => p.status === 'unpublished').length})` }
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

        {/* Create Button */}
        <button
          onClick={onCreatePackage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)'
          }}
        >
          <Plus size={16} />
          <span>+ Create Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px dashed #cbd5e1',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#f0f9ff',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Luggage size={28} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            No Tour Packages Found
          </h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', maxWidth: '360px' }}>
            {searchQuery || statusFilter !== 'all' 
              ? 'Try changing your search keywords or filter tab.'
              : 'Create your first multi-day tour package to publish to the global TripMind traveler catalog.'}
          </p>
          <button
            onClick={onCreatePackage}
            style={{
              marginTop: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Create Your First Package
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onViewPackage(pkg)}
              style={{
                borderRadius: '16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
              }}
            >
              {/* Cover Image & Badges */}
              <div style={{ position: 'relative', height: '170px', width: '100%', background: '#0f172a' }}>
                <img
                  src={pkg.coverImage || 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80'}
                  alt={pkg.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '100px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: pkg.status === 'published' ? '#10b981' : pkg.status === 'draft' ? '#f59e0b' : '#64748b',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    {pkg.status}
                  </span>

                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '100px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff'
                  }}>
                    {pkg.durationDays} Days
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={12} color="#38bdf8" /> {pkg.destination}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                    {pkg.title}
                  </h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pkg.shortDescription}
                  </p>
                </div>

                {/* Inclusions Row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.7rem', color: '#334155' }}>
                  {pkg.hotelName && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🏨 Hotel</span>}
                  {pkg.inclusions?.transfer && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🚐 Transfer</span>}
                  {pkg.inclusions?.guide && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🧭 Guide</span>}
                  {pkg.inclusions?.meals && <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🍽️ Meals</span>}
                </div>

                {/* Footer Price & Analytics */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>STARTING FROM</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                      {formatPrice(pkg.priceUSD)} <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>/ pax</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
                    <div><strong>{pkg.viewsCount || 0}</strong> views</div>
                    <div style={{ color: '#059669', fontWeight: 700 }}><strong>{pkg.leadsCount || 0}</strong> leads</div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  paddingTop: '8px',
                  borderTop: '1px dashed #e2e8f0'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPackage(pkg);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  <button
                    onClick={(e) => handleDuplicate(pkg.id, e)}
                    title="Duplicate"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    onClick={(e) => handleTogglePublish(pkg.id, e)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: pkg.status === 'published' ? '#f0fdf4' : '#f8fafc',
                      border: pkg.status === 'published' ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
                      color: pkg.status === 'published' ? '#16a34a' : '#475569',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {pkg.status === 'published' ? 'Live' : 'Publish'}
                  </button>

                  <button
                    onClick={(e) => handleDelete(pkg.id, e)}
                    title="Delete"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
