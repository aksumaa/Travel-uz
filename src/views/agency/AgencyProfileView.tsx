'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Building2, MapPin, Phone, Mail, Globe, 
  ShieldCheck, Check, Sparkles, Image as ImageIcon, 
  Languages, Tag, Star 
} from '../../icons';
import { agencyService } from '../../lib/agency/agency-service';
import { AgencyProfile } from '../../lib/agency/types';

export const AgencyProfileView: React.FC = () => {
  const [profile, setProfile] = useState<AgencyProfile>(agencyService.getProfile());
  const [name, setName] = useState(profile.name);
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || '');
  const [licenseNumber, setLicenseNumber] = useState(profile.licenseNumber);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [description, setDescription] = useState(profile.description);
  const [country, setCountry] = useState(profile.country);
  const [city, setCity] = useState(profile.city);
  const [address, setAddress] = useState(profile.address);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [website, setWebsite] = useState(profile.website);
  const [telegramContact, setTelegramContact] = useState(profile.telegramContact);
  const [languagesStr, setLanguagesStr] = useState(profile.languages.join(', '));
  const [specializationsStr, setSpecializationsStr] = useState(profile.specializations.join(', '));

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = agencyService.updateProfile({
      name,
      logoUrl,
      licenseNumber,
      ownerName,
      description,
      country,
      city,
      address,
      phone,
      email,
      website,
      telegramContact,
      languages: languagesStr.split(',').map(s => s.trim()).filter(Boolean),
      specializations: specializationsStr.split(',').map(s => s.trim()).filter(Boolean),
    });
    setProfile(updated);
    setToastMessage('Agency profile updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }} className="agency-profile-grid">
      
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

      {/* Form Left Side */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            Agency Business Profile
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#64748b' }}>
            Manage official licensing, contacts, and public agency profile metadata.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Agency Business Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Tourism License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Owner / Managing Director
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Logo Image URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Agency Description & Specialization Story
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Telegram Bot Handle
              </label>
              <input
                type="text"
                value={telegramContact}
                onChange={(e) => setTelegramContact(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Guide Languages Supported (comma separated)
            </label>
            <input
              type="text"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              placeholder="English, Uzbek, Russian, French, German"
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Specializations & Focus Areas (comma separated)
            </label>
            <input
              type="text"
              value={specializationsStr}
              onChange={(e) => setSpecializationsStr(e.target.value)}
              placeholder="UNESCO Heritage Expeditions, VIP Train Journeys, Desert Caravans"
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#0f172a' }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
            }}
          >
            Save Agency Profile Changes
          </button>

        </form>
      </div>

      {/* Right Side: Live Traveler Preview Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '14px' }}>
            👁️ How Travelers See Your Agency
          </div>

          <div style={{
            borderRadius: '16px',
            border: '1px solid #bae6fd',
            background: 'radial-gradient(circle at 10% 20%, #f0f9ff 0%, #ffffff 90%)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#0f172a',
                border: '2px solid #0ea5e9',
                flexShrink: 0
              }}>
                <img
                  src={logoUrl || 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=200&q=80'}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                  {name || 'Agency Name'}
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <ShieldCheck size={14} color="#059669" /> Verified Partner ({city}, {country})
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
              {description || 'Accredited tour agency offering bespoke excursions, heritage guides, and luxury transit.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {specializationsStr.split(',').filter(Boolean).map((spec, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.68rem', fontWeight: 700 }}>
                  {spec.trim()}
                </span>
              ))}
            </div>

            <div style={{
              paddingTop: '12px',
              borderTop: '1px solid #e0f2fe',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#64748b'
            }}>
              <div>📍 {address || city}, {country}</div>
              <div>📞 {phone}</div>
              <div>✉️ {email}</div>
            </div>
          </div>
        </div>

        {/* Subscription Tier Info Card */}
        <div style={{
          padding: '20px',
          borderRadius: '16px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
            Subscription Status: <span style={{ color: '#0284c7', textTransform: 'uppercase' }}>{profile.subscriptionTier} TIER</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Unlimited tour publishing, live CRM lead alerts, telegram notifications, and multi-currency quoting enabled.
          </div>
        </div>

      </div>

    </div>
  );
};
