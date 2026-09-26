import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from '../icons';
import { useAuth } from '../context/AuthContext';

interface AgencyOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AgencyOnboardingModal: React.FC<AgencyOnboardingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { onboardAgency } = useAuth();
  const [step, setStep] = useState(1);

  // Form states
  const [agencyName, setAgencyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      await onboardAgency({
        name: agencyName,
        logo_url: logoUrl || undefined,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        subscription_tier: tier
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to onboard agency.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '32px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '24px', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Wizard Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: s <= step ? 'var(--color-accent)' : 'var(--color-bg-subtle)'
              }}
            />
          ))}
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* Step 1: Agency Profile */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent)' }}>Step 1 of 3</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>Register Your Tour Agency</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Setup your agency profile for branded AI itineraries and CRM telemetry.</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Agency Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Silk Road Expeditions"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Agency Logo Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
              />
            </div>

            <button
              onClick={() => {
                if (agencyName.trim()) setStep(2);
                else setErrorMsg('Agency name is required.');
              }}
              className="btn-primary"
              style={{ padding: '14px', borderRadius: '12px', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              Continue to Contact Info <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent)' }}>Step 2 of 3</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>Client Contact Details</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>This info will be displayed on shareable public client itineraries.</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Business Contact Email</label>
              <input
                type="email"
                placeholder="booking@agency.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Hotline / Phone Number</label>
              <input
                type="text"
                placeholder="+998 71 200 00 00"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary"
                style={{ flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                Select SaaS Tier <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Subscription Tier Selection */}
        {step === 3 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent)' }}>Step 3 of 3</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>Choose Agency SaaS Plan</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Select your subscription tier. Upgrade or downgrade anytime.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              
              {/* Starter */}
              <div
                onClick={() => setTier('starter')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: tier === 'starter' ? '2px solid var(--color-accent)' : '1px solid var(--glass-border)',
                  background: tier === 'starter' ? 'rgba(14,165,233,0.1)' : 'var(--color-bg-subtle)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Starter</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-accent)' }}>$49/mo</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Up to 50 AI Trips</span>
              </div>

              {/* Pro */}
              <div
                onClick={() => setTier('pro')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: tier === 'pro' ? '2px solid var(--color-purple)' : '1px solid var(--glass-border)',
                  background: tier === 'pro' ? 'rgba(139,92,246,0.1)' : 'var(--color-bg-subtle)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Pro</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-purple)' }}>$149/mo</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Unlimited AI & Telegram</span>
              </div>

              {/* Enterprise */}
              <div
                onClick={() => setTier('enterprise')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: tier === 'enterprise' ? '2px solid #f59e0b' : '1px solid var(--glass-border)',
                  background: tier === 'enterprise' ? 'rgba(245,158,11,0.1)' : 'var(--color-bg-subtle)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Enterprise</strong>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f59e0b' }}>$299/mo</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Custom Domain + API</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                {submitting ? 'Registering Agency...' : 'Complete Agency Setup'}
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
};
