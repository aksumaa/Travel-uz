'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from '../components/LoadingScreen';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPage } from '../views/LandingPage';

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}
        >
          <Navbar />
          <div style={{ flex: 1, position: 'relative' }}>
            <LandingPage onStartPlanning={() => undefined} />
          </div>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
