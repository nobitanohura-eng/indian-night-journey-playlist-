import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Route, Ticket, ViewMode, Playlist } from '../types';
import { MUSIC_PLAYLISTS, HORN_TRACKS } from '../constants/audio';

export type AppState = 'SPLASH' | 'SELECTION' | 'TICKET' | 'BOARDING' | 'JOURNEY';

export const ROUTES: Route[] = [
  { id: 'delhi-manali', from: 'DELHI', to: 'MANALI', highway: 'NH 44 (Himalayan Rider)', departureTime: '21:30', duration: '12h 00m', nextStop: 'CHANDIGARH', type: 'VOLVO AC SLEEPER' },
  { id: 'mumbai-goa', from: 'MUMBAI', to: 'GOA', highway: 'NH 66 (Konkan Highway)', departureTime: '20:45', duration: '11h 30m', nextStop: 'CHIPLUN', type: 'DELUXE SLEEPER' },
  { id: 'bangalore-ooty', from: 'BANGALORE', to: 'OOTY', highway: 'NH 275 (Nilgiri Ghats)', departureTime: '22:15', duration: '07h 45m', nextStop: 'MYSORE', type: 'NIGHT EXPRESS' },
  { id: 'jaipur-jodhpur', from: 'JAIPUR', to: 'JODHPUR', highway: 'NH 48 (Marwar Highway)', departureTime: '22:00', duration: '06h 30m', nextStop: 'AJMER', type: 'ROYAL EXPRESS' },
  { id: 'kolkata-siliguri', from: 'KOLKATA', to: 'SILIGURI', highway: 'NH 12 (North Bengal)', departureTime: '21:00', duration: '11h 00m', nextStop: 'MALDA', type: 'EXPRESS SLEEPER' },
  { id: 'patna-ranchi', from: 'PATNA', to: 'RANCHI', highway: 'NH 20 (Chota Nagpur)', departureTime: '22:30', duration: '08h 15m', nextStop: 'HAZARIBAGH', type: 'DELUXE NIGHT BUS' },
  { id: 'chandigarh-shimla', from: 'CHANDIGARH', to: 'SHIMLA', highway: 'NH 5 (Himalayan Queen)', departureTime: '23:00', duration: '04h 00m', nextStop: 'KALKA', type: 'DELUXE EXPRESS' },
  { id: 'pune-mahabaleshwar', from: 'PUNE', to: 'MAHABALESHWAR', highway: 'NH 48 (Western Ghats)', departureTime: '23:15', duration: '03h 45m', nextStop: 'WAI', type: 'NIGHT SERVICE' }
];

interface HotkeyToast {
  id: number;
  label: string;
  sub?: string;
  icon: string;
}

interface JourneyState {
  appState: AppState;
  setAppState: (state: AppState) => void;
  
  routes: Route[];
  activeRoute: Route | null;
  setActiveRoute: (route: Route | null) => void;
  
  ticket: Ticket | null;
  generateTicket: (route: Route) => void;
  
  view: ViewMode;
  setView: (view: ViewMode) => void;
  
  isRainy: boolean;
  setIsRainy: (isRainy: boolean) => void;
  toggleRain: () => void;
  
  hornActive: boolean;
  selectedHornIndex: number;
  setSelectedHornIndex: React.Dispatch<React.SetStateAction<number>>;
  triggerHorn: (specificIndex?: number) => void;
  
  dipperActive: boolean;
  triggerDipper: () => void;
  
  passengers: number;
  
  // Audio & Music state
  isSharedView: boolean;
  setIsSharedView: (v: boolean) => void;
  
  isChaiBreak: boolean;
  setIsChaiBreak: (v: boolean) => void;

  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlay: () => void;
  
  activePlaylist: Playlist | null;
  setActivePlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  
  currentTrackIndex: number;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
  nextTrack: () => void;
  prevTrack: () => void;
  
  // Hotkey notification toast & shortcuts modal
  hotkeyToast: HotkeyToast | null;
  showShortcutsModal: boolean;
  setShowShortcutsModal: (show: boolean) => void;
  
  isZenMode: boolean;
  setIsZenMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleZenMode: () => void;
  
  ambientVolumes: {
    engine: number;
    rain: number;
    road: number;
    chatter: number;
  };
}

