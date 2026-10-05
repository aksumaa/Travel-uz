export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
export type LeadSource = 'web' | 'telegram' | 'direct' | 'referral';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Lead {
  id: number;
  agency_id: number;
  client_name: string;
  client_contact: string;
  source: LeadSource | string;
  itinerary_id?: number | null;
  status: LeadStatus;
  notes?: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  lead_id?: number | null;
  agency_id: number;
  client_name?: string;
  client_contact?: string;
  final_price: number;
  currency: string;
  status: BookingStatus;
  created_at: string;
}

export interface LeadCreatePublic {
  share_token: string;
  client_name: string;
  client_contact: string;
  notes?: string;
}

export interface ConvertLeadRequest {
  final_price: number;
  currency?: string;
}

export interface BookingCreateRequest {
  lead_id?: number;
  agency_id: number;
  final_price: number;
  currency?: string;
  status?: BookingStatus;
}
