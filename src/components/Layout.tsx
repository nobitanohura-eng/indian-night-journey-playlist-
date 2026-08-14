import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useJourney } from '../store/JourneyContext';

import { WindowView } from './views/WindowView';
import { DriverView } from './views/DriverView';
import { LastSeatView } from './views/LastSeatView';
import { HUD } from './ui/HUD';
import { AudioEngine } from './AudioEngine';
import { ChaiBreakOverlay } from './ui/ChaiBreakOverlay';
import { KeyboardShortcutsModal } from './ui/KeyboardShortcutsModal';

export function Layout() {
  const { view, isChaiBreak } = useJourney();

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black selection:bg-amber-500/30 font-sans">
      
      {/* Background/Base Experience Layer - crossfade */}
      <AnimatePresence>
        {view === 'WINDOW' && <WindowView key="window" />}
        {view === 'DRIVER' && <DriverView key="driver" />}
        {view === 'LAST_SEAT' && <LastSeatView key="last_seat" />}
      </AnimatePresence>
      
      {/* UI Overlay Layer */}
      <HUD />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal />
      
      <AudioEngine />
      <AnimatePresence>
        {isChaiBreak && <ChaiBreakOverlay />}
      </AnimatePresence>
    </main>
  );
}
