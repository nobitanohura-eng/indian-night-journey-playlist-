import React from 'react';
import { useJourney } from '../../store/JourneyContext';
import { motion, AnimatePresence } from 'motion/react';

export function Rain() {
  const { isRainy, view } = useJourney();

  return (
    <AnimatePresence>
      {isRainy && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
        >
          {/* CSS-based rain simulation */}
          <div className="rain-container absolute inset-0 transform -skew-x-12">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white/30 w-[1px] h-[20px] rounded-full animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100 - 100}%`,
                  animationDuration: `${0.5 + Math.random() * 0.4}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Window drops with turbulence */}
          <div className="absolute inset-0 z-20 backdrop-blur-[2px] opacity-40 mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id="displacementFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {Array.from({ length: 80 }).map((_, i) => (
                 <circle 
                   key={i}
                   cx={`${Math.random() * 100}%`} 
                   cy={`${Math.random() * 100}%`} 
                   r={Math.random() * 2 + 1} 
                   fill="#ffffff" 
                   opacity={Math.random() * 0.6 + 0.2}
                   filter="url(#displacementFilter)"
                 />
              ))}
            </svg>
          </div>
          
          {/* Wiper effect for driver view */}
          {view === 'driver' && (
            <div className="absolute bottom-0 left-1/4 w-[150vh] h-[150vh] origin-bottom-left -translate-x-1/2 translate-y-1/2 animate-wiper z-30">
               {/* Wiper Blade */}
               <div className="absolute top-1/2 left-0 w-full h-4 bg-[#111] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.8)] border-b border-white/10" />
               <div className="absolute top-1/2 left-0 w-[90%] h-[2px] bg-black translate-y-[-2px]" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
