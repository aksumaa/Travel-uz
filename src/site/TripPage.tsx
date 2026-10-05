'use client';

import { PublicItineraryView } from '../components/PublicItineraryView';

export function TripPage({ token }: { token: string }) {
  return <PublicItineraryView shareToken={token} />;
}
