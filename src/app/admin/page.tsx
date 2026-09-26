'use client';

import dynamic from 'next/dynamic';

const AdminApp = dynamic(() => import('../../site/AdminApp').then((mod) => mod.AdminApp), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
}
