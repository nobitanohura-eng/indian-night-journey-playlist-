import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Radio, CloudRain, Disc, Sparkles, X, Mail, Heart, Bus } from 'lucide-react';
import { useJourney } from '../store/JourneyContext';

export function SplashScreen() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const { setAppState } = useJourney();

  const handleStart = () => {
    setIsLeaving(true);
    setAppState('SELECTION');
  };

  return (
    <>
      <AnimatePresence>
        {!isLeaving && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto flex flex-col justify-between p-3 sm:p-4 md:p-8 landscape:p-3 select-none"
          >
            {/* Background image */}
            <motion.div 
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{ backgroundImage: "url('/splash-bg.png')" }}
            />

            {/* Clean atmospheric dark vignette for readable contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

            {/* TOP BAR: Title & Round Creator Nostalgia Avatar */}
            <div className="relative z-20 flex items-start justify-between w-full max-w-5xl mx-auto shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-amber-400 font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LATE NIGHT EXPRESS • 23:45 HRS</span>
                </div>
                <h1 
                  className="text-xl sm:text-2xl md:text-4xl landscape:text-xl sm:landscape:text-2xl text-[#f3ece0] tracking-wide mt-0.5 sm:mt-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: '"Yatra One", system-ui' }}
                >
                  रात का सफ़र
                </h1>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-white/60 font-mono tracking-widest uppercase">
                  90s Indian Bus Nostalgia Experience
                </span>
              </div>

              {/* ROUND CREATOR NOSTALGIC AVATAR BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreatorOpen(true);
                }}
                className="group relative flex items-center space-x-2 bg-black/60 hover:bg-black/90 border border-amber-500/40 hover:border-amber-400 p-1 sm:p-1.5 md:pr-4 rounded-full backdrop-blur-md transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.8)] active:scale-95 shrink-0"
                title="ड्राइवर कौन है? (Creator Info)"
              >
                {/* Round Avatar Thumbnail */}
                <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#120c08] flex items-center justify-center text-amber-400 font-bold text-xs">
                    <Bus className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                </div>
                
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
                    ड्राइवर कौन है?
                  </span>
                  <span className="text-[9px] text-white/60 font-mono tracking-wider">
                    AVINASH ✦
                  </span>
                </div>
              </button>
            </div>

            {/* MIDDLE: Nostalgic Experience Badges */}
            <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-2 landscape:py-1 flex flex-col items-center pointer-events-none shrink">
              <div className="grid grid-cols-1 sm:grid-cols-3 landscape:grid-cols-3 gap-2 sm:gap-3 w-full max-w-2xl px-1">
                <div className="p-2 sm:p-3 md:p-3.5 landscape:p-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center space-x-2.5 shadow-lg">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-white/90 truncate">90s Highway Radio</span>
                    <span className="text-[8px] sm:text-[9px] text-white/50 font-mono truncate">Kumar Sanu & Alka Yagnik</span>
                  </div>
                </div>

                <div className="p-2 sm:p-3 md:p-3.5 landscape:p-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center space-x-2.5 shadow-lg">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                    <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-white/90 truncate">Monsoon Raindrops</span>
                    <span className="text-[8px] sm:text-[9px] text-white/50 font-mono truncate">Window Condensation & Fog</span>
                  </div>
                </div>

                <div className="p-2 sm:p-3 md:p-3.5 landscape:p-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center space-x-2.5 shadow-lg">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Disc className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-white/90 truncate">Interactive Cabin</span>
                    <span className="text-[8px] sm:text-[9px] text-white/50 font-mono truncate">Driver Horn & 3 Views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: Compact Start Button & Audio Advice */}
            <div className="relative z-20 flex flex-col items-center justify-center pb-1 sm:pb-2 md:pb-4 w-full shrink-0">
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={handleStart}
                className="group relative px-5 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3.5 landscape:py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.8)] transition-all duration-150 active:scale-95 flex items-center space-x-2 sm:space-x-3"
              >
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                <span className="text-xs sm:text-sm md:text-base tracking-wide font-black uppercase">
                  सफ़र शुरू करें (ENTER BUS)
                </span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black opacity-80 group-hover:rotate-45 transition-transform" />
              </motion.button>

              <div className="flex items-center space-x-1.5 sm:space-x-2 mt-2 landscape:mt-1 text-[9px] sm:text-[10px] md:text-xs text-amber-200/80 font-mono bg-black/40 px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 backdrop-blur-sm">
                <span>🎧</span>
                <span>Best experienced with headphones for binaural bus audio</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATOR MODAL (AVINASH) */}
      <AnimatePresence>
        {isCreatorOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0e0906] border border-amber-500/40 p-6 md:p-8 rounded-2xl shadow-2xl relative max-w-[340px] w-full text-center"
            >
              <button 
                onClick={() => setIsCreatorOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-full bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Avatar Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 mx-auto mb-3 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <div className="w-full h-full rounded-full bg-[#160e08] flex items-center justify-center text-amber-400">
                  <Bus className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <span className="text-xl text-amber-400 block" style={{ fontFamily: '"Yatra One", system-ui' }}>
                ड्राइवर कौन है?
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2 block font-mono">
                EXPERIENCE CREATOR
              </span>

              <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase mt-1 mb-2" style={{ fontFamily: '"Eczar", serif' }}>
                AVINASH
              </h2>

              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mb-4" />

              <p className="text-xs text-white/70 leading-relaxed italic mb-6 font-serif px-2">
                "Dedicated to all those unforgettable late-night bus journeys in India — the rain on the glass, the diesel engine roar, and timeless 90s cassette tracks."
              </p>

              <div className="w-full bg-white/5 p-3.5 rounded-xl border border-white/10 mb-4">
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/40 block mb-1">GET IN TOUCH</span>
                <a 
                  href="mailto:avinashkr502080@gmail.com" 
                  className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>avinashkr502080@gmail.com</span>
                </a>
              </div>

              <button
                onClick={() => setIsCreatorOpen(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Close (वापस जाएँ)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

