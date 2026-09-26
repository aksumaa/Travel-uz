'use client';

import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthModal } from '../components/AuthModal';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ErrorBoundary>
            {children}
            <AuthModal />
          </ErrorBoundary>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
