import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { Share2, ArrowRight, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export function VirtualTicket() {
  const { ticket, setAppState, setIsPlaying, isSharedView, setIsSharedView } = useJourney();
  const [phase, setPhase] = useState<'READY' | 'DEPARTING'>('READY');
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0806',
        style: {
          transform: 'none',
          boxShadow: 'none'
        }
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Indian_Night_Journey_${ticket?.route.from}_to_${ticket?.route.to}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to download ticket', err);
      alert('Unable to save ticket. Please try again.');
    }
  };

  const handleEnterBus = () => {
    if (isSharedView) {
      window.history.replaceState({}, '', '/');
      setIsSharedView(false);
      setAppState('SPLASH');
      return;
    }
    setIsPlaying(true);
    setAppState('BOARDING');
  };

  const handleShare = async () => {
    if (!ticket || !ticketRef.current) return;

    const shareText = `🎫 My Bus Ticket: ${ticket.route.from} ➔ ${ticket.route.to}\nSleeper Seat: ${ticket.seat} | PNR: ${ticket.pnr}\nTake this 90s night bus journey with me:`;
    const shareUrl = `${window.location.origin}?shared=true&from=${encodeURIComponent(ticket.route.from)}&to=${encodeURIComponent(ticket.route.to)}&pnr=${ticket.pnr}&seat=${ticket.seat}`;

    try {
      // 1. Generate high-quality PNG image blob from ticket DOM
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0806'
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const imageFile = new File([blob], `Bus_Ticket_${ticket.pnr}.png`, { type: 'image/png' });

      // 2. Share Image + Link natively via Web Share API (WhatsApp/Instagram/Telegram)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          title: 'Indian Night Journey 🎟️',
          text: `${shareText}\n${shareUrl}`,
          files: [imageFile],
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'Indian Night Journey 🎟️',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch (err) {
      console.log('Image share fallback:', err);
    }

    // 3. Fallback: Direct WhatsApp Share
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(waUrl, '_blank');
  };

    const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${today.getFullYear()}`;

  if (!ticket) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-[#0a0806] flex items-center justify-center p-4 md:p-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] overflow-x-hidden overflow-y-auto font-sans"
    >
      {/* Background Atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)] pointer-events-none" />
      
      {phase === 'LOADING' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 border-t-2 border-amber-500 border-solid rounded-full animate-spin mb-4" />
          <p className="text-amber-500/80 text-[10px] tracking-[0.4em] uppercase text-center w-full">Printing Journey Pass</p>
        </motion.div>
      )}

      {/* Ticket Container */}
      <AnimatePresence>
        {(phase === 'REVEAL' || phase === 'READY') && (
          <motion.div 
            key="ticket-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative w-full min-h-full flex flex-col items-center justify-center z-10 py-4 sm:py-10 landscape:py-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-amber-500/90 text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] uppercase mb-2 sm:mb-6 landscape:mb-2 text-center drop-shadow-md"
            >
              TICKET CONFIRMED
            </motion.div>
            
            {/* The Ticket Itself */}
            <motion.div 
              ref={ticketRef as any}
              initial={{ y: 60, opacity: 0, rotateX: 15 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[320px] sm:max-w-[360px] landscape:max-w-[320px] bg-[#fdfaf3] text-[#2c241b] rounded shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col overflow-hidden"
              style={{ perspective: 1000 }}
            >
              {/* Paper Texture Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
              />

              {/* Light Sweep Effect */}
              {phase === 'REVEAL' && (
                <motion.div 
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '200%', opacity: 0.2 }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay z-20 pointer-events-none transform -skew-x-12 w-[150%]"
                />
              )}

              {/* TICKET TOP HEADER */}
              <div className="bg-[#8b2323] text-[#fdfaf3] px-4 py-2.5 sm:px-5 sm:py-4 landscape:py-2.5 text-center relative border-b-[3px] border-[#2c241b]">
                {/* Decorative borders */}
                <div className="absolute inset-1.5 sm:inset-2 border border-[#fdfaf3]/20 pointer-events-none" />
                <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase relative z-10" style={{ fontFamily: '"Eczar", serif' }}>
                  INDIAN NIGHT JOURNEY
                </h1>
                <p className="text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-[0.3em] font-mono opacity-80 mt-0.5 sm:mt-1 relative z-10">
                  NIGHT SERVICE • DIGITAL TICKET
                </p>
              </div>

              {/* MAIN ROUTE SECTION */}
              <div className="p-4 sm:p-6 md:p-8 landscape:p-3.5 flex flex-col items-center justify-center relative border-b-2 border-dashed border-[#2c241b]/20">
                {/* Fictional Background Stamp */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] opacity-[0.04] pointer-events-none">
                  <span className="text-4xl sm:text-5xl font-bold uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: '"Eczar", serif' }}>
                    VERIFIED
                  </span>
                </div>

                <div className="w-full flex items-center justify-between relative z-10">
                  <div className="flex flex-col items-start w-[42%] overflow-hidden">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-mono text-[#2c241b]/50 mb-0.5 sm:mb-1">FROM</span>
                    <span className="text-2xl sm:text-[28px] md:text-4xl font-bold text-[#8b2323] uppercase tracking-wider leading-none truncate w-full" style={{ fontFamily: '"Yatra One", system-ui' }} title={ticket.route.from}>
                      {ticket.route.from}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center w-[16%] text-[#2c241b]/30">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </div>

                  <div className="flex flex-col items-end w-[42%] text-right overflow-hidden">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-mono text-[#2c241b]/50 mb-0.5 sm:mb-1">TO</span>
                    <span className="text-2xl sm:text-[28px] md:text-4xl font-bold text-[#8b2323] uppercase tracking-wider leading-none truncate w-full" style={{ fontFamily: '"Yatra One", system-ui' }} title={ticket.route.to}>
                      {ticket.route.to}
                    </span>
                  </div>
                </div>
              </div>

              {/* TICKET DETAILS */}
              <div className="p-3.5 sm:p-5 md:p-6 pb-3 sm:pb-4 bg-[#f4ebd8]/50">
                <div className="grid grid-cols-2 gap-y-3 sm:gap-y-5 gap-x-4">
                  <div className="flex flex-col">
                    <span className="text-[7.5px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-mono text-[#2c241b]/50 mb-0.5">DATE</span>
                    <span className="text-xs sm:text-xs md:text-sm font-bold font-mono text-[#2c241b] tracking-wider">{formattedDate}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[7.5px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-mono text-[#2c241b]/50 mb-0.5">DEPARTURE</span>
                    <span className="text-xs sm:text-xs md:text-sm font-bold font-mono text-[#2c241b] tracking-wider">{ticket.boardingTime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-mono text-[#2c241b]/50 mb-0.5">SERVICE</span>
                    <span className="text-xs sm:text-xs md:text-sm font-bold font-mono text-[#2c241b] tracking-wider">
                      {ticket.route.distanceKm ? `${ticket.route.distanceKm} KM • NIGHT` : 'NIGHT EXPRESS'}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[7.5px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-mono text-[#2c241b]/50 mb-0.5">SEAT</span>
                    <span className="text-xs sm:text-sm md:text-base font-bold font-mono text-[#8b2323] tracking-wider">{ticket.seat}</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM PERFORATED SECTION */}
              <div className="relative border-t-[1.5px] border-dashed border-[#2c241b]/30 bg-[#fdfaf3] p-3.5 sm:p-5 pb-4 sm:pb-6">
                {/* Side Cutouts */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#0a0806] rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5)]" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#0a0806] rounded-full shadow-[inset_2px_-2px_4px_rgba(0,0,0,0.5)]" />
                
                <div className="flex justify-between items-center mt-0.5">
                  <div className="flex flex-col">
                    <span className="text-[7px] uppercase tracking-[0.2em] font-mono text-[#2c241b]/50 mb-0.5">TICKET NO.</span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#2c241b] tracking-widest">{ticket.pnr || 'INJ-284731'}</span>
                  </div>
                  
                  {/* Fictional Barcode */}
                  <div className="flex flex-col items-end opacity-70 mix-blend-multiply">
                    <div className="flex space-x-[2px] h-6 sm:h-8 items-end">
                      {[3,1,4,2,5,1,3,2,4,1,2,5,3,1,4,2,3,5].map((h, i) => (
                        <div key={i} className="bg-[#2c241b] w-[2px]" style={{ height: `${(h / 5) * 100}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-5 text-center">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.1em] text-[#8b2323] italic font-bold" style={{ fontFamily: '"Eczar", serif' }}>
                    "Safar abhi baaki hai."
                  </span>
                </div>
                
                {/* Tiny stamps */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-3 sm:left-4 border-[1.5px] border-[#2c241b]/30 rounded px-1 sm:px-1.5 py-0.5 rotate-[4deg] opacity-60 mix-blend-multiply">
                  <span className="text-[5.5px] sm:text-[6px] uppercase tracking-widest text-[#2c241b] font-bold">BOARDING PASS</span>
                </div>
                <div className="absolute top-2.5 sm:top-4 right-3 sm:right-4 border-[1.5px] border-[#8b2323]/50 rounded px-1 sm:px-1.5 py-0.5 rotate-[-5deg] opacity-70 mix-blend-multiply">
                  <span className="text-[5.5px] sm:text-[6px] uppercase tracking-widest text-[#8b2323] font-bold">NIGHT ROUTE</span>
                </div>
              </div>

              {/* Jagged Edge (Perforation at the very bottom) */}
              <div className="absolute bottom-0 left-0 right-0 h-2 w-full flex overflow-hidden">
                <div className="w-full h-2 bg-[#0a0806]" style={{
                  WebkitMaskImage: 'radial-gradient(circle at 4px 4px, transparent 4px, black 4.5px)',
                  WebkitMaskSize: '8px 8px',
                  WebkitMaskPosition: 'bottom', maskImage: 'radial-gradient(circle at 4px 4px, transparent 4px, black 4.5px)', maskSize: '8px 8px', maskPosition: 'bottom'
                }} />
              </div>
            </motion.div>

            {/* ACTION BUTTONS OUTSIDE THE TICKET */}
            {phase === 'READY' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 sm:mt-8 landscape:mt-3 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 z-20"
              >
                {!isSharedView && (
                  <div className="flex gap-2.5 sm:gap-4 w-full sm:w-auto">
                    <button
                      onClick={handleDownload}
                      className="flex-1 sm:flex-none items-center justify-center flex space-x-1.5 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#1a1412] text-white/90 border border-white/20 font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-white/10 transition-colors shadow-lg"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">SAVE</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 sm:flex-none items-center justify-center flex space-x-1.5 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#1a1412] text-white/90 border border-white/20 font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-white/10 transition-colors shadow-lg"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>SHARE</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleEnterBus}
                  className="flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 bg-amber-500 text-[#0a0806] font-bold font-mono rounded-lg tracking-[0.2em] uppercase text-[9px] sm:text-[10px] md:text-xs hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  {isSharedView ? 'TAKE THIS JOURNEY →' : 'BOARD THE BUS →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'DEPARTING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute inset-0 bg-[#0a0806] flex flex-col items-center justify-center z-50"
          >
            <p className="text-3xl md:text-5xl text-[#e4dbcb] text-center mb-4 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
              अपना सफ़र शुरू करते हैं
            </p>
            <p className="text-amber-500/80 text-xs tracking-[0.4em] uppercase text-center">
              YOUR NIGHT JOURNEY BEGINS
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
