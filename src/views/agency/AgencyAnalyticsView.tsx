'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Eye, Users, Luggage, ArrowUpRight, 
  Calendar, MapPin, Sparkles, DollarSign, CheckCircle2 
} from '../../icons';
import { agencyService } from '../../lib/agency/agency-service';
import { AgencyAnalytics } from '../../lib/agency/types';
import { useCurrency } from '../../context/CurrencyContext';

export const AgencyAnalyticsView: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<AgencyAnalytics>(agencyService.getAnalytics('30d'));

  useEffect(() => {
    setAnalytics(agencyService.getAnalytics(dateRange));
  }, [dateRange]);

  const maxViews = Math.max(...analytics.timeline.map((t) => t.views), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Disclaimer / Notice */}
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
            <strong>Demo Analytics Engine:</strong> Visualizing aggregated traveler impressions, inquiries, and conversion ratios.
          </span>
        </div>

        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id as any)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: dateRange === r.id ? '#0284c7' : 'transparent',
                color: dateRange === r.id ? '#ffffff' : '#64748b',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>TOTAL VIEWS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
            {analytics.totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
            ↑ 24% vs previous period
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>TOTAL INQUIRIES & LEADS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
            {analytics.newLeads}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginTop: '8px' }}>
            Direct customer inquiries
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>LEAD CONVERSION RATE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
            {analytics.leadConversionRate}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
            High-intent travelers
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PUBLISHED TOUR PACKAGES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
            {analytics.publishedPackages}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, marginTop: '8px' }}>
            {analytics.draftPackages} drafts in progress
          </div>
        </div>
      </div>

      {/* Views & Inquiries Chart Visual */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Traffic & Lead Activity Timeline
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Daily catalog visits vs inquiry generation
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0284c7' }} />
              <span>Catalog Views</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#059669' }} />
              <span>Leads Received</span>
            </div>
          </div>
        </div>

        {/* Lightweight Pure CSS/SVG Bar Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '200px',
          paddingTop: '20px',
          borderBottom: '1px solid #e2e8f0',
          gap: '12px'
        }}>
          {analytics.timeline.map((point, idx) => {
            const heightPercent = Math.max(15, Math.round((point.views / maxViews) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7' }}>
                  {point.views}
                </div>
                <div style={{
                  width: '100%',
                  maxWidth: '42px',
                  height: `${heightPercent}%`,
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                  borderRadius: '6px 6px 0 0',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: '#059669'
                  }}>
                    {point.leads > 0 ? `+${point.leads}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, marginTop: '6px' }}>
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Packages Breakdown Table */}
      <div style={{
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Top Performing Tour Packages
          </h3>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Conversion breakdown per published itinerary
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Tour Package</th>
                <th style={{ padding: '12px 16px' }}>Impressions</th>
                <th style={{ padding: '12px 16px' }}>Inquiries</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPackages.map((pkg) => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 800, color: '#0f172a' }}>
                    {pkg.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 600 }}>
                    {pkg.views.toLocaleString()} views
                  </td>
                  <td style={{ padding: '14px 16px', color: '#059669', fontWeight: 700 }}>
                    {pkg.leads} inquiries
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#0284c7' }}>
                    {pkg.conversion}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
