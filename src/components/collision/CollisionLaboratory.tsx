/**
 * EQUATION 1 — Collision & Momentum Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Interactive 1D Collision Track (CollisionCanvas)
 * - Top Right: Essential Parameters Deck (m1, v1, m2, v2, e) & Playback Controls
 * - Middle: Mathematical Graphs (Momentum p(t), Velocity v(t), Energy K(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  CollisionParameters,
  CollisionType,
  CollisionVectorOptions,
  CollisionState,
  CollisionSample,
} from '../../physics/collision/types';
import {
  computeAnalyticalCollision,
  computeCollisionStateAtTime,
  generateCollisionSamples,
} from '../../physics/collision/model';
import { CollisionSimulationEngine } from '../../physics/collision/simulationEngine';
import { CollisionCanvas } from './CollisionCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { CollisionGraphs } from './CollisionGraphs';
import { CollisionPresetsModal } from './CollisionPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { ArrowRightLeft, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_ELASTIC_PARAMS: CollisionParameters = {
  collisionType: 'elastic',
  m1: 2.0,
  v1: 5.0,
  x1: 1.0,
  m2: 2.0,
  v2: 0.0,
  x2: 7.0,
  restitution: 1.0,
  collisionDuration: 0.05,
};

const DEFAULT_INELASTIC_PARAMS: CollisionParameters = {
  collisionType: 'inelastic',
  m1: 2.5,
  v1: 5.0,
  x1: 1.0,
  m2: 2.0,
  v2: -1.0,
  x2: 8.0,
  restitution: 0.65,
  collisionDuration: 0.05,
};

const DEFAULT_PERFECT_PARAMS: CollisionParameters = {
  collisionType: 'perfectly-inelastic',
  m1: 2.0,
  v1: 5.0,
  x1: 1.0,
  m2: 3.0,
  v2: 0.0,
  x2: 7.0,
  restitution: 0.0,
  collisionDuration: 0.05,
};

const DEFAULT_VECTOR_OPTIONS: CollisionVectorOptions = {
  showVelocityVectors: true,
  showMomentumVectors: true,
  showForceVectors: false,
  showMotionTrails: true,
  showTrackRuler: true,
  showCenterOfMass: false,
};

interface CollisionLaboratoryProps {
  onBackToPhysics?: () => void;
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

export const CollisionLaboratory: React.FC<CollisionLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [params, setParams] = useState<CollisionParameters>(DEFAULT_ELASTIC_PARAMS);
  const [vectorOptions, setVectorOptions] = useState<CollisionVectorOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpenInternal, setIsPresetsOpenInternal] = useState(false);

  const isPresetsOpen = isPresetsOpenExternal ?? isPresetsOpenInternal;
  const handleClosePresets = onClosePresetsExternal ?? (() => setIsPresetsOpenInternal(false));

  // Simulation Engine
  const engineRef = useRef<CollisionSimulationEngine | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [trailPositions1, setTrailPositions1] = useState<number[]>([]);
  const [trailPositions2, setTrailPositions2] = useState<number[]>([]);

  if (!engineRef.current) {
    engineRef.current = new CollisionSimulationEngine(6.0);
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
  const currentState = useMemo<CollisionState>(() => {
    return computeCollisionStateAtTime(params, currentTime);
  }, [params, currentTime]);

  // Compute trajectory samples for graphing
  const samples = useMemo<CollisionSample[]>(() => {
    return generateCollisionSamples(params, 6.0, 0.02);
  }, [params]);

  // Trail accumulation
  useEffect(() => {
    if (isPlaying) {
      setTrailPositions1((prev) => [...prev.slice(-40), currentState.object1.position]);
      setTrailPositions2((prev) => [...prev.slice(-40), currentState.object2.position]);
    }
  }, [currentState.object1.position, currentState.object2.position, isPlaying]);

  // Playback handlers
  const handleTogglePlayPause = useCallback(() => {
    engineRef.current?.togglePlayPause();
  }, []);

  const handleReset = useCallback(() => {
    engineRef.current?.reset();
    setCurrentTime(0);
    setTrailPositions1([]);
    setTrailPositions2([]);
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

  const handleSelectMode = (newMode: CollisionType) => {
    handleReset();
    if (newMode === 'elastic') setParams(DEFAULT_ELASTIC_PARAMS);
    else if (newMode === 'inelastic') setParams(DEFAULT_INELASTIC_PARAMS);
    else setParams(DEFAULT_PERFECT_PARAMS);
  };

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Classical Mechanics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Collisions &amp; Linear Momentum Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            1D horizontal momentum conservation, coefficient of restitution, and kinetic energy exchange.
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
            title="Reset collision track to initial state"
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
          <CollisionCanvas
            params={params}
            state={currentState}
            vectorOptions={vectorOptions}
            onChangeVectorOptions={setVectorOptions}
            onOpenValidationModal={() => {}}
            trailPositions1={trailPositions1}
            trailPositions2={trailPositions2}
          />
        </div>

        {/* Right: Essential Parameters & Playback (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Collision Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Collision Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Collision Regime
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleSelectMode('elastic')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  params.collisionType === 'elastic'
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Elastic (e=1)
              </button>
              <button
                onClick={() => handleSelectMode('inelastic')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  params.collisionType === 'inelastic'
                    ? 'border-[#A78BFA] text-[#A78BFA] bg-[#A78BFA]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Inelastic
              </button>
              <button
                onClick={() => handleSelectMode('perfectly-inelastic')}
                className={`py-1.5 px-2 text-center text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                  params.collisionType === 'perfectly-inelastic'
                    ? 'border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Sticks (e=0)
              </button>
            </div>
          </div>

          {/* Cart 1 Parameters */}
          <div className="p-3 bg-[#050508] border border-[#1E293B] rounded-lg space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-[#38BDF8] uppercase">Cart 1 (Blue)</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Mass (m₁)</span>
                <span className="text-[#F8FAFC] font-bold">{params.m1.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={params.m1}
                onChange={(e) => {
                  setParams((p) => ({ ...p, m1: parseFloat(e.target.value) }));
                  handleReset();
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Velocity (v₁)</span>
                <span className="text-[#F8FAFC] font-bold">{params.v1.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min={-5.0}
                max={10.0}
                step={0.5}
                value={params.v1}
                onChange={(e) => {
                  setParams((p) => ({ ...p, v1: parseFloat(e.target.value) }));
                  handleReset();
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
              />
            </div>
          </div>

          {/* Cart 2 Parameters */}
          <div className="p-3 bg-[#050508] border border-[#1E293B] rounded-lg space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-[#FBBF24] uppercase">Cart 2 (Amber)</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Mass (m₂)</span>
                <span className="text-[#F8FAFC] font-bold">{params.m2.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={params.m2}
                onChange={(e) => {
                  setParams((p) => ({ ...p, m2: parseFloat(e.target.value) }));
                  handleReset();
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Velocity (v₂)</span>
                <span className="text-[#F8FAFC] font-bold">{params.v2.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min={-5.0}
                max={10.0}
                step={0.5}
                value={params.v2}
                onChange={(e) => {
                  setParams((p) => ({ ...p, v2: parseFloat(e.target.value) }));
                  handleReset();
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
              />
            </div>
          </div>

          {/* Restitution (if inelastic) */}
          {params.collisionType === 'inelastic' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Restitution (e)</span>
                <span className="text-[#A78BFA] font-bold">{params.restitution.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.99}
                step={0.01}
                value={params.restitution}
                onChange={(e) => {
                  setParams((p) => ({ ...p, restitution: parseFloat(e.target.value) }));
                  handleReset();
                }}
                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
              />
            </div>
          )}

          {/* Playback Controls Container */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              timeOfFlight={6.0}
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

      {/* 3. Mathematical Graphs: Momentum & Velocity */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Kinematic &amp; Dynamic Graphs
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Real-Time Simulation Trajectory</span>
        </div>
        <CollisionGraphs samples={samples} currentTime={currentTime} />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Momentum Conservation & Restitution Equations"
        formula="m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"
        additionalFormula="e = -\frac{v_{2f} - v_{1f}}{v_{2i} - v_{1i}}"
        description="In an isolated system with no external net horizontal forces, total linear momentum is strictly conserved across any collision. The coefficient of restitution e quantifies the elasticity: e = 1 for perfectly elastic collisions (kinetic energy conserved), 0 < e < 1 for inelastic, and e = 0 for perfectly inelastic sticking."
        parameters={[
          { symbol: 'm_1, m_2', name: 'Cart Masses', unit: 'kg' },
          { symbol: 'v_{1i}, v_{2i}', name: 'Initial Velocities', unit: 'm/s' },
          { symbol: 'v_{1f}, v_{2f}', name: 'Final Velocities', unit: 'm/s' },
          { symbol: 'e', name: 'Restitution Coefficient', unit: 'dimensionless' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <CollisionPresetsModal
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
