import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio, Disc, CassetteTape, AudioLines, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useJourney } from '../store/JourneyContext';
import { MUSIC_PLAYLISTS } from '../constants/audio';
import { Playlist } from '../types';

export function MusicPlayer() {
  const { 
    isPlaying, 
    setIsPlaying, 
    togglePlay,
    activePlaylist, 
    setActivePlaylist, 
    currentTrackIndex, 
    setCurrentTrackIndex,
    nextTrack,
    prevTrack 
  } = useJourney();
  const [showSelector, setShowSelector] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLofiMode, setIsLofiMode] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Apply Lo-Fi Slowed + Reverb playbackRate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = isLofiMode ? 0.88 : 1.0;
    }
  }, [isLofiMode, currentTrackIndex, isPlaying]);

  const toggleLofiMode = () => {
    setIsLofiMode(prev => !prev);
  };
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextPreloaderRef = useRef<HTMLAudioElement | null>(null);
  const prevPreloaderRef = useRef<HTMLAudioElement | null>(null);

  // Preload adjacent tracks for 0ms instant song switching
  useEffect(() => {
    if (!activePlaylist || activePlaylist.tracks.length <= 1) return;
    const len = activePlaylist.tracks.length;
    const nextIndex = (currentTrackIndex + 1) % len;
    const prevIndex = (currentTrackIndex - 1 + len) % len;

    // Preload next track
    if (!nextPreloaderRef.current) {
      nextPreloaderRef.current = new Audio();
      nextPreloaderRef.current.preload = 'auto';
    }
    nextPreloaderRef.current.src = activePlaylist.tracks[nextIndex].src;

    // Preload prev track
    if (!prevPreloaderRef.current) {
      prevPreloaderRef.current = new Audio();
      prevPreloaderRef.current.preload = 'auto';
    }
    prevPreloaderRef.current.src = activePlaylist.tracks[prevIndex].src;
  }, [activePlaylist, currentTrackIndex]);

  // Handle active track change with rapid play
  // Handle active track change with rapid play & Lockscreen/Background MediaSession API
  useEffect(() => {
    if (activePlaylist && audioRef.current) {
      const track = activePlaylist.tracks[currentTrackIndex];
      if (track) {
        setHasError(false);
        if (audioRef.current.src !== window.location.origin + track.src && audioRef.current.getAttribute('src') !== track.src) {
          setIsBuffering(true);
          audioRef.current.src = track.src;
          audioRef.current.load();
        }

        // Setup Media Session API for background audio & lock screen controls
        if ('mediaSession' in navigator) {
          try {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: track.title,
              artist: track.artist || 'Indian Night Journey',
              album: activePlaylist.name,
              artwork: [
                { src: '/app-icon.svg', sizes: '192x192', type: 'image/svg+xml' },
                { src: '/H.png', sizes: '512x512', type: 'image/png' }
              ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
              setIsPlaying(true);
            });
            navigator.mediaSession.setActionHandler('pause', () => {
              setIsPlaying(false);
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
              prevTrack();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
              nextTrack();
            });
          } catch (e) {
            console.warn('MediaSession API error:', e);
          }
        }

        if (isPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsBuffering(false);
                if ('mediaSession' in navigator) {
                  navigator.mediaSession.playbackState = 'playing';
                }
              })
              .catch(e => {
                console.warn("Audio autoplay waiting for user tap:", e);
                setIsBuffering(false);
              });
          }
        }
      }
    }
  }, [activePlaylist, currentTrackIndex]);

  // Handle play/pause & mediaSession sync
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        if (!audioRef.current.src && activePlaylist) {
          const track = activePlaylist.tracks[currentTrackIndex];
          if (track) {
            audioRef.current.src = track.src;
          }
        }
        audioRef.current.play().then(() => {
          if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
          }
        }).catch(e => {
          console.warn("Audio play interrupted:", e);
        });
      } else {
        audioRef.current.pause();
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'paused';
        }
      }
    }
  }, [isPlaying]);

  // Audio Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setHasError(false);
      setIsBuffering(false);
    };
    const onEnded = () => {
      if (activePlaylist && activePlaylist.tracks.length > 0) {
        setCurrentTrackIndex(prev => (prev + 1) % activePlaylist.tracks.length);
      }
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setHasError(false);
    };
    const onError = () => {
      setHasError(true);
      setIsBuffering(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
    };
  }, [activePlaylist]);

  const selectPlaylist = (pl: Playlist) => {
    if (activePlaylist?.id === pl.id) {
      setShowSelector(false);
      return;
    }
    setActivePlaylist(pl);
    setCurrentTrackIndex(0);
    setShowSelector(false);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentTrack = activePlaylist?.tracks[currentTrackIndex];

  return (
    <div className="flex flex-col justify-end w-full pointer-events-auto">
      <audio ref={audioRef} className="hidden" preload="auto" />

      {/* Playlist Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#12100d]/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[85vh] landscape:max-h-[88vh]"
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5 shrink-0">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs uppercase tracking-[0.2em] font-mono text-white/90">SELECT CASSETTE TAPE (कैसेट)</h4>
                </div>
                <button 
                  onClick={() => setShowSelector(false)}
                  className="text-xs text-white/50 hover:text-white px-2 py-1 bg-white/5 rounded-md"
                >
                  ✕
                </button>
              </div>

              {/* Playlists List */}
              <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-2 flex-1">
                {MUSIC_PLAYLISTS.filter(pl => pl.tracks && pl.tracks.length > 0).map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => selectPlaylist(pl)}
                    className={`flex flex-col text-left p-2.5 sm:p-3 border rounded-xl transition-all duration-150 group active:scale-[0.98] ${
                      activePlaylist?.id === pl.id 
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                        : 'bg-white/5 border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                        activePlaylist?.id === pl.id ? 'text-amber-400' : 'text-amber-500/90 group-hover:text-amber-400'
                      }`}>
                        {pl.icon && <span className="text-xs sm:text-sm">{pl.icon}</span>}
                        <span>{pl.name}</span>
                      </span>
                      {activePlaylist?.id === pl.id && (
                        <span className="text-[8px] sm:text-[9px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">ACTIVE</span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-white/50 leading-relaxed line-clamp-2">
                      {pl.description}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ULTRA-COMPACT SLEEK HUD PLAYER BAR */}
      {activePlaylist && currentTrack && (
        <div className="relative group/player bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 hover:border-amber-500/40 rounded-full px-2 sm:px-3.5 py-1 sm:py-2 landscape:py-1 landscape:px-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center gap-1.5 sm:gap-3 max-w-[280px] sm:max-w-[360px] landscape:max-w-[280px] sm:landscape:max-w-[320px]">
          
          {/* Micro Progress Bar on Top Border */}
          <div 
            className="absolute top-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={handleSeek}
            title="Seek track"
          >
            <div 
              className="h-full bg-amber-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Retro Cassette Tape Icon (Click to open playlist selector) */}
          <button 
            onClick={() => setShowSelector(true)}
            className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)] relative group/cassette"
            title="Change Cassette Tape (कैसेट टेप बदलें)"
          >
            <CassetteTape className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 ${isPlaying && !isBuffering ? 'animate-pulse' : 'opacity-70'}`} />
            {isPlaying && !isBuffering && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* Track Info */}
          <div 
            onClick={() => setShowSelector(true)}
            className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center select-none"
          >
            <div className="text-[10px] sm:text-xs font-mono font-bold text-white/90 truncate flex items-center gap-1.5">
              {isBuffering ? (
                <span className="text-amber-400 animate-pulse text-[9px] sm:text-[10px]">BUFFERING...</span>
              ) : (
                <>
                  <span className="truncate">{currentTrack.title}</span>
                  {/* Live Animated Equalizer Bars when playing */}
                  {isPlaying && (
                    <div className="flex items-end gap-[1.5px] h-2.5 shrink-0">
                      <span className="w-[2px] bg-amber-400 h-2 animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <span className="w-[2px] bg-amber-300 h-3 animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <span className="w-[2px] bg-amber-400 h-1.5 animate-bounce" style={{ animationDuration: '0.8s' }} />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="text-[8px] sm:text-[9.5px] font-mono text-white/50 truncate flex items-center gap-1">
              <span>{currentTrack.artist}</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-amber-400/80">{isLofiMode ? 'LO-FI REVERB' : activePlaylist.name}</span>
            </div>
          </div>

          {/* LO-FI SLOWED + REVERB TOGGLE BUTTON */}
          <button
            onClick={toggleLofiMode}
            aria-label="Toggle Slowed and Reverb Lofi Mode"
            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-mono font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border ${
              isLofiMode
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-extrabold scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white/70 border-white/20'
            }`}
            title="Toggle Slowed + Reverb 90s Lo-Fi Effect"
          >
            {isLofiMode ? '🎧 LOFI ON' : '🎧 LOFI'}
          </button>

          {/* Audio Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button 
              aria-label="Previous Track (Key: ←)" 
              onClick={prevTrack} 
              title="Previous Track [←]"
              className="p-1 text-white/40 hover:text-white active:scale-95 transition-colors"
            >
              <SkipBack className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            
            <button 
              aria-label={isPlaying ? "Pause Music (Key: Space)" : "Play Music (Key: Space)"}
              onClick={togglePlay} 
              title="Play / Pause [Space]"
              className="w-5.5 h-5.5 sm:w-7 sm:h-7 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.4)] active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              ) : (
                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5" />
              )}
            </button>
            
            <button 
              aria-label="Next Track (Key: →)" 
              onClick={nextTrack} 
              title="Next Track [→]"
              className="p-1 text-white/40 hover:text-white active:scale-95 transition-colors"
            >
              <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


