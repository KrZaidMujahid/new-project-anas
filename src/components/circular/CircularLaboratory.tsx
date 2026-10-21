/**
 * EQUATION 1 — Circular Motion Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: 2D Circular Orbit Visualization (CircularCanvas)
 * - Top Right: Essential Parameters Deck (m, r, ω) & Playback Controls
 * - Middle: Mathematical Kinematic Graphs (x(t), y(t), v(t), ac(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  CircularParameters,
  CircularVectorOptions,
  CircularState,
  CircularSample,
} from '../../physics/circular/types';
import {
  computeCircularDerivedValues,
  computeCircularStateAtTime,
  generateCircularSamples,
} from '../../physics/circular/model';
import { CircularSimulationEngine } from '../../physics/circular/simulationEngine';
import { CircularCanvas } from './CircularCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { CircularGraphs } from './CircularGraphs';
import { CircularPresetsModal } from './CircularPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { RotateCw, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_PARAMS: CircularParameters = {
  mass: 2.0,
  radius: 3.0,
  angularVelocity: 2.0,
  initialAngleDeg: 0,
};

const DEFAULT_VECTOR_OPTIONS: CircularVectorOptions = {
  showVelocityVector: true,
  showAccelerationVector: true,
  showForceVector: true,
  showRadiusLine: true,
  showAngleArc: true,
  showMotionTrail: true,
  showCoordinateAxes: true,
  showVelocityComponents: false,
};

interface CircularLaboratoryProps {
  onBackToPhysics?: () => void;
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

export const CircularLaboratory: React.FC<CircularLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [params, setParams] = useState<CircularParameters>(DEFAULT_PARAMS);
  const [vectorOptions, setVectorOptions] = useState<CircularVectorOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpenInternal, setIsPresetsOpenInternal] = useState(false);

  const isPresetsOpen = isPresetsOpenExternal ?? isPresetsOpenInternal;
  const handleClosePresets = onClosePresetsExternal ?? (() => setIsPresetsOpenInternal(false));

  // Simulation Engine
  const engineRef = useRef<CircularSimulationEngine | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [trailPoints, setTrailPoints] = useState<Array<{ x: number; y: number }>>([]);

  if (!engineRef.current) {
    engineRef.current = new CircularSimulationEngine(10.0);
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
  const currentState = useMemo<CircularState>(() => {
    return computeCircularStateAtTime(params, currentTime);
  }, [params, currentTime]);

  // Derived values
  const derived = useMemo(() => {
    return computeCircularDerivedValues(params);
  }, [params]);

  // Trajectory samples for graphing
  const samples = useMemo<CircularSample[]>(() => {
    return generateCircularSamples(params, 10.0, 0.05);
  }, [params]);

  // Trail accumulation
  useEffect(() => {
    if (isPlaying) {
      setTrailPoints((prev) => [
        ...prev.slice(-60),
        { x: currentState.x, y: currentState.y },
      ]);
    }
  }, [currentState.x, currentState.y, isPlaying]);

  // Playback handlers
  const handleTogglePlayPause = useCallback(() => {
    engineRef.current?.togglePlayPause();
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current?.reset();
    setCurrentTime(0);
    setTrailPoints([]);
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

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <RotateCw className="w-4 h-4" />
            <span>Classical Mechanics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Uniform Circular Motion Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            2D orbital mechanics: tangential speed, centripetal acceleration, inward force, and period.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPresetsOpenInternal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#38BDF8]/50 text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset orbit simulation to t=0"
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
          <CircularCanvas
            params={params}
            state={currentState}
            vectorOptions={vectorOptions}
            onChangeVectorOptions={setVectorOptions}
            onOpenValidationModal={() => {}}
            trailPoints={trailPoints}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Orbit Parameters</span>
            </div>
            <button
              onClick={() => {
                setParams(DEFAULT_PARAMS);
                handleReset();
              }}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Mass m */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Mass (m)</span>
              <span className="text-[#38BDF8] font-bold">{params.mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={10.0}
              step={0.1}
              value={params.mass}
              onChange={(e) => {
                setParams((p) => ({ ...p, mass: parseFloat(e.target.value) }));
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Radius r */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Orbit Radius (r)</span>
              <span className="text-[#FBBF24] font-bold">{params.radius.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={params.radius}
              onChange={(e) => {
                setParams((p) => ({ ...p, radius: parseFloat(e.target.value) }));
                handleReset();
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Angular Velocity ω */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Angular Velocity (ω)</span>
              <span className="text-[#34D399] font-bold">{params.angularVelocity.toFixed(2)} rad/s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={6.0}
              step={0.1}
              value={params.angularVelocity}
              onChange={(e) => {
                setParams((p) => ({ ...p, angularVelocity: parseFloat(e.target.value) }));
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#34D399]"
            />
          </div>

          {/* Instantaneous Computed Kinematics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Speed (v)</div>
              <div className="text-sm font-bold text-[#38BDF8]">{derived.speed.toFixed(2)} m/s</div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Centripetal (ac)</div>
              <div className="text-sm font-bold text-[#FBBF24]">{derived.centripetalAccel.toFixed(2)} m/s²</div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Force (Fc)</div>
              <div className="text-sm font-bold text-[#FB7185]">{derived.centripetalForce.toFixed(2)} N</div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Period (T)</div>
              <div className="text-sm font-bold text-[#A78BFA]">{derived.period.toFixed(2)} s</div>
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

      {/* 3. Mathematical Graphs */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Kinematic Coordinate Plots
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Synchronized Periodic Waves</span>
        </div>
        <CircularGraphs samples={samples} currentTime={currentTime} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Uniform Circular Motion Equations"
        formula="v = \omega r \quad \text{and} \quad a_c = \frac{v^2}{r} = \omega^2 r"
        additionalFormula="F_c = m a_c = \frac{m v^2}{r} \quad \text{and} \quad T = \frac{2\pi}{\omega}"
        description="In uniform circular motion, an object moves along a circular path of radius r at constant linear speed v. The velocity vector continuously changes direction toward the center, creating an inward centripetal acceleration a_c driven by a net centripetal force F_c."
        parameters={[
          { symbol: 'm', name: 'Object Mass', unit: 'kg' },
          { symbol: 'r', name: 'Orbit Radius', unit: 'm' },
          { symbol: '\\omega', name: 'Angular Velocity', unit: 'rad/s' },
          { symbol: 'v', name: 'Tangential Speed', unit: 'm/s' },
          { symbol: 'a_c', name: 'Centripetal Accel.', unit: 'm/s²' },
          { symbol: 'F_c', name: 'Centripetal Force', unit: 'N' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <CircularPresetsModal
          isOpen={isPresetsOpen}
          onClose={handleClosePresets}
          currentParams={params}
          onSelectPreset={(newParams) => {
            setParams(newParams);
            handleReset();
            handleClosePresets();
          }}
        />
      )}
    </div>
  );
};
