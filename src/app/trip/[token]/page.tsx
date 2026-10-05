'use client';

import { useParams } from 'next/navigation';
import { TripPage } from '../../../site/TripPage';

export default function PublicTripPage() {
  const params = useParams<{ token: string }>();
  const token = typeof params?.token === 'string' ? params.token : '';
  if (!token) return null;
  return <TripPage token={token} />;
}
