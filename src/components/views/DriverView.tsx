import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { BusChassis } from '../effects/BusChassis';
import { HighwayScenery } from '../effects/HighwayScenery';
import { CanvasRainLayer } from '../effects/CanvasRainLayer';
import { HORN_TRACKS } from '../../constants/audio';

export function DriverView() {
  const { 
    hornActive, 
    selectedHornIndex, 
    setSelectedHornIndex, 
    triggerHorn, 
    dipperActive, 
    triggerDipper, 
    isRainy 
  } = useJourney();
  const [hazardsActive, setHazardsActive] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const introTimer = setTimeout(() => setShowIntro(false), 4200);
    return () => clearTimeout(introTimer);
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
        {/* 1. Dynamic Highway Scenery Layer behind Windshield */}
        <div className="absolute inset-0 z-0">
          <HighwayScenery view="DRIVER" />
        </div>

        {/* 2. Base Driver Seat Cabin Background Image */}
        <motion.div 
          animate={{ scale: [1.015, 1.035, 1.015], y: ['0%', '0.4%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center opacity-100 origin-center pointer-events-none z-5 transform-gpu will-change-transform"
          style={{ backgroundImage: "url('/driver-seat.png')" }}
        />

        {/* 3. Driver Windshield Raindrops */}
        {isRainy && (
          <div className="absolute inset-0 z-10 pointer-events-auto opacity-100">
            <CanvasRainLayer />
          </div>
        )}

        {/* 4. High Beam Flash (Dipper) Overlay */}
        <AnimatePresence>
          {dipperActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-gradient-to-t from-amber-100/25 via-white/40 to-transparent pointer-events-none z-15 mix-blend-screen"
            />
          )}
        </AnimatePresence>

        {/* 5. Hindi Nostalgic Intro Overlay */}
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
                  DRIVER CABIN
                </span>
                <p 
                  className="text-white/90 text-xl sm:text-2xl md:text-3xl tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: '"Yatra One", system-ui' }}
                >
                  ड्राइवर केबिन
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Interactive Driver Dashboard Controls Area */}
        <div className="absolute bottom-[115px] sm:bottom-[90px] md:bottom-[95px] landscape:bottom-auto landscape:top-[60px] left-2.5 sm:left-6 md:left-8 landscape:left-4 z-30 pointer-events-auto flex items-center gap-2 sm:gap-2.5 scale-90 sm:scale-100 landscape:scale-80 origin-bottom-left landscape:origin-top-left">
          {/* Main HORN OK PLEASE Button */}
          <button 
            onClick={() => triggerHorn()}
            aria-label="Horn OK Please (Keyboard: H)"
            className={`relative group transition-transform duration-100 active:scale-95 ${
              hornActive ? 'scale-95' : 'hover:scale-105'
            }`}
            title="Press Horn [Keyboard: H]"
          >
            <div className={`relative px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#1a1714]/95 backdrop-blur-xl border-[2px] border-[#3a2e22] flex flex-col items-center justify-center rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] ${
              hornActive ? 'bg-[#2a221b] border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : ''
            }`}>
              {/* Screws */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-black/70 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black/70 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-black/70 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-black/70 shadow-[0_1px_0_rgba(255,255,255,0.15)]" />
              
              {/* Retro Box/Text */}
              <div className="border border-dashed border-[#ffb300]/50 px-2 sm:px-2.5 py-0.5 sm:py-1 flex flex-col items-center">
                <span className={`font-mono text-[8.5px] sm:text-[9.5px] md:text-xs font-bold tracking-[0.16em] transition-colors duration-100 whitespace-nowrap ${
                  hornActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-[#ffb300]'
                }`}>
                  HORN OK PLEASE
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs transition-all duration-100 ${
                    hornActive ? 'opacity-100 scale-125' : 'opacity-70'
                  }`}>
                    🔊
                  </span>
                  <span className="text-[7.5px] font-mono text-amber-200/90 font-bold">
                    {HORN_TRACKS[selectedHornIndex]?.hindi || 'हॉर्न'}
                  </span>
                  <span className="text-[7.5px] font-mono text-white/40 hidden sm:inline">[H]</span>
                </div>
              </div>
            </div>
          </button>

          {/* DIPPER / FLASH HEADLIGHTS Button */}
          <button
            onClick={triggerDipper}
            aria-label="Flash High Beam Dipper (Keyboard: D)"
            className="group px-2.5 py-2 bg-[#12100e]/90 hover:bg-[#1f1a14] active:scale-95 backdrop-blur-md border border-white/20 hover:border-amber-400/50 rounded-xl shadow-lg transition-all flex flex-col items-center text-center"
            title="Flash High Beam [Keyboard: D]"
          >
            <span className="text-amber-400 text-xs">⚡</span>
            <span className="text-[7.5px] font-mono font-bold text-white/80 uppercase tracking-widest mt-0.5">
              DIPPER
            </span>
          </button>

          {/* HAZARD LIGHTS TOGGLE */}
          <button
            onClick={() => setHazardsActive(!hazardsActive)}
            aria-label="Toggle Hazard Emergency Blinkers"
            className={`group px-2.5 py-2 backdrop-blur-md rounded-xl border transition-all active:scale-95 flex flex-col items-center text-center ${
              hazardsActive 
                ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                : 'bg-[#12100e]/90 hover:bg-[#1f1a14] border-white/20'
            }`}
            title="Toggle Hazard Lights"
          >
            <span className={`text-xs ${hazardsActive ? 'text-red-400 animate-pulse' : 'text-white/40'}`}>
              ▲
            </span>
            <span className={`text-[7.5px] font-mono font-bold uppercase tracking-widest mt-0.5 ${
              hazardsActive ? 'text-red-300 font-extrabold' : 'text-white/70'
            }`}>
              HAZARD
            </span>
          </button>
        </div>

        {/* 7. Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </BusChassis>
    </motion.div>
  );
}