const JourneyContext = createContext<JourneyState | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>('SPLASH');
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  
  const [view, setView] = useState<ViewMode>('WINDOW');
  const [isRainy, setIsRainy] = useState(false);
  const [hornActive, setHornActive] = useState(false);
  const [selectedHornIndex, setSelectedHornIndex] = useState(0);
  const [dipperActive, setDipperActive] = useState(false);
  const [passengers, setPassengers] = useState(42);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChaiBreak, setIsChaiBreak] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(MUSIC_PLAYLISTS[0] || null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const [hotkeyToast, setHotkeyToast] = useState<HotkeyToast | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  const [isSharedView, setIsSharedView] = useState(false);
  
  // Sequential cycling pointer for the 3 uploaded bus horns
  const nextHornIndexRef = useRef<number>(0);
  
  // Dedicated multi-instance audio pool for the 3 Indian bus horns
  const hornAudioInstances = useRef<HTMLAudioElement[][]>([]);

  useEffect(() => {
    // Pre-create 3 audio instances per horn for instant polyphonic response
    const hornSources = ['/horns/horn-01.mp3', '/horns/horn-02.mp3', '/horns/horn-03.mp3'];
    hornAudioInstances.current = hornSources.map(src => {
      return [0, 1, 2].map(() => {
        const audio = new Audio(src);
        audio.preload = 'auto';
        return audio;
      });
    });
  }, []);

  const hornPoolPointers = useRef<number[]>([0, 0, 0]);

  const showToast = (_label: string, _icon: string, _sub?: string) => {
    // Disabled for clean, uncluttered nostalgic atmosphere
  };

  useEffect(() => {
    // Check URL parameters for shared ticket
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared') === 'true') {
      const from = params.get('from') || 'PATNA';
      const to = params.get('to') || 'GAYA';
      const route: Route = {
        id: 'shared',
        from: from.substring(0, 20),
        to: to.substring(0, 20),
        highway: 'NH 19',
        departureTime: '23:45',
        duration: '08h 30m',
        nextStop: 'Dhaba'
      };
      
      const sharedTicket: Ticket = {
        pnr: params.get('pnr') || 'INJ-SHARED',
        seat: params.get('seat') || 'W12',
        route,
        boardingTime: route.departureTime,
        journeyNumber: 'INJ-9999'
      };
      
      setTicket(sharedTicket);
      setIsSharedView(true);
      setAppState('TICKET');
    }
  }, []);

  const ambientVolumes = {
    engine: 70,
    rain: isRainy ? 45 : 0,
    road: 55,
    chatter: 30
  };

  const generateTicket = (route: Route) => {
    const newTicket: Ticket = {
      pnr: Math.random().toString(36).substring(2, 10).toUpperCase(),
      seat: ['W', 'D', 'L'][Math.floor(Math.random() * 3)] + Math.floor(Math.random() * 20 + 1),
      route,
      boardingTime: route.departureTime,
      journeyNumber: 'INJ-' + Math.floor(Math.random() * 9000 + 1000)
    };
    setTicket(newTicket);
  };

  const playSynthHorn = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // Indian bus multi-tone air horn chords (340Hz, 425Hz, 510Hz)
      const freqs = [340, 425, 510];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.1);
      });
    } catch (e) {
      console.log('Synth horn error:', e);
    }
  };

  const triggerHorn = () => {
    // Sequential cycle: 0 -> 1 -> 2 -> 0 -> 1 -> 2
    const targetIdx = nextHornIndexRef.current % 3;
    nextHornIndexRef.current = (targetIdx + 1) % 3;
    setSelectedHornIndex(targetIdx);

    setHornActive(true);
    setTimeout(() => setHornActive(false), 2000);

    const hornSources = ['/horns/horn-01.mp3', '/horns/horn-02.mp3', '/horns/horn-03.mp3'];
    const hornInstances = hornAudioInstances.current[targetIdx];
    
    if (hornInstances && hornInstances.length > 0) {
      const poolIdx = (hornPoolPointers.current[targetIdx] || 0) % hornInstances.length;
      hornPoolPointers.current[targetIdx] = (poolIdx + 1) % hornInstances.length;
      
      const audio = hornInstances[poolIdx];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.play().catch(() => {
          // Direct fallback to new Audio instance for the uploaded mp3
          const fallbackAudio = new Audio(hornSources[targetIdx]);
          fallbackAudio.volume = 1.0;
          fallbackAudio.play().catch(() => {});
        });
      }
    } else {
      const directAudio = new Audio(hornSources[targetIdx]);
      directAudio.volume = 1.0;
      directAudio.play().catch(() => {});
    }

    const hornMeta = HORN_TRACKS[targetIdx];
    showToast(hornMeta ? `${hornMeta.name} (${hornMeta.hindi})` : 'HORN OK PLEASE!', '🔊', 'Keyboard [H]');
  };

  const triggerDipper = () => {
    setDipperActive(true);
    setTimeout(() => setDipperActive(false), 800);
    showToast('HIGH BEAM DIPPER', '⚡', 'Keyboard [D]');
  };

  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      showToast(next ? 'MUSIC PLAYING' : 'MUSIC PAUSED', next ? '▶' : '❚❚', 'Keyboard [Space]');
      return next;
    });
  };

  const nextTrack = () => {
    if (activePlaylist && activePlaylist.tracks.length > 0) {
      setCurrentTrackIndex(prev => {
        const nextIdx = (prev + 1) % activePlaylist.tracks.length;
        const track = activePlaylist.tracks[nextIdx];
        showToast(track?.title || 'NEXT TRACK', '⏭', track?.artist || 'Keyboard [→]');
        return nextIdx;
      });
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    if (activePlaylist && activePlaylist.tracks.length > 0) {
      setCurrentTrackIndex(prev => {
        const prevIdx = (prev - 1 + activePlaylist.tracks.length) % activePlaylist.tracks.length;
        const track = activePlaylist.tracks[prevIdx];
        showToast(track?.title || 'PREV TRACK', '⏮', track?.artist || 'Keyboard [←]');
        return prevIdx;
      });
      setIsPlaying(true);
    }
  };

  const toggleRain = () => {
    setIsRainy(prev => {
      const next = !prev;
      showToast(next ? 'MONSOON RAIN ON' : 'CLEAR NIGHT SKY', next ? '🌧' : '🌙', 'Keyboard [R]');
      return next;
    });
  };

  const toggleZenMode = () => {
    setIsZenMode(prev => {
      const next = !prev;
      showToast(next ? 'ZEN MODE (HUD HIDDEN)' : 'HUD RESTORED', next ? '👁' : '🪟', 'Keyboard [Z]');
      return next;
    });
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input / textarea / select
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return;
      }

      // 1. Space: Play / Pause music
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
        return;
      }

      // 2. Arrow Right: Next song
      if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextTrack();
        return;
      }

      // 3. Arrow Left: Previous song
      if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevTrack();
        return;
      }

      // 4. H: Honk Horn
      if (e.code === 'KeyH' || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        triggerHorn();
        return;
      }

      // 5. D: Dipper / High beam flash
      if (e.code === 'KeyD' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        triggerDipper();
        return;
      }

      // 6. R: Toggle Rain
      if (e.code === 'KeyR' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        toggleRain();
        return;
      }

      // 7. 1, 2, 3: Switch Views
      if (e.key === '1') {
        e.preventDefault();
        setView('WINDOW');
        showToast('WINDOW SEAT VIEW', '🪟', 'Keyboard [1]');
        return;
      }
      if (e.key === '2') {
        e.preventDefault();
        setView('DRIVER');
        showToast('DRIVER CABIN VIEW', '🛞', 'Keyboard [2]');
        return;
      }
      if (e.key === '3') {
        e.preventDefault();
        setView('LAST_SEAT');
        showToast('LAST SEAT VIEW', '🚌', 'Keyboard [3]');
        return;
      }

      // 8. Z: Zen Mode
      if (e.code === 'KeyZ' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        toggleZenMode();
        return;
      }

      // 9. K or ?: Keyboard Shortcuts Cheat Sheet
      if (e.code === 'KeyK' || e.key.toLowerCase() === 'k' || e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // 10. Escape: Close modals
      if (e.key === 'Escape') {
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlaylist, currentTrackIndex, isRainy, isZenMode]);

  // Live passenger fluctuation simulation
  useEffect(() => {
    if (appState !== 'JOURNEY') return;
    
    const interval = setInterval(() => {
      setPassengers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return newCount > 45 ? 45 : (newCount < 35 ? 35 : newCount);
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [appState]);

  return (
    <JourneyContext.Provider value={{
      appState, setAppState,
      routes: ROUTES,
      activeRoute, setActiveRoute,
      ticket, generateTicket,
      view, setView,
      isRainy, setIsRainy, toggleRain,
      hornActive, selectedHornIndex, setSelectedHornIndex, triggerHorn,
      dipperActive, triggerDipper,
      passengers,
      isSharedView, setIsSharedView,
      isChaiBreak, setIsChaiBreak,
      isPlaying, setIsPlaying, togglePlay,
      activePlaylist, setActivePlaylist,
      currentTrackIndex, setCurrentTrackIndex, nextTrack, prevTrack,
      hotkeyToast,
      showShortcutsModal, setShowShortcutsModal,
      isZenMode, setIsZenMode, toggleZenMode,
      ambientVolumes
    }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
