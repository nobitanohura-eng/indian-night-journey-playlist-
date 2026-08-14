import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { Coffee, Radio } from 'lucide-react';

export function ChaiBreakOverlay() {
  const { isChaiBreak, setIsChaiBreak } = useJourney();
  const [timeLeft, setTimeLeft] = useState(60); // 1 real minute
  const [interactionMsg, setInteractionMsg] = useState('');
  
  // Timer countdown
  useEffect(() => {
    if (!isChaiBreak) {
      setTimeLeft(60);
      setInteractionMsg('');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInteractionMsg('ALL ABOARD');
          setTimeout(() => setIsChaiBreak(false), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isChaiBreak, setIsChaiBreak]);

  if (!isChaiBreak) return null;

  const handleInteraction = (type: string) => {
    switch (type) {
      case 'chai':
        setInteractionMsg('CHAI MIL GAYI ☕\nGarama-garam. Bilkul sahi.');
        break;
      case 'cold_drink':
        setInteractionMsg('Thandi bottle, raat ka safar.');
        break;
      case 'biscuit':
        setInteractionMsg('Safar mein kuch meetha.');
        break;
      case 'radio':
        setInteractionMsg('Nostalgic melodies playing softly...');
        break;
    }
    setTimeout(() => {
      if (timeLeft > 3) setInteractionMsg('');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const simulatedSeconds = seconds * 10;
    const m = Math.floor(simulatedSeconds / 60);
    const s = simulatedSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 pointer-events-auto flex flex-col justify-end md:justify-center items-center bg-black/40 backdrop-blur-sm pb-24 md:pb-0"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#3a1d04]/60 via-transparent to-black/30 pointer-events-none mix-blend-overlay" />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-full max-w-sm bg-[#110a05]/90 border border-amber-500/20 rounded-t-xl md:rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.1)] p-6 relative overflow-hidden backdrop-blur-md"
      >
        {/* Tungsten Light Effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-amber-500/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-500 tracking-widest uppercase flex items-center gap-2" style={{ fontFamily: '"Eczar", serif' }}>
              <Coffee className="w-5 h-5" />
              CHAI BREAK
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-mono mt-1">
              Roadside stop ahead.
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-amber-500/70 uppercase tracking-widest font-mono mb-1">HALT</span>
            <span className="text-lg font-mono text-white/90 font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Interaction Message */}
        <AnimatePresence mode="wait">
          {interactionMsg ? (
            <motion.div 
              key="msg"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-[48px] flex items-center justify-center text-center p-3 mb-6 bg-amber-500/10 border border-amber-500/20 rounded text-amber-200/90 text-xs tracking-wider whitespace-pre-line leading-relaxed"
            >
              {interactionMsg}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              className="min-h-[48px] mb-6 flex items-center justify-center opacity-40 text-[10px] uppercase tracking-widest text-white/50"
            >
              <span className="animate-pulse">Driver saab, ek cutting...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => handleInteraction('chai')}
            className="flex flex-col items-center p-4 bg-black/40 border border-white/5 rounded-lg hover:bg-white/5 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-xl mb-2 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all">🫖</span>
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono">CHAI</span>
            <span className="text-[8px] text-amber-500/50 uppercase tracking-widest font-mono mt-1">₹20</span>
          </button>
          
          <button 
            onClick={() => handleInteraction('cold_drink')}
            className="flex flex-col items-center p-4 bg-black/40 border border-white/5 rounded-lg hover:bg-white/5 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-xl mb-2 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all">🥤</span>
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono text-center">COLD DRINK</span>
            <span className="text-[8px] text-amber-500/50 uppercase tracking-widest font-mono mt-1">₹40</span>
          </button>

          <button 
            onClick={() => handleInteraction('biscuit')}
            className="flex flex-col items-center p-4 bg-black/40 border border-white/5 rounded-lg hover:bg-white/5 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-xl mb-2 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all">🍪</span>
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono">BISCUIT</span>
            <span className="text-[8px] text-amber-500/50 uppercase tracking-widest font-mono mt-1">₹10</span>
          </button>

          <button 
            onClick={() => handleInteraction('radio')}
            className="flex flex-col items-center p-4 bg-black/40 border border-white/5 rounded-lg hover:bg-white/5 hover:border-amber-500/30 transition-all group"
          >
            <Radio className="w-7 h-7 mb-2 text-white/40 group-hover:text-white/80 transition-colors" />
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono">OLD RADIO</span>
            <span className="text-[8px] text-amber-500/50 uppercase tracking-widest font-mono mt-1">Listen</span>
          </button>
        </div>

        {/* Actions */}
        <button 
          onClick={() => setIsChaiBreak(false)}
          className="w-full py-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors rounded"
        >
          [ BACK TO JOURNEY ]
        </button>
      </motion.div>
    </motion.div>
  );
}
