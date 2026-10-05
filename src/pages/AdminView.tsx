import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Activity, Brain, TrendingUp, Save, Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AdminView: React.FC = () => {
  const { language } = useLanguage();
  
  // Localized dictionary for Admin Console
  const getAdminText = (key: string) => {
    const dict: Record<string, Record<'uz' | 'ru' | 'en', string>> = {
      'Admin Console': { en: 'Admin Console', ru: 'Панель администратора', uz: 'Admin paneli' },
      'System Telemetry': { en: 'System Telemetry', ru: 'Системная телеметрия', uz: 'Tizim ko‘rsatkichlari' },
      'User Accounts': { en: 'User Directory', ru: 'Список пользователей', uz: 'Foydalanuvchilar' },
      'AI Prompt Settings': { en: 'AI Prompt Settings', ru: 'Настройки ИИ-промптов', uz: 'AI Prompt sozlamalari' },
      'Prompt Template': { en: 'Prompt Template', ru: 'Шаблон промпта', uz: 'Prompt shabloni' },
      'System Prompts': { en: 'Configure OpenAI / Claude System Instructions', ru: 'Инструкции для ИИ (OpenAI / Claude)', uz: 'OpenAI / Claude tizim ko‘rsatмалari' },
      'Total Users': { en: 'Total Users', ru: 'Всего пользователей', uz: 'Jami a’zolar' },
      'Trips Generated': { en: 'Trips Generated', ru: 'Создано поездок', uz: 'Yaratilgan sayohatlar' },
      'API Latency': { en: 'API Response Latency', ru: 'Задержка ответа API', uz: 'API javob tezligi' },
      'AI Tokens Used': { en: 'AI Tokens Used', ru: 'Использовано токенов ИИ', uz: 'AI tokenlar sarfi' },
      'Database Status': { en: 'Database Health', ru: 'Статус базы данных', uz: 'Ma’lumotlar bazasi' },
      'Save Config': { en: 'Save Configuration', ru: 'Сохранить настройки', uz: 'Saqlash' }
    };
    return dict[key]?.[language] || key;
  };

  // Read-only system stats configurations
  const stats = {
    totalUsers: 14820,
    tripsGenerated: 42390,
    apiLatency: '185ms',
    tokensUsed: '14.8M',
    cpuLoad: '12%',
    memoryUsed: '2.4 GB / 8.0 GB'
  };

  // User list table state
  const [users, setUsers] = useState([
    { id: 1, name: 'Shoabbosova Muslima', email: 'muslima@traveluz.com', role: 'Administrator', status: 'Premium', joined: '2026-06-25' },
    { id: 2, name: 'Akbarjonov Dilshod', email: 'dilshod@traveluz.com', role: 'Traveler', status: 'Premium', joined: '2026-06-26' },
    { id: 3, name: 'Sarkorova Lola', email: 'lola.s@traveluz.com', role: 'Traveler', status: 'Free', joined: '2026-06-26' },
    { id: 4, name: 'John Doe', email: 'john.doe@gmail.com', role: 'Traveler', status: 'Premium', joined: '2026-06-20' },
    { id: 5, name: 'Elena Petrova', email: 'elena.p@mail.ru', role: 'Traveler', status: 'Free', joined: '2026-06-18' }
  ]);

  // AI Prompt config variables
  const [promptTemplate, setPromptTemplate] = useState(
    `You are a helpful travel assistant for TripMind. Create a detailed itinerary for {{destination}} for {{duration}} days. Budget level: {{budget}}.`
  );
  const [temperature, setTemperature] = useState(0.7);
  const [modelType, setModelType] = useState('gpt-4o');

  // Trigger role update
  const toggleStatus = (userId: number) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Premium' ? 'Free' : 'Premium' };
      }
      return u;
    });
    setUsers(updated);
  };

  const handleSavePromptConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Prompt configurations successfully cached and updated in DB.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      
      {/* Top Banner */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
        <Shield size={28} style={{ color: 'var(--color-accent)' }} />
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            {getAdminText('Admin Console')}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            System dashboard analytics, user accounts, and AI prompt controllers.
          </span>
        </div>
      </div>

      {/* System Telemetry stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Card 1: Users */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(14,165,233,0.08)', color: 'var(--color-accent)', padding: '12px', borderRadius: '14px' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{getAdminText('Total Users')}</span>
            <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>{stats.totalUsers.toLocaleString()}</strong>
          </div>
        </div>

        {/* Card 2: Trips */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(139,92,246,0.08)', color: 'var(--color-purple)', padding: '12px', borderRadius: '14px' }}>
            <Brain size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{getAdminText('Trips Generated')}</span>
            <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>{stats.tripsGenerated.toLocaleString()}</strong>
          </div>
        </div>

        {/* Card 3: Latency */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', padding: '12px', borderRadius: '14px' }}>
            <Activity size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{getAdminText('API Latency')}</span>
            <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>{stats.apiLatency}</strong>
          </div>
        </div>

        {/* Card 4: Hardware usage */}
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', padding: '12px', borderRadius: '14px' }}>
            <Cpu size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>CPU load</span>
            <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>{stats.cpuLoad}</strong>
          </div>
        </div>
      </div>

      {/* Grid: Graph and Prompt Configuration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }} className="admin-main-grid">
        
        {/* Left: Traffic activity chart */}
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              System Health & Token Timeline
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +12% Traffic peak
            </span>
          </div>

          {/* SVG Line Graph */}
          <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="var(--glass-border)" strokeWidth="0.5" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="var(--glass-border)" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="var(--glass-border)" strokeWidth="0.5" strokeDasharray="3,3" />

              {/* Area background under line */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0 120 L 0 95 Q 60 40 120 70 T 240 30 T 360 50 Q 380 60 400 30 L 400 120 Z" fill="url(#areaGradient)" />

              {/* Smooth Trend line */}
              <path 
                d="M 0 95 Q 60 40 120 70 T 240 30 T 360 50 Q 380 60 400 30" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="2.5" 
              />

              {/* Glowing Dots */}
              <circle cx="120" cy="70" r="4" fill="var(--color-purple)" />
              <circle cx="240" cy="30" r="4" fill="var(--color-accent)" />
              <circle cx="400" cy="30" r="4" fill="#10b981" />
            </svg>
          </div>

          {/* Details below graph */}
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span>Database Nodes: <strong style={{ color: '#10b981' }}>Healthy</strong></span>
            <span>Total AI Tokens: <strong style={{ color: 'var(--color-text-primary)' }}>{stats.tokensUsed}</strong></span>
            <span>Memory Load: <strong style={{ color: 'var(--color-text-primary)' }}>{stats.memoryUsed}</strong></span>
          </div>
        </div>

        {/* Right: AI configuration editor */}
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {getAdminText('AI Prompt Settings')}
          </h4>

          <form onSubmit={handleSavePromptConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem' }}>
            {/* Model select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: 800, color: 'var(--color-text-muted)' }}>Target LLM model</label>
              <select value={modelType} onChange={(e) => setModelType(e.target.value)} style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)' }}>
                <option value="gpt-4o">OpenAI GPT-4o (Stable)</option>
                <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Premium)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Temperature (Creativity)</span>
                <span style={{ color: 'var(--color-accent)' }}>{temperature}</span>
              </div>
              <input type="range" min={0.1} max={1.0} step={0.05} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} style={{ width: '100%', height: '6px', background: 'var(--glass-border)', borderRadius: '4px' }} />
            </div>

            {/* Prompt Template */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: 800, color: 'var(--color-text-muted)' }}>{getAdminText('Prompt Template')}</label>
              <textarea 
                value={promptTemplate} 
                onChange={(e) => setPromptTemplate(e.target.value)} 
                rows={4}
                style={{ padding: '10px', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--color-text-primary)', fontFamily: 'monospace', fontSize: '0.75rem', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-premium" style={{ border: 'none', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Save size={14} /> {getAdminText('Save Config')}
            </button>
          </form>
        </div>

      </div>

      {/* Users Accounts List */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {getAdminText('User Accounts')}
        </h4>

        {/* User directory table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px' }}>Full Name</th>
                <th style={{ padding: '12px 10px' }}>Email Address</th>
                <th style={{ padding: '12px 10px' }}>Role</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px' }}>Joined Date</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--color-text-primary)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>{user.name}</td>
                  <td style={{ padding: '12px 10px', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: user.role === 'Administrator' ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.04)', color: user.role === 'Administrator' ? '#ef4444' : 'var(--color-text-secondary)' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: user.status === 'Premium' ? 'var(--color-accent-glow)' : 'rgba(100,116,139,0.08)', color: user.status === 'Premium' ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', color: 'var(--color-text-muted)' }}>{user.joined}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--color-bg)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Toggle Premium
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS adjustments for Admin Panel */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 992px) {
          .admin-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

    </motion.div>
  );
};
