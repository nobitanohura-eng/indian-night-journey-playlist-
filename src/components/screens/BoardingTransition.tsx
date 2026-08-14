import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { Bus } from 'lucide-react';

export function BoardingTransition() {
  const { setAppState, ticket } = useJourney();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState('JOURNEY');
    }, 2400);
    return () => clearTimeout(timer);
  }, [setAppState]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => setAppState('JOURNEY')}
      className="fixed inset-0 z-50 bg-[#050403] flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
    >
      {/* Background vignette & texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center max-w-lg"
      >
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
        >
          <Bus className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#e4dbcb] tracking-[0.2em] mb-1.5 font-bold uppercase" style={{ fontFamily: '"Eczar", serif' }}>
          WELCOME ABOARD
        </h1>
        
        <p className="text-amber-400/90 text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-4 font-mono">
          DELUXE NIGHT EXPRESS • {ticket ? `${ticket.route.from} → ${ticket.route.to}` : 'HIGHWAY SERVICE'}
        </p>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-2" />

        <p className="text-white/80 text-lg sm:text-2xl tracking-wider mt-2 mb-2 font-medium" style={{ fontFamily: '"Yatra One", system-ui' }}>
          सीट संभाल लीजिए... सफ़र शुरू हो चुका है।
        </p>

        {ticket && (
          <div className="mt-4 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 text-[10px] sm:text-xs font-mono text-amber-200/90">
            SEAT {ticket.seat} • DEPARTURE {ticket.boardingTime}
          </div>
        )}

        <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase mt-8 animate-pulse">
          Click anywhere or wait to enter...
        </span>
      </motion.div>
    </motion.div>
  );
}
