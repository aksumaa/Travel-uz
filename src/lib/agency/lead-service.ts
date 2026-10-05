import { AgencyLead, LeadStatus } from './types';
import { INITIAL_LEADS } from './mock-data';

const STORAGE_KEY = 'tripmind_agency_leads';

function loadLeads(): AgencyLead[] {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
  }
}

function saveLeads(leads: AgencyLead[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Failed to save agency leads:', err);
  }
}

export const leadService = {
  getLeads(): AgencyLead[] {
    return loadLeads();
  },

  getLeadById(id: string): AgencyLead | undefined {
    return loadLeads().find((l) => l.id === id);
  },

  updateStatus(id: string, status: LeadStatus): AgencyLead | null {
    const leads = loadLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    leads[idx].status = status;
    leads[idx].updatedAt = new Date().toISOString();
    saveLeads(leads);
    return leads[idx];
  },

  addNote(id: string, author: string, text: string): AgencyLead | null {
    const leads = loadLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const newNote = {
      id: `note-${Date.now()}`,
      author: author || 'Agency Staff',
      text,
      createdAt: new Date().toISOString(),
    };

    if (!leads[idx].notes) leads[idx].notes = [];
    leads[idx].notes.unshift(newNote);
    leads[idx].updatedAt = new Date().toISOString();

    saveLeads(leads);
    return leads[idx];
  },

  createLead(data: Omit<AgencyLead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): AgencyLead {
    const leads = loadLeads();
    const newLead: AgencyLead = {
      ...data,
      id: `lead-${Date.now()}`,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    leads.unshift(newLead);
    saveLeads(leads);
    return newLead;
  },
};
