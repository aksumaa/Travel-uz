'use client';

import React, { useState } from 'react';
import { 
  Settings, Globe, DollarSign, Bell, Shield, 
  MessageSquare, Mail, Check, Sparkles 
} from '../../icons';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export const AgencySettingsView: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();

  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [autoQuoteEnabled, setAutoQuoteEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = () => {
    setToastMessage('Agency settings saved.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px' }}>
      
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

      {/* Localization Card */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#0284c7" /> Regional & Currency Preferences
          </h3>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Set primary operational language and base currency for traveler quotes.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              System Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600 }}
            >
              <option value="en">English (US)</option>
              <option value="ru">Русский</option>
              <option value="uz">Oʻzbekcha</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => {
                const found = currencies.find(c => c.code === e.target.value);
                if (found) setCurrency(found.code);
              }}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600 }}
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#0284c7" /> Traveler Lead Notifications
          </h3>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Control where your agency staff receives instant quote alerts.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Instant Telegram Bot Alerts', desc: 'Receive real-time notifications on client quote requests via Telegram bot.', state: telegramAlerts, setter: setTelegramAlerts },
            { label: 'Direct Email Inquiries', desc: 'Send full lead contact context to agency team mailbox.', state: emailAlerts, setter: setEmailAlerts },
            { label: 'Weekly Performance Digest', desc: 'Summary of catalog views, top tours, and lead conversion metrics.', state: weeklyDigest, setter: setWeeklyDigest },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => item.setter(!item.state)}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: item.state ? '#f0f9ff' : '#f8fafc',
                border: item.state ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: item.state ? '#0369a1' : '#334155' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  {item.desc}
                </div>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                background: item.state ? '#0284c7' : '#ffffff',
                border: item.state ? 'none' : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                {item.state && <Check size={14} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Security & FastAPI RBAC Boundary Card */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#059669" /> Role-Based Access Control (RBAC)
        </h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
          Your account is registered as an <strong>Agency Owner</strong>. Access to administrative platform moderation is strictly segregated via server-side JWT authentication. All agency operations are isolated to your multi-tenant agency scope.
        </p>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        style={{
          alignSelf: 'flex-start',
          padding: '12px 24px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          color: '#ffffff',
          border: 'none',
          fontWeight: 800,
          fontSize: '0.86rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
        }}
      >
        Save Settings
      </button>

    </div>
  );
};
