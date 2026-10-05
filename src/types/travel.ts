export type ActivityCategory = 
  | 'attraction'
  | 'food'
  | 'cafe'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'lodging';

export interface ActivityItem {
  id?: string;
  activity: string;
  category?: ActivityCategory;
  location: string;
  duration: string;
  cost: number;
  timeSlot?: 'morning' | 'lunch' | 'afternoon' | 'evening' | 'night';
  startTime?: string;
  tip?: string;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  lat?: number;
  lng?: number;
  image?: string;
  transitToNext?: {
    distance: string;
    duration: string;
    modality: 'walking' | 'metro' | 'taxi' | 'bus';
  };
}

export interface DiningItem {
  restaurant: string;
  cuisine: string;
  cost: number;
  address?: string;
  rating?: number;
  reviewsCount?: number;
  lat?: number;
  lng?: number;
  tip?: string;
  isVerified?: boolean;
  category?: ActivityCategory;
}

export interface HotelItem {
  name: string;
  stars: number;
  price: number;
  area: string;
  amenities?: string[];
  lat?: number;
  lng?: number;
  rating?: number;
  image?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  morning: ActivityItem;
  lunch?: DiningItem;
  afternoon: ActivityItem;
  evening: DiningItem;
  hotel?: HotelItem;
  dailyCost?: number;
  activities?: ActivityItem[];
}

export interface ItineraryContent {
  title: string;
  summary: string;
  totalCost: number;
  currency?: string;
  days: DayPlan[];
  packingTips?: string[];
  visaInfo?: string;
  bestTime?: string;
  emergencyNumbers?: {
    police?: string;
    ambulance?: string;
    embassy?: string;
  };
  destination?: string;
  tripStyle?: 'Local Explorer' | 'Balanced' | 'Relaxed Premium';
}

export interface Itinerary {
  id: number | string;
  agency_id?: number | null;
  package_id?: number | null;
  user_id?: number | null;
  title: string;
  destination: string;
  generated_by: 'ai' | 'manual';
  content_json: ItineraryContent;
  share_token: string;
  created_at: string;
  agency_name?: string | null;
  agency_logo?: string | null;
  agency_contact_email?: string | null;
  agency_contact_phone?: string | null;
}

export interface TripSummary {
  id: string | number;
  destination: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  budget?: string | number;
  style?: string;
  status: 'Upcoming' | 'Completed' | 'Draft' | 'Active';
  totalCost: number;
  share_token?: string;
  image?: string;
  rawTripData?: ItineraryContent;
}

export type TripPace = 'Leisurely' | 'Balanced' | 'Fast-Paced';
export type TripComfort = 'Backpacker' | 'Boutique' | 'Luxury';
export type TripStrategyTier = 'Local Explorer' | 'Balanced' | 'Relaxed Premium';

export interface PlannerFilters {
  destination: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travelers: number;
  budgetUSD: number;
  pace: TripPace;
  comfort: TripComfort;
  interests: string[];
  foodPreferences: string[];
  transportPreference: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    description?: string;
  }[];
}

export interface StrategyChoice {
  tier: TripStrategyTier;
  title: string;
  tagline: string;
  estimatedCostUSD: number;
  paceDescription: string;
  transitDescription: string;
  diningDescription: string;
  keyTradeoff: string;
  highlights: string[];
}

export interface ReadyTourPackage {
  id: number | string;
  agencyId?: number;
  agencyName: string;
  agencyRating: number;
  agencyReviewsCount: number;
  isVerifiedAgency: boolean;
  title: string;
  destination: string;
  days: number;
  nights: number;
  priceUSD: number;
  currency?: string;
  matchScore: number;
  matchReason: string;
  imageUrl: string;
  hotelGrade: string;
  mealsIncluded: string;
  transportIncluded: string;
  guideLanguage: string;
  inclusions: string[];
  exclusions: string[];
  description: string;
  highlights: string[];
}

export interface ComparisonDimension {
  title: string;
  aiValue: string;
  tourValue: string;
  advantage: 'ai' | 'tour' | 'neutral';
}

export interface CountryData {
  name?: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  population: string;
  area: string;
  flag: string;
  weather: {
    temp: number;
    condition: string;
  };
  visa: string;
  bestTime: string;
  description: string;
  attractions: Array<{
    name: string;
    city: string;
    image: string;
  }>;
  foods: Array<{
    name: string;
    image: string;
  }>;
}

export interface GlobeCountryData extends CountryData {
  id: string;
  name: string;
  lat: number;
  lon: number;
}
