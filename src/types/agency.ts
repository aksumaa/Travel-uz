export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

export interface Agency {
  id: number;
  name: string;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  owner_user_id: number;
  subscription_tier: SubscriptionTier;
  telegram_bot_token?: string | null;
  telegram_chat_id?: string | null;
  has_telegram_bot?: boolean;
  created_at: string;
}

export interface AgencyMember {
  agency_id: number;
  user_id: number;
  role: 'owner' | 'staff';
  created_at: string;
}

export interface AgencyAnalytics {
  total_revenue: number;
  leads_count: number;
  bookings_count: number;
  conversion_rate: number;
  top_destinations: Array<{ destination: string; count: number }>;
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

export interface TelegramSettingsUpdate {
  telegram_bot_token?: string;
  telegram_chat_id?: string;
}

export interface AgencyOnboardRequest {
  name: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  subscription_tier?: SubscriptionTier;
}
