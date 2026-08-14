import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { BusChassis } from '../effects/BusChassis';
import { HighwayScenery } from '../effects/HighwayScenery';
import { CanvasRainLayer } from '../effects/CanvasRainLayer';

export function WindowView() {
  const { isRainy } = useJourney();
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const introTimer = setTimeout(() => setShowIntro(false), 4200);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPhoneOpen(false);
    };
    if (isPhoneOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhoneOpen]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden select-none"
    >
      <BusChassis>
        {/* 1. Dynamic Highway Scenery Layer (Outside View) */}
        <HighwayScenery view="WINDOW" />

        {/* 2. Base Window Seat Image with smooth Parallax zoom */}
        <motion.div 
          animate={{ scale: [1.015, 1.035, 1.015], x: ['0%', '-0.4%', '0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center opacity-100 origin-center pointer-events-none"
          style={{ backgroundImage: "url('/window-seat.png')" }}
        />

        {/* 3. Window Glass Atmospheric Reflection */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-cyan-950/15 via-transparent to-amber-100/10 pointer-events-none"
          style={{ 
            maskImage: 'radial-gradient(ellipse at 48% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 48% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 90%)'
          }}
        />

        {/* 4. Realistic Rain on Glass Layer (Interactive touch & wipe) */}
        {isRainy && (
          <div 
            className="absolute inset-0 pointer-events-auto opacity-100"
            style={{ 
              maskImage: 'radial-gradient(ellipse at 48% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 48% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 90%)'
            }}
          >
            <CanvasRainLayer />
          </div>
        )}

        {/* 5. Hindi Nostalgic Atmospheric Intro Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15">
          <AnimatePresence>
            {showIntro && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center px-4 select-none"
              >
                <span className="text-[10px] md:text-xs font-mono text-amber-400/90 tracking-[0.25em] uppercase block mb-1">
                  WINDOW SEAT
                </span>
                <p 
                  className="text-white/90 text-xl sm:text-2xl md:text-3xl tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: '"Yatra One", system-ui' }}
                >
                  खिड़की वाली सीट
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Cinematic Soft Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_25%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />

        {/* 7. Phone Hotspot (Nostalgic Missed Call Phone on Left Seat) */}
        <button
          aria-label="Open phone to check message"
          onClick={() => setIsPhoneOpen(true)}
          className="absolute bottom-[100px] sm:bottom-[120px] left-[5%] md:left-[8%] w-[60px] sm:w-[90px] md:w-[120px] h-[80px] sm:h-[110px] md:h-[140px] z-20 cursor-pointer bg-white/0 hover:bg-white/5 active:bg-white/10 transition-colors rounded-2xl border border-transparent hover:border-amber-400/20"
          title="Click to check phone message from Maa"
        />

        {/* 8. Phone UI Overlay Modal */}
        <AnimatePresence>
          {isPhoneOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsPhoneOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[240px] sm:w-[260px] h-[440px] sm:h-[480px] max-h-[92vh] landscape:scale-[0.68] landscape:sm:scale-85 origin-center bg-[#1a1a1a] rounded-[30px] sm:rounded-[35px] border-[4px] border-[#0a0a0a] shadow-2xl relative overflow-hidden flex flex-col pb-4 sm:pb-6"
              >
                 {/* Top Speaker Slit */}
                 <div className="w-12 h-1.5 bg-black rounded-full mx-auto mt-4 mb-2 opacity-80" />

                 {/* Screen Content - Nostalgic Dark/Green Display */}
                 <div className="flex-1 bg-[#0a1a0a] mx-3 mt-1 mb-2 rounded-xl border-[4px] border-black p-4 flex flex-col font-mono text-[#4ade80] relative overflow-hidden shadow-inner">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-[9px] opacity-80 mb-8 border-b border-[#4ade80]/20 pb-1">
                      <span>▰▰▰▰ Jio</span>
                      <span>01:17</span>
                      <span>52% 🔋</span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center -mt-6">
                      <div className="space-y-1 mb-6">
                        <p className="text-[10px] tracking-widest opacity-60">MISSED CALL</p>
                        <p className="text-2xl font-bold text-[#4ade80]">Maa</p>
                        <p className="text-[10px] opacity-60">12:48 AM</p>
                      </div>

                      <div className="px-3 py-3 w-full border border-[#4ade80]/30 border-dashed">
                        <p className="text-xs leading-relaxed italic opacity-90 text-[#4ade80]">
                          "Pahunch ke call<br/>kar dena."
                        </p>
                      </div>
                    </div>
                 </div>

                 {/* Lock Button */}
                 <div className="px-4 mt-auto">
                    <button
                      onClick={() => setIsPhoneOpen(false)}
                      className="w-full py-3 bg-[#222] hover:bg-[#333] active:bg-[#111] text-white/50 hover:text-white/80 text-[10px] tracking-widest uppercase rounded-lg transition-colors border-b-2 border-black font-bold shadow-sm"
                    >
                      LOCK PHONE
                    </button>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </BusChassis>
    </motion.div>
  );
}
