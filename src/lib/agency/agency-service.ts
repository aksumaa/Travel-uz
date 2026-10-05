import { AgencyProfile, AgencyAnalytics, VerificationDocument } from './types';
import { INITIAL_PROFILE, INITIAL_DOCUMENTS, INITIAL_ANALYTICS } from './mock-data';
import { packageService } from './package-service';
import { leadService } from './lead-service';

const PROFILE_KEY = 'tripmind_agency_profile';
const DOCS_KEY = 'tripmind_agency_docs';

function loadProfile(): AgencyProfile {
  if (typeof window === 'undefined') return INITIAL_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILE;
  }
}

function saveProfile(profile: AgencyProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save agency profile:', err);
  }
}

function loadDocs(): VerificationDocument[] {
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (!raw) {
      localStorage.setItem(DOCS_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

function saveDocs(docs: VerificationDocument[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save verification docs:', err);
  }
}

export const agencyService = {
  getProfile(): AgencyProfile {
    return loadProfile();
  },

  updateProfile(updates: Partial<AgencyProfile>): AgencyProfile {
    const profile = loadProfile();
    const updated = { ...profile, ...updates };
    saveProfile(updated);
    return updated;
  },

  getVerificationDocuments(): VerificationDocument[] {
    return loadDocs();
  },

  uploadVerificationDocument(name: string, type: string): VerificationDocument {
    const docs = loadDocs();
    const newDoc: VerificationDocument = {
      id: `doc-${Date.now()}`,
      name,
      type,
      status: 'pending',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    docs.unshift(newDoc);
    saveDocs(docs);

    // Update profile verification status to under_review if not already verified
    const profile = loadProfile();
    if (profile.verificationStatus !== 'verified') {
      this.updateProfile({ verificationStatus: 'under_review' });
    }

    return newDoc;
  },

  getAnalytics(range: '7d' | '30d' | '90d' = '30d'): AgencyAnalytics {
    const packages = packageService.getPackages();
    const leads = leadService.getLeads();

    const published = packages.filter((p) => p.status === 'published').length;
    const drafts = packages.filter((p) => p.status === 'draft').length;
    const totalViews = packages.reduce((acc, p) => acc + (p.viewsCount || 0), 0) + 1450;
    const newLeads = leads.length;

    const conversionRate = totalViews > 0 ? parseFloat(((newLeads / totalViews) * 100).toFixed(1)) : 0;

    const topPackages = packages.map((p) => ({
      id: p.id,
      name: p.title,
      views: p.viewsCount || 100,
      leads: p.leadsCount || 5,
      conversion: p.viewsCount ? parseFloat(((p.leadsCount / p.viewsCount) * 100).toFixed(1)) : 5.0,
    })).sort((a, b) => b.views - a.views);

    // Dynamic timeline depending on range
    let timeline = INITIAL_ANALYTICS.timeline;
    if (range === '7d') {
      timeline = [
        { date: 'Mon', views: 320, leads: 8, conversions: 1 },
        { date: 'Tue', views: 480, leads: 12, conversions: 2 },
        { date: 'Wed', views: 590, leads: 15, conversions: 3 },
        { date: 'Thu', views: 640, leads: 18, conversions: 2 },
        { date: 'Fri', views: 820, leads: 22, conversions: 4 },
        { date: 'Sat', views: 760, leads: 16, conversions: 3 },
        { date: 'Sun', views: 510, leads: 11, conversions: 1 },
      ];
    } else if (range === '90d') {
      timeline = [
        { date: 'Jan', views: 4200, leads: 95, conversions: 18 },
        { date: 'Feb', views: 5800, leads: 130, conversions: 26 },
        { date: 'Mar', views: 7600, leads: 184, conversions: 39 },
      ];
    }

    return {
      totalViews,
      newLeads,
      publishedPackages: published,
      draftPackages: drafts,
      leadConversionRate: conversionRate || 7.8,
      topPackages,
      timeline,
    };
  },
};
