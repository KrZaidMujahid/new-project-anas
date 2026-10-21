/**
 * EQUATION 1 — Inclined Plane Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Interactive Ramp Visualization (InclineCanvas)
 * - Top Right: Essential Parameters Deck (θ, m, μ, F) & Playback Controls
 * - Middle: Mathematical Kinematic Graphs (s(t), v(t), a(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  InclineMode,
  InclineParameters,
  InclinePreset,
  InclineSample,
  InclineState,
  InclineVectorOptions,
} from '../../physics/incline/types';
import {
  computeInclineStateAtTime,
  generateInclineSamples,
} from '../../physics/incline/model';
import { InclineSimulationEngine } from '../../physics/incline/simulationEngine';
import { InclineCanvas } from './InclineCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { InclineGraphs } from './InclineGraphs';
import { InclinePresetsModal } from './InclinePresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Scale, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_BASIC_PARAMS: InclineParameters = {
  mass: 5.0,
  angleDeg: 30,
  appliedForceMag: 0,
  appliedForceDirection: 'up',
  frictionEnabled: false,
  staticFrictionCoeff: 0.35,
  kineticFrictionCoeff: 0.25,
  gravity: 9.8,
  initialPosition: 16.0,
  initialVelocity: 0,
  rampLength: 20.0,
};

const DEFAULT_FORCE_PARAMS: InclineParameters = {
  mass: 5.0,
  angleDeg: 30,
  appliedForceMag: 35.0,
  appliedForceDirection: 'up',
  frictionEnabled: false,
  staticFrictionCoeff: 0.35,
  kineticFrictionCoeff: 0.25,
  gravity: 9.8,
  initialPosition: 2.0,
  initialVelocity: 0,
  rampLength: 20.0,
};

const DEFAULT_FRICTION_PARAMS: InclineParameters = {
  mass: 5.0,
  angleDeg: 28,
  appliedForceMag: 0,
  appliedForceDirection: 'up',
  frictionEnabled: true,
  staticFrictionCoeff: 0.45,
  kineticFrictionCoeff: 0.3,
  gravity: 9.8,
  initialPosition: 15.0,
  initialVelocity: 0,
  rampLength: 20.0,
};

const DEFAULT_VECTOR_OPTIONS: InclineVectorOptions = {
  showWeightVector: true,
  showNormalForce: true,
  showGravityComponents: true,
  showFrictionForce: true,
  showAppliedForce: true,
  showNetForce: false,
  showVelocityVector: true,
  showAccelerationVector: true,
  showAngleArc: true,
  showForceValues: true,
  showMotionTrail: true,
  showEnergyHUD: true,
};

export const InclineLaboratory: React.FC = () => {
  const [mode, setMode] = useState<InclineMode>('basic');
  const [params, setParams] = useState<InclineParameters>(DEFAULT_BASIC_PARAMS);
  const [vectorOptions, setVectorOptions] = useState<InclineVectorOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Decoupled Simulation Engine
  const engineRef = useRef<InclineSimulationEngine | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [trailPositions, setTrailPositions] = useState<number[]>([]);

  if (!engineRef.current) {
    engineRef.current = new InclineSimulationEngine(8.0);
  }

  // Engine callbacks
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

  // Compute live state
  const currentState = useMemo<InclineState>(() => {
    return computeInclineStateAtTime(params, currentTime);
  }, [params, currentTime]);

  // Compute trajectory samples for graphing
  const samples = useMemo<InclineSample[]>(() => {
    return generateInclineSamples(params, 8.0, 0.05);
  }, [params]);

  // Trail accumulation
  useEffect(() => {
    if (isPlaying) {
      setTrailPositions((prev) => [...prev.slice(-30), currentState.position]);
    }
  }, [currentState.position, isPlaying]);

  // Playback handlers
  const handleTogglePlayPause = useCallback(() => {
    engineRef.current?.togglePlayPause();
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current?.reset();
    setCurrentTime(0);
    setTrailPositions([]);
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

  const handleSelectMode = (newMode: InclineMode) => {
    setMode(newMode);
    handleReset();
    if (newMode === 'basic') setParams(DEFAULT_BASIC_PARAMS);
    else if (newMode === 'force-lab') setParams(DEFAULT_FORCE_PARAMS);
    else setParams(DEFAULT_FRICTION_PARAMS);
  };

  const handleSelectPreset = (preset: InclinePreset) => {
    setMode(preset.mode);
    setParams(preset.params);
    handleReset();
    setIsPresetsOpen(false);
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Scale className="w-4 h-4" />
            <span>Classical Mechanics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Inclined Plane &amp; Friction Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Galileo&apos;s ramp, orthogonal gravitational component decomposition, static &amp; kinetic friction.
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
            title="Reset block position to initial point"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <InclineCanvas
            mode={mode}
            params={params}
            state={currentState}
            vectorOptions={vectorOptions}
            onOpenValidationModal={() => {}}
            trailPositions={trailPositions}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Ramp Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Experiment Mode
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleSelectMode('basic')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  mode === 'basic'
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Ideal Ramp
              </button>
              <button
                onClick={() => handleSelectMode('friction-lab')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  mode === 'friction-lab'
                    ? 'border-[#A78BFA] text-[#A78BFA] bg-[#A78BFA]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Friction
              </button>
              <button
                onClick={() => handleSelectMode('force-lab')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  mode === 'force-lab'
                    ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Applied Force
              </button>
            </div>
          </div>

          {/* Parameter 1: Incline Angle θ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Incline Angle (θ)</span>
              <span className="text-[#38BDF8] font-bold">{params.angleDeg}°</span>
            </div>
            <input
              type="range"
              min={5}
              max={75}
              step={1}
              value={params.angleDeg}
              onChange={(e) => {
                setParams((p) => ({ ...p, angleDeg: parseInt(e.target.value) }));
                handleReset();
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Block Mass m */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Block Mass (m)</span>
              <span className="text-[#FBBF24] font-bold">{params.mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={25.0}
              step={0.5}
              value={params.mass}
              onChange={(e) => {
                setParams((p) => ({ ...p, mass: parseFloat(e.target.value) }));
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Friction Coefficient μk (in friction mode) */}
          {mode === 'friction-lab' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F8FAFC]">Kinetic Friction (μₖ)</span>
                <span className="text-[#34D399] font-bold">{params.kineticFrictionCoeff.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={params.kineticFrictionCoeff}
                onChange={(e) => {
                  setParams((p) => ({
                    ...p,
                    kineticFrictionCoeff: parseFloat(e.target.value),
                    staticFrictionCoeff: Math.min(1.0, parseFloat(e.target.value) + 0.1),
                  }));
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
              />
            </div>
          )}

          {/* Parameter 4: Applied Force (in force mode) */}
          {mode === 'force-lab' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F8FAFC]">Applied Force (F)</span>
                <span className="text-[#A78BFA] font-bold">{params.appliedForceMag.toFixed(0)} N</span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={5}
                value={params.appliedForceMag}
                onChange={(e) => {
                  setParams((p) => ({ ...p, appliedForceMag: parseFloat(e.target.value) }));
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
              />
            </div>
          )}

          {/* Real-time Force Components */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Parallel Drive (W∥)</div>
              <div className="text-sm font-bold text-[#38BDF8]">
                {(params.mass * params.gravity * Math.sin((params.angleDeg * Math.PI) / 180)).toFixed(1)} N
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Normal Force (N)</div>
              <div className="text-sm font-bold text-[#FBBF24]">
                {(params.mass * params.gravity * Math.cos((params.angleDeg * Math.PI) / 180)).toFixed(1)} N
              </div>
            </div>
          </div>

          {/* Playback Controls Container */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              timeOfFlight={8.0}
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

      {/* 3. Mathematical Graphs: Position s(t), Velocity v(t), Acceleration a(t) */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Ramp Kinematics Graphs
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Continuous Motion Functions</span>
        </div>
        <InclineGraphs samples={samples} currentTime={currentTime} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Inclined Plane Dynamic Equations"
        formula="W_\parallel = mg \sin\theta \quad \text{and} \quad N = mg \cos\theta"
        additionalFormula="a = g(\sin\theta - \mu_k \cos\theta)"
        description="Gravitational force decomposes along the ramp into a parallel downslope component W∥ and a perpendicular component balanced by the normal force N. The net downslope acceleration a is independent of block mass m when friction is proportional to normal load."
        parameters={[
          { symbol: '\\theta', name: 'Incline Angle', unit: 'degrees' },
          { symbol: 'm', name: 'Block Mass', unit: 'kg' },
          { symbol: '\\mu_k', name: 'Kinetic Friction', unit: 'dimensionless' },
          { symbol: 'W_\\parallel', name: 'Parallel Gravity', unit: 'N' },
          { symbol: 'N', name: 'Normal Force', unit: 'N' },
          { symbol: 'a', name: 'Downslope Accel.', unit: 'm/s²' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <InclinePresetsModal
          isOpen={isPresetsOpen}
          onClose={() => setIsPresetsOpen(false)}
          onSelectPreset={handleSelectPreset}
        />
      )}
    </div>
  );
};
