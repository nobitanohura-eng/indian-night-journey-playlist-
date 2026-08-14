import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { MapPin, Navigation, Coffee, Clock } from 'lucide-react';

export function JourneyProgress() {
  const { ticket } = useJourney();
  const [progressPercent, setProgressPercent] = useState(28);
  const [showMilestones, setShowMilestones] = useState(false);

  // Smoothly increment simulated progress over time
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPercent(prev => (prev < 96 ? prev + 0.4 : prev));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (!ticket) return null;

  // Derive estimated numbers from route duration
  const totalKm = 540;
  const coveredKm = Math.round((progressPercent / 100) * totalKm);
  const remainingKm = totalKm - coveredKm;

  return (
    <div className="relative pointer-events-auto flex flex-col items-center">
      {/* Top Main Progress Bar Capsule */}
      <button
        onClick={() => setShowMilestones(!showMilestones)}
        aria-label="Toggle Route Journey Progress Details"
        className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 hover:border-amber-500/40 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all select-none max-w-[92vw] sm:max-w-md"
      >
        {/* Origin Label */}
        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400/90 uppercase truncate max-w-[65px] sm:max-w-[80px]">
          {ticket.route.from}
        </span>

        {/* Progress Track with Bus Indicator */}
        <div className="relative w-24 sm:w-36 h-1.5 bg-white/10 rounded-full overflow-visible flex items-center">
          {/* Covered Distance Active Gradient Bar */}
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Glowing Bus Icon positioned along track */}
          <motion.div
            animate={{ y: [-0.5, 0.5, -0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -ml-2.5 flex flex-col items-center pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            <span className="text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">🚌</span>
          </motion.div>

          {/* Midway Dhaba Icon */}
          <div className="absolute left-[50%] -top-1.5 -ml-1 text-[8px] opacity-40 group-hover:opacity-80 transition-opacity">
            ☕
          </div>
        </div>

        {/* Destination Label */}
        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/90 uppercase truncate max-w-[65px] sm:max-w-[80px]">
          {ticket.route.to}
        </span>

        {/* Percentage / Distance Covered Pill */}
        <div className="flex items-center gap-1 pl-1 border-l border-white/10 text-[8px] sm:text-[9px] font-mono text-amber-400/90 shrink-0">
          <span className="font-bold">{Math.round(progressPercent)}%</span>
          <span className="text-white/40 hidden md:inline">({coveredKm} km)</span>
        </div>
      </button>

      {/* Expandable Route Milestones Card */}
      <AnimatePresence>
        {showMilestones && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-10 sm:top-11 z-50 w-72 sm:w-80 bg-black/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5 text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/90 font-bold">
                  JOURNEY PROGRESS
                </span>
              </div>
              <button
                onClick={() => setShowMilestones(false)}
                className="text-xs text-white/40 hover:text-white px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Distance Summary Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-2 rounded-xl border border-white/10 text-center font-mono">
              <div>
                <span className="text-[7.5px] uppercase tracking-widest text-white/40 block">COVERED</span>
                <span className="text-xs font-bold text-amber-400">{coveredKm} KM</span>
              </div>
              <div>
                <span className="text-[7.5px] uppercase tracking-widest text-white/40 block">PROGRESS</span>
                <span className="text-xs font-bold text-white">{Math.round(progressPercent)}%</span>
              </div>
              <div>
                <span className="text-[7.5px] uppercase tracking-widest text-white/40 block">REMAINING</span>
                <span className="text-xs font-bold text-white/80">{remainingKm} KM</span>
              </div>
            </div>

            {/* Interactive Timeline Milestones */}
            <div className="flex flex-col gap-2 relative pl-3 border-l-2 border-dashed border-amber-500/30 my-1 font-mono">
              
              {/* Origin */}
              <div className="relative">
                <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white font-bold">{ticket.route.from}</span>
                  <span className="text-white/40">DEPARTED {ticket.boardingTime}</span>
                </div>
              </div>

              {/* Current Position / Live Status */}
              <div className="relative bg-amber-500/10 -ml-2 p-1.5 rounded-lg border border-amber-500/30">
                <span className="absolute -left-[15px] top-2.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute -left-[15px] top-2.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                <div className="flex justify-between items-center text-[9.5px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>BUS EN ROUTE</span>
                    <span className="text-[8px] font-normal text-white/60">• NH 44</span>
                  </span>
                  <span className="text-amber-300 font-bold">{Math.round(progressPercent)}% DONE</span>
                </div>
              </div>

              {/* Next Midway Dhaba Stop */}
              <div className="relative">
                <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-400/50" />
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white/80 flex items-center gap-1">
                    <Coffee className="w-2.5 h-2.5 text-amber-400" />
                    <span>{ticket.route.nextStop || 'MIDWAY DHABA'}</span>
                  </span>
                  <span className="text-amber-400/80 font-bold">~45 KM AWAY</span>
                </div>
              </div>

              {/* Destination */}
              <div className="relative">
                <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-red-400/60" />
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white/60">{ticket.route.to}</span>
                  <span className="text-white/40">EST. {ticket.route.duration}</span>
                </div>
              </div>

            </div>

            <div className="text-[8px] text-white/40 font-mono text-center pt-1 border-t border-white/5">
              Tap anywhere outside to close timeline
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
