'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from '../views/Dashboard';

export function UserApp() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState('home');

  useEffect(() => {
    const redirectView = localStorage.getItem('auth_redirect_view');
    if (redirectView) {
      setView(redirectView);
      localStorage.removeItem('auth_redirect_view');
    }
    if (!isLoading && !user) {
      localStorage.setItem('auth_redirect_path', '/dashboard');
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-accent)' }}>
        Opening your trips...
      </div>
    );
  }

  return <Dashboard variant="user" initialView={view} />;
}
