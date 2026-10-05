import { AgencyPackage, PackageStatus } from './types';
import { INITIAL_PACKAGES } from './mock-data';

const STORAGE_KEY = 'tripmind_agency_packages';

function loadPackages(): AgencyPackage[] {
  if (typeof window === 'undefined') return INITIAL_PACKAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
      return INITIAL_PACKAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PACKAGES;
  }
}

function savePackages(packages: AgencyPackage[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch (err) {
    console.error('Failed to save agency packages:', err);
  }
}

export const packageService = {
  getPackages(): AgencyPackage[] {
    return loadPackages();
  },

  getPackageById(id: string): AgencyPackage | undefined {
    return loadPackages().find((p) => p.id === id);
  },

  createPackage(pkg: Omit<AgencyPackage, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'leadsCount' | 'rating'>): AgencyPackage {
    const packages = loadPackages();
    const newPkg: AgencyPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      viewsCount: 0,
      leadsCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    packages.unshift(newPkg);
    savePackages(packages);
    return newPkg;
  },

  updatePackage(id: string, updates: Partial<AgencyPackage>): AgencyPackage | null {
    const packages = loadPackages();
    const idx = packages.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    packages[idx] = {
      ...packages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    savePackages(packages);
    return packages[idx];
  },

  duplicatePackage(id: string): AgencyPackage | null {
    const packages = loadPackages();
    const target = packages.find((p) => p.id === id);
    if (!target) return null;

    const dup: AgencyPackage = {
      ...target,
      id: `pkg-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'draft',
      viewsCount: 0,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    packages.unshift(dup);
    savePackages(packages);
    return dup;
  },

  togglePublish(id: string): AgencyPackage | null {
    const packages = loadPackages();
    const idx = packages.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const currentStatus = packages[idx].status;
    const nextStatus: PackageStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    packages[idx].status = nextStatus;
    packages[idx].updatedAt = new Date().toISOString();

    savePackages(packages);
    return packages[idx];
  },

  deletePackage(id: string): boolean {
    const packages = loadPackages();
    const filtered = packages.filter((p) => p.id !== id);
    if (filtered.length === packages.length) return false;
    savePackages(filtered);
    return true;
  },
};
