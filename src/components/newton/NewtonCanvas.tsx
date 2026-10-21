/**
 * EQUATION 1 — Newton's Laws Simulation Canvas Viewport
 * Responsive canvas rendering for 1D dynamics, force vectors, and Third Law interactions.
 */

import React, { useRef, useEffect, useState } from 'react';
import { NewtonCanvasRenderer } from '../../canvas/newtonRenderer';
import {
  NewtonFirstLawParameters,
  NewtonFirstLawState,
  NewtonMode,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
  NewtonVectorOptions,
} from '../../physics/newton/types';
import { ShieldCheck } from 'lucide-react';

interface NewtonCanvasProps {
  mode: NewtonMode;
  secondLawParams: NewtonSecondLawParameters;
  secondLawState: NewtonSecondLawState;
  firstLawParams: NewtonFirstLawParameters;
  firstLawState: NewtonFirstLawState;
  thirdLawParams: NewtonThirdLawParameters;
  thirdLawState: NewtonThirdLawState;
  vectorOptions: NewtonVectorOptions;
  onOpenValidationModal: () => void;
}

export const NewtonCanvas: React.FC<NewtonCanvasProps> = ({
  mode,
  secondLawParams,
  secondLawState,
  firstLawParams,
  firstLawState,
  thirdLawParams,
  thirdLawState,
  vectorOptions,
  onOpenValidationModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<NewtonCanvasRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 420 });

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new NewtonCanvasRenderer(canvasRef.current);
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

  // Re-render whenever states or parameters change
  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current) return;

    if (mode === 'second-law') {
      rendererRef.current.renderSecondLaw(secondLawParams, secondLawState, vectorOptions);
    } else if (mode === 'first-law') {
      rendererRef.current.renderFirstLaw(firstLawParams, firstLawState, vectorOptions);
    } else if (mode === 'third-law') {
      rendererRef.current.renderThirdLaw(thirdLawParams, thirdLawState, vectorOptions);
    }
  }, [
    mode,
    secondLawParams,
    secondLawState,
    firstLawParams,
    firstLawState,
    thirdLawParams,
    thirdLawState,
    vectorOptions,
    dimensions,
  ]);

  return (
    <div className="flex flex-col space-y-2">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              Physics · Classical Mechanics · Dynamics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Newton's Laws of Motion
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'second-law' && 'Second Law: Quantitative relationship between net force, mass, and acceleration (ΣF = ma).'}
            {mode === 'first-law' && 'First Law (Inertia): Constant velocity motion when net external force is zero.'}
            {mode === 'third-law' && 'Third Law: Simultaneous equal and opposite interaction forces between bodies (F_AB = -F_BA).'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded transition-colors cursor-pointer"
            title="Inspect Section 19 automated 7-test physics verification suite"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Physics Test Suite (7/7)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Host */}
      <div
        ref={containerRef}
        className="relative w-full h-[260px] sm:h-[360px] md:h-[450px] bg-[#07090e] border border-slate-800/90 rounded-lg overflow-hidden shadow-2xl"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Dynamic HUD Tag */}
        <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none select-none">
          {mode === 'second-law' && (
            <div className="px-2.5 py-1 bg-[#0b101b]/90 border border-slate-700/80 rounded text-[11px] font-mono text-slate-200">
              <span className="text-slate-400">ΣF = </span>
              <span className="text-emerald-400 font-bold">{secondLawState.netForce.toFixed(1)} N</span>
              <span className="text-slate-500"> | </span>
              <span className="text-slate-400">a = </span>
              <span className="text-yellow-400 font-bold">{secondLawState.acceleration.toFixed(2)} m/s²</span>
            </div>
          )}

          {mode === 'first-law' && (
            <div className="px-2.5 py-1 bg-[#0b101b]/90 border border-slate-700/80 rounded text-[11px] font-mono text-slate-200">
              <span className="text-emerald-400 font-bold">
                {Math.abs(firstLawState.netForce) < 0.001 ? 'INERTIAL STATE (a = 0)' : 'NON-ZERO NET FORCE'}
              </span>
            </div>
          )}

          {mode === 'third-law' && (
            <div className="px-2.5 py-1 bg-[#0b101b]/90 border border-slate-700/80 rounded text-[11px] font-mono text-slate-200">
              <span className="text-cyan-400 font-bold">F_AB = +{Math.abs(thirdLawState.forceOnB).toFixed(0)} N</span>
              <span className="text-slate-500"> = </span>
              <span className="text-rose-400 font-bold">-F_BA</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
