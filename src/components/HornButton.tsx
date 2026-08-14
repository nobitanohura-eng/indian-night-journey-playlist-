import React from 'react';
import { Megaphone } from 'lucide-react';
import { useJourney } from '../store/JourneyContext';
import { motion } from 'motion/react';
import { HORN_TRACKS } from '../constants/audio';

export function HornButton() {
  const { triggerHorn, hornActive, selectedHornIndex } = useJourney();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => triggerHorn()}
      className={`relative group px-8 py-4 rounded-2xl border-4 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col items-center ${
        hornActive 
          ? 'bg-amber-600 border-yellow-300 shadow-[0_0_50px_rgba(245,158,11,0.8)]' 
          : 'bg-[#1a0f00]/90 border-amber-600 backdrop-blur-xl hover:bg-[#2a1800]/90'
      }`}
    >
      {/* Metal texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
      
      {/* Rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-black/80 rounded-full border border-white/20 shadow-inner" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-black/80 rounded-full border border-white/20 shadow-inner" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-black/80 rounded-full border border-white/20 shadow-inner" />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-black/80 rounded-full border border-white/20 shadow-inner" />

      <Megaphone className={`w-8 h-8 mb-2 relative z-10 transition-transform ${hornActive ? 'text-yellow-100 scale-110 -rotate-12' : 'text-amber-500'}`} />
      
      <div className={`font-black tracking-widest text-lg relative z-10 ${hornActive ? 'text-white' : 'text-amber-500'}`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
        HORN OK PLEASE
      </div>
      <div className={`font-bold tracking-[0.1em] text-[10px] relative z-10 ${hornActive ? 'text-yellow-200' : 'text-amber-600'}`}>
        {HORN_TRACKS[selectedHornIndex]?.name || 'HIGHWAY AIR HORN'}
      </div>

      <div className="absolute bottom-1 right-2 text-[8px] text-white/30 font-mono">[H]</div>
    </motion.button>
  );
}

