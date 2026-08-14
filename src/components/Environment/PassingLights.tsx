import React, { useEffect, useState } from 'react';

interface Light {
  id: number;
  type: 'street' | 'headlight' | 'taillight';
  top: number;
  speed: number;
  size: number;
  delay: number;
}

export function PassingLights() {
  const [lights, setLights] = useState<Light[]>([]);

  useEffect(() => {
    // Generate static list of lights that CSS will animate infinitely
    const generateLights = () => {
      const newLights: Light[] = [];
      for (let i = 0; i < 30; i++) {
        const rand = Math.random();
        let type: 'street' | 'headlight' | 'taillight' = 'street';
        if (rand > 0.6) type = 'headlight';
        else if (rand > 0.8) type = 'taillight';

        newLights.push({
          id: i,
          type,
          top: 40 + Math.random() * 40, // 40% to 80% down the screen
          speed: 2 + Math.random() * 6, // 2s to 8s
          size: 1 + Math.random() * 3, // 1rem to 4rem width (streaks)
          delay: Math.random() * 10,
        });
      }
      return newLights;
    };

    setLights(generateLights());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {lights.map(light => {
        let colorClass = 'bg-amber-100/40 shadow-[0_0_30px_10px_rgba(254,243,199,0.2)]';
        if (light.type === 'headlight') colorClass = 'bg-white/60 shadow-[0_0_40px_15px_rgba(255,255,255,0.3)]';
        if (light.type === 'taillight') colorClass = 'bg-red-500/50 shadow-[0_0_30px_10px_rgba(239,68,68,0.3)]';

        return (
          <div
            key={light.id}
            className={`absolute rounded-full blur-[2px] animate-pass-light ${colorClass}`}
            style={{
              top: `${light.top}%`,
              right: '-20%', // Start off screen right
              width: `${light.size * 4}rem`,
              height: `${Math.max(0.5, light.size * 0.2)}rem`,
              animationDuration: `${light.speed}s`,
              animationDelay: `${light.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear'
            }}
          />
        );
      })}
    </div>
  );
}
