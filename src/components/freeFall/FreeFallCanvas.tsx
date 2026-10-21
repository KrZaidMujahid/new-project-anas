/**
 * EQUATION 1 — Free Fall Canvas Viewport
 * Responsive canvas host with auto-scale and mouse inspection probe.
 */

import React, { useRef, useEffect, useState } from 'react';
import { FreeFallCanvasRenderer } from '../../canvas/freeFallRenderer';
import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallSample,
  FreeFallState,
  FreeFallVectorOptions,
} from '../../physics/freeFall/types';
import { ShieldAlert, Crosshair } from 'lucide-react';

interface FreeFallCanvasProps {
  parameters: FreeFallParameters;
  analytical: FreeFallAnalytical;
  currentState: FreeFallState;
  trajectorySamples: FreeFallSample[];
  vectorOptions: FreeFallVectorOptions;
  onOpenValidationModal: () => void;
}

export const FreeFallCanvas: React.FC<FreeFallCanvasProps> = ({
  parameters,
  analytical,
  currentState,
  trajectorySamples,
  vectorOptions,
  onOpenValidationModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<FreeFallCanvasRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 480 });

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new FreeFallCanvasRenderer(canvasRef.current);
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

  // Render trigger
  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current) return;
    rendererRef.current.render(
      parameters,
      analytical,
      currentState,
      trajectorySamples,
      vectorOptions
    );
  }, [
    parameters,
    analytical,
    currentState,
    trajectorySamples,
    vectorOptions,
    dimensions,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cy = e.clientY - rect.top;

    const vp = rendererRef.current.calculateViewport(
      parameters,
      analytical,
      dimensions.width,
      dimensions.height
    );
    const worldY = rendererRef.current.canvasYToWorld(cy, vp);

    rendererRef.current.setHoverHeight(Math.max(0, worldY));
    rendererRef.current.render(
      parameters,
      analytical,
      currentState,
      trajectorySamples,
      vectorOptions
    );
  };

  const handleMouseLeave = () => {
    if (!rendererRef.current) return;
    rendererRef.current.setHoverHeight(null);
    rendererRef.current.render(
      parameters,
      analytical,
      currentState,
      trajectorySamples,
      vectorOptions
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              Physics · Mechanics · 1D Kinematics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Free Fall
          </h1>
          <p className="text-xs text-slate-400">
            Explore vertical motion under constant gravitational acceleration with zero aerodynamic drag.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded transition-colors cursor-pointer"
            title="Inspect Section 9 automated physics test verification suite"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Physics Validation Suite</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] bg-[#07090e] border border-slate-800/90 rounded-lg overflow-hidden shadow-2xl"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block cursor-crosshair"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Viewport status tags */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none select-none">
          <div className="px-2 py-0.5 bg-[#0b101b]/80 border border-slate-800 rounded text-[10px] font-mono text-slate-400 backdrop-blur-sm">
            <span>SCALE: AUTO-FIT</span>
          </div>
          {currentState.isGrounded && (
            <div className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded text-[10px] font-mono text-emerald-300 font-semibold backdrop-blur-sm">
              GROUND IMPACT REACHED (y = 0.0 m)
            </div>
          )}
        </div>

        <div className="absolute bottom-3 right-3 pointer-events-none select-none hidden sm:block">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-[#07090e]/70 px-2 py-0.5 rounded border border-slate-800/60">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>Hover vertical axis to probe (y, t, v)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
