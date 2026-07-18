import React, { useRef, useState, useEffect } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  maxTilt = 15,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoords({ x, y });

    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    const rotateY = normalizedX * maxTilt;
    const rotateX = -normalizedY * maxTilt;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`,
      transition: 'transform 0.08s ease-out',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;

    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 550);
  };

  return (
    <div
      ref={cardRef}
      className={`glass-panel tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        ...tiltStyle,
      }}
    >
      {/* Dynamic Ripple Overlays */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Spotlight glass reflection */}
      {isHovered && !reducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle 220px at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.08), transparent 75%)`,
            zIndex: 3,
          }}
        />
      )}
      
      {/* 3D Content Container */}
      <div className="tilt-card-content" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};
