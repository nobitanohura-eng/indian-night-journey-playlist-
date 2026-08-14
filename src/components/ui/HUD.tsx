import React, { useState, useEffect } from 'react';
import { useJourney } from '../../store/JourneyContext';
import { CloudRain, Moon, Info, Eye, EyeOff, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode } from '../../types';
import { MusicPlayer } from '../MusicPlayer';
import { CreatorCredit } from './CreatorCredit';
import { JourneyProgress } from './JourneyProgress';

export function HUD() {
  const { 
    ticket, 
    view, 
    setView, 
    isRainy, 
    toggleRain,
    isZenMode, 
    setIsZenMode,
    setShowShortcutsModal 
  } = useJourney();
  const [time, setTime] = useState('');
  const [showRouteInfo, setShowRouteInfo] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!ticket) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between pt-[max(0.4rem,env(safe-area-inset-top))] pb-[max(0.4rem,env(safe-area-inset-bottom))] px-[max(0.4rem,env(safe-area-inset-left))] pr-[max(0.4rem,env(safe-area-inset-right))] overflow-hidden select-none">
      
      {/* TOP REGION: Minimalist Glass Top Bar */}
      <motion.div 
        animate={{ opacity: isZenMode ? 0 : 1, y: isZenMode ? -20 : 0 }}
        transition={{ duration: 0.25 }}
        className={`flex flex-col gap-1 w-full p-1 sm:p-2.5 pointer-events-none shrink-0 relative ${isZenMode ? 'pointer-events-none' : ''}`}
      >
        
        {/* Top Header Single Line Flex Row */}
        <div className="flex justify-between items-center w-full gap-1.5">
          
          {/* Top Left: Ultra-Compact Route Pill & Info */}
          <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto min-w-0 shrink-0">
            {/* Route Pill */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/60 backdrop-blur-md border border-white/15 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[9px] sm:text-xs font-bold text-white/95 tracking-wide truncate max-w-[80px] sm:max-w-[160px] md:max-w-[200px]" style={{ fontFamily: '"Eczar", serif' }}>
                {ticket.route.from} &rarr; {ticket.route.to}
              </span>
            </div>

            {/* Info Trigger Pill */}
            <button 
              aria-label="Route Information"
              onClick={() => setShowRouteInfo(!showRouteInfo)} 
              className="p-1 sm:px-2 sm:py-1 text-[8.5px] sm:text-[9px] font-mono uppercase tracking-wider text-white/70 hover:text-white bg-black/60 backdrop-blur-md border border-white/15 rounded-full transition-colors flex items-center gap-1 shrink-0 active:scale-95"
              title="Route Details"
            >
              <Info className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">INFO</span>
            </button>
            
            {/* Weather Ambiance Toggle */}
            {view === 'WINDOW' && (
              <div className="flex items-center bg-black/60 backdrop-blur-md border border-white/15 p-0.5 rounded-full shrink-0">
                <button
                  aria-label="Toggle Weather Ambiance (Key: R)"
                  onClick={toggleRain}
                  className={`p-1 rounded-full transition-all flex items-center gap-1 active:scale-95 ${isRainy ? 'bg-cyan-500/30 text-cyan-300' : 'bg-amber-500/30 text-amber-300'}`}
                  title="Toggle Monsoon Rain / Clear Sky [Key: R]"
                >
                  {isRainy ? <CloudRain className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  <span className="text-[7.5px] font-mono pr-0.5 hidden lg:inline text-white/60">[R]</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop & Landscape Center: Journey Progress Bar */}
          <div className="hidden md:flex pointer-events-auto shrink min-w-0 justify-center">
            <JourneyProgress />
          </div>

          {/* Top Right: Clock, Shortcuts, Creator, Zen */}
          <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
            {/* Clock */}
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 backdrop-blur-md border border-white/15 rounded-full flex items-center shadow-lg">
              <span className="text-[9px] sm:text-xs font-mono font-bold text-white/90">
                {time}
              </span>
            </div>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              aria-label="Keyboard Shortcuts (Key: K or ?)"
              className="p-1 sm:px-2 sm:py-1 rounded-full backdrop-blur-md border bg-black/50 text-amber-400/90 hover:text-amber-300 border-amber-500/30 hover:border-amber-500/60 transition-all flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono uppercase tracking-wider active:scale-95"
              title="Keyboard Shortcuts [Key: K or ?]"
            >
              <Keyboard className="w-3 h-3" />
              <span className="hidden lg:inline font-bold">KEYS</span>
            </button>

            {/* Creator Badge */}
            <CreatorCredit />

            {/* ZEN TOGGLE BUTTON */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              aria-label={isZenMode ? "Show Controls" : "Hide Controls for Full Scene Immersion (Key: Z)"}
              className="p-1 sm:px-2 sm:py-1 rounded-full backdrop-blur-md border bg-black/50 text-white/60 hover:text-white border-white/15 hover:border-white/30 transition-all flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono uppercase tracking-wider active:scale-95"
              title="Zen Mode [Key: Z]"
            >
              <EyeOff className="w-3 h-3" />
              <span className="hidden lg:inline">ZEN</span>
            </button>
          </div>

        </div>

        {/* Mobile Portrait Sub-Row: Centered Journey Progress */}
        <div className="flex md:hidden justify-center w-full pointer-events-auto pt-0.5">
          <JourneyProgress />
        </div>

        {/* Route Info Dropdown Modal */}
        <AnimatePresence>
          {showRouteInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-black/95 backdrop-blur-2xl border border-amber-500/40 p-3 sm:p-3.5 rounded-2xl w-[calc(100vw-24px)] max-w-[260px] shadow-2xl mt-1 absolute top-[40px] sm:top-[46px] left-2 z-50 pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">ROUTE SPECS</span>
                <button onClick={() => setShowRouteInfo(false)} className="text-[10px] text-white/40 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-left">
                <div>
                  <span className="text-[7.5px] uppercase tracking-widest text-amber-400/90 block">ORIGIN</span>
                  <span className="text-[10px] font-bold text-white/90 truncate block">{ticket.route.from}</span>
                </div>
                <div>
                  <span className="text-[7.5px] uppercase tracking-widest text-amber-400/90 block">DESTINATION</span>
                  <span className="text-[10px] font-bold text-white/90 truncate block">{ticket.route.to}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[7.5px] uppercase tracking-widest text-amber-400/90 block">HIGHWAY ROUTE</span>
                  <span className="text-[10px] text-white/80 truncate block">{ticket.route.highway || 'NH EXPRESS'}</span>
                </div>
                <div>
                  <span className="text-[7.5px] uppercase tracking-widest text-amber-400/90 block">DEPARTURE</span>
                  <span className="text-[10px] font-mono text-white/80">{ticket.boardingTime}</span>
                </div>
                <div>
                  <span className="text-[7.5px] uppercase tracking-widest text-amber-400/90 block">NEXT STOP</span>
                  <span className="text-[10px] text-white/80 truncate block">{ticket.route.nextStop}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ZEN MODE REVEAL BUTTON (When HUD is hidden in Zen Mode) */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 right-2 z-50 pointer-events-auto"
          >
            <button
              onClick={() => setIsZenMode(false)}
              aria-label="Exit Zen Mode and Show HUD Controls (Key: Z)"
              className="px-3 py-1.5 rounded-full backdrop-blur-xl bg-amber-500 text-black border border-amber-400 font-mono font-bold text-[9px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SHOW CONTROLS</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM REGION: Responsive Non-Overlapping Dock */}
      <motion.div 
        animate={{ opacity: isZenMode ? 0 : 1, y: isZenMode ? 30 : 0 }}
        transition={{ duration: 0.25 }}
        className={`w-full p-1 sm:p-2.5 md:p-3 pointer-events-none flex flex-col sm:flex-row landscape:flex-row items-center justify-between gap-1.5 sm:gap-2 shrink-0 ${isZenMode ? 'pointer-events-none' : ''}`}
      >
        
        {/* Bottom Left / Center: Sleek Cassette Player Pill */}
        <div className="w-full sm:w-auto landscape:w-auto flex justify-center sm:justify-start landscape:justify-start pointer-events-auto">
          <MusicPlayer />
        </div>

        {/* Bottom Right / Center: View Switcher Capsule */}
        <div className="pointer-events-auto flex items-center justify-center gap-0.5 bg-black/60 hover:bg-black/80 backdrop-blur-xl p-0.5 sm:p-1 rounded-full border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shrink-0">
          {[
            { id: 'WINDOW' as ViewMode, icon: '🪟', label: 'WINDOW', fullLabel: 'WINDOW SEAT', keyHint: '1' },
            { id: 'DRIVER' as ViewMode, icon: '🛞', label: 'DRIVER', fullLabel: 'DRIVER CABIN', keyHint: '2' },
            { id: 'LAST_SEAT' as ViewMode, icon: '🚌', label: 'LAST SEAT', fullLabel: 'LAST SEAT', keyHint: '3' }
          ].map(v => (
            <button
              key={v.id}
              aria-label={`Switch to ${v.fullLabel} (Key: ${v.keyHint})`}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center space-x-1 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-150 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold active:scale-95 ${
                view === v.id 
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-100' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[11px] sm:text-xs">{v.icon}</span>
              <span className="uppercase tracking-wider whitespace-nowrap">
                <span className="inline md:hidden">{v.label}</span>
                <span className="hidden md:inline">{v.fullLabel}</span>
              </span>
              <kbd className={`text-[7.5px] px-1 py-0.2 rounded border hidden lg:inline ${view === v.id ? 'bg-black/20 border-black/30 text-black' : 'bg-white/10 border-white/20 text-white/40'}`}>
                {v.keyHint}
              </kbd>
            </button>
          ))}
        </div>

      </motion.div>

    </div>
  );
}
