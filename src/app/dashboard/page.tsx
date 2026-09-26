'use client';

import dynamic from 'next/dynamic';

const UserApp = dynamic(() => import('../../site/UserApp').then((mod) => mod.UserApp), { ssr: false });

export default function DashboardPage() {
  return <UserApp />;
}
