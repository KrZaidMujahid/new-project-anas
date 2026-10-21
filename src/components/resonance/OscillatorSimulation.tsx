/**
 * EQUATION 1 — Resonance Oscillator Canvas Component
 * Interactive high-DPI viewport with responsive ResizeObserver,
 * real-time mass-spring rendering, and fullscreen toggle.
 */

import React, { useRef, useEffect, useState } from 'react';
import { ResonanceParameters, LiveOscillatorState } from '../../physics/resonance/types';
import { renderResonanceOscillator } from '../../canvas/resonanceRenderer';
import { Maximize2, Minimize2, Activity, Sparkles, Compass } from 'lucide-react';

interface OscillatorSimulationProps {
  params: ResonanceParameters;
  state: LiveOscillatorState;
  steadyStateAmp: number;
}

export const OscillatorSimulation: React.FC<OscillatorSimulationProps> = ({
  params,
  state,
  steadyStateAmp,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 820,
    height: 380,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ResizeObserver for responsive auto-scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const computedHeight = Math.max(320, Math.min(460, Math.round(width * 0.44)));
        setDimensions({
          width: Math.floor(width),
          height: computedHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous render call synchronized with state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    renderResonanceOscillator(
      ctx,
      dimensions.width,
      dimensions.height,
      params,
      state,
      steadyStateAmp
    );

    ctx.restore();
  }, [dimensions, params, state, steadyStateAmp]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#07111F] shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Floating HUD Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#101D30]/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-cyan-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>DRIVEN MASS-SPRING OSCILLATOR</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101D30]/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-amber-300">
            <span>F₀ sin(ω_d t) = {state.drivingForce.toFixed(2)} N</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#101D30]/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
