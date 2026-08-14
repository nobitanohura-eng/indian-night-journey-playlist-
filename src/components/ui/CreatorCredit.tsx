import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Sparkles } from 'lucide-react';

export function CreatorCredit() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative pointer-events-auto flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Creator info - Who is driving?"
          className="group relative flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/50 hover:bg-black/80 border border-white/15 hover:border-amber-500/50 rounded-full backdrop-blur-md transition-all duration-200 shadow-md active:scale-95 text-white/90"
        >
          <span className="text-amber-400 text-[9px] sm:text-[10px] animate-pulse">
            ✦
          </span>
          <span 
            className="text-[10px] sm:text-[12px] text-[#e4dbcb] group-hover:text-amber-300 tracking-wider transition-colors whitespace-nowrap"
            style={{ fontFamily: '"Yatra One", system-ui' }}
          >
            <span className="inline sm:hidden">ड्राइवर</span>
            <span className="hidden sm:inline">ड्राइवर कौन है?</span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 landscape:p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-auto bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e0c09]/95 backdrop-blur-2xl border border-amber-500/40 p-4 sm:p-6 landscape:p-3.5 rounded-2xl shadow-2xl relative max-w-[320px] landscape:max-w-[320px] w-full text-center pointer-events-auto overflow-y-auto max-h-[85vh] landscape:max-h-[92vh] no-scrollbar"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-white/50 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <span className="text-base sm:text-xl text-amber-400 block drop-shadow-md" style={{ fontFamily: '"Yatra One", system-ui' }}>ड्राइवर कौन है?</span>
              <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.3em] text-white/40 mb-1 block">WHO'S DRIVING?</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-white uppercase mb-1" style={{ fontFamily: '"Eczar", serif' }}>
                AVINASH
              </h2>
              
              <div className="w-10 h-[1px] bg-amber-500/30 mb-2 mx-auto" />
              
              <span className="text-[8px] sm:text-[9px] tracking-widest text-amber-400/90 uppercase mb-2 block font-mono">
                CREATOR OF THIS EXPERIENCE
              </span>
              
              <p className="text-[11px] sm:text-xs italic text-white/70 mb-3.5 font-serif px-2 leading-relaxed">
                "Built with memories, music & late nights on Indian highways."
              </p>

              {/* Developer Contacts */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-left">
                <a 
                  href="mailto:avinashkr502080@gmail.com" 
                  className="flex items-center space-x-2 text-[10px] sm:text-xs text-white/70 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 font-mono truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">avinashkr502080@gmail.com</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
