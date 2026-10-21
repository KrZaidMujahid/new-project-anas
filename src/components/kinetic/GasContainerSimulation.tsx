/**
 * EQUATION 1 — Gas Container Interactive Simulation
 * Canvas-based particle dynamics engine showing molecular motion,
 * elastic collisions, movable piston, and wall momentum transfers.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  KineticParameters,
  KineticResults,
  Particle2D,
  WallCollisionEvent,
} from '../../physics/kinetic/types';
import {
  sampleMaxwellianVelocity,
  GAS_CATALOG,
} from '../../physics/kinetic/model';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Gauge,
  Activity,
  Flame,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GasContainerSimulationProps {
  params: KineticParameters;
  results: KineticResults;
  onParamChange: <K extends keyof KineticParameters>(
    key: K,
    value: KineticParameters[K]
  ) => void;
  onReset: () => void;
}

export const GasContainerSimulation: React.FC<GasContainerSimulationProps> = ({
  params,
  results,
  onParamChange,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle2D[]>([]);
  const wallCollisionsRef = useRef<WallCollisionEvent[]>([]);
  const collisionCountRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Real-time visual collision frequency metrics (sampled over 1s)
  const [visualCollisionRate, setVisualCollisionRate] = useState<number>(0);
  const lastSampleTimeRef = useRef<number>(performance.now());
  const sampleCollisionCountRef = useRef<number>(0);

  // Initialize or update particle ensemble when count or gas type changes
  const initParticles = useCallback(
    (count: number, width: number, height: number, pistonY: number) => {
      const species = GAS_CATALOG[params.gasType] || GAS_CATALOG.nitrogen;
      const particles: Particle2D[] = [];
      const particleRadius = Math.max(3.5, Math.min(6.5, species.radiusPm / 10));

      const usableHeight = height - pistonY - 20;

      for (let i = 0; i < count; i++) {
        const vel = sampleMaxwellianVelocity(
          params.temperatureK,
          species.molarMassKgPerMol
        );

        // Normalize velocity to canvas pixel scale (e.g. ~50-200 px/sec)
        // 500 m/s corresponds to approx 150 px/s
        const pixelScale = 0.35;
        const vx = vel.vx * pixelScale;
        const vy = vel.vy * pixelScale;

        particles.push({
          id: i,
          x: 20 + Math.random() * (width - 40),
          y: pistonY + 15 + Math.random() * (usableHeight - 20),
          vx,
          vy,
          radius: particleRadius,
          color: species.particleColor,
          lastWallCollisionTime: 0,
          recentCollisions: 0,
        });
      }

      particlesRef.current = particles;
    },
    [params.gasType, params.temperatureK]
  );

  // Re-scale particle speeds smoothly when temperature changes without jumping positions
  useEffect(() => {
    const species = GAS_CATALOG[params.gasType] || GAS_CATALOG.nitrogen;
    const currentParticles = particlesRef.current;
    if (currentParticles.length === 0) return;

    // Rescale all velocities so their RMS matches the new temperature
    const targetVrms = results.vRms;
    const pixelScale = 0.35;
    const targetCanvasSpeed = targetVrms * pixelScale;

    // Compute current average canvas speed
    let currentTotalSpeedSq = 0;
    for (const p of currentParticles) {
      currentTotalSpeedSq += p.vx * p.vx + p.vy * p.vy;
    }
    const currentCanvasRms = Math.sqrt(currentTotalSpeedSq / currentParticles.length) || 1;
    const scalingFactor = targetCanvasSpeed / currentCanvasRms;

    for (const p of currentParticles) {
      p.vx *= scalingFactor;
      p.vy *= scalingFactor;
      p.color = species.particleColor;
    }
  }, [params.temperatureK, params.gasType, results.vRms]);

  // Main animation canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    // Ensure particle count matches params
    const width = canvas.width;
    const height = canvas.height;

    // Piston position mapping: Volume 1 L -> 10 L
    // 10 L corresponds to top (piston at ~30px), 1 L corresponds to compressed (~height - 100px)
    const minPistonY = 35;
    const maxPistonY = height - 120;
    // Normalized fraction: (10 - V) / (10 - 1)
    const volumeFraction = (10 - params.volumeLiters) / 9;
    const pistonY = minPistonY + volumeFraction * (maxPistonY - minPistonY);

    if (particlesRef.current.length !== params.visibleParticleCount) {
      initParticles(params.visibleParticleCount, width, height, pistonY);
    }

    const render = (currentTime: number) => {
      if (!isMounted) return;

      const dtRaw = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      // Clamp dt to avoid huge step if tab lost focus
      const dt = Math.min(0.05, Math.max(0.001, dtRaw)) * params.simulationSpeed;

      const containerWidth = canvas.width;
      const containerHeight = canvas.height;

      // Piston bounds
      const curVolumeFraction = (10 - params.volumeLiters) / 9;
      const curPistonY = minPistonY + curVolumeFraction * (maxPistonY - minPistonY);
      const chamberLeft = 30;
      const chamberRight = containerWidth - 30;
      const chamberBottom = containerHeight - 35;

      // 1. Clear Canvas with dark navy-blue background
      ctx.fillStyle = '#071426';
      ctx.fillRect(0, 0, containerWidth, containerHeight);

      // Subtle engineering grid in chamber
      ctx.strokeStyle = '#102740';
      ctx.lineWidth = 1;
      for (let x = chamberLeft; x <= chamberRight; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, curPistonY);
        ctx.lineTo(x, chamberBottom);
        ctx.stroke();
      }
      for (let y = curPistonY; y <= chamberBottom; y += 30) {
        ctx.beginPath();
        ctx.moveTo(chamberLeft, y);
        ctx.lineTo(chamberRight, y);
        ctx.stroke();
      }

      // 2. Draw Cylinder Walls & Base
      ctx.fillStyle = '#0B1F36';
      ctx.fillRect(chamberLeft - 12, curPistonY - 15, 12, chamberBottom - curPistonY + 25);
      ctx.fillRect(chamberRight, curPistonY - 15, 12, chamberBottom - curPistonY + 25);
      ctx.fillRect(chamberLeft - 12, chamberBottom, chamberRight - chamberLeft + 24, 18);

      // Border stroke for container
      ctx.strokeStyle = '#29445F';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Left outer
      ctx.moveTo(chamberLeft, curPistonY - 20);
      ctx.lineTo(chamberLeft, chamberBottom);
      // Bottom
      ctx.lineTo(chamberRight, chamberBottom);
      // Right outer
      ctx.lineTo(chamberRight, curPistonY - 20);
      ctx.stroke();

      // Tick marks along the side (Liters scale 1 to 10 L)
      ctx.fillStyle = '#AFC2D8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      for (let v = 1; v <= 10; v++) {
        const tickFraction = (10 - v) / 9;
        const tickY = minPistonY + tickFraction * (maxPistonY - minPistonY);
        ctx.strokeStyle = v === Math.round(params.volumeLiters) ? '#38BDF8' : '#29445F';
        ctx.lineWidth = v % 2 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(chamberLeft - 10, tickY);
        ctx.lineTo(chamberLeft, tickY);
        ctx.stroke();

        if (v % 2 === 0 || v === 1 || v === 10) {
          ctx.fillText(`${v}L`, chamberLeft - 14, tickY + 3);
        }
      }

      // 3. Draw Movable Piston
      // Piston rod
      const pistonCenterX = (chamberLeft + chamberRight) / 2;
      ctx.fillStyle = '#16334F';
      ctx.fillRect(pistonCenterX - 12, 10, 24, curPistonY - 10);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pistonCenterX - 12, 10, 24, curPistonY - 10);

      // Piston head
      const pistonGradient = ctx.createLinearGradient(
        chamberLeft,
        curPistonY - 14,
        chamberLeft,
        curPistonY + 6
      );
      pistonGradient.addColorStop(0, '#1E4068');
      pistonGradient.addColorStop(0.5, '#2B588B');
      pistonGradient.addColorStop(1, '#16334F');

      ctx.fillStyle = pistonGradient;
      ctx.fillRect(chamberLeft + 1, curPistonY - 12, chamberRight - chamberLeft - 2, 14);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.strokeRect(chamberLeft + 1, curPistonY - 12, chamberRight - chamberLeft - 2, 14);

      // Piston seal rings
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(chamberLeft + 2, curPistonY - 4, chamberRight - chamberLeft - 4, 2);

      // Piston label
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `PISTON HEAD • V = ${params.volumeLiters.toFixed(1)} L`,
        pistonCenterX,
        curPistonY - 18
      );

      // 4. Update Particle Physics if not paused
      const particles = particlesRef.current;
      const now = performance.now();

      if (!params.isPaused) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Push particles back into valid chamber if piston moved downward quickly
          if (p.y < curPistonY + p.radius) {
            p.y = curPistonY + p.radius + 2;
            p.vy = Math.abs(p.vy); // push downward
          }

          // Move
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Wall Collisions (Elastic reflection + momentum count)
          // Left Wall
          if (p.x - p.radius <= chamberLeft) {
            p.x = chamberLeft + p.radius;
            p.vx = -p.vx;
            p.lastWallCollisionTime = now;
            collisionCountRef.current++;
            sampleCollisionCountRef.current++;
            wallCollisionsRef.current.push({
              wall: 'left',
              x: chamberLeft,
              y: p.y,
              impulse: Math.abs(p.vx),
              timestamp: now,
            });
          }
          // Right Wall
          else if (p.x + p.radius >= chamberRight) {
            p.x = chamberRight - p.radius;
            p.vx = -p.vx;
            p.lastWallCollisionTime = now;
            collisionCountRef.current++;
            sampleCollisionCountRef.current++;
            wallCollisionsRef.current.push({
              wall: 'right',
              x: chamberRight,
              y: p.y,
              impulse: Math.abs(p.vx),
              timestamp: now,
            });
          }

          // Piston (Top boundary)
          if (p.y - p.radius <= curPistonY) {
            p.y = curPistonY + p.radius;
            p.vy = Math.abs(p.vy);
            p.lastWallCollisionTime = now;
            collisionCountRef.current++;
            sampleCollisionCountRef.current++;
            wallCollisionsRef.current.push({
              wall: 'top',
              x: p.x,
              y: curPistonY,
              impulse: Math.abs(p.vy),
              timestamp: now,
            });
          }
          // Floor (Bottom boundary)
          else if (p.y + p.radius >= chamberBottom) {
            p.y = chamberBottom - p.radius;
            p.vy = -Math.abs(p.vy);
            p.lastWallCollisionTime = now;
            collisionCountRef.current++;
            sampleCollisionCountRef.current++;
            wallCollisionsRef.current.push({
              wall: 'bottom',
              x: p.x,
              y: chamberBottom,
              impulse: Math.abs(p.vy),
              timestamp: now,
            });
          }
        }

        // Particle-Particle Elastic Collisions (Equal mass 2D elastic collision)
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;
            const minDist = p1.radius + p2.radius;

            if (distSq < minDist * minDist && distSq > 1e-4) {
              const dist = Math.sqrt(distSq);
              // Normal vector
              const nx = dx / dist;
              const ny = dy / dist;

              // Relative velocity
              const kx = p1.vx - p2.vx;
              const ky = p1.vy - p2.vy;

              // Normal component of relative velocity
              const p = 2 * (nx * kx + ny * ky) / 2; // equal masses m1 = m2 = 1

              // Only collide if moving toward each other
              if (nx * kx + ny * ky > 0) {
                p1.vx -= p * nx;
                p1.vy -= p * ny;
                p2.vx += p * nx;
                p2.vy += p * ny;

                // Position separation to prevent overlap trapping
                const overlap = 0.5 * (minDist - dist);
                p1.x -= overlap * nx;
                p1.y -= overlap * ny;
                p2.x += overlap * nx;
                p2.y += overlap * ny;
              }
            }
          }
        }
      }

      // 5. Draw Wall Collision Sparkle & Momentum Indicators (especially in Collisions View)
      const recentCollisions = wallCollisionsRef.current.filter(
        (c) => now - c.timestamp < 350
      );
      wallCollisionsRef.current = recentCollisions;

      if (params.viewMode === 'collisions') {
        for (const col of recentCollisions) {
          const age = (now - col.timestamp) / 350; // 0 to 1
          const alpha = 1 - age;
          const radius = 4 + age * 16;

          ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.9})`; // Purple accent
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(col.x, col.y, radius, 0, 2 * Math.PI);
          ctx.stroke();

          // Flash dot at impact point
          ctx.fillStyle = `rgba(241, 245, 249, ${alpha})`;
          ctx.beginPath();
          ctx.arc(col.x, col.y, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // 6. Draw Gas Particles
      const species = GAS_CATALOG[params.gasType] || GAS_CATALOG.nitrogen;
      // Thermal speed coloring: hotter particles glow warmer
      const isHotGas = params.temperatureK >= 550;
      const isColdGas = params.temperatureK <= 220;

      for (const p of particles) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const speedRatio = speed / (results.vRms * 0.35 || 1);

        // Color based on speed or temperature
        let fill = species.particleColor;
        if (params.viewMode === 'collisions') {
          // If recently collided with wall, flash purple
          const timeSinceWall = now - p.lastWallCollisionTime;
          if (timeSinceWall < 120) {
            fill = '#A78BFA';
          } else {
            fill = speedRatio > 1.2 ? '#FB923C' : '#60A5FA';
          }
        } else {
          if (isHotGas) {
            fill = speedRatio > 1.1 ? '#FB923C' : '#FBBF24';
          } else if (isColdGas) {
            fill = speedRatio < 0.9 ? '#38BDF8' : '#818CF8';
          }
        }

        // Particle Glow
        ctx.shadowColor = fill;
        ctx.shadowBlur = params.viewMode === 'collisions' ? 8 : 4;

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.shadowBlur = 0; // reset shadow

        // Velocity Vectors (Optional overlay)
        if (params.showVelocityVectors && !params.isPaused) {
          ctx.strokeStyle = 'rgba(241, 245, 249, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.08, p.y + p.vy * 0.08);
          ctx.stroke();
        }
      }

      // 7. Calculate Visual Collision Rate per second
      if (now - lastSampleTimeRef.current >= 600) {
        const elapsed = (now - lastSampleTimeRef.current) / 1000;
        const rate = Math.round(sampleCollisionCountRef.current / elapsed);
        setVisualCollisionRate(rate);
        sampleCollisionCountRef.current = 0;
        lastSampleTimeRef.current = now;
      }

      // 8. Visual Chamber Overlay Badges
      // Gas Type & Species Badge
      ctx.fillStyle = 'rgba(16, 39, 64, 0.85)';
      ctx.fillRect(chamberLeft + 10, chamberBottom - 38, 140, 28);
      ctx.strokeStyle = '#29445F';
      ctx.lineWidth = 1;
      ctx.strokeRect(chamberLeft + 10, chamberBottom - 38, 140, 28);

      ctx.fillStyle = species.particleColor;
      ctx.beginPath();
      ctx.arc(chamberLeft + 24, chamberBottom - 24, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${species.name} (${species.formula})`,
        chamberLeft + 36,
        chamberBottom - 20
      );

      // Qualitative Collision Frequency Indicator Badge
      ctx.fillStyle = 'rgba(16, 39, 64, 0.85)';
      ctx.fillRect(chamberRight - 170, chamberBottom - 38, 160, 28);
      ctx.strokeStyle = '#29445F';
      ctx.lineWidth = 1;
      ctx.strokeRect(chamberRight - 170, chamberBottom - 38, 160, 28);

      ctx.fillStyle = '#A78BFA';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        `Collisions: ~${visualCollisionRate}/s`,
        chamberRight - 18,
        chamberBottom - 20
      );

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    params.visibleParticleCount,
    params.volumeLiters,
    params.temperatureK,
    params.gasType,
    params.isPaused,
    params.simulationSpeed,
    params.viewMode,
    params.showVelocityVectors,
    initParticles,
    results.vRms,
  ]);

  return (
    <div className="bg-[#102740] rounded-xl border border-[#29445F] p-4 shadow-xl flex flex-col space-y-4">
      {/* Top Bar with Title & View Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#29445F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] tracking-wide flex items-center gap-2">
              <span>Interactive Gas Cylinder &amp; Piston</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16334F] text-[#38BDF8] border border-[#29445F]">
                V = {params.volumeLiters.toFixed(1)} L
              </span>
            </h3>
            <p className="text-[11px] text-[#AFC2D8]">
              2D molecular ensemble illustrating collisions and momentum transfer to walls.
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Particles vs Collisions */}
        <div className="flex items-center gap-1.5 bg-[#0B1F36] p-1 rounded-lg border border-[#29445F] text-xs">
          <button
            onClick={() => onParamChange('viewMode', 'particles')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              params.viewMode === 'particles'
                ? 'bg-[#38BDF8] text-[#071426] shadow-xs'
                : 'text-[#AFC2D8] hover:text-[#F1F5F9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Particle View</span>
          </button>
          <button
            onClick={() => onParamChange('viewMode', 'collisions')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              params.viewMode === 'collisions'
                ? 'bg-[#A78BFA] text-[#071426] shadow-xs'
                : 'text-[#AFC2D8] hover:text-[#F1F5F9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pressure &amp; Collisions</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Canvas */}
      <div className="relative w-full flex justify-center bg-[#071426] rounded-xl border border-[#29445F] overflow-hidden p-2">
        <canvas
          ref={canvasRef}
          width={650}
          height={400}
          className="w-full max-w-[650px] h-[360px] sm:h-[400px] block rounded-lg select-none"
        />

        {/* Piston Volume Quick Slider Overlay */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center bg-[#0B1F36]/90 border border-[#29445F] p-2.5 rounded-xl backdrop-blur-xs gap-2">
          <span className="text-[10px] uppercase font-mono font-bold text-[#38BDF8]">
            Piston V
          </span>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={params.volumeLiters}
            onChange={(e) => onParamChange('volumeLiters', parseFloat(e.target.value))}
            className="h-32 accent-[#38BDF8] cursor-pointer"
            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            aria-label="Volume slider"
          />
          <span className="text-[11px] font-mono font-bold text-white">
            {params.volumeLiters.toFixed(1)}L
          </span>
        </div>
      </div>

      {/* Transport Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onParamChange('isPaused', !params.isPaused)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              params.isPaused
                ? 'bg-[#4ADE80] text-[#071426] hover:bg-[#4ADE80]/90 shadow-sm'
                : 'bg-[#16334F] text-[#F1F5F9] hover:bg-[#29445F] border border-[#29445F]'
            }`}
          >
            {params.isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (!params.isPaused) onParamChange('isPaused', true);
              // Step forward by 1 tick
              const particles = particlesRef.current;
              for (const p of particles) {
                p.x += p.vx * 0.02;
                p.y += p.vy * 0.02;
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[#16334F] text-[#AFC2D8] hover:text-[#F1F5F9] hover:bg-[#29445F] border border-[#29445F] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Advance simulation by one frame"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-[#16334F] text-[#AFC2D8] hover:text-[#F1F5F9] hover:bg-[#29445F] border border-[#29445F] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Reset parameters to standard STP values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Multiplier & Vector Toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-[#AFC2D8] cursor-pointer">
            <input
              type="checkbox"
              checked={params.showVelocityVectors}
              onChange={(e) => onParamChange('showVelocityVectors', e.target.checked)}
              className="accent-[#38BDF8] rounded"
            />
            <span>Velocity Vectors</span>
          </label>

          <div className="flex items-center gap-1.5 text-xs text-[#AFC2D8]">
            <span className="font-mono">Speed:</span>
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => onParamChange('simulationSpeed', s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  params.simulationSpeed === s
                    ? 'bg-[#38BDF8] text-[#071426] font-bold'
                    : 'bg-[#0B1F36] text-[#AFC2D8] hover:text-white border border-[#29445F]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Distinction Disclaimer */}
      <div className="p-2.5 rounded-lg bg-[#071426] border border-[#29445F] flex items-start gap-2.5 text-[11px] text-[#AFC2D8]">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#F1F5F9]">Scientific Note:</strong> The macroscopic gas pressure
          is strictly calculated from the ideal gas law (<span className="font-mono text-[#38BDF8]">P = nRT/V</span>).
          The animated particles provide a qualitative 2D illustration of molecular motion and wall collisions,
          not a literal 1:1 rendering of all ~10²³ real molecules.
        </p>
      </div>
    </div>
  );
};
