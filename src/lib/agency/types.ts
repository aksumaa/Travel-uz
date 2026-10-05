export type PackageStatus = 'draft' | 'published' | 'unpublished';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
export type VerificationStatus = 'not_submitted' | 'under_review' | 'verified' | 'changes_requested';
export type HotelCategory = '3-star' | '4-star' | '5-star' | 'Boutique' | 'Heritage Riad' | 'Resort' | 'Eco-Lodge';

export interface PackageItineraryDay {
  day: number;
  time?: string;
  activity: string;
  location: string;
  description: string;
}

export interface PackageInclusions {
  transfer: boolean;
  meals: boolean;
  guide: boolean;
  activities: boolean;
}

export interface AgencyPackage {
  id: string;
  title: string;
  destination: string;
  shortDescription: string;
  fullDescription: string;
  durationDays: number;
  startDate?: string;
  endDate?: string;
  groupSizeMin: number;
  groupSizeMax: number;
  priceUSD: number;
  currency: string;
  hotelName: string;
  hotelCategory: HotelCategory;
  roomType: string;
  inclusions: PackageInclusions;
  itinerary: PackageItineraryDay[];
  coverImage: string;
  galleryImages: string[];
  contactPhone: string;
  contactEmail: string;
  contactWebsite?: string;
  contactTelegram?: string;
  status: PackageStatus;
  viewsCount: number;
  leadsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface AgencyLead {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  packageId?: string;
  packageName: string;
  destination: string;
  travelDates: string;
  travelersCount: number;
  budgetUSD: number;
  status: LeadStatus;
  message: string;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface AgencyProfile {
  name: string;
  logoUrl?: string;
  licenseNumber: string;
  ownerName: string;
  description: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  telegramContact: string;
  languages: string[];
  specializations: string[];
  verificationStatus: VerificationStatus;
  subscriptionTier: 'starter' | 'pro' | 'enterprise';
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  leads: number;
  conversions: number;
}

export interface AgencyAnalytics {
  totalViews: number;
  newLeads: number;
  publishedPackages: number;
  draftPackages: number;
  leadConversionRate: number;
  topPackages: Array<{ id: string; name: string; views: number; leads: number; conversion: number }>;
  timeline: AnalyticsDataPoint[];
}
