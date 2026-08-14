import React from 'react';
import { useJourney } from '../../store/JourneyContext';
import { motion, AnimatePresence } from 'motion/react';

const BACKGROUNDS = {
  window: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2070&auto=format&fit=crop',
  driver: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?q=80&w=2070&auto=format&fit=crop',
  last_seat: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'
};

export function Interior() {
  const { view, isRainy, showTooltip } = useJourney();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden animate-vibrate-slow">
      <AnimatePresence mode="wait">
        <motion.div 
          key={view}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BACKGROUNDS[view]})` }}
        >
          {/* Base Atmosphere */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />
          
          {/* Dynamic Wet Road Reflection when raining */}
          {isRainy && (
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-amber-500/10 to-transparent mix-blend-color-dodge opacity-60" />
          )}

          {view === 'window' && (
            <div className="absolute inset-0 z-10">
              {/* Window Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)] pointer-events-none" />
              
              {/* Curtain Left */}
              <div 
                className="absolute top-0 left-0 bottom-0 w-32 md:w-64 bg-[#1a2332] shadow-[20px_0_50px_rgba(0,0,0,0.9)] border-r-8 border-[#0d121c] origin-top pointer-events-auto cursor-pointer"
                style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 20%, rgba(0,0,0,0.5) 40%, transparent 60%, rgba(0,0,0,0.8) 100%)' }}
                onClick={() => showTooltip("Thandi hawa aa rahi hai... (Cold breeze coming in)")}
              >
                 {/* Curtain Pattern */}
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/floral-pattern.png')]" />
              </div>

              {/* Hindi Sticker on Window */}
              <div 
                className="absolute top-[15%] right-[20%] text-amber-500/80 font-bold text-2xl md:text-4xl tracking-widest pointer-events-auto cursor-pointer mix-blend-overlay rotate-[-5deg] drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                onClick={() => showTooltip("Shubh Yatra - Have a safe journey.")}
                style={{ fontFamily: 'sans-serif' }}
              >
                शुभ यात्रा
              </div>

              {/* Distant passing lights glow */}
              <div className="absolute top-[60%] right-[30%] w-32 h-16 bg-red-500/20 blur-[40px] rounded-full animate-pulse" />
            </div>
          )}
          
          {view === 'driver' && (
            <div className="absolute inset-0 z-10">
              {/* Driver Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.95)_100%)] pointer-events-none" />

              {/* Hanging Marigold / Tassel */}
              <div className="absolute top-0 left-[60%] w-2 h-48 bg-gradient-to-b from-orange-600 to-yellow-500 origin-top animate-vibrate shadow-[0_0_10px_rgba(0,0,0,0.8)] pointer-events-auto cursor-pointer rounded-full" onClick={() => showTooltip("Jai Mata Di 🙏")}>
                <div className="absolute bottom-[-10px] left-[-8px] w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px]">✨</div>
              </div>

              {/* Top Banner Text */}
              <div className="absolute top-[5%] inset-x-0 flex justify-center pointer-events-auto cursor-pointer" onClick={() => showTooltip("The journey is beautiful... ♡")}>
                <div className="text-red-500/90 font-bold text-xl md:text-3xl tracking-widest mix-blend-overlay drop-shadow-[0_0_5px_rgba(0,0,0,1)] bg-black/20 px-8 py-2 rounded-full border border-red-900/50">
                  सफर खूबसूरत है... ♡
                </div>
              </div>
              
              {/* Pillar Text Right */}
              <div className="absolute top-[40%] right-[10%] w-48 text-yellow-500/90 font-bold text-lg md:text-2xl text-center pointer-events-auto cursor-pointer rotate-[3deg] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/40 p-3 rounded" onClick={() => showTooltip("Drive slowly, you only live once.")}>
                धीरे चलो<br/>जिंदगी मिलेगी<br/>दोबारा नहीं...♡
              </div>

              {/* Fake dashboard ambient glows */}
              <div className="absolute bottom-0 inset-x-0 h-[40vh] bg-[#050505] border-t-4 border-[#111] shadow-[0_-30px_50px_rgba(0,0,0,1)] pointer-events-auto cursor-pointer" onClick={() => showTooltip("Driver dashboard humming...")}>
                 {/* Steering Wheel Arc */}
                 <div className="absolute bottom-[-20%] left-[20%] w-[50vh] h-[50vh] rounded-full border-[30px] border-[#0a0a0a] shadow-[inset_0_10px_30px_rgba(255,255,255,0.05),0_-10px_30px_rgba(0,0,0,0.8)]" />
                 
                 {/* Dashboard Dials */}
                 <div className="absolute top-[20%] left-[32%] w-24 h-24 rounded-full border-4 border-[#222] bg-[#0a0a0a] shadow-[inset_0_0_20px_rgba(52,211,153,0.1)] flex items-center justify-center">
                   <div className="w-1 h-10 bg-emerald-500/80 rounded-full origin-bottom rotate-[45deg]" />
                 </div>

                 {/* Fan */}
                 <div className="absolute top-[-120px] right-[25%] w-24 h-24 rounded-full border-8 border-[#111] bg-black shadow-2xl flex items-center justify-center overflow-hidden">
                   <div className="w-[110%] h-[20%] bg-[#222] animate-fan" />
                   <div className="absolute w-[20%] h-[110%] bg-[#222] animate-fan" />
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
                 </div>
              </div>
              <div className="absolute bottom-[20%] left-[45%] w-48 h-32 bg-amber-500/10 blur-[60px] rounded-full animate-pulse" />
            </div>
          )}

          {view === 'last_seat' && (
            <div className="absolute inset-0 z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(0,0,0,0.98)_100%)] pointer-events-none" />
              
              {/* Silhouette Seats overlay */}
              <div className="absolute bottom-0 left-[5%] w-[30%] h-[50%] bg-[#080808] rounded-tr-[40px] shadow-[20px_0_50px_rgba(0,0,0,0.9)] border-t border-white/5" />
              <div className="absolute bottom-0 right-[5%] w-[30%] h-[50%] bg-[#080808] rounded-tl-[40px] shadow-[-20px_0_50px_rgba(0,0,0,0.9)] border-t border-white/5" />
              
              <div className="absolute bottom-[10%] left-[25%] w-[15%] h-[40%] bg-[#060606] rounded-tr-[30px] border-t border-white/5" />
              <div className="absolute bottom-[10%] right-[25%] w-[15%] h-[40%] bg-[#060606] rounded-tl-[30px] border-t border-white/5" />

              {/* Aisle light */}
              <div className="absolute top-0 inset-x-0 flex justify-center">
                 <div className="w-full max-w-[200px] h-32 bg-gradient-to-b from-blue-900/10 to-transparent" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-blue-500/40 blur-[10px] rounded-full" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
