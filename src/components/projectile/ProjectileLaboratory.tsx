/**
 * EQUATION 1 — Projectile Motion Laboratory View
 * Minimalist Studio Split Architecture:
 * - Top Left: 2D Flight Trajectory Viewport (SimulationCanvas)
 * - Top Right: Essential Parameters Deck (v0, θ, y0, g) & Playback Controls
 * - Middle: Mathematical Kinematic Graphs (y(x), y(t), v(t), E(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AnalyticalResults,
  ComparisonTrail,
  ProjectileParameters,
  ProjectileState,
  TrajectorySample,
  VectorDisplayOptions,
} from '../../physics/types';
import {
  calculateAnalyticalResults,
  computeStateAtTime,
  generateTrajectoryPoints,
} from '../../physics/projectileModel';
import { ProjectileSimulationEngine } from '../../physics/simulationEngine';
import { SimulationCanvas } from '../SimulationCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { GraphsPanel } from '../GraphsPanel';
import { PresetsModal } from '../PresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Target, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_PARAMETERS: ProjectileParameters = {
  initialSpeed: 20.0,
  launchAngleDeg: 45.0,
  initialHeight: 0.0,
  gravity: 9.81,
};

const DEFAULT_VECTOR_OPTIONS: VectorDisplayOptions = {
  showVelocityVector: true,
  showVelocityComponents: false,
  showAccelerationVector: false,
  showTrajectoryTicks: true,
  showApexMarker: true,
  showRangeMarker: true,
  showCoordinateGrid: true,
};

export const ProjectileLaboratory: React.FC = () => {
  const [parameters, setParameters] = useState<ProjectileParameters>(DEFAULT_PARAMETERS);
  const [vectorOptions, setVectorOptions] = useState<VectorDisplayOptions>(DEFAULT_VECTOR_OPTIONS);
  const [comparisonTrails, setComparisonTrails] = useState<ComparisonTrail[]>([]);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const engineRef = useRef<ProjectileSimulationEngine | null>(null);

  const [currentState, setCurrentState] = useState<ProjectileState>(() =>
    computeStateAtTime(DEFAULT_PARAMETERS, 0)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  if (!engineRef.current) {
    engineRef.current = new ProjectileSimulationEngine(DEFAULT_PARAMETERS);
  }

  const analytical = useMemo<AnalyticalResults>(() => {
    return calculateAnalyticalResults(parameters);
  }, [parameters]);

  const trajectoryPoints = useMemo<TrajectorySample[]>(() => {
    return generateTrajectoryPoints(parameters, analytical, 250);
  }, [parameters, analytical]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const unsubTick = engine.onTick((state) => {
      setCurrentState(state);
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
    setCurrentState(computeStateAtTime(parameters, 0));
  }, [parameters]);

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

  const handleParametersChange = useCallback((newParams: ProjectileParameters) => {
    setParameters(newParams);
    engineRef.current?.updateParameters(newParams);
    setCurrentState(computeStateAtTime(newParams, 0));
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <Target className="w-4 h-4" />
            <span>Classical Kinematics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            2D Projectile Motion Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Orthogonal velocity decomposition, parabolic ballistic trajectories, range, apex, and flight time.
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
            onClick={() => handleParametersChange(DEFAULT_PARAMETERS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset trajectory to standard initial values"
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
          <SimulationCanvas
            parameters={parameters}
            analytical={analytical}
            currentState={currentState}
            trajectoryPoints={trajectoryPoints}
            vectorOptions={vectorOptions}
            comparisonTrails={comparisonTrails}
            onOpenAssumptions={() => {}}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Launch Parameters</span>
            </div>
            <button
              onClick={() => handleParametersChange(DEFAULT_PARAMETERS)}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Launch Velocity v0 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Launch Speed (v₀)</span>
              <span className="text-[#38BDF8] font-bold">{parameters.initialSpeed.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={60.0}
              step={0.5}
              value={parameters.initialSpeed}
              onChange={(e) =>
                handleParametersChange({
                  ...parameters,
                  initialSpeed: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Launch Angle θ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Launch Angle (θ)</span>
              <span className="text-[#FBBF24] font-bold">{parameters.launchAngleDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={90.0}
              step={1.0}
              value={parameters.launchAngleDeg}
              onChange={(e) =>
                handleParametersChange({
                  ...parameters,
                  launchAngleDeg: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Initial Elevation y0 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Initial Height (y₀)</span>
              <span className="text-[#34D399] font-bold">{parameters.initialHeight.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={30.0}
              step={0.5}
              value={parameters.initialHeight}
              onChange={(e) =>
                handleParametersChange({
                  ...parameters,
                  initialHeight: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Parameter 4: Gravity g */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Gravity (g)</span>
              <span className="text-[#A78BFA] font-bold">{parameters.gravity.toFixed(2)} m/s²</span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[
                { label: 'Earth', val: 9.81 },
                { label: 'Moon', val: 1.62 },
                { label: 'Mars', val: 3.71 },
                { label: 'Jupiter', val: 24.79 },
              ].map((body) => (
                <button
                  key={body.label}
                  onClick={() =>
                    handleParametersChange({
                      ...parameters,
                      gravity: body.val,
                    })
                  }
                  className={`py-1 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                    Math.abs(parameters.gravity - body.val) < 0.05
                      ? 'border-[#A78BFA] text-[#A78BFA] bg-[#A78BFA]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {body.label}
                </button>
              ))}
            </div>
          </div>

          {/* Computed Balistics Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Range (R)</div>
              <div className="text-xs font-bold text-[#38BDF8]">{analytical.range.toFixed(1)} m</div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Apex (H)</div>
              <div className="text-xs font-bold text-[#FBBF24]">{analytical.maxHeight.toFixed(1)} m</div>
            </div>
            <div className="p-2 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Flight Time (T)</div>
              <div className="text-xs font-bold text-[#34D399]">{analytical.timeOfFlight.toFixed(2)} s</div>
            </div>
          </div>

          {/* Playback Controls Container */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentState.time}
              timeOfFlight={analytical.timeOfFlight}
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

      {/* 3. Mathematical Graphs: Parabolic Trajectory & Kinematic Functions */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Kinematic Function Graphs
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Live Trajectory &amp; Time Coordinates</span>
        </div>
        <GraphsPanel
          parameters={parameters}
          analytical={analytical}
          currentState={currentState}
          trajectoryPoints={trajectoryPoints}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Kinematics of 2D Ballistic Projectile Motion"
        formula="x(t) = (v_0 \cos\theta) t \quad \text{and} \quad y(t) = y_0 + (v_0 \sin\theta) t - \frac{1}{2}gt^2"
        additionalFormula="R = \frac{v_0^2 \sin(2\theta)}{g} \quad \text{and} \quad H = y_0 + \frac{v_0^2 \sin^2\theta}{2g}"
        description="Neglecting atmospheric drag, horizontal motion continues with uniform constant velocity while vertical motion undergoes constant gravitational acceleration. Range R achieves its theoretical maximum at launch angle θ = 45° on level ground."
        parameters={[
          { symbol: 'v_0', name: 'Launch Speed', unit: 'm/s' },
          { symbol: '\\theta', name: 'Launch Angle', unit: 'degrees' },
          { symbol: 'g', name: 'Gravity', unit: 'm/s²' },
          { symbol: 'R', name: 'Horizontal Range', unit: 'm' },
          { symbol: 'H', name: 'Maximum Height', unit: 'm' },
          { symbol: 'T', name: 'Flight Duration', unit: 's' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <PresetsModal
          isOpen={isPresetsOpen}
          onClose={() => setIsPresetsOpen(false)}
          onSelectPreset={handleParametersChange}
          currentParams={parameters}
        />
      )}
    </div>
  );
};
