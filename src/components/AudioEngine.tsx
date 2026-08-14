import { useEffect, useRef } from 'react';
import { useJourney } from '../store/JourneyContext';
import { AMBIENT_TRACKS } from '../constants/audio';

export function AudioEngine() {
  const { ambientVolumes } = useJourney();
  
  const engineRef = useRef<HTMLAudioElement | null>(null);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const roadRef = useRef<HTMLAudioElement | null>(null);

  // Web Audio Context Synthesizer Fallback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const roadGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Standard Audio elements load attempt
    engineRef.current = new Audio(AMBIENT_TRACKS.engine);
    engineRef.current.loop = true;
    engineRef.current.volume = (ambientVolumes.engine / 100) * 0.45;
    
    let engineFileFailed = false;
    engineRef.current.play().catch(() => {
      engineFileFailed = true;
      initWebAudioSynth();
    });

    rainRef.current = new Audio(AMBIENT_TRACKS.rain);
    rainRef.current.loop = true;
    rainRef.current.volume = (ambientVolumes.rain / 100) * 0.4;
    rainRef.current.play().catch(() => {
      if (!engineFileFailed) initWebAudioSynth();
    });

    roadRef.current = new Audio(AMBIENT_TRACKS.road);
    roadRef.current.loop = true;
    roadRef.current.volume = (ambientVolumes.road / 100) * 0.35;
    roadRef.current.play().catch(() => {});

    function initWebAudioSynth() {
      if (audioCtxRef.current) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // 1. Synthesize Engine Diesel Low Hum (Sawtooth + Lowpass Filter)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const eGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low 55Hz diesel idle hum
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        eGain.gain.setValueAtTime((ambientVolumes.engine / 100) * 0.15, ctx.currentTime);
        osc.connect(filter);
        filter.connect(eGain);
        eGain.connect(ctx.destination);
        osc.start();
        engineGainRef.current = eGain;

        // 2. Synthesize Rain & Road Noise (Pink/White Noise Buffer)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        // Rain Noise
        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;
        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.setValueAtTime(1200, ctx.currentTime);
        const rGain = ctx.createGain();
        rGain.gain.setValueAtTime((ambientVolumes.rain / 100) * 0.08, ctx.currentTime);
        rainSource.connect(rainFilter);
        rainFilter.connect(rGain);
        rGain.connect(ctx.destination);
        rainSource.start();
        rainGainRef.current = rGain;

        // Road Noise
        const roadSource = ctx.createBufferSource();
        roadSource.buffer = noiseBuffer;
        roadSource.loop = true;
        const roadFilter = ctx.createBiquadFilter();
        roadFilter.type = 'lowpass';
        roadFilter.frequency.setValueAtTime(300, ctx.currentTime);
        const rdGain = ctx.createGain();
        rdGain.gain.setValueAtTime((ambientVolumes.road / 100) * 0.05, ctx.currentTime);
        roadSource.connect(roadFilter);
        roadFilter.connect(rdGain);
        rdGain.connect(ctx.destination);
        roadSource.start();
        roadGainRef.current = rdGain;
      } catch (err) {
        console.warn('Web Audio Ambient Synth initialized fallback', err);
      }
    }
    
    return () => {
      engineRef.current?.pause();
      rainRef.current?.pause();
      roadRef.current?.pause();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Handle ambient volume adjustments
  useEffect(() => {
    if (engineRef.current) engineRef.current.volume = Math.max(0, Math.min(1, (ambientVolumes.engine / 100) * 0.45));
    if (rainRef.current) rainRef.current.volume = Math.max(0, Math.min(1, (ambientVolumes.rain / 100) * 0.4));
    if (roadRef.current) roadRef.current.volume = Math.max(0, Math.min(1, (ambientVolumes.road / 100) * 0.35));

    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      const now = audioCtxRef.current.currentTime;
      if (engineGainRef.current) engineGainRef.current.gain.setValueAtTime((ambientVolumes.engine / 100) * 0.15, now);
      if (rainGainRef.current) rainGainRef.current.gain.setValueAtTime((ambientVolumes.rain / 100) * 0.08, now);
      if (roadGainRef.current) roadGainRef.current.gain.setValueAtTime((ambientVolumes.road / 100) * 0.05, now);
    }
  }, [ambientVolumes]);

  return null; // Side effects only
}


