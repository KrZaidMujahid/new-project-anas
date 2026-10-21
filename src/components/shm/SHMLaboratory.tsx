/**
 * EQUATION 1 — Simple Harmonic Motion Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Harmonic Oscillator Viewport (SHMCanvas)
 * - Top Right: Essential Parameters Deck (m, k, A) & Playback Controls
 * - Middle: Mathematical Waveform & Phase Space Graphs (x(t), v(t), a(t), E(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SHMParameters,
  SHMDerivedValues,
  SHMState,
  SHMVectorDisplayOptions,
  SHMSystemType,
  SHMPreset,
} from '../../physics/shm/types';
import {
  computeSHMDerivedValues,
  computeSHMStateAtTime,
  generateSHMSamples,
} from '../../physics/shm/model';
import { SHMSimulationEngine } from '../../physics/shm/simulationEngine';
import { SHMCanvas } from './SHMCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { SHMGraphs } from './SHMGraphs';
import { SHMPresetsModal } from './SHMPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Waves, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_SHM_PARAMS: SHMParameters = {
  systemType: 'horizontal-spring',
  inputMode: 'amplitude-phase',
  mass: 1.0,
  springConstant: 20.0,
  amplitude: 0.20,
  initialPhaseDeg: 0,
  initialDisplacement: 0.20,
  initialVelocity: 0,
  gravity: 9.80,
  pendulumLength: 1.0,
  pendulumInitialAngleDeg: 12,
};

const DEFAULT_VECTOR_OPTIONS: SHMVectorDisplayOptions = {
  showVelocityVector: true,
  showForceVector: true,
  showAccelerationVector: true,
  showEquilibriumMarker: true,
  showAmplitudeBounds: true,
  showGrid: true,
  showEnergyBar: false,
  showPhaseWheel: false,
  showTrail: true,
};

export const SHMLaboratory: React.FC = () => {
  const [params, setParams] = useState<SHMParameters>(DEFAULT_SHM_PARAMS);
  const [vectorOptions, setVectorOptions] = useState<SHMVectorDisplayOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Engine instance
  const engineRef = useRef<SHMSimulationEngine | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  if (!engineRef.current) {
    engineRef.current = new SHMSimulationEngine(10.0, true);
  }

  // Derived values
  const derived = useMemo<SHMDerivedValues>(() => {
    return computeSHMDerivedValues(params);
  }, [params]);

  // Current state
  const currentState = useMemo<SHMState>(() => {
    return computeSHMStateAtTime(params, currentTime);
  }, [params, currentTime]);

  // Trajectory samples for graph
  const samples = useMemo(() => {
    return generateSHMSamples(params, 10.0, 200);
  }, [params]);

  // Engine subscriptions
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const unsubTick = engine.onTick((time) => {
      setCurrentTime(time);
    });

    const unsubStatus = engine.onStatusChange((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      unsubTick();
      unsubStatus();
    };
  }, []);

  const handleTogglePlayPause = useCallback(() => {
    engineRef.current?.togglePlayPause();
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current?.reset();
    setCurrentTime(0);
  }, []);

  const handleSeek = useCallback((time: number) => {
    engineRef.current?.seekTo(time);
  }, []);

  const handleStepForward = useCallback(() => {
    engineRef.current?.stepForward(0.05);
  }, []);

  const handleStepBackward = useCallback(() => {
    engineRef.current?.stepBackward(0.05);
  }, []);

  const handleChangeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    engineRef.current?.setPlaybackSpeed(speed);
  }, []);

  const handleSelectSystem = (sys: SHMSystemType) => {
    setParams((p) => ({ ...p, systemType: sys }));
    handleReset();
  };

  const handleSelectPreset = (preset: SHMPreset) => {
    setParams((prev) => ({
      ...prev,
      ...preset.params,
      systemType: preset.systemType,
    }));
    handleReset();
    setIsPresetsOpen(false);
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Waves className="w-4 h-4" />
            <span>Oscillations &amp; Waves</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Simple Harmonic Motion (SHM) Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Hooke&apos;s Law restoring force, sinusoidal kinematics, phase space orbits, and mechanical energy conservation.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPresetsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset oscillator to t=0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation Canvas (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <SHMCanvas
            params={params}
            derived={derived}
            state={currentState}
            vectorOptions={vectorOptions}
            onChangeVectorOptions={setVectorOptions}
            onOpenValidationModal={() => {}}
            onUpdateDisplacementFromDrag={(d: number) => {
              setParams((p) => ({ ...p, amplitude: Math.abs(d) }));
              handleReset();
            }}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Oscillator Controls</span>
            </div>
            <button
              onClick={() => {
                setParams(DEFAULT_SHM_PARAMS);
                handleReset();
              }}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* System Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Oscillator System
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleSelectSystem('horizontal-spring')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  params.systemType === 'horizontal-spring'
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                H-Spring
              </button>
              <button
                onClick={() => handleSelectSystem('vertical-spring')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  params.systemType === 'vertical-spring'
                    ? 'border-[#A78BFA] text-[#A78BFA] bg-[#A78BFA]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                V-Spring
              </button>
              <button
                onClick={() => handleSelectSystem('pendulum')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  params.systemType === 'pendulum'
                    ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Pendulum
              </button>
            </div>
          </div>

          {/* Parameter 1: Mass m */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Mass (m)</span>
              <span className="text-[#38BDF8] font-bold">{params.mass.toFixed(2)} kg</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5.0}
              step={0.1}
              value={params.mass}
              onChange={(e) => {
                setParams((p) => ({ ...p, mass: parseFloat(e.target.value) }));
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Spring Constant k or Pendulum Length L */}
          {params.systemType === 'pendulum' ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F8FAFC]">Length (L)</span>
                <span className="text-[#FBBF24] font-bold">{params.pendulumLength.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.05}
                value={params.pendulumLength}
                onChange={(e) => {
                  setParams((p) => ({ ...p, pendulumLength: parseFloat(e.target.value) }));
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F8FAFC]">Spring Constant (k)</span>
                <span className="text-[#FBBF24] font-bold">{params.springConstant.toFixed(1)} N/m</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={60.0}
                step={1.0}
                value={params.springConstant}
                onChange={(e) => {
                  setParams((p) => ({ ...p, springConstant: parseFloat(e.target.value) }));
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
              />
            </div>
          )}

          {/* Parameter 3: Amplitude A */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Amplitude (A)</span>
              <span className="text-[#34D399] font-bold">{(params.amplitude * 100).toFixed(0)} cm</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.50}
              step={0.01}
              value={params.amplitude}
              onChange={(e) => {
                setParams((p) => ({ ...p, amplitude: parseFloat(e.target.value) }));
                handleReset();
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Derived Period & Frequency Readouts */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Angular (ω₀)</div>
              <div className="text-xs font-bold text-[#38BDF8]">{derived.omega.toFixed(2)} r/s</div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Period (T)</div>
              <div className="text-xs font-bold text-[#FBBF24]">{derived.period.toFixed(2)} s</div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Energy (E)</div>
              <div className="text-xs font-bold text-[#34D399]">{derived.totalEnergy.toFixed(3)} J</div>
            </div>
          </div>

          {/* Playback Controls Container */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              timeOfFlight={10.0}
              playbackSpeed={playbackSpeed}
              onTogglePlayPause={handleTogglePlayPause}
              onReset={handleReset}
              onSeek={handleSeek}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onChangeSpeed={handleChangeSpeed}
            />
          </div>
        </div>
      </div>

      {/* 3. Mathematical Graphs: x(t), v(t), a(t), Phase Orbit */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <SHMGraphs
          params={params}
          derived={derived}
          state={currentState}
          samples={samples}
          currentTime={currentTime}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Simple Harmonic Motion Equations"
        formula="x(t) = A \cos(\omega_0 t + \phi) \quad \text{and} \quad a(t) = -\omega_0^2 x(t)"
        additionalFormula="\omega_0 = \sqrt{\frac{k}{m}} \quad \text{and} \quad T = 2\pi\sqrt{\frac{m}{k}} \quad \text{and} \quad E = \frac{1}{2}kA^2"
        description="A restoring force proportional to displacement (F = -kx) governs simple harmonic motion. Acceleration is strictly opposite to displacement, yielding sinusoidal oscillation whose period T is strictly independent of amplitude A."
        parameters={[
          { symbol: 'm', name: 'Oscillator Mass', unit: 'kg' },
          { symbol: 'k', name: 'Spring Constant', unit: 'N/m' },
          { symbol: 'A', name: 'Oscillation Amplitude', unit: 'm' },
          { symbol: '\\omega_0', name: 'Natural Frequency', unit: 'rad/s' },
          { symbol: 'T', name: 'Period of Motion', unit: 's' },
          { symbol: 'E', name: 'Total Energy', unit: 'J' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <SHMPresetsModal
          isOpen={isPresetsOpen}
          onClose={() => setIsPresetsOpen(false)}
          onSelectPreset={handleSelectPreset}
        />
      )}
    </div>
  );
};
