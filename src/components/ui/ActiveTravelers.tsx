import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';

const PRESENCE_MODE: 'simulation' | 'realtime' = 'simulation';

export function ActiveTravelers() {
  const { appState } = useJourney();
  const [count, setCount] = useState(27);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (appState !== 'JOURNEY') return;

    if (PRESENCE_MODE === 'simulation') {
      const interval = setInterval(() => {
        setCount(prev => {
          // Small natural changes occasionally
          const change = Math.random() > 0.5 ? 1 : -1;
          const newCount = prev + change;
          // Keep count natural, between 18 and 35
          return Math.max(18, Math.min(35, newCount));
        });
        
        setHasChanged(true);
        setTimeout(() => setHasChanged(false), 2000);
      }, 45000); // Check/change occasionally

      return () => clearInterval(interval);
    } else {
      // Future Realtime Mode Architecture:
      // 1. Register the visitor when they enter the journey.
      // 2. Assign them a temporary anonymous session ID.
      // 3. Maintain presence while the page is active.
      // 4. Remove/expire the presence when the visitor leaves.
      // 5. Update the visible count when other visitors join or leave.
      // 6. Automatically handle stale sessions.
    }
  }, [appState]);

  if (appState !== 'JOURNEY') return null;

  return (
    <div className="pointer-events-auto flex items-center justify-end">
      <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-sm bg-black/40 border border-white/5 backdrop-blur-sm shadow-md transition-all">
        {/* Blinking Green Dot */}
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        
        {/* Count and Text */}
        <div className="flex items-center space-x-1">
          <div className="relative overflow-hidden h-3 min-w-[12px] flex justify-center items-center">
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={count}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`text-[9px] md:text-[10px] font-mono font-bold ${hasChanged ? 'text-emerald-400' : 'text-white/90'}`}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.1em] text-white/50">
            TRAVELERS ON THIS JOURNEY
          </span>
        </div>
      </div>
    </div>
  );
}
