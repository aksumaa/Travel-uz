'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, Clock, 
  Upload, FileText, Trash2, Check, Sparkles 
} from '../../icons';
import { agencyService } from '../../lib/agency/agency-service';
import { VerificationDocument, AgencyProfile } from '../../lib/agency/types';

export const AgencyVerificationView: React.FC = () => {
  const [profile, setProfile] = useState<AgencyProfile>(agencyService.getProfile());
  const [docs, setDocs] = useState<VerificationDocument[]>([]);
  const [selectedDocType, setSelectedDocType] = useState('Tourism License');
  const [fileName, setFileName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAll = () => {
    setProfile(agencyService.getProfile());
    setDocs(agencyService.getVerificationDocuments());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    agencyService.uploadVerificationDocument(fileName.trim(), selectedDocType);
    setFileName('');
    loadAll();
    setToastMessage(`Uploaded ${fileName} for accreditation review.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getStatusBadge = (status: AgencyProfile['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return { label: 'Verified & Accredited Partner', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      case 'under_review':
        return { label: 'Verification Under Review', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'changes_requested':
        return { label: 'Action Needed / Changes Requested', bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      default:
        return { label: 'Not Submitted', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const badge = getStatusBadge(profile.verificationStatus);

  const checklist = [
    { title: 'Official Tourism Operator License', desc: 'State-issued commercial tourism permit or DMC registration.', done: true },
    { title: 'Commercial Liability & Traveler Insurance', desc: 'Active policy covering passenger transit and guided tours.', done: true },
    { title: 'Corporate Bank Account & Tax Certificate', desc: 'Official commercial banking entity matching agency legal name.', done: true },
    { title: 'Director Identity Verification', desc: 'Valid passport or national ID of company director.', done: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
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

      {/* Verification Status Banner */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: badge.bg,
        border: `1px solid ${badge.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ffffff', color: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: badge.color, textTransform: 'uppercase' }}>
              ACCREDITATION STATUS
            </div>
            <h2 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              {badge.label}
            </h2>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
          License ID: <strong>{profile.licenseNumber || 'UZ-TO-2024-8891-DMC'}</strong>
        </div>
      </div>

      {/* Checklist & Document Upload Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="agency-verification-grid">
        
        {/* Verification Checklist */}
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
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Verification Requirements Checklist
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Accredited agencies unlock priority catalog ranking and verified badges.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {checklist.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Check size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Documentation Dropzone */}
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
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Upload Official Documentation
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Submit state licenses, tax certificates, or insurance renewals.
            </span>
          </div>

          <form onSubmit={handleSimulateUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Document Classification
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 600 }}
              >
                <option value="Tourism License">State Tourism License</option>
                <option value="Insurance Coverage">Commercial Insurance Certificate</option>
                <option value="Tax Identification">Tax Registration Certificate</option>
                <option value="Director Passport">Director Passport / National ID</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                File Name / Document Reference
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. Tourism_License_2026_Renewal.pdf"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer'
            }}>
              <Upload size={24} color="#0284c7" />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '6px' }}>
                Drag & Drop PDF / Scan or click to browse
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                PDF, JPG, PNG up to 15MB
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}
            >
              Submit Document for Review
            </button>
          </form>
        </div>

      </div>

      {/* Submitted Documents History */}
      <div style={{
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Submitted Verification Documents ({docs.length})
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Document Name</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Uploaded Date</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#0284c7" />
                    <span>{doc.name}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {doc.type}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {doc.uploadedAt}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '100px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: doc.status === 'approved' ? '#ecfdf5' : '#eff6ff',
                      color: doc.status === 'approved' ? '#059669' : '#2563eb'
                    }}>
                      {doc.status}
                    </span>
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
