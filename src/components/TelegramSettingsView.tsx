import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle, AlertCircle } from '../icons';
import { api } from '../services/api';
export const TelegramSettingsView: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [hasBot, setHasBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAgencyInfo = async () => {
      try {
        const agency = await api.get<any>('/agencies/me');
        if (agency) {
          setHasBot(agency.has_telegram_bot || false);
          setChatId(agency.telegram_chat_id || '');
        }
      } catch (err) {
        console.warn("Could not fetch agency telegram info", err);
      }
    };
    fetchAgencyInfo();
  }, []);

  const handleSaveTelegramConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updated = await api.patch<any>('/agencies/me', {
        telegram_bot_token: botToken || undefined,
        telegram_chat_id: chatId || undefined
      });

      setHasBot(updated.has_telegram_bot);
      setSuccessMsg('Telegram Bot configuration encrypted & updated successfully!');
      setBotToken('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update Telegram Bot configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={28} style={{ color: 'var(--color-accent)' }} /> Telegram Bot Integration
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Connect your custom Telegram bot to receive instant alerts when clients submit inquiries on public itinerary links
        </span>
      </div>

      {/* Connection Status Card */}
      <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
            Bot Integration Status
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {hasBot ? 'Bot details are saved on this device.' : 'No active Telegram bot connected.'}
          </span>
        </div>

        <div style={{ padding: '6px 14px', borderRadius: '20px', background: hasBot ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: hasBot ? '#10b981' : '#ef4444', border: `1px solid ${hasBot ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hasBot ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {hasBot ? 'CONNECTED & ACTIVE' : 'UNCONFIGURED'}
        </div>
      </div>

      {/* Setup Form */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
        
        {successMsg && (
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSaveTelegramConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Telegram Bot API Token (stored encrypted with Fernet AES)
            </label>
            <input
              type="password"
              placeholder="e.g. 7123456789:AAFxXxxxxxxxxxxxxxxxxxxxxxxxx"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Agency Telegram Chat / Group ID
            </label>
            <input
              type="text"
              placeholder="e.g. -100123456789 or 987654321"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--color-text-primary)', outline: 'none' }}
            />
          </div>

          {/* Quick Setup Instructions */}
          <div style={{ padding: '14px', background: 'var(--color-bg-subtle)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>How to connect your Telegram Bot:</strong>
            1. Open Telegram and search for <code>@BotFather</code>.<br/>
            2. Send <code>/newbot</code> to create a bot and copy your HTTP API Token.<br/>
            3. Start your bot and type <code>/start</code> to get your Chat ID.<br/>
            4. Paste the Token and Chat ID above and click Save.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            {loading ? 'Encrypting & Saving...' : 'Save Telegram Bot Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
};
