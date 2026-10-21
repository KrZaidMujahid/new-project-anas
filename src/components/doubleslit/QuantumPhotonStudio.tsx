/**
 * EQUATION 1 — Quantum Photon & Wave-Particle Duality Studio
 * Interactive quantum mechanical simulation of Young's experiment:
 * - Single-photon-by-single-photon accumulation onto the detector
 * - Demonstration of probability density P(x) = |Psi(x)|^2
 * - "Which-Way" (Welcher-Weg) detector measurement and decoherence
 * - Quantum wavepacket collapse vs coherent superposition
 * - De Broglie wavelength lambda = h / p connection
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Atom,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { calculateIntensityAtY, samplePhotonHit, wavelengthToRGB } from '../../physics/doubleslit/model';
import { DoubleSlitParameters } from '../../physics/doubleslit/types';

export const QuantumPhotonStudio: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [whichWay, setWhichWay] = useState<boolean>(false);
  const [photonHits, setPhotonHits] = useState<{ id: number; yMm: number; slit?: 1 | 2 }[]>([]);
  const [rate, setRate] = useState<number>(60); // photons per sec
  const [wavelengthNm, setWavelengthNm] = useState<number>(532);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastSampleRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);

  // Bench parameters for quantum mode
  const quantumParams: DoubleSlitParameters = useMemo(
    () => ({
      wavelengthNm,
      isWhiteLight: false,
      coherence: 'coherent',
      slitSeparationMm: 0.25,
      slitWidthMm: 0.04,
      screenDistanceM: 1.2,
      slitMode: 'double',
      slit1Open: true,
      slit2Open: true,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0,
      quantumMode: true,
      whichWayDetector: whichWay,
      photonEmissionRate: rate,
      showWaveField: false,
      showRays: false,
      showIntensityGraph: true,
      showEnvelope: true,
      showFringes: true,
      showGrid: true,
      showPhasor: false,
      showCentralMarker: true,
      showFringeLabels: true,
      showIntensityScale: true,
      pureInterferenceMode: false,
      intensityPercent: 70,
      detectorYMm: 0,
    }),
    [whichWay, rate, wavelengthNm]
  );

  // Screen layout
  const screenSpanMm = 25;

  // Photon sampling loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (isRunning) {
        const interval = 1000 / rate;
        if (time - lastSampleRef.current >= interval) {
          lastSampleRef.current = time;
          const y = samplePhotonHit(quantumParams, screenSpanMm);
          const chosenSlit: 1 | 2 | undefined = whichWay ? (Math.random() > 0.5 ? 1 : 2) : undefined;

          setPhotonHits((prev) => {
            const next = [...prev, { id: nextIdRef.current++, yMm: y, slit: chosenSlit }];
            if (next.length > 2500) {
              return next.slice(next.length - 2500);
            }
            return next;
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, rate, quantumParams, whichWay]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark scientific screen background
    ctx.fillStyle = '#060E1A';
    ctx.fillRect(0, 0, w, h);

    // Grid ticks
    ctx.strokeStyle = '#17263B';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = '#26364D';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw accumulated photon dots
    const rgb = wavelengthToRGB(wavelengthNm);
    for (const p of photonHits) {
      // Map yMm [-25, +25] to canvas X [40, w - 40]
      const px = w / 2 + (p.yMm / screenSpanMm) * (w / 2 - 40);
      // Random vertical jitter to give visual screen height
      const py = 20 + Math.random() * (h - 40);

      if (whichWay && p.slit) {
        ctx.fillStyle = p.slit === 1 ? '#FBBF24' : '#38BDF8';
      } else {
        ctx.fillStyle = rgb.hex;
      }

      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [photonHits, whichWay, wavelengthNm]);

  const handleReset = () => {
    setPhotonHits([]);
  };

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#F1F5F9] flex items-center gap-2.5">
            <Atom className="w-5 h-5 text-[#A78BFA]" />
            <span>QUANTUM PHOTON & WAVE-PARTICLE DUALITY STUDIO</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            "A phenomenon which is impossible, absolutely impossible, to explain in any classical way, and which has in it the heart of quantum mechanics." — Richard Feynman
          </p>
        </div>

        {/* Status controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-xs font-bold transition-colors cursor-pointer"
          >
            {isRunning ? <Pause className="w-4 h-4 text-[#FBBF24]" /> : <Play className="w-4 h-4 text-[#34D399]" />}
            <span>{isRunning ? 'Pause Stream' : 'Resume'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-xs font-bold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Screen</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN EXPERIMENT CANVAS */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26364D] pb-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#94A3B8]">Photons Detected:</span>
            <span className="font-mono font-bold text-base text-[#38BDF8]">{photonHits.length}</span>
          </div>

          {/* Observer Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setWhichWay(!whichWay);
                setPhotonHits([]);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                whichWay
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-md'
                  : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              }`}
            >
              {whichWay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>
                {whichWay ? 'Which-Way Detector ON (Decoherence Active!)' : 'No Observer (Coherent Superposition)'}
              </span>
            </button>
          </div>

          {/* Rate slider */}
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8]">Rate:</span>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value))}
              className="w-24 accent-[#A78BFA] cursor-pointer"
            />
            <span className="font-mono font-bold text-[#A78BFA] w-12 text-right">{rate}/s</span>
          </div>
        </div>

        {/* Screen Canvas */}
        <div className="relative w-full aspect-[900/320] bg-[#060E1A] rounded-lg border border-[#26364D] overflow-hidden">
          <canvas ref={canvasRef} width={900} height={320} className="w-full h-full block" />

          {/* Overlay Labels */}
          <div className="absolute top-3 left-4 text-xs font-mono bg-[#0B1728]/80 px-2.5 py-1 rounded border border-[#26364D]">
            State:{' '}
            <strong className={whichWay ? 'text-rose-400' : 'text-emerald-400'}>
              {whichWay ? '|Ψ₁⟩ OR |Ψ₂⟩ (Collapsed Mixture)' : '|Ψ⟩ = (|Ψ₁⟩ + |Ψ₂⟩)/√2 (Entangled Superposition)'}
            </strong>
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono bg-[#0B1728]/80 px-3 py-0.5 rounded border border-[#26364D]">
            Screen Coordinate y (Center y = 0)
          </div>
        </div>

        {/* Explanation Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>When Which-Way Detector is OFF</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Each single photon interferes with itself! The probability amplitude <strong className="text-white font-mono">Ψ = Ψ₁ + Ψ₂</strong> leads to the interference term <strong className="text-white font-mono">|Ψ|² = |Ψ₁|² + |Ψ₂|² + 2 Re(Ψ₁*Ψ₂)</strong>. Even when photons are sent one by one, fringes emerge over time!
            </p>
          </div>

          <div className="bg-[#0B1728] p-3 rounded-lg border border-[#26364D] space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-400" />
              <span>When Which-Way Detector is ON</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Measuring which slit the photon passed through forces the quantum state to collapse. Phase coherence is permanently destroyed (<strong className="text-white font-mono">Re(Ψ₁*Ψ₂) = 0</strong>), and the fringes vanish into two simple overlapping single-slit distributions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
