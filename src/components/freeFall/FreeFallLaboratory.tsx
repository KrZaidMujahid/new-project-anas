/**
 * EQUATION 1 — Free Fall Kinematics Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Vertical Drop Tower Viewport (FreeFallCanvas)
 * - Top Right: Essential Parameters Deck (y0, v0, g) & Playback Controls
 * - Middle: Mathematical Kinematic Graphs (y(t), v(t), a(t))
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  FreeFallAnalytical,
  FreeFallParameters as FreeFallParamsType,
  FreeFallSample,
  FreeFallState,
  FreeFallVectorOptions,
} from '../../physics/freeFall/types';
import {
  calculateFreeFallAnalytical,
  computeFreeFallStateAtTime,
  generateFreeFallTrajectory,
} from '../../physics/freeFall/model';
import { FreeFallSimulationEngine } from '../../physics/freeFall/simulationEngine';
import { FreeFallCanvas } from './FreeFallCanvas';
import { PlaybackControls } from '../PlaybackControls';
import { FreeFallGraphs } from './FreeFallGraphs';
import { FreeFallPresetsModal } from './FreeFallPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { ArrowDownCircle, RotateCcw, Sparkles, Sliders } from 'lucide-react';

const DEFAULT_FREE_FALL_PARAMS: FreeFallParamsType = {
  initialHeight: 20.0,
  initialVelocity: 0.0,
  gravity: 9.8,
};

const DEFAULT_VECTOR_OPTIONS: FreeFallVectorOptions = {
  showVelocityVector: true,
  showAccelerationVector: true,
  showMotionTrail: true,
  showHeightRuler: true,
  showApexMarker: true,
  showCoordinateGrid: true,
};

export const FreeFallLaboratory: React.FC = () => {
  const [parameters, setParameters] = useState<FreeFallParamsType>(DEFAULT_FREE_FALL_PARAMS);
  const [vectorOptions, setVectorOptions] = useState<FreeFallVectorOptions>(DEFAULT_VECTOR_OPTIONS);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Simulation engine instance
  const engineRef = useRef<FreeFallSimulationEngine | null>(null);

  const [currentState, setCurrentState] = useState<FreeFallState>(() =>
    computeFreeFallStateAtTime(DEFAULT_FREE_FALL_PARAMS, 0)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  if (!engineRef.current) {
    engineRef.current = new FreeFallSimulationEngine(DEFAULT_FREE_FALL_PARAMS);
  }

  const analytical = useMemo<FreeFallAnalytical>(() => {
    return calculateFreeFallAnalytical(parameters);
  }, [parameters]);

  const trajectorySamples = useMemo<FreeFallSample[]>(() => {
    return generateFreeFallTrajectory(parameters, analytical, 250);
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
    setCurrentState(computeFreeFallStateAtTime(parameters, 0));
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

  const handleParametersChange = useCallback((newParams: FreeFallParamsType) => {
    setParameters(newParams);
    engineRef.current?.updateParameters(newParams);
    setCurrentState(computeFreeFallStateAtTime(newParams, 0));
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider font-semibold">
            <ArrowDownCircle className="w-4 h-4" />
            <span>Classical Kinematics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Free Fall Gravitational Kinematics
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            1D vertical kinematics under uniform gravity, impact velocity, time of flight, and apex height.
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
            onClick={() => handleParametersChange(DEFAULT_FREE_FALL_PARAMS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset to standard Earth drop conditions"
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
          <FreeFallCanvas
            parameters={parameters}
            analytical={analytical}
            currentState={currentState}
            trajectorySamples={trajectorySamples}
            vectorOptions={vectorOptions}
            onOpenValidationModal={() => {}}
          />
        </div>

        {/* Right: Essential Parameters (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Drop Parameters</span>
            </div>
            <button
              onClick={() => handleParametersChange(DEFAULT_FREE_FALL_PARAMS)}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#38BDF8] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Drop Height y0 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Initial Height (y₀)</span>
              <span className="text-[#38BDF8] font-bold">{parameters.initialHeight.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={100.0}
              step={1.0}
              value={parameters.initialHeight}
              onChange={(e) =>
                handleParametersChange({
                  ...parameters,
                  initialHeight: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 2: Initial Velocity v0 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Initial Velocity (v₀)</span>
              <span className="text-[#FBBF24] font-bold">{parameters.initialVelocity.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={-30.0}
              max={30.0}
              step={1.0}
              value={parameters.initialVelocity}
              onChange={(e) =>
                handleParametersChange({
                  ...parameters,
                  initialVelocity: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
            />
          </div>

          {/* Parameter 3: Gravity g */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Gravity (g)</span>
              <span className="text-[#34D399] font-bold">{parameters.gravity.toFixed(2)} m/s²</span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[
                { label: 'Earth', val: 9.8 },
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
                      ? 'border-[#34D399] text-[#34D399] bg-[#34D399]/10 font-bold'
                      : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                  }`}
                >
                  {body.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Calculated Readout */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Impact Speed</div>
              <div className="text-sm font-bold text-[#FB7185]">
                {analytical.finalSpeed.toFixed(2)} m/s
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Time to Ground</div>
              <div className="text-sm font-bold text-[#38BDF8]">
                {analytical.timeToGround.toFixed(2)} s
              </div>
            </div>
          </div>

          {/* Playback Controls Container */}
          <div className="pt-2 border-t border-[#1E293B]">
            <PlaybackControls
              isPlaying={isPlaying}
              currentTime={currentState.time}
              timeOfFlight={isFinite(analytical.timeToGround) ? analytical.timeToGround : 10}
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

      {/* 3. Mathematical Graphs: y(t), v(t), a(t) */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] font-bold">
            Mathematical Gravitational Kinematics Graphs
          </span>
          <span className="text-[11px] font-mono text-[#64748B]">Height &amp; Velocity Curves</span>
        </div>
        <FreeFallGraphs
          parameters={parameters}
          analytical={analytical}
          currentState={currentState}
          trajectorySamples={trajectorySamples}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Free Fall Gravitational Equations"
        formula="y(t) = y_0 + v_0 t - \frac{1}{2}gt^2 \quad \text{and} \quad v(t) = v_0 - gt"
        additionalFormula="v_f^2 = v_0^2 - 2g(y - y_0) \quad \text{and} \quad t_{\text{ground}} = \frac{v_0 + \sqrt{v_0^2 + 2gy_0}}{g}"
        description="In vacuum free fall, gravitational acceleration is strictly constant at -g. All bodies fall with identical acceleration independent of mass or composition, producing a parabolic height-time relationship and linear velocity decay."
        parameters={[
          { symbol: 'y_0', name: 'Initial Elevation', unit: 'm' },
          { symbol: 'v_0', name: 'Initial Velocity', unit: 'm/s' },
          { symbol: 'g', name: 'Gravity', unit: 'm/s²' },
          { symbol: 'v_f', name: 'Impact Velocity', unit: 'm/s' },
          { symbol: 't_{\\text{ground}}', name: 'Time to Ground', unit: 's' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <FreeFallPresetsModal
          isOpen={isPresetsOpen}
          onClose={() => setIsPresetsOpen(false)}
          onSelectPreset={handleParametersChange}
          currentParams={parameters}
        />
      )}
    </div>
  );
};
