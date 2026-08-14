/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JourneyProvider, useJourney } from './store/JourneyContext';
import { SplashScreen } from './components/SplashScreen';
import { JourneySelection } from './components/screens/JourneySelection';
import { VirtualTicket } from './components/screens/VirtualTicket';
import { BoardingTransition } from './components/screens/BoardingTransition';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { appState } = useJourney();

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {appState === 'SPLASH' && <SplashScreen key="splash" />}
        {appState === 'SELECTION' && <JourneySelection key="selection" />}
        {appState === 'TICKET' && <VirtualTicket key="ticket" />}
        {appState === 'BOARDING' && <BoardingTransition key="boarding" />}
        {appState === 'JOURNEY' && <Layout key="journey" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <JourneyProvider>
      <AppContent />
    </JourneyProvider>
  );
}
