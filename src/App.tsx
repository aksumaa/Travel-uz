import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/AuthModal';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Lazy loaded page components
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PublicItineraryView = lazy(() => import('./components/PublicItineraryView').then(m => ({ default: m.PublicItineraryView })));

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardView, setDashboardView] = useState('home');
  const { user } = useAuth();

  // Check public itinerary link
  const pathname = window.location.pathname;
  const isPublicTrip = pathname.startsWith('/trip/');
  const shareToken = isPublicTrip ? pathname.replace('/trip/', '').split('/')[0] : '';

  // Redirect to target tab after successful login
  useEffect(() => {
    if (user) {
      const redirectView = localStorage.getItem('auth_redirect_view');
      if (redirectView) {
        setDashboardView(redirectView);
        localStorage.removeItem('auth_redirect_view');
      }
    }
  }, [user]);

  if (isPublicTrip && shareToken) {
    return (
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Tour Itinerary...</div>}>
        <PublicItineraryView shareToken={shareToken} />
      </Suspense>
    );
  }

  // Show Dashboard if user is authenticated or interacting with dashboard tabs ('home', 'explore', 'planner', 'my-trips', 'tours', 'saved', etc.)
  const showDashboard = Boolean(user) || dashboardView !== 'landing';

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Global Header Navigation for Guest Landing */}
          {!user && !showDashboard && (
            <Navbar onNavigateHome={() => setDashboardView('landing')} />
          )}

          {/* Conditional Layout Switching */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Suspense fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--color-accent)' }}>
                <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', width: '40px', height: '40px' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            }>
              {showDashboard ? (
                <Dashboard
                  initialView={dashboardView === 'landing' ? 'home' : dashboardView}
                  onViewChange={setDashboardView}
                />
              ) : (
                <>
                  <LandingPage
                    onStartPlanning={(_countryId, view) => {
                      if (view) {
                        setDashboardView(view);
                      } else {
                        setDashboardView('planner');
                      }
                    }}
                  />
                  {/* Landing page footer */}
                  <Footer />
                </>
              )}
            </Suspense>
          </div>

          {/* Global Authentication Modal overlay */}
          <AuthModal />
        </motion.div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CurrencyProvider>
            <AppContent />
          </CurrencyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;