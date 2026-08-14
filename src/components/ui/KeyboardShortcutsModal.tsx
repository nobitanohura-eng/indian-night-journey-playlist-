import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { Keyboard, X, Sparkles } from 'lucide-react';

interface ShortcutItem {
  keyLabel: string;
  action: string;
  category: 'MUSIC' | 'BUS CONTROLS' | 'VIEW & AMBIANCE';
  icon: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { keyLabel: 'SPACE', action: 'Play / Pause 90s Cassette Song', category: 'MUSIC', icon: '⏯' },
  { keyLabel: '→ (Right Arrow)', action: 'Next Song in Cassette', category: 'MUSIC', icon: '⏭' },
  { keyLabel: '← (Left Arrow)', action: 'Previous Song in Cassette', category: 'MUSIC', icon: '⏮' },
  
  { keyLabel: 'H', action: 'Blow Highway Air Horn (Horn OK Please)', category: 'BUS CONTROLS', icon: '🔊' },
  { keyLabel: 'D', action: 'Flash High Beam (Dipper)', category: 'BUS CONTROLS', icon: '⚡' },
  
  { keyLabel: 'R', action: 'Toggle Monsoon Rain / Clear Sky', category: 'VIEW & AMBIANCE', icon: '🌧' },
  { keyLabel: 'W', action: 'Slide Open / Close Window Glass', category: 'VIEW & AMBIANCE', icon: '💨' },
  { keyLabel: '1', action: 'Switch to Window Seat View', category: 'VIEW & AMBIANCE', icon: '🪟' },
  { keyLabel: '2', action: 'Switch to Driver Cabin View', category: 'VIEW & AMBIANCE', icon: '🛞' },
  { keyLabel: '3', action: 'Switch to Last Seat View', category: 'VIEW & AMBIANCE', icon: '🚌' },
  { keyLabel: 'Z', action: 'Zen Mode (Hide / Show HUD)', category: 'VIEW & AMBIANCE', icon: '👁' },
  { keyLabel: 'K or ?', action: 'Toggle this Shortcuts Guide', category: 'VIEW & AMBIANCE', icon: '⌨️' },
];

export function KeyboardShortcutsModal() {
  const { showShortcutsModal, setShowShortcutsModal } = useJourney();

  if (!showShortcutsModal) return null;

  const categories = ['MUSIC', 'BUS CONTROLS', 'VIEW & AMBIANCE'] as const;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={() => setShowShortcutsModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0e0c0a] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-white relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-400 font-mono tracking-wide">
                  KEYBOARD CONTROLS
                </h3>
                <p className="text-[10px] sm:text-xs text-white/50 font-mono">
                  Control your 90s Night Bus journey with your keyboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categorized Shortcuts */}
          <div className="flex flex-col gap-4">
            {categories.map(cat => {
              const items = SHORTCUTS.filter(s => s.category === cat);
              return (
                <div key={cat} className="flex flex-col gap-2">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-amber-400/80 px-1">
                    {cat}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="text-sm shrink-0">{item.icon}</span>
                          <span className="text-[11px] font-medium text-white/90 truncate">
                            {item.action}
                          </span>
                        </div>
                        <kbd className="px-2 py-1 bg-black/80 border border-amber-500/40 rounded-lg text-[10px] font-mono font-bold text-amber-300 shadow-inner shrink-0 whitespace-nowrap">
                          {item.keyLabel}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Press <kbd className="text-amber-300 font-bold">K</kbd> anytime to open/close
            </span>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold rounded-lg transition-all"
            >
              GOT IT
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function HotkeyToastNotification() {
  const { hotkeyToast } = useJourney();

  return (
    <AnimatePresence>
      {hotkeyToast && (
        <motion.div
          key={hotkeyToast.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[110] pointer-events-none"
        >
          <div className="px-4 py-2 bg-black/90 backdrop-blur-xl border-2 border-amber-500/60 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2.5">
            <span className="text-base sm:text-lg">{hotkeyToast.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider whitespace-nowrap">
                {hotkeyToast.label}
              </span>
              {hotkeyToast.sub && (
                <span className="text-[9px] font-mono text-white/50 truncate max-w-[180px]">
                  {hotkeyToast.sub}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
