/**
 * EQUATION 1 — Wave Interference Simulation Canvas Component
 * Interactive high-DPI canvas viewport with click-to-place probe P(x, y),
 * dragging, wavefront overlays, and responsive resizing.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TwoSourceParameters, PointInterferenceAnalysis } from '../../physics/waves/types';
import { renderTwoSourceInterference } from '../../canvas/twoSourceRenderer';
import { Maximize2, Minimize2, Eye, ShieldCheck, Sparkles, Crosshair } from 'lucide-react';

interface WaveSimulationCanvasProps {
  params: TwoSourceParameters;
  time: number;
  onChangeProbePoint: (point: { x: number; y: number }) => void;
  onChangeParams: (newParams: TwoSourceParameters) => void;
  onAnalysisUpdate?: (analysis: PointInterferenceAnalysis) => void;
}

export const WaveSimulationCanvas: React.FC<WaveSimulationCanvasProps> = ({
  params,
  time,
  onChangeProbePoint,
  onChangeParams,
  onAnalysisUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 820,
    height: 480,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);
  const toMetersRef = useRef<((sx: number, sy: number) => { x: number; y: number }) | null>(null);

  // ResizeObserver for responsive adaptation
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const computedHeight = Math.max(380, Math.min(620, Math.round(width * 0.56)));
        setDimensions({
          width: Math.floor(width),
          height: computedHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous animation frame rendering
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

    toMetersRef.current = result.toMeters;
    if (onAnalysisUpdate) {
      onAnalysisUpdate(result.analysis);
    }

    ctx.restore();
  }, [dimensions, params, time, isDraggingProbe, onAnalysisUpdate]);

  // Pointer interactions: Click or Drag anywhere to place observation point P
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingProbe(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateProbeLocation(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingProbe) return;
    updateProbeLocation(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingProbe(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const updateProbeLocation = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !toMetersRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const meters = toMetersRef.current(sx, sy);
    onChangeProbePoint(meters);
  };

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
      {/* Top Floating Overlay Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Active Mode Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101D30]/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-cyan-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider">
              {params.activeVizMode === 'two-source' && 'Two-Source Wavefield'}
              {params.activeVizMode === 'constructive' && 'Constructive Maxima (Δr = nλ)'}
              {params.activeVizMode === 'destructive' && 'Destructive Nodes (Δr = [n+½]λ)'}
              {params.activeVizMode === 'resultant' && 'Superposition Wave View'}
              {params.activeVizMode === 'intensity' && '2D Interference Intensity Map'}
            </span>
          </div>

          {/* Quick Overlays Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showWavefronts: !params.showWavefronts,
              })
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md transition-colors cursor-pointer border ${
              params.showWavefronts
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#101D30]/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle expanding circular wavefront rings"
          >
            Wavefronts
          </button>

          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showConstructiveHyperbolas: !params.showConstructiveHyperbolas,
              })
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md transition-colors cursor-pointer border ${
              params.showConstructiveHyperbolas
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                : 'bg-[#101D30]/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle antinodal constructive hyperbolic curves"
          >
            Antinodes (Δr=nλ)
          </button>

          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showDestructiveHyperbolas: !params.showDestructiveHyperbolas,
              })
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md transition-colors cursor-pointer border ${
              params.showDestructiveHyperbolas
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-[#101D30]/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle nodal destructive hyperbolic curves"
          >
            Nodes (Δr=[n+½]λ)
          </button>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="block w-full h-full cursor-crosshair touch-none"
      />
    </div>
  );
};
