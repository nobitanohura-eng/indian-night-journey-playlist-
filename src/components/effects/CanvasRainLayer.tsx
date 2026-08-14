import React, { useEffect, useRef } from 'react';

interface Droplet {
  id: number;
  x: number;
  y: number;
  r: number;
  baseR: number;
  vx: number;
  vy: number;
  state: 'static' | 'hesitating' | 'slipping' | 'fast_drip';
  slipTimer: number;
  slipDistance: number;
  targetSlipDist: number;
  hesitationDuration: number;
  trailPoints: { x: number; y: number; r: number; alpha: number; isBead: boolean }[];
  isDead: boolean;
  aspectRatio: number;
  angle: number;
}

interface RainStreak {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  thickness: number;
}

interface MicroSplash {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  sparks: { dx: number; dy: number; r: number; alpha: number }[];
}

interface WipeTrack {
  x: number;
  y: number;
  r: number;
  time: number;
}

export function CanvasRainLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wipeTracksRef = useRef<WipeTrack[]>([]);
  const isInteractingRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fast-falling rain streaks outside the window glass
    const streaks: RainStreak[] = Array.from({ length: 140 }, () => ({
      x: Math.random() * width * 1.4,
      y: Math.random() * height,
      len: 30 + Math.random() * 45,
      speed: 28 + Math.random() * 22,
      alpha: 0.08 + Math.random() * 0.2,
      thickness: 0.7 + Math.random() * 0.8,
    }));

    // Micro Splashes on Glass impact
    const splashes: MicroSplash[] = [];

    // Glass Water Droplets Collection
    let dropletIdCounter = 1;
    const droplets: Droplet[] = [];

    // Helper to spawn static delicate droplet
    const spawnStaticDroplet = (x?: number, y?: number, radius?: number) => {
      const r = radius || (0.6 + Math.random() * 1.8);
      droplets.push({
        id: dropletIdCounter++,
        x: x !== undefined ? x : Math.random() * width,
        y: y !== undefined ? y : Math.random() * height,
        r,
        baseR: r,
        vx: 0,
        vy: 0,
        state: 'static',
        slipTimer: Math.floor(Math.random() * 200),
        slipDistance: 0,
        targetSlipDist: 15 + Math.random() * 35,
        hesitationDuration: 30 + Math.random() * 100,
        trailPoints: [],
        isDead: false,
        aspectRatio: 0.98 + Math.random() * 0.08,
        angle: 0,
      });
    };

    // Helper to spawn an active dripping rivulet droplet
    const spawnDrippingDroplet = (x?: number, y?: number, radius?: number) => {
      const r = radius || (2.0 + Math.random() * 1.6);
      droplets.push({
        id: dropletIdCounter++,
        x: x !== undefined ? x : Math.random() * width,
        y: y !== undefined ? y : Math.random() * (height * 0.5),
        r,
        baseR: r,
        vx: -0.3 - Math.random() * 0.25,
        vy: 1.0 + Math.random() * 1.8,
        state: Math.random() > 0.4 ? 'slipping' : 'hesitating',
        slipTimer: 0,
        slipDistance: 0,
        targetSlipDist: 20 + Math.random() * 45,
        hesitationDuration: 20 + Math.random() * 50,
        trailPoints: [],
        isDead: false,
        aspectRatio: 1.28,
        angle: 0.08,
      });
    };

    // Initialize clean population of droplets on glass
    const INITIAL_STATIC_COUNT = 280;
    const INITIAL_DRIP_COUNT = 18;

    for (let i = 0; i < INITIAL_STATIC_COUNT; i++) {
      spawnStaticDroplet();
    }
    for (let i = 0; i < INITIAL_DRIP_COUNT; i++) {
      spawnDrippingDroplet();
    }

    // Touch / Mouse Wiping Handlers
    const addWipe = (clientX: number, clientY: number) => {
      wipeTracksRef.current.push({
        x: clientX,
        y: clientY,
        r: 42,
        time: Date.now(),
      });
      if (wipeTracksRef.current.length > 50) {
        wipeTracksRef.current.shift();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isInteractingRef.current = true;
      addWipe(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isInteractingRef.current) {
        addWipe(e.clientX, e.clientY);
      }
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      wipeTracksRef.current = wipeTracksRef.current.filter(w => now - w.time < 10000);

      // Periodically spawn new raindrops hitting the glass with organic micro-splashes
      if (frameCount % 5 === 0 && droplets.length < 380) {
        const hitX = Math.random() * width;
        const hitY = Math.random() * height;
        const hitR = 0.7 + Math.random() * 1.5;
        spawnStaticDroplet(hitX, hitY, hitR);

        // Organic micro-splashes (fine spray beads instead of giant fake rings)
        if (Math.random() < 0.25) {
          const sparkCount = 3 + Math.floor(Math.random() * 3);
          const sparks = [];
          for (let s = 0; s < sparkCount; s++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 2 + Math.random() * 5;
            sparks.push({
              dx: Math.cos(angle) * dist,
              dy: Math.sin(angle) * dist,
              r: 0.4 + Math.random() * 0.6,
              alpha: 0.7,
            });
          }

          splashes.push({
            x: hitX,
            y: hitY,
            r: 0.8,
            maxR: 3.5 + Math.random() * 3,
            alpha: 0.55,
            sparks,
          });
        }
      }

      // Periodically spawn dripping rivulet
      if (frameCount % 24 === 0 && Math.random() < 0.65) {
        spawnDrippingDroplet(Math.random() * width, -10, 1.8 + Math.random() * 1.8);
      }

      // --- LAYER 1: Fast Exterior Rain Streaks ---
      ctx.lineCap = 'round';
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.y += s.speed;
        s.x -= s.speed * 0.28;

        if (s.y > height + 50 || s.x < -50) {
          s.y = -40;
          s.x = Math.random() * width * 1.35;
          s.speed = 28 + Math.random() * 22;
          s.len = 30 + Math.random() * 45;
        }

        ctx.lineWidth = s.thickness;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len * 0.28, s.y - s.len);
        grad.addColorStop(0, `rgba(210, 235, 255, ${s.alpha})`);
        grad.addColorStop(0.6, `rgba(170, 205, 240, ${s.alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(170, 205, 240, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x + s.len * 0.28, s.y - s.len);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // --- LAYER 2: Delicate Micro-Splashes & Scatter Beads ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const sp = splashes[i];
        sp.r += 0.4;
        sp.alpha -= 0.055;

        if (sp.alpha <= 0 || sp.r >= sp.maxR) {
          splashes.splice(i, 1);
          continue;
        }

        // Soft subtle impact halo
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 245, 255, ${sp.alpha * 0.25})`;
        ctx.fill();

        // Satellite scatter micro-beads
        for (let k = 0; k < sp.sparks.length; k++) {
          const spark = sp.sparks[k];
          ctx.beginPath();
          ctx.arc(sp.x + spark.dx * (sp.r / 2), sp.y + spark.dy * (sp.r / 2), spark.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha * spark.alpha * 0.8})`;
          ctx.fill();
        }
      }

      // --- LAYER 3: Water Droplets, Rivulets & Trails ---
      const engineJiggleX = Math.sin(frameCount * 0.35) * 0.18;
      const engineJiggleY = Math.cos(frameCount * 0.3) * 0.15;

      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        if (d.isDead) continue;

        // Check if wiped by user finger
        let isWiped = false;
        for (let j = 0; j < wipeTracksRef.current.length; j++) {
          const w = wipeTracksRef.current[j];
          const dist = Math.hypot(d.x - w.x, d.y - w.y);
          if (dist < w.r) {
            const age = now - w.time;
            if (age < 6000) {
              isWiped = true;
              break;
            }
          }
        }
        if (isWiped) continue;

        // --- PHYSICAL STATE MACHINE FOR DRIPPING / RIVULET DROPS ---
        if (d.state !== 'static') {
          // A. Hesitation Phase (Stick state)
          if (d.state === 'hesitating') {
            d.slipTimer++;
            d.y += engineJiggleY * 0.15;

            if (d.slipTimer > d.hesitationDuration || d.r > 3.8) {
              d.state = d.r > 3.2 ? 'fast_drip' : 'slipping';
              d.slipTimer = 0;
              d.slipDistance = 0;
              d.targetSlipDist = 18 + Math.random() * (d.r * 14);
              d.vy = 1.1 + (d.r - 1.5) * 0.6;
              d.aspectRatio = 1.35;
            }
          } 
          // B. Slipping / Fast Drip Phase (Slip state)
          else if (d.state === 'slipping' || d.state === 'fast_drip') {
            const speedMultiplier = d.state === 'fast_drip' ? 1.4 : 1.0;
            
            const dy = d.vy * speedMultiplier;
            const dx = (d.vx + (Math.random() - 0.5) * 0.25) * speedMultiplier;

            d.y += dy;
            d.x += dx;
            d.slipDistance += dy;

            if (frameCount % 8 === 0) {
              d.vx = -0.15 - Math.random() * 0.3;
            }

            // Leave fine wet trail & satellite beads
            if (frameCount % 3 === 0) {
              const isBead = Math.random() < 0.3;
              d.trailPoints.push({
                x: d.x + (Math.random() - 0.5) * (d.r * 0.25),
                y: d.y - d.r * 0.4,
                r: isBead ? Math.max(0.4, d.r * 0.25) : Math.max(0.3, d.r * 0.15),
                alpha: isBead ? 0.65 : 0.4,
                isBead,
              });
            }

            // Absorb stationary drops in its path
            for (let k = 0; k < droplets.length; k++) {
              if (k !== i && !droplets[k].isDead && droplets[k].state === 'static') {
                const target = droplets[k];
                const dist = Math.hypot(d.x - target.x, d.y - target.y);
                if (dist < d.r + target.r + 1.8) {
                  const newVol = Math.pow(d.r, 3) + Math.pow(target.r, 3);
                  d.r = Math.min(4.8, Math.cbrt(newVol));
                  d.vy = Math.min(4.5, d.vy + 0.25);
                  target.isDead = true;

                  d.slipDistance = 0;
                  d.targetSlipDist += 20;
                }
              }
            }

            if (d.slipDistance >= d.targetSlipDist) {
              d.state = 'hesitating';
              d.slipTimer = 0;
              d.hesitationDuration = 15 + Math.random() * 35;
              d.aspectRatio = 1.1;
            }
          }

          if (d.y > height + 30 || d.x < -30 || d.x > width + 30) {
            d.isDead = true;
          }
        }

        // --- RENDER WET TRAIL BEHIND SLIDING DROPLET ---
        if (d.trailPoints.length > 0) {
          for (let t = d.trailPoints.length - 1; t >= 0; t--) {
            const tp = d.trailPoints[t];
            tp.alpha -= 0.003;
            if (tp.alpha <= 0) {
              d.trailPoints.splice(t, 1);
              continue;
            }

            if (tp.isBead) {
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, tp.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(210, 235, 255, ${tp.alpha * 0.6})`;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(tp.x - tp.r * 0.25, tp.y - tp.r * 0.25, Math.max(0.25, tp.r * 0.35), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${tp.alpha * 0.8})`;
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, tp.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(180, 215, 245, ${tp.alpha * 0.2})`;
              ctx.fill();
            }
          }
        }

        // --- REALISTIC REFINED WATER DROPLET RENDERING ---
        const posX = d.x + (d.state === 'static' ? engineJiggleX : 0);
        const posY = d.y + (d.state === 'static' ? engineJiggleY : 0);
        const radX = d.r;
        const radY = d.r * d.aspectRatio;

        ctx.save();
        ctx.translate(posX, posY);
        if (d.state !== 'static') {
          ctx.rotate(d.angle);
        }

        // 1. Soft Ambient Cast Shadow under the water dome
        ctx.beginPath();
        ctx.ellipse(radX * 0.1, radY * 0.15, radX * 1.05, radY * 1.05, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(4, 10, 18, 0.35)';
        ctx.fill();

        // 2. Refractive Water Body Gradient
        const bodyGrad = ctx.createRadialGradient(
          -radX * 0.2,
          -radY * 0.2,
          radX * 0.05,
          radX * 0.05,
          radY * 0.15,
          radY * 1.02
        );
        bodyGrad.addColorStop(0, 'rgba(235, 248, 255, 0.75)');
        bodyGrad.addColorStop(0.35, 'rgba(170, 210, 245, 0.3)');
        bodyGrad.addColorStop(0.75, 'rgba(100, 155, 210, 0.45)');
        bodyGrad.addColorStop(1, 'rgba(20, 45, 75, 0.65)');

        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // 3. Delicate Outer Meniscus Edge Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.lineWidth = 0.45;
        ctx.strokeStyle = 'rgba(20, 40, 65, 0.55)';
        ctx.stroke();

        // 4. Sharp Primary Specular Glint Highlight
        ctx.beginPath();
        ctx.ellipse(
          -radX * 0.35,
          -radY * 0.35,
          Math.max(0.35, radX * 0.28),
          Math.max(0.25, radY * 0.22),
          -0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();

        // 5. Secondary Soft Caustic Glow (Bottom right reflection)
        if (d.r > 1.4) {
          ctx.beginPath();
          ctx.ellipse(
            radX * 0.22,
            radY * 0.28,
            Math.max(0.3, radX * 0.28),
            Math.max(0.2, radY * 0.16),
            0.3,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(215, 240, 255, 0.45)';
          ctx.fill();
        }

        ctx.restore();
      }

      // Cleanup dead drops
      for (let i = droplets.length - 1; i >= 0; i--) {
        if (droplets[i].isDead && droplets[i].trailPoints.length === 0) {
          droplets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair select-none"
      title="Tap or drag to wipe raindrops from glass"
    />
  );
}
