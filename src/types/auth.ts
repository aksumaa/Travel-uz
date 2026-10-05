export type UserRole = 'admin' | 'agency_owner' | 'agency_staff' | 'client';

export interface AgencyInfo {
  id: number;
  name: string;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  subscription_tier: string;
  has_telegram_bot?: boolean;
  telegram_chat_id?: string | null;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  role?: UserRole | string;
  agency_id?: number | null;
  agency?: AgencyInfo | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface RegisterResponse extends AuthTokens {
  user: User;
}
