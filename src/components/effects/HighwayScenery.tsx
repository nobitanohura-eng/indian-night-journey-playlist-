import React from 'react';
import { motion } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';

export function HighwayScenery({ view }: { view: 'WINDOW' | 'DRIVER' | 'LAST_SEAT' }) {
  const { isRainy } = useJourney();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. Distant Dark Horizon & Highway Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#07060a] to-[#030304]" />

      {/* 2. Distant Moving Night Sky & Subtle Constellations */}
      <div className="absolute top-0 left-0 w-full h-[50%] opacity-35 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_25px_35px,#ffffff,rgba(0,0,0,0)),radial-gradient(1px_1px_at_140px_80px,#fcd34d,rgba(0,0,0,0)),radial-gradient(1px_1px_at_260px_150px,#93c5fd,rgba(0,0,0,0))] bg-[length:300px_180px]" />
        
        {/* Soft slow drifting night clouds */}
        <motion.div 
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-[200%] h-full opacity-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-600 via-transparent to-transparent blur-2xl"
        />
      </div>

      {/* 3. Subtle Distant Oncoming Headlights Gliding Past */}
      {[
        { id: 1, top: 48, speed: 4.2, delay: 0.5 },
        { id: 2, top: 52, speed: 3.6, delay: 3.2 },
        { id: 3, top: 49, speed: 5.0, delay: 6.8 },
      ].map(car => (
        <motion.div
          key={car.id}
          initial={{ x: '115vw', opacity: 0, scale: 0.6 }}
          animate={{ 
            x: '-25vw', 
            opacity: [0, 0.4, 0.7, 0.4, 0], 
            scale: [0.6, 0.85, 1.05] 
          }}
          transition={{
            duration: car.speed,
            repeat: Infinity,
            delay: car.delay,
            ease: 'linear',
          }}
          style={{ top: `${car.top}%` }}
          className="absolute flex items-center gap-3 sm:gap-4 pointer-events-none"
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90 blur-[1.5px] shadow-[0_0_25px_10px_rgba(255,255,255,0.4)]" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90 blur-[1.5px] shadow-[0_0_25px_10px_rgba(255,255,255,0.4)]" />
        </motion.div>
      ))}

      {/* 4. Wet Road Reflection when Rainy */}
      {isRainy && (
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-cyan-950/25 via-slate-900/10 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
