/**
 * Unified Travel Destination & Country Information System
 * Standardized data contracts for all countries and destinations.
 */

export interface DestinationCoordinates {
  lat: number;
  lng: number;
}

export interface DestinationCost {
  perDayUSD: number;
  currencyFormatted?: string;
}

export interface DestinationInfo {
  id?: string;
  name: string;
  country: string;
  city: string;
  image: string;
  description: string;
  coordinates: DestinationCoordinates;
  category: string;
  rating: number;
  bestTime: string;
  estimatedCost: DestinationCost;
  highlights?: string[];
  tags?: string[];
}

export interface CountryCurrency {
  code: string;
  symbol: string;
  name: string;
  formatted?: string;
}

export interface CountryWeather {
  tempC: number;
  condition: string;
  icon?: string;
}

export interface CountryBudget {
  perDayUSD: number;
  level: string; // e.g. "Budget", "Moderate", "Moderate to Premium", "Luxury"
  formatted?: string;
}

export interface CountryInfo {
  id: string; // normalized lower-case slug e.g. 'france', 'niger'
  name: string;
  countryCode: string; // e.g. 'FRA', 'NER', 'UZB'
  capital: string;
  population: string;
  languages: string[];
  currency: CountryCurrency;
  timezone: string;
  weather: CountryWeather;
  bestTime: string;
  averageBudget: CountryBudget;
  description: string;
  heroImage: string;
  gallery?: string[];
  destinations: DestinationInfo[];
  coordinates: DestinationCoordinates;
  flag: string;
  region?: string;
  subregion?: string;
  callingCode?: string;
  visaStatus?: string;
  visaSummary?: string;
  tagline?: string;
  language?: string;
  currencyCode?: string;
  currencySymbol?: string;
  averageBudgetUSD?: number;
}
