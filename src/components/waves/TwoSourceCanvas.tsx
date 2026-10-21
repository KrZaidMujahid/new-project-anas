/**
 * EQUATION 1 — Two-Source Interference 2D Canvas Component
 * Interactive 2D viewport with draggable observation probe P(x, y), render mode switches
 * (wavefield, intensity fringes, circular wavefronts), and hyperbolic nodal overlays.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis } from '../../physics/waves/types';
import { renderTwoSourceInterference } from '../../canvas/twoSourceRenderer';
import { Maximize2, Minimize2, Eye, ShieldCheck, Grid, Sparkles } from 'lucide-react';

interface TwoSourceCanvasProps {
  params: TwoSourceParameters;
  time: number;
  onChangeProbePoint: (point: { x: number; y: number }) => void;
  onChangeParams: (newParams: TwoSourceParameters) => void;
  onOpenValidationModal: () => void;
  onAnalysisUpdate?: (analysis: PointInterferenceAnalysis) => void;
}

export const TwoSourceCanvas: React.FC<TwoSourceCanvasProps> = ({
  params,
  time,
  onChangeProbePoint,
  onChangeParams,
  onOpenValidationModal,
  onAnalysisUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 480,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);
  const probeScreenRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const computedHeight = Math.max(380, Math.min(560, Math.round(width * 0.54)));
        setDimensions({
          width: Math.floor(width),
          height: computedHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous render loop
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

    const result = renderTwoSourceInterference(
      ctx,
      dimensions.width,
      dimensions.height,
      params,
      time,
      isDraggingProbe
    );

    probeScreenRef.current = result.probeScreen;
    if (onAnalysisUpdate) {
      onAnalysisUpdate(result.analysis);
    }

    ctx.restore();
  }, [dimensions, params, time, isDraggingProbe, onAnalysisUpdate]);

  // Pointer drag on probe P(x, y)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingProbe(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateProbeFromEvent(e);
  };

  const updateProbeFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const originX = dimensions.width * 0.22;
    const originY = dimensions.height * 0.5;

    const scale = Math.min(
      (dimensions.width * 0.72) / (params.fieldWidthMeters * 0.8),
      (dimensions.height * 0.85) / params.fieldHeightMeters
    );

    const newMetersX = Math.max(0.2, Math.min(params.fieldWidthMeters, (clickX - originX) / scale));
    const newMetersY = Math.max(-params.fieldHeightMeters / 2, Math.min(params.fieldHeightMeters / 2, (originY - clickY) / scale));

    onChangeProbePoint({ x: newMetersX, y: newMetersY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingProbe) return;
    updateProbeFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingProbe) {
      setIsDraggingProbe(false);
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
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#090e18]/90 border-b border-slate-800/80 backdrop-blur-sm z-10 text-xs">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
            Two-Source 2D Interference
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-cyan-300">
            d = {params.separation.toFixed(2)}m · λ = {params.wavelength.toFixed(2)}m
          </span>
        </div>

        {/* View Mode & Overlay Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Render Style Mode Selector */}
          <div className="flex bg-[#07090e] border border-slate-800 rounded p-0.5">
            <button
              onClick={() => onChangeParams({ ...params, renderMode: 'field' })}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                params.renderMode === 'field'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wavefield
            </button>
            <button
              onClick={() => onChangeParams({ ...params, renderMode: 'intensity' })}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                params.renderMode === 'intensity'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Intensity
            </button>
            <button
              onClick={() => onChangeParams({ ...params, renderMode: 'wavefronts' })}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                params.renderMode === 'wavefronts'
                  ? 'bg-purple-500/20 text-purple-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wavefronts
            </button>
          </div>

          {/* Constructive Lines Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showConstructiveHyperbolas: !params.showConstructiveHyperbolas,
              })
            }
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              params.showConstructiveHyperbolas
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle constructive interference hyperbolas (Δr = nλ)"
          >
            Antinodes (Δr = nλ)
          </button>

          {/* Destructive Lines Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showDestructiveHyperbolas: !params.showDestructiveHyperbolas,
              })
            }
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              params.showDestructiveHyperbolas
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle destructive interference nodal lines (Δr = (n+1/2)λ)"
          >
            Nodes (Δr = (n+½)λ)
          </button>

          {/* Verification Suite Button */}
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer text-[11px] font-medium"
            title="Verify Two-Source Physics Laws"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Verify</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-slate-400 hover:text-white bg-slate-800/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
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
            isDraggingProbe ? 'cursor-grabbing' : 'cursor-crosshair'
          }`}
        />
      </div>
    </div>
  );
};
