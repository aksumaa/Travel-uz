'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from '../views/Dashboard';

export function UserApp() {
  const { user, isLoading } = useAuth();
  const [view, setView] = useState('home');

  useEffect(() => {
    const redirectView = localStorage.getItem('auth_redirect_view');
    if (redirectView) {
      setView(redirectView);
      localStorage.removeItem('auth_redirect_view');
    }
  }, []);

  return <Dashboard variant="user" initialView={view} />;
}
