'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const TripPage = dynamic(() => import('../../../site/TripPage').then((mod) => mod.TripPage), { ssr: false });

export default function PublicTripPage() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === 'string' ? params.token : '';
  if (!token) return null;
  return <TripPage token={token} />;
}
