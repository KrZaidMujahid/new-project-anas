/**
 * EQUATION 1 — Simple Harmonic Motion Canvas Component
 * Interactive viewport with mouse/touch drag manipulation, vector overlays, and responsive rendering.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  SHMParameters,
  SHMDerivedValues,
  SHMState,
  SHMVectorDisplayOptions,
} from '../../physics/shm/types';
import { renderSHMCanvas } from '../../canvas/shmRenderer';
import {
  Maximize2,
  Minimize2,
  Eye,
  ShieldCheck,
  Grid,
  Zap,
} from 'lucide-react';

interface SHMCanvasProps {
  params: SHMParameters;
  derived: SHMDerivedValues;
  state: SHMState;
  vectorOptions: SHMVectorDisplayOptions;
  onChangeVectorOptions: (options: SHMVectorDisplayOptions) => void;
  onUpdateDisplacementFromDrag: (displacement: number) => void;
  onOpenValidationModal: () => void;
}

export const SHMCanvas: React.FC<SHMCanvasProps> = ({
  params,
  derived,
  state,
  vectorOptions,
  onChangeVectorOptions,
  onUpdateDisplacementFromDrag,
  onOpenValidationModal,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 420,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const massBoundsRef = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    center: { x: number; y: number };
  } | null>(null);

  // ResizeObserver for fluid responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Keep a high-fidelity aspect ratio (responsive between mobile and desktop)
        const computedHeight = width < 640
          ? Math.max(240, Math.min(340, Math.round(width * 0.65)))
          : Math.max(340, Math.min(500, Math.round(width * 0.52)));
        setDimensions({
          width: Math.floor(width),
          height: computedHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Render canvas loop on state/params/dimensions changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = `${dimensions.height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    const result = renderSHMCanvas(
      ctx,
      dimensions.width,
      dimensions.height,
      params,
      derived,
      state,
      vectorOptions,
      isDragging
    );

    massBoundsRef.current = result.massBounds || null;
    ctx.restore();
  }, [dimensions, params, derived, state, vectorOptions, isDragging]);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !massBoundsRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const b = massBoundsRef.current;
    // Check if within bounds with some margin
    const margin = 20;
    if (
      clickX >= b.x - margin &&
      clickX <= b.x + b.w + margin &&
      clickY >= b.y - margin &&
      clickY <= b.y + b.h + margin
    ) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (params.systemType === 'horizontal-spring') {
      const equilibriumX = dimensions.width * 0.52;
      const maxVisualRange = Math.max(0.35, derived.effectiveAmplitude * 1.5);
      const pxPerMeter = (dimensions.width * 0.32) / maxVisualRange;
      const deltaPx = currentX - equilibriumX;
      const newDisplacement = deltaPx / pxPerMeter;
      onUpdateDisplacementFromDrag(newDisplacement);
    } else if (params.systemType === 'vertical-spring') {
      // Natural equilibrium to static equilibrium
      const ceilingY = 50;
      const naturalSpringLength = 90;
      const naturalEquilibriumY = ceilingY + naturalSpringLength;
      const maxSpanMeters = Math.max(0.6, derived.staticExtension + derived.effectiveAmplitude * 1.5);
      const pxPerMeter = (dimensions.height * 0.48) / maxSpanMeters;
      const staticEquilibriumY = naturalEquilibriumY + derived.staticExtension * pxPerMeter;

      const deltaPx = currentY - staticEquilibriumY;
      const newDisplacement = deltaPx / pxPerMeter;
      onUpdateDisplacementFromDrag(newDisplacement);
    } else {
      // Pendulum
      const pivotX = dimensions.width * 0.5;
      const pivotY = 70;
      const dx = currentX - pivotX;
      const dy = currentY - pivotY;
      const angleRad = Math.atan2(dx, dy);
      // Small angle limit max ~25 deg
      const maxAngleRad = (25 * Math.PI) / 180;
      const clampedAngleRad = Math.max(-maxAngleRad, Math.min(maxAngleRad, angleRad));
      onUpdateDisplacementFromDrag(clampedAngleRad);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden border border-slate-800 bg-[#070b13] select-none flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Overlay Bar: Status, Mode info, Vector Toggles & Validation */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#090e18]/90 border-b border-slate-800/80 backdrop-blur-sm z-10 text-xs">
        {/* System & Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
            {params.systemType === 'horizontal-spring' && 'Horizontal Mass-Spring (Hooke\'s Law)'}
            {params.systemType === 'vertical-spring' && 'Vertical Mass-Spring (Gravity + Elastic)'}
            {params.systemType === 'pendulum' && 'Simple Gravitational Pendulum (Small Angle)'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-cyan-300">
            ω = {derived.omega.toFixed(2)} rad/s · T = {derived.period.toFixed(2)}s
          </span>
        </div>

        {/* Vector and Visualization Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Velocity Vector Toggle */}
          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showVelocityVector: !vectorOptions.showVelocityVector,
              })
            }
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              vectorOptions.showVelocityVector
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Velocity Vector v(t)"
          >
            v⃗ (Cyan)
          </button>

          {/* Restoring Force Vector Toggle */}
          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showForceVector: !vectorOptions.showForceVector,
              })
            }
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              vectorOptions.showForceVector
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Restoring Force Vector F(t)"
          >
            F⃗ (Rose)
          </button>

          {/* Acceleration Vector Toggle */}
          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showAccelerationVector: !vectorOptions.showAccelerationVector,
              })
            }
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              vectorOptions.showAccelerationVector
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Acceleration Vector a(t)"
          >
            a⃗ (Amber)
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showGrid: !vectorOptions.showGrid,
              })
            }
            className={`p-1.5 rounded text-slate-400 hover:text-white bg-slate-800/50 transition-colors cursor-pointer ${
              vectorOptions.showGrid ? 'text-cyan-400 bg-cyan-950/40' : ''
            }`}
            title="Toggle Coordinate Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Physics Validation Suite Button */}
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer text-[11px] font-medium"
            title="Run Automated SHM Physics Validation Suite"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify Laws</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-slate-400 hover:text-white bg-slate-800/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`block w-full h-full ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        />
      </div>
    </div>
  );
};
