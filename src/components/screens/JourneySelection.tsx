import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../../store/JourneyContext';
import { JOURNEY_DATA, Region, City, Terminal, Destination } from '../../constants/journeyData';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

type Step = 'REGION' | 'CITY' | 'TERMINAL' | 'DESTINATION' | 'SUMMARY';

export function JourneySelection() {
  const { setActiveRoute, generateTicket, setAppState, routes } = useJourney();

  const [step, setStep] = useState<Step>('REGION');
  
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Generate deterministic details on SUMMARY step
  const summaryDetails = useMemo(() => {
    if (step !== 'SUMMARY' || !selectedCity || !selectedDestination) return null;

    const predefined = routes.find(r => 
      r.from.toLowerCase() === selectedCity.name.toLowerCase() && 
      r.to.toLowerCase() === selectedDestination.name.toLowerCase()
    );

    if (predefined) {
      return {
        type: predefined.type || 'NIGHT SERVICE',
        departure: predefined.departureTime,
        arrival: '--:--', 
        duration: predefined.duration,
        fare: '₹' + (Math.floor(Math.random() * 2 + 1) * 150).toString(),
        highway: predefined.highway || 'INJ-BR-XX'
      };
    }

    return {
      type: Math.random() > 0.5 ? 'DELUXE NIGHT BUS' : 'EXPRESS SLEEPER',
      departure: '11:45 PM',
      arrival: '03:10 AM',
      duration: '3h 25m',
      fare: '₹' + (Math.floor(Math.random() * 5 + 4) * 99).toString(),
      highway: 'NH ' + Math.floor(Math.random() * 90 + 10).toString()
    };
  }, [step, selectedCity, selectedDestination, routes]);

  const handleBack = () => {
    if (step === 'CITY') setStep('REGION');
    if (step === 'TERMINAL') setStep('CITY');
    if (step === 'DESTINATION') setStep('TERMINAL');
    if (step === 'SUMMARY') setStep('DESTINATION');
  };

  const handleGetTicket = () => {
    if (!selectedCity || !selectedTerminal || !selectedDestination || !summaryDetails) return;
    
    const predefined = routes.find(r => 
      r.from.toLowerCase() === selectedCity.name.toLowerCase() && 
      r.to.toLowerCase() === selectedDestination.name.toLowerCase()
    );

    // Create temporary route
    const customRoute = {
      id: predefined ? predefined.id : Math.random().toString(),
      from: selectedCity.name,
      to: selectedDestination.name,
      highway: summaryDetails.highway,
      departureTime: summaryDetails.departure,
      duration: summaryDetails.duration,
      nextStop: predefined ? predefined.nextStop : selectedDestination.name,
      fare: summaryDetails.fare,
      type: summaryDetails.type
    };
    
    setActiveRoute(customRoute);
    generateTicket(customRoute);
    setAppState('TICKET');
  };

  const handleQuickBoard = (route: typeof routes[0]) => {
    setActiveRoute(route);
    generateTicket(route);
    setAppState('TICKET');
  };

  const renderProgress = () => {
    const steps = ['REGION', 'CITY', 'TERMINAL', 'DESTINATION', 'SUMMARY'];
    const currentIndex = steps.indexOf(step);
    
    return (
      <div className="absolute top-4 sm:top-8 landscape:top-3 left-0 right-0 z-20 flex justify-center pointer-events-none px-4">
        <div className="flex items-center space-x-2 md:space-x-4 max-w-2xl w-full">
          {steps.map((s, idx) => (
            <React.Fragment key={s}>
              <div className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${idx <= currentIndex ? 'text-amber-500/90' : 'text-white/20'}`}>
                0{idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-amber-500/50 w-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: idx < currentIndex ? '0%' : '-100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-[#070707] flex flex-col p-3 sm:p-4 md:p-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto"
    >
      <div className="fixed inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: "url('/splash-bg.png')" }} />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(5,5,5,1)_100%)] pointer-events-none" />
      
      {renderProgress()}

      {step !== 'REGION' && (
        <button 
          onClick={handleBack}
          className="fixed top-4 sm:top-8 landscape:top-3 left-3 sm:left-4 md:left-8 z-30 flex items-center space-x-1.5 sm:space-x-2 text-white/50 hover:text-white transition-colors bg-black/40 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs tracking-widest uppercase">Back</span>
        </button>
      )}
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center pt-14 sm:pt-24 landscape:pt-10 pb-8 sm:pb-12 landscape:pb-4 min-h-full">
        
        <AnimatePresence mode="wait">
          {step === 'REGION' && (
            <motion.div 
              key="REGION"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full flex flex-col items-center"
            >
              <h1 className="text-2xl sm:text-3xl md:text-5xl landscape:text-2xl text-[#e4dbcb] text-center mb-1.5 sm:mb-2 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
                अपनी रात की मंज़िल चुनिए
              </h1>
              <p className="text-white/40 text-xs sm:text-sm tracking-[0.2em] uppercase text-center mb-4 sm:mb-8 landscape:mb-3">
                Choose where the road takes you tonight
              </p>

              {/* Express 1-Click Boarding */}
              <div className="w-full max-w-4xl mb-4 sm:mb-8 landscape:mb-3 p-3 sm:p-4 landscape:p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center gap-1.5">
                    ⚡ DIRECT EXPRESS (POPULAR HIGHWAYS • 1-TAP START)
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-white/50 font-mono">INSTANT ENTRY</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 landscape:grid-cols-2 sm:landscape:grid-cols-4 gap-2 sm:gap-2.5">
                  {routes.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleQuickBoard(r)}
                      className="p-2.5 sm:p-3 bg-black/70 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/60 rounded-lg text-left transition-all duration-150 active:scale-95 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-amber-400/80 mb-0.5">
                          <span className="truncate">{r.type || 'EXPRESS'}</span>
                          <span>{r.departureTime}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {r.from} &rarr; {r.to}
                        </div>
                      </div>
                      <div className="text-[8.5px] text-white/50 font-mono mt-1 truncate">
                        {r.highway}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.2em] mb-2 sm:mb-4 landscape:mb-2">
                OR EXPLORE BY REGION
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 landscape:grid-cols-2 sm:landscape:grid-cols-4 gap-2.5 sm:gap-4 w-full">
                {Object.values(JOURNEY_DATA).map(region => (
                  <button
                    key={region.id}
                    onClick={() => { setSelectedRegion(region); setStep('CITY'); }}
                    className="p-4 sm:p-6 md:p-8 landscape:p-3 bg-black/40 border border-white/10 hover:border-amber-500/40 rounded-lg backdrop-blur-sm transition-all duration-150 active:scale-95 group flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-base sm:text-lg md:text-xl landscape:text-base tracking-widest text-white/80 group-hover:text-amber-500 transition-colors" style={{ fontFamily: '"Eczar", serif' }}>
                      {region.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'CITY' && selectedRegion && (
            <motion.div 
              key="CITY"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center max-w-3xl"
            >
              <p className="text-amber-500/70 text-xs tracking-[0.2em] uppercase mb-2">{selectedRegion.name}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl landscape:text-2xl text-[#e4dbcb] text-center mb-6 sm:mb-10 landscape:mb-4 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
                Select City
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 landscape:grid-cols-2 gap-3 sm:gap-4 w-full">
                {selectedRegion.cities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => { setSelectedCity(city); setStep('TERMINAL'); }}
                    className="p-4 sm:p-6 landscape:p-3 bg-black/40 border border-white/10 hover:border-white/30 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group"
                  >
                    <span className="text-lg sm:text-xl tracking-wider text-white/90" style={{ fontFamily: '"Eczar", serif' }}>
                      {city.name}
                    </span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'TERMINAL' && selectedCity && (
            <motion.div 
              key="TERMINAL"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center max-w-3xl"
            >
              <p className="text-amber-500/70 text-xs tracking-[0.2em] uppercase mb-2">{selectedCity.name}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl landscape:text-2xl text-[#e4dbcb] text-center mb-6 sm:mb-10 landscape:mb-4 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
                Select Boarding Point
              </h1>
              <div className="flex flex-col gap-2.5 sm:gap-4 w-full">
                {selectedCity.terminals.map(terminal => (
                  <button
                    key={terminal.id}
                    onClick={() => { setSelectedTerminal(terminal); setStep('DESTINATION'); }}
                    className="p-4 sm:p-6 landscape:p-3 bg-black/40 border border-white/10 hover:border-white/30 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group text-left"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/50" />
                      <span className="text-base sm:text-lg md:text-xl tracking-wider text-white/90 font-medium">
                        {terminal.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'DESTINATION' && selectedTerminal && (
            <motion.div 
              key="DESTINATION"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center max-w-3xl"
            >
              <div className="flex flex-col items-center text-center mb-4 sm:mb-8 landscape:mb-2">
                <span className="text-white/40 text-xs tracking-[0.2em] uppercase mb-1">From</span>
                <span className="text-lg sm:text-xl text-white/80" style={{ fontFamily: '"Eczar", serif' }}>{selectedTerminal.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl landscape:text-2xl text-[#e4dbcb] text-center mb-6 sm:mb-10 landscape:mb-4 tracking-wider" style={{ fontFamily: '"Yatra One", system-ui' }}>
                Where to?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 landscape:grid-cols-2 gap-3 sm:gap-4 w-full">
                {selectedTerminal.destinations.map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => { setSelectedDestination(dest); setStep('SUMMARY'); }}
                    className="p-4 sm:p-6 landscape:p-3 bg-black/40 border border-white/10 hover:border-amber-500/40 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group"
                  >
                    <span className="text-lg sm:text-xl tracking-wider text-white/90" style={{ fontFamily: '"Eczar", serif' }}>
                      {dest.name}
                    </span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/20 group-hover:text-amber-500/80 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'SUMMARY' && selectedCity && selectedTerminal && selectedDestination && summaryDetails && (
            <motion.div 
              key="SUMMARY"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center max-w-2xl"
            >
              <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-10 landscape:p-4 mb-4 sm:mb-8 landscape:mb-3 relative overflow-hidden shadow-2xl">
                {/* Subtle glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <div className="text-center mb-4 sm:mb-8 landscape:mb-2">
                  <p className="text-amber-500/80 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-1">{summaryDetails.type}</p>
                </div>
                
                {/* Route visualization */}
                <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 mb-4 sm:mb-8 landscape:mb-3">
                  <div className="flex-1 text-left sm:text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">From</p>
                    <p className="text-xl sm:text-2xl md:text-3xl text-white mb-0.5" style={{ fontFamily: '"Eczar", serif' }}>{selectedCity.name.toUpperCase()}</p>
                    <p className="text-xs text-white/60 truncate">{selectedTerminal.name}</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center px-2 shrink-0">
                    <div className="text-[9px] sm:text-xs text-white/40 tracking-widest uppercase mb-1">{summaryDetails.duration}</div>
                    <div className="w-12 sm:w-16 h-[1px] bg-white/20 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right sm:text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">To</p>
                    <p className="text-xl sm:text-2xl md:text-3xl text-white mb-0.5" style={{ fontFamily: '"Eczar", serif' }}>{selectedDestination.name.toUpperCase()}</p>
                    <p className="text-xs text-white/60 truncate">Bus Stand</p>
                  </div>
                </div>
                
                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 border-t border-white/10 pt-3 sm:pt-6 landscape:pt-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Departure</p>
                    <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide">{summaryDetails.departure}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Arrival</p>
                    <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide">{summaryDetails.arrival}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Seat</p>
                    <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide">Auto</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Fare</p>
                    <p className="text-sm sm:text-base md:text-lg font-medium text-amber-500 tracking-wide">{summaryDetails.fare}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleGetTicket}
                className="group relative px-6 sm:px-8 py-2.5 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-all duration-150 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <span className="text-xs sm:text-sm tracking-[0.2em] uppercase">GET MY TICKET 🎟️</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
