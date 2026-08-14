import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, Share } from 'lucide-react';
import { useJourney } from '../../store/JourneyContext';

export function PwaInstallPrompt() {
  const { isZenMode } = useJourney();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Check if already running inside installed PWA Standalone Mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // 2. Check localStorage for completed installation
    const isInstalled = localStorage.getItem('inj_pwa_installed') === 'true';

    // 3. Check dismissal state
    const dismissed = localStorage.getItem('inj_pwa_dismissed');
    const isRecentlyDismissed = dismissed && Date.now() - parseInt(dismissed) < 86400000 * 3;

    if (isStandalone || isInstalled || isRecentlyDismissed) {
      return; // Do NOT show install suggestion to installed app users!
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIos(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      localStorage.setItem('inj_pwa_installed', 'true');
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt after 8 seconds of engagement
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 8000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPwaPrompt || deferredPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          localStorage.setItem('inj_pwa_installed', 'true');
          setShowPrompt(false);
        }
      } catch (err) {
        console.log('PWA Install prompt error:', err);
      }
      (window as any).deferredPwaPrompt = null;
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIos) {
      alert('To install on iPhone/iPad:\n1. Tap the Share button in Safari 📤\n2. Scroll down & select "Add to Home Screen" 📲');
      setShowPrompt(false);
    } else {
      // Fallback
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('inj_pwa_dismissed', Date.now().toString());
  };

  if (isZenMode || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-[90] pointer-events-auto max-w-[320px] sm:max-w-[360px] bg-black/90 backdrop-blur-2xl border border-amber-500/50 p-3 sm:p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 select-none"
      >
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/app-icon.svg" 
              alt="Night Journey App Icon" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-amber-500/50 shadow-md shrink-0 object-cover" 
            />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-white/95 uppercase tracking-wider">
                INSTALL NIGHT JOURNEY APP
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-mono text-amber-400/90">
                1-Tap Add to Home Screen
              </span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss app install suggestion"
            className="text-white/40 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[9.5px] sm:text-[10.5px] text-white/75 font-sans leading-relaxed">
          {isIos 
            ? 'Get full-screen app experience on your iPhone. Tap Share 📤 ➔ Add to Home Screen.' 
            : 'Enjoy zero-address bar full screen app experience directly from your phone home screen!'}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-[9.5px] sm:text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all"
          >
            {isIos ? <Share className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isIos ? 'HOW TO INSTALL' : 'ADD TO HOME SCREEN'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white/70 font-mono text-[9.5px] sm:text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            LATER
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
