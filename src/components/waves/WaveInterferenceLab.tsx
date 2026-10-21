/**
 * EQUATION 1 — Wave Interference Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: 2D Wave Ripple Tank (WaveSimulationCanvas)
 * - Top Right: Essential Parameters Deck (Separation d, Wavelength λ, Frequency f) & Playback Controls
 * - Middle: Mathematical Superposition Graph (WaveResultantGraph)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  TwoSourceParameters,
  PointInterferenceAnalysis,
} from '../../physics/waves/types';
import { analyzeTwoSourcePoint } from '../../physics/waves/model';
import { WaveSimulationCanvas } from './WaveSimulationCanvas';
import { WaveResultantGraph } from './WaveResultantGraph';
import { PlaybackControls } from '../PlaybackControls';
import { FormulaCard } from '../FormulaCard';
import { Waves, RotateCcw, Sliders } from 'lucide-react';

const DEFAULT_TWO_SOURCE_PARAMS: TwoSourceParameters = {
  separation: 2.0, // 2.0 m
  wavelength: 1.0, // 1.0 m
  frequency: 2.0, // 2.0 Hz
  amplitude: 1.0,
  amplitude1: 1.0,
  amplitude2: 1.0,
  phaseDifferenceDeg: 0,
  sourcePhase1Deg: 0,
  sourcePhase2Deg: 0,
  waveSpeed: 2.0, // v = f * λ
  lockSpeedToPhysics: true,
  fieldWidthMeters: 12.0,
  fieldHeightMeters: 8.0,
  showWavefronts: true,
  showConstructiveHyperbolas: true,
  showDestructiveHyperbolas: true,
  renderMode: 'field',
  activeVizMode: 'two-source',
  probePoint: { x: 3.5, y: 0.0 },
};

export const WaveInterferenceLab: React.FC = () => {
  const [params, setParams] = useState<TwoSourceParameters>(DEFAULT_TWO_SOURCE_PARAMS);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Instantaneous observation point analysis
  const currentAnalysis = useMemo<PointInterferenceAnalysis>(() => {
    return analyzeTwoSourcePoint(params, params.probePoint.x, params.probePoint.y, currentTime);
  }, [params, currentTime]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const elapsed = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const dt = Math.min(0.1, elapsed) * playbackSpeed;
      setCurrentTime((prev) => prev + dt);

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameIdRef.current !== null) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleParamChange = useCallback(
    <K extends keyof TwoSourceParameters>(key: K, value: TwoSourceParameters[K]) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        if (key === 'frequency' || key === 'wavelength') {
          next.waveSpeed = next.frequency * next.wavelength;
        }
        return next;
      });
    },
    []
  );

  const handleResetDefaults = useCallback(() => {
    setParams(DEFAULT_TWO_SOURCE_PARAMS);
    setCurrentTime(0);
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Waves className="w-4 h-4" />
            <span>Wave Mechanics &amp; Interference</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Two-Source Wave Interference Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Phase superposition, path length difference, constructive nodal lines, and destructive interference hyperbolas.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset parameters to standard 2m separation defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Wavefield Viewport (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <WaveSimulationCanvas
            params={params}
            time={currentTime}
            onChangeProbePoint={(pt) => handleParamChange('probePoint', pt)}
            onChangeParams={setParams}
          />
        </div>

        {/* Right: Essential Parameters Deck (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Wave Parameters</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Source Separation d */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Source Separation (d)</span>
              <span className="text-[#38BDF8] font-bold">{params.separation.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={params.separation}
              onChange={(e) => handleParamChange('separation', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Wavelength λ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Wavelength (λ)</span>
              <span className="text-[#FBBF24] font-bold">{params.wavelength.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={3.0}
              step={0.1}
              value={params.wavelength}
              onChange={(e) => handleParamChange('wavelength', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Frequency f */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Frequency (f)</span>
              <span className="text-[#34D399] font-bold">{params.frequency.toFixed(2)} Hz</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={4.0}
              step={0.1}
              value={params.frequency}
              onChange={(e) => handleParamChange('frequency', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Key Calculated Interference Readouts */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Wave Speed (v)</div>
              <div className="text-sm font-bold text-[#A78BFA] mt-0.5">
                {(params.frequency * params.wavelength).toFixed(2)} m/s
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Path Difference (Δr)</div>
              <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                {currentAnalysis.pathDifference.toFixed(2)} m
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              timeOfFlight={10.0}
              playbackSpeed={playbackSpeed}
              onTogglePlayPause={() => setIsPlaying((p) => !p)}
              onReset={() => setCurrentTime(0)}
              onSeek={(t) => setCurrentTime(t)}
              onStepForward={() => setCurrentTime((t) => t + 0.1)}
              onStepBackward={() => setCurrentTime((t) => Math.max(0, t - 0.1))}
              onChangeSpeed={setPlaybackSpeed}
            />
          </div>
        </div>
      </div>

      {/* 3. Mathematical Superposition Graph */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Superposition Waveform y(x) &amp; Oscillation y(t)
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">
            Linear Wave Addition: y_net = y1 + y2
          </span>
        </div>
        <WaveResultantGraph
          params={params}
          time={currentTime}
          analysis={currentAnalysis}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Principle of Linear Superposition & Wave Interference"
        formula="y_{\text{net}}(\vec{r}, t) = y_1(\vec{r}_1, t) + y_2(\vec{r}_2, t)"
        additionalFormula="\Delta r = |r_1 - r_2| = m\lambda \quad (\text{Constructive}) \quad \text{or} \quad \left(m + \frac{1}{2}\right)\lambda \quad (\text{Destructive})"
        description="When two coherent waves overlap, the resultant displacement equals the instantaneous vector sum of the individual wave displacements. The interference condition depends strictly on path difference Δr relative to wavelength λ."
        parameters={[
          { symbol: '\\Delta r', name: 'Path Difference', unit: 'm' },
          { symbol: '\\lambda', name: 'Wavelength', unit: 'm' },
          { symbol: 'd', name: 'Source Separation', unit: 'm' },
          { symbol: 'f', name: 'Wave Frequency', unit: 'Hz' },
          { symbol: 'v', name: 'Phase Propagation Velocity', unit: 'm/s' },
          { symbol: 'm', name: 'Interference Order', unit: '0, 1, 2, ...' },
        ]}
      />
    </div>
  );
};
