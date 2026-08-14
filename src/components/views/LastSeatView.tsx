import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BusChassis } from '../effects/BusChassis';
import { HighwayScenery } from '../effects/HighwayScenery';

export function LastSeatView() {
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden select-none"
    >
      <BusChassis>
        {/* 1. Dynamic Highway Scenery Layer behind Rear Windshield */}
        <HighwayScenery view="LAST_SEAT" />

        {/* 2. Base Last Seat Image with subtle sway */}
        <motion.div 
          animate={{ scale: [1.02, 1.05, 1.02], y: ['0%', '1%', '0%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center opacity-100 origin-center pointer-events-none"
          style={{ backgroundImage: "url('/last-seat.png')" }}
        />
        
        {/* 3. Hindi Nostalgic Atmospheric Intro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15">
          <AnimatePresence>
            {showLabel && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center px-4 select-none"
              >
                <span className="text-[10px] md:text-xs font-mono text-amber-400/90 tracking-[0.25em] uppercase block mb-1">
                  LAST SEAT
                </span>
                <p 
                  className="text-white/90 text-xl sm:text-2xl md:text-3xl tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: '"Yatra One", system-ui' }}
                >
                  बस की सबसे पीछे वाली सीट
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)] pointer-events-none" />
      </BusChassis>
    </motion.div>
  );
}
