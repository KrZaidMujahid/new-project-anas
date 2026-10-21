/**
 * EQUATION 1 — Inclined Plane Simulation Canvas Viewport
 * Responsive canvas rendering for 2D wedge geometry, sliding block, and FBD vectors.
 */

import React, { useRef, useEffect, useState } from 'react';
import { InclineCanvasRenderer } from '../../canvas/inclineRenderer';
import {
  InclineMode,
  InclineParameters,
  InclineState,
  InclineVectorOptions,
} from '../../physics/incline/types';
import { ShieldCheck, Eye } from 'lucide-react';

interface InclineCanvasProps {
  mode: InclineMode;
  params: InclineParameters;
  state: InclineState;
  vectorOptions: InclineVectorOptions;
  onOpenValidationModal: () => void;
  trailPositions?: number[];
}

export const InclineCanvas: React.FC<InclineCanvasProps> = ({
  mode,
  params,
  state,
  vectorOptions,
  onOpenValidationModal,
  trailPositions = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<InclineCanvasRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 420 });

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new InclineCanvasRenderer(canvasRef.current);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Re-render whenever states, parameters, or dimensions change
  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current) return;
    rendererRef.current.render(params, state, vectorOptions, trailPositions);
  }, [params, state, vectorOptions, dimensions, trailPositions]);

  const modeTitles: Record<InclineMode, { title: string; subtitle: string }> = {
    basic: {
      title: "Galileo's Incline (Frictionless)",
      subtitle: 'Diluted gravity: a = -g sin(θ) — Independence of mass',
    },
    'force-lab': {
      title: 'Force Dynamics Lab',
      subtitle: 'Applied force F_app, gravity components, and normal force balance',
    },
    'friction-lab': {
      title: 'Friction & Angle of Repose Lab',
      subtitle: 'Static hold vs kinetic sliding: tan(θ_c) = μ_s threshold',
    },
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Viewport Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              SIMULATION VIEWPORT
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-200">
              {modeTitles[mode].title}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {modeTitles[mode].subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded transition-colors cursor-pointer"
            title="Inspect automated physics test cases"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Validate Physics</span>
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] lg:h-[480px] bg-[#07090e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Live HUD telemetry pill overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-3 text-[11px] font-mono text-slate-300 pointer-events-none shadow-lg">
          <div>
            <span className="text-slate-500">s: </span>
            <span className="text-cyan-300 font-semibold">
              {state.position.toFixed(2)}m
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">v: </span>
            <span
              className={
                state.velocity > 0
                  ? 'text-emerald-400 font-semibold'
                  : state.velocity < 0
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-300'
              }
            >
              {state.velocity.toFixed(2)}m/s
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">a: </span>
            <span className="text-purple-300 font-semibold">
              {state.acceleration.toFixed(2)}m/s²
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">ΣF: </span>
            <span className="text-emerald-400 font-semibold">
              {state.netForce.toFixed(1)}N
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
