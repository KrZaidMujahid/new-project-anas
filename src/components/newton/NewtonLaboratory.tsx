/**
 * EQUATION 1 — Newton's Laws of Motion Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Dynamics Track Viewport (NewtonCanvas)
 * - Top Right: Essential Parameters Deck (m, F_applied, friction) & Playback Controls
 * - Middle: Mathematical Dynamics Graphs (F(t), a(t), v(t), x(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  NewtonFirstLawParameters,
  NewtonFirstLawState,
  NewtonMode,
  NewtonPreset,
  NewtonSample,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
  NewtonVectorOptions,
} from '../../physics/newton/types';
import {
  computeFirstLawStateAtTime,
  computeSecondLawStateAtTime,
  computeThirdLawStateAtTime,
  generateNewtonSecondLawSamples,
} from '../../physics/newton/model';
import { NewtonSimulationEngine } from '../../physics/newton/simulationEngine';
import { NewtonCanvas } from './NewtonCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { NewtonGraphs } from './NewtonGraphs';
import { NewtonPresetsModal } from './NewtonPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Activity, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_SECOND_LAW_PARAMS: NewtonSecondLawParameters = {
  mass: 2.0,
  appliedForce: 10.0,
  opposingForce: 0.0,
  initialVelocity: 0.0,
  frictionEnabled: false,
  frictionCoeff: 0.2,
  gravity: 9.8,
};

const DEFAULT_FIRST_LAW_PARAMS: NewtonFirstLawParameters = {
  mass: 5.0,
  initialVelocity: 5.0,
  appliedForce: 0.0,
  initialPosition: 0.0,
};

const DEFAULT_THIRD_LAW_PARAMS: NewtonThirdLawParameters = {
  massA: 2.0,
  massB: 5.0,
  interactionForce: 20.0,
  interactionDuration: 1.0,
};

const DEFAULT_VECTOR_OPTIONS: NewtonVectorOptions = {
  showAppliedForce: true,
  showFrictionForce: true,
  showNetForce: true,
  showVelocityVector: true,
  showAccelerationVector: true,
  showForceLabels: true,
  showSurfaceGrid: true,
};

export const NewtonLaboratory: React.FC = () => {
  const [mode, setMode] = useState<NewtonMode>('second-law');

  const [secondLawParams, setSecondLawParams] = useState<NewtonSecondLawParameters>(DEFAULT_SECOND_LAW_PARAMS);
  const [firstLawParams, setFirstLawParams] = useState<NewtonFirstLawParameters>(DEFAULT_FIRST_LAW_PARAMS);
  const [thirdLawParams, setThirdLawParams] = useState<NewtonThirdLawParameters>(DEFAULT_THIRD_LAW_PARAMS);

  const [vectorOptions, setVectorOptions] = useState<NewtonVectorOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Simulation engine instance
  const engineRef = useRef<NewtonSimulationEngine | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  if (!engineRef.current) {
    engineRef.current = new NewtonSimulationEngine(8.0);
  }

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

  // Compute live states
  const secondLawState = useMemo<NewtonSecondLawState>(() => {
    return computeSecondLawStateAtTime(secondLawParams, currentTime);
  }, [secondLawParams, currentTime]);

  const firstLawState = useMemo<NewtonFirstLawState>(() => {
    return computeFirstLawStateAtTime(firstLawParams, currentTime);
  }, [firstLawParams, currentTime]);

  const thirdLawState = useMemo<NewtonThirdLawState>(() => {
    return computeThirdLawStateAtTime(thirdLawParams, currentTime);
  }, [thirdLawParams, currentTime]);

  // Compute samples for Second Law graphs
  const secondLawSamples = useMemo<NewtonSample[]>(() => {
    return generateNewtonSecondLawSamples(secondLawParams, 8.0, 0.05);
  }, [secondLawParams]);

  // Playback handlers
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

  const handleResetAll = useCallback(() => {
    handleReset();
    if (mode === 'second-law') setSecondLawParams(DEFAULT_SECOND_LAW_PARAMS);
    else if (mode === 'first-law') setFirstLawParams(DEFAULT_FIRST_LAW_PARAMS);
    else setThirdLawParams(DEFAULT_THIRD_LAW_PARAMS);
  }, [mode, handleReset]);

  const handleSelectPreset = (preset: NewtonPreset) => {
    setMode(preset.law);
    if (preset.law === 'second-law') setSecondLawParams(preset.params as NewtonSecondLawParameters);
    else if (preset.law === 'first-law') setFirstLawParams(preset.params as NewtonFirstLawParameters);
    else setThirdLawParams(preset.params as NewtonThirdLawParameters);
    handleReset();
    setIsPresetsOpen(false);
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Activity className="w-4 h-4" />
            <span>Classical Dynamics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Newton&apos;s Laws of Motion Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Fundamental laws of dynamics: inertia, F = ma acceleration, and action-reaction pairs.
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
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset dynamics track to initial conditions"
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
          <NewtonCanvas
            mode={mode}
            secondLawParams={secondLawParams}
            secondLawState={secondLawState}
            firstLawParams={firstLawParams}
            firstLawState={firstLawState}
            thirdLawParams={thirdLawParams}
            thirdLawState={thirdLawState}
            vectorOptions={vectorOptions}
            onOpenValidationModal={() => {}}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Dynamics Controls</span>
            </div>
            <button
              onClick={handleResetAll}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Newtonian Law
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  setMode('second-law');
                  handleReset();
                }}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  mode === 'second-law'
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                2nd: F=ma
              </button>
              <button
                onClick={() => {
                  setMode('first-law');
                  handleReset();
                }}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  mode === 'first-law'
                    ? 'border-[#34D399] text-[#34D399] bg-[#34D399]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                1st: Inertia
              </button>
              <button
                onClick={() => {
                  setMode('third-law');
                  handleReset();
                }}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer truncate ${
                  mode === 'third-law'
                    ? 'border-[#A78BFA] text-[#A78BFA] bg-[#A78BFA]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                3rd: Pairs
              </button>
            </div>
          </div>

          {/* Second Law Parameters */}
          {mode === 'second-law' && (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8FAFC]">Mass (m)</span>
                  <span className="text-[#38BDF8] font-bold">{secondLawParams.mass.toFixed(1)} kg</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={10.0}
                  step={0.5}
                  value={secondLawParams.mass}
                  onChange={(e) => {
                    setSecondLawParams((p) => ({ ...p, mass: parseFloat(e.target.value) }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8FAFC]">Applied Force (F)</span>
                  <span className="text-[#FBBF24] font-bold">{secondLawParams.appliedForce.toFixed(0)} N</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={secondLawParams.appliedForce}
                  onChange={(e) => {
                    setSecondLawParams((p) => ({ ...p, appliedForce: parseFloat(e.target.value) }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
                <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                  <div className="text-[10px] text-[#64748B]">Net Force</div>
                  <div className="text-sm font-bold text-[#38BDF8]">{secondLawState.netForce.toFixed(1)} N</div>
                </div>
                <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                  <div className="text-[10px] text-[#64748B]">Acceleration</div>
                  <div className="text-sm font-bold text-[#FBBF24]">{secondLawState.acceleration.toFixed(2)} m/s²</div>
                </div>
              </div>
            </>
          )}

          {/* First Law Parameters */}
          {mode === 'first-law' && (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8FAFC]">Constant Speed (v₀)</span>
                  <span className="text-[#34D399] font-bold">{firstLawParams.initialVelocity.toFixed(1)} m/s</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={firstLawParams.initialVelocity}
                  onChange={(e) => {
                    setFirstLawParams((p) => ({ ...p, initialVelocity: parseFloat(e.target.value) }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
                />
              </div>

              <div className="p-3 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono space-y-1">
                <div className="text-[10px] text-[#64748B]">Equilibrium Condition</div>
                <div className="text-xs font-bold text-[#34D399]">ΣF = 0 ⟹ a = 0 m/s²</div>
                <div className="text-[11px] text-[#94A3B8]">Velocity remains constant indefinitely</div>
              </div>
            </>
          )}

          {/* Third Law Parameters */}
          {mode === 'third-law' && (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8FAFC]">Mass A (m_A)</span>
                  <span className="text-[#38BDF8] font-bold">{thirdLawParams.massA.toFixed(1)} kg</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={10.0}
                  step={0.5}
                  value={thirdLawParams.massA}
                  onChange={(e) => {
                    setThirdLawParams((p) => ({ ...p, massA: parseFloat(e.target.value) }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F8FAFC]">Mass B (m_B)</span>
                  <span className="text-[#A78BFA] font-bold">{thirdLawParams.massB.toFixed(1)} kg</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={10.0}
                  step={0.5}
                  value={thirdLawParams.massB}
                  onChange={(e) => {
                    setThirdLawParams((p) => ({ ...p, massB: parseFloat(e.target.value) }));
                    handleReset();
                  }}
                  className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
                <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                  <div className="text-[10px] text-[#64748B]">Accel. A</div>
                  <div className="text-sm font-bold text-[#38BDF8]">{thirdLawState.accA.toFixed(2)} m/s²</div>
                </div>
                <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
                  <div className="text-[10px] text-[#64748B]">Accel. B</div>
                  <div className="text-sm font-bold text-[#A78BFA]">{thirdLawState.accB.toFixed(2)} m/s²</div>
                </div>
              </div>
            </>
          )}

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

      {/* 3. Mathematical Dynamics Graphs */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Kinematic &amp; Force Graphs
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">F(t), a(t), v(t), x(t)</span>
        </div>
        <NewtonGraphs samples={secondLawSamples} currentTime={currentTime} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Newton's Laws of Motion"
        formula="\Sigma \vec{F} = m \vec{a} \implies a = \frac{F_{\text{net}}}{m}"
        additionalFormula="\vec{F}_{AB} = -\vec{F}_{BA} \quad \text{and} \quad \Sigma \vec{F} = 0 \implies \vec{v} = \text{const}"
        description="Newton's Second Law dictates that acceleration is directly proportional to net force and inversely proportional to mass. In the absence of net force (First Law), an object maintains its velocity. Any force exerted on object B by object A elicits an equal and opposite reaction on object A (Third Law)."
        parameters={[
          { symbol: 'm', name: 'Mass', unit: 'kg' },
          { symbol: 'F_{\\text{net}}', name: 'Net Force', unit: 'N' },
          { symbol: 'a', name: 'Acceleration', unit: 'm/s²' },
          { symbol: 'v', name: 'Velocity', unit: 'm/s' },
          { symbol: 'F_{AB}, F_{BA}', name: 'Interaction Forces', unit: 'N' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <NewtonPresetsModal
          isOpen={isPresetsOpen}
          onClose={() => setIsPresetsOpen(false)}
          onSelectPreset={handleSelectPreset}
        />
      )}
    </div>
  );
};
