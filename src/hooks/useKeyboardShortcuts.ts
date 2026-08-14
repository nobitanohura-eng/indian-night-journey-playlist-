import { useEffect } from 'react';
import { useJourney } from '../store/JourneyContext';

export function useKeyboardShortcuts() {
  const { 
    isPlaying, setIsPlaying, 
    isRainy, setIsRainy,
    triggerHorn
  } = useJourney();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (if any are added later)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'KeyH':
          e.preventDefault();
          triggerHorn();
          break;
        case 'KeyR':
          e.preventDefault();
          setIsRainy(!isRainy);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isRainy, triggerHorn, setIsPlaying, setIsRainy]);
}
