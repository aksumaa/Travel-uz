import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  'Calibrating navigation arrays...',
  'Plotting atmospheric vectors...',
  'Syncing orbital map coordinates...',
  'Connecting telemetry databases...',
  'Finalizing pre-flight checklists...',
  'Welcome to TravelUZ.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 2;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const stepCount = LOADING_STEPS.length;
    const currentStep = Math.min(
      Math.floor((progress / 100) * stepCount),
      stepCount - 1
    );
    setStepIndex(currentStep);

    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, #0a0f1d 0%, #030408 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Outfit', sans-serif",
      }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Background Atmosphere */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
          filter: 'blur(45px)',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '90%', maxWidth: '400px' }}>
        
        {/* Airplane Logo Container */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#planeGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5l-8.2-1.8c-.9-.2-1.8.2-2.1.9-.3.7-.1 1.6.5 2.1l6.1 4.6-2.5 2.5-3.1-.7c-.6-.1-1.2.1-1.5.6-.4.5-.4 1.2 0 1.6l1.8 1.8 1.8 1.8c.4.4 1.1.4 1.6 0 .5-.3.7-.9.6-1.5l-.7-3.1 2.5-2.5 4.6 6.1c.5.6 1.4.8 2.1.5.7-.3 1.1-1.2.9-2.1z" />
          </svg>
        </motion.div>

        {/* Text Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center', height: '60px' }}>
          <motion.h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #ffffff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            T R A V E L U Z
          </motion.h2>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                letterSpacing: '0.5px',
                fontWeight: 400,
              }}
            >
              {LOADING_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading Progress Bar */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.02)',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9 0%, #8b5cf6 50%, #f59e0b 100%)',
              boxShadow: '0 0 8px rgba(14, 165, 233, 0.8)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Percentage Counter */}
        <span
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          {progress}%
        </span>
      </div>
    </motion.div>
  );
};
