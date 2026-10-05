'use client';

import dynamic from 'next/dynamic';

const AgencyApp = dynamic(() => import('../../../site/AgencyApp').then((mod) => mod.AgencyApp), { ssr: false });

export default function AgencyDashboardPage() {
  return <AgencyApp />;
}
