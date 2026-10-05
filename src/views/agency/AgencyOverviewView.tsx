'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Luggage, Users, TrendingUp, Eye, CheckCircle2, 
  ArrowRight, Plus, MapPin, Calendar, Star, ShieldCheck, 
  Sparkles, ExternalLink 
} from '../../icons';
import { packageService } from '../../lib/agency/package-service';
import { leadService } from '../../lib/agency/lead-service';
import { agencyService } from '../../lib/agency/agency-service';
import { AgencyPackage, AgencyLead } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

interface AgencyOverviewViewProps {
  onCreatePackage: () => void;
  onSelectLead: (lead: AgencyLead) => void;
  onSelectPackage: (pkg: AgencyPackage) => void;
}

export const AgencyOverviewView: React.FC<AgencyOverviewViewProps> = ({
  onCreatePackage,
  onSelectLead,
  onSelectPackage,
}) => {
  const { formatPrice } = useCurrency();
  const [packages, setPackages] = useState<AgencyPackage[]>([]);
  const [leads, setLeads] = useState<AgencyLead[]>([]);
  const [analytics, setAnalytics] = useState(agencyService.getAnalytics('30d'));

  useEffect(() => {
    setPackages(packageService.getPackages());
    setLeads(leadService.getLeads());
    setAnalytics(agencyService.getAnalytics('30d'));
  }, []);

  const publishedCount = packages.filter((p) => p.status === 'published').length;
  const draftCount = packages.filter((p) => p.status === 'draft').length;
  const mostViewedPkg = [...packages].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Demo / MVP Indicator Banner */}
      <div style={{
        padding: '12px 18px',
        borderRadius: '12px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#0284c7" />
          <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700 }}>
            <strong>Agency Workspace (Demo & Local MVP):</strong> Data changes are persisted in your browser session and ready for seamless FastAPI backend sync.
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', background: '#0284c7', color: '#ffffff', padding: '3px 10px', borderRadius: '100px', fontWeight: 800 }}>
          PRO TIER ACCREDITED
        </span>
      </div>

      {/* Top KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Published Packages */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>PUBLISHED PACKAGES</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
                {publishedCount}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Luggage size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '12px' }}>
            ● Active in public marketplace
          </div>
        </div>

        {/* Draft Packages */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>DRAFT PACKAGES</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
                {draftCount}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '12px' }}>
            Ready to be completed & published
          </div>
        </div>

        {/* Total Inquiries / Leads */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>NEW LEADS & INQUIRIES</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
                {leads.length}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, marginTop: '12px' }}>
            ↑ 18% higher than last month
          </div>
        </div>

        {/* Total Views */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>TOTAL CATALOG VIEWS</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
                {analytics.totalViews.toLocaleString()}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, marginTop: '12px' }}>
            Conversion rate: {analytics.leadConversionRate}%
          </div>
        </div>

      </div>

      {/* Secondary Cards: Most Viewed Package & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Most Viewed Package Spotlight */}
        {mostViewedPkg && (
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                🌟 Top Performing Tour
              </span>
              <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>
                {mostViewedPkg.viewsCount} Views
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '64px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={mostViewedPkg.coverImage} alt={mostViewedPkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {mostViewedPkg.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  {mostViewedPkg.durationDays} Days • {formatPrice(mostViewedPkg.priceUSD)} / pax
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPackage(mostViewedPkg)}
              style={{
                marginTop: '16px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>View Tour Analytics & Schedule</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Quick Agency Actions */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
              ⚡ Quick Agency Actions
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={onCreatePackage}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={15} /> + New Package
              </button>

              <Link
                href="/agency/dashboard/leads"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Users size={15} /> Manage Leads
              </Link>
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '14px' }}>
            Accreditation status: <strong style={{ color: '#059669' }}>Verified Partner</strong> (License valid thru Dec 2026)
          </div>
        </div>

      </div>

      {/* Recent Leads Table Summary */}
      <div style={{
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Recent Traveler Inquiries
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Live traveler quote requests from public itineraries and tour listings
            </span>
          </div>
          <Link
            href="/agency/dashboard/leads"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0284c7',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View All ({leads.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {leads.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
            No new leads yet. Traveler inquiries on your shared tours will appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px' }}>Traveler</th>
                  <th style={{ padding: '12px 16px' }}>Interested Package</th>
                  <th style={{ padding: '12px 16px' }}>Dates</th>
                  <th style={{ padding: '12px 16px' }}>Budget</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 4).map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{lead.travelerName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{lead.travelerEmail}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{lead.packageName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#0284c7' }}>{lead.destination}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {lead.travelDates} ({lead.travelersCount} pax)
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                      {formatPrice(lead.budgetUSD)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '100px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: lead.status === 'new' ? '#dbeafe' : lead.status === 'closed' ? '#d1fae5' : '#fef3c7',
                        color: lead.status === 'new' ? '#1d4ed8' : lead.status === 'closed' ? '#047857' : '#b45309'
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectLead(lead)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#0284c7',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Inspect Lead
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
