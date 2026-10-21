/**
 * EQUATION 1 — Wave Superposition Canvas Component
 * Interactive high-DPI viewport with mouse/touch drag manipulation of the spatial probe,
 * wave visibility toggles, and responsive canvas sizing.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WaveSuperpositionParameters } from '../../physics/waves/types';
import { renderWaveSuperposition } from '../../canvas/waveSuperpositionRenderer';
import { Maximize2, Minimize2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface WaveSuperpositionCanvasProps {
  params: WaveSuperpositionParameters;
  time: number;
  onChangeProbeX: (newX: number) => void;
  onChangeParams: (newParams: WaveSuperpositionParameters) => void;
  onOpenValidationModal: () => void;
}

export const WaveSuperpositionCanvas: React.FC<WaveSuperpositionCanvasProps> = ({
  params,
  time,
  onChangeProbeX,
  onChangeParams,
  onOpenValidationModal,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 400,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);

  // ResizeObserver for fluid responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const computedHeight = Math.max(360, Math.min(500, Math.round(width * 0.48)));
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

    renderWaveSuperposition(ctx, dimensions.width, dimensions.height, params, time);

    ctx.restore();
  }, [dimensions, params, time]);

  // Pointer drag on probe
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDraggingProbe(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateProbeFromEvent(e);
  };

  const updateProbeFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const paddingLeft = 60;
    const paddingRight = 40;
    const plotWidth = dimensions.width - paddingLeft - paddingRight;

    const normalizedRatio = Math.max(0, Math.min(1, (clickX - paddingLeft) / plotWidth));
    const newX = normalizedRatio * params.spatialSpanMeters;
    onChangeProbeX(newX);
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
      {/* Top Overlay Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#090e18]/90 border-b border-slate-800/80 backdrop-blur-sm z-10 text-xs">
        {/* Title / Description */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
            Wave Superposition Canvas
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-cyan-300">
            Linear Addition y_R(x,t) = y₁(x,t) + y₂(x,t)
          </span>
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Wave 1 Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                wave1: { ...params.wave1, visible: !params.wave1.visible },
              })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              params.wave1.visible
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Wave 1 visibility"
          >
            {params.wave1.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>Wave 1 (Cyan)</span>
          </button>

          {/* Wave 2 Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                wave2: { ...params.wave2, visible: !params.wave2.visible },
              })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              params.wave2.visible
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Wave 2 visibility"
          >
            {params.wave2.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>Wave 2 (Violet)</span>
          </button>

          {/* Resultant Wave Toggle */}
          <button
            onClick={() =>
              onChangeParams({
                ...params,
                showResultant: !params.showResultant,
              })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              params.showResultant
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
            title="Toggle Resultant Wave visibility"
          >
            {params.showResultant ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>Resultant (Amber)</span>
          </button>

          {/* Verification Suite Button */}
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer text-[11px] font-medium"
            title="Verify 12 Wave Physics Laws"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Verify Physics</span>
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
            isDraggingProbe ? 'cursor-ew-resize' : 'cursor-crosshair'
          }`}
        />
      </div>
    </div>
  );
};
