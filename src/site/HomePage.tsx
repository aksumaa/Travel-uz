'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '../components/LoadingScreen';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPage } from '../views/LandingPage';

export function HomePage() {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('traveluz_loaded');
    if (!hasLoaded) {
      setShowLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    try {
      sessionStorage.setItem('traveluz_loaded', 'true');
    } catch {
      // ignore in incognito or restricted mode
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Navbar />
        <div style={{ flex: 1, position: 'relative' }}>
          <LandingPage onStartPlanning={() => undefined} />
        </div>
        <Footer />
      </div>
    </>
  );
}
