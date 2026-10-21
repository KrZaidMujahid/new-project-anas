/**
 * EQUATION 1 — Carnot Heat Engine Laboratory
 * Minimalist Studio Split Architecture:
 * - Top Left: Thermodynamic Piston Apparatus (CarnotEngineApparatus)
 * - Top Right: Essential Parameters Deck (TH, TC, gas type) & Cycle Playback
 * - Middle: Mathematical P-V Indicator Diagram (CarnotPVDiagram)
 * - Bottom: KaTeX Formula Card & Law Definitions
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  CarnotParameters,
  CarnotCycleResults,
  InstantaneousEngineState,
  CarnotStageId,
} from '../../physics/carnot/types';
import {
  computeCarnotCycle,
  getInstantaneousEngineState,
} from '../../physics/carnot/model';
import { CarnotEngineApparatus } from './CarnotEngineApparatus';
import { CarnotPVDiagram } from './CarnotPVDiagram';
import { CarnotCycleController } from './CarnotCycleController';
import { CarnotPresetsModal } from './CarnotPresetsModal';
import { FormulaCard } from '../FormulaCard';
import { Flame, RotateCcw, Sparkles, Sliders } from 'lucide-react';

interface CarnotLaboratoryProps {
  onBackToPhysics?: () => void;
  isPresetsOpenExternal?: boolean;
  onClosePresetsExternal?: () => void;
}

export const CarnotLaboratory: React.FC<CarnotLaboratoryProps> = ({
  isPresetsOpenExternal,
  onClosePresetsExternal,
}) => {
  const [params, setParams] = useState<CarnotParameters>({
    tHotK: 600,
    tColdK: 300,
    moles: 1.0,
    initialVolumeL: 2.0,
    gasType: 'monatomic',
    numCycles: 1,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycleProgress, setCycleProgress] = useState<number>(0.1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [isPresetsOpenInternal, setIsPresetsOpenInternal] = useState(false);

  const isPresetsOpen = isPresetsOpenExternal ?? isPresetsOpenInternal;
  const handleClosePresets = onClosePresetsExternal ?? (() => setIsPresetsOpenInternal(false));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Compute live cycle quantities
  const cycleResults = useMemo<CarnotCycleResults>(() => {
    return computeCarnotCycle(params);
  }, [params]);

  // Determine current stage (1, 2, 3, 4) and stage progress (0 to 1) from cycleProgress (0 to 1)
  const normalizedProgress = ((cycleProgress % 1.0) + 1.0) % 1.0;
  const stageIndex = Math.min(3, Math.floor(normalizedProgress * 4));
  const currentStage = (stageIndex + 1) as CarnotStageId;
  const stageProgress = normalizedProgress * 4 - stageIndex;

  // Instantaneous state along cycle
  const instState = useMemo<InstantaneousEngineState>(() => {
    return getInstantaneousEngineState(cycleResults, currentStage, stageProgress);
  }, [cycleResults, currentStage, stageProgress]);

  // Animation loop
  useEffect(() => {
    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (isPlaying) {
        const cyclePeriodSec = 8.0 / playbackSpeed;
        const deltaProgress = dt / cyclePeriodSec;
        setCycleProgress((prev) => {
          const next = prev + deltaProgress;
          if (next >= 1.0) {
            setCompletedCycles((c) => c + 1);
          }
          return next % 1.0;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleResetDefaults = useCallback(() => {
    setParams({
      tHotK: 600,
      tColdK: 300,
      moles: 1.0,
      initialVolumeL: 2.0,
      gasType: 'monatomic',
      numCycles: 1,
    });
    setCycleProgress(0.0);
  }, []);

  return (
    <div className="space-y-6 text-[#F8FAFC]">
      {/* 1. Module Header */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F97316] uppercase tracking-wider font-semibold">
            <Flame className="w-4 h-4" />
            <span>Thermodynamics</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Carnot Heat Engine Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Maximum theoretical thermodynamic efficiency, reversible isothermal &amp; adiabatic stages, and P-V indicator loops.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPresetsOpenInternal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] hover:border-[#F97316]/50 text-xs font-medium text-[#F97316] transition-colors cursor-pointer min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050508] hover:bg-[#121722] border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer min-h-[36px]"
            title="Reset engine temperatures to 600K / 300K"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Studio Split Layout: Simulation Canvas (Left) + Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulation Canvas (Hero, 7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <CarnotEngineApparatus
            cycle={cycleResults}
            instantState={instState}
            params={params}
            isPlaying={isPlaying}
          />
        </div>

        {/* Right: Essential Parameters (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm min-w-0">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F97316] font-bold">
              <Sliders className="w-4 h-4" />
              <span>Thermal Reservoir Controls</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-mono text-[#64748B] hover:text-[#F97316] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Parameter 1: Hot Reservoir TH */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Hot Reservoir (T_H)</span>
              <span className="text-[#EF4444] font-bold">{params.tHotK} K ({(params.tHotK - 273).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min={400}
              max={1200}
              step={25}
              value={params.tHotK}
              onChange={(e) => {
                const newTH = parseInt(e.target.value);
                setParams((p) => ({
                  ...p,
                  tHotK: newTH,
                  tColdK: Math.min(p.tColdK, newTH - 50),
                }));
              }}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
            />
          </div>

          {/* Parameter 2: Cold Reservoir TC */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8FAFC]">Cold Reservoir (T_C)</span>
              <span className="text-[#38BDF8] font-bold">{params.tColdK} K ({(params.tColdK - 273).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min={150}
              max={params.tHotK - 50}
              step={25}
              value={params.tColdK}
              onChange={(e) => setParams((p) => ({ ...p, tColdK: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
            />
          </div>

          {/* Parameter 3: Gas Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Working Substance
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setParams((p) => ({ ...p, gasType: 'monatomic' }))}
                className={`py-1.5 px-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  params.gasType === 'monatomic'
                    ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Monatomic (γ = 1.67)
              </button>
              <button
                onClick={() => setParams((p) => ({ ...p, gasType: 'diatomic' }))}
                className={`py-1.5 px-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  params.gasType === 'diatomic'
                    ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10 font-bold'
                    : 'border-[#1E293B] text-[#94A3B8] bg-[#050508] hover:text-[#F8FAFC]'
                }`}
              >
                Diatomic (γ = 1.40)
              </button>
            </div>
          </div>

          {/* Efficiency Readout */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Carnot Efficiency (η)</div>
              <div className="text-lg font-bold text-[#F97316]">
                {cycleResults.carnotEfficiencyPercent.toFixed(1)}%
              </div>
            </div>
            <div className="p-2.5 bg-[#050508] border border-[#1E293B] rounded-lg text-center font-mono">
              <div className="text-[10px] text-[#64748B]">Net Work (W_net)</div>
              <div className="text-lg font-bold text-[#38BDF8]">
                {cycleResults.netWorkJ.toFixed(0)} J
              </div>
            </div>
          </div>

          {/* Cycle Playback Controller */}
          <div className="pt-2 border-t border-[#1E293B]">
            <CarnotCycleController
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onReset={() => {
                setCycleProgress(0.0);
                setIsPlaying(false);
              }}
              onStepForward={() => {
                const next = (stageIndex + 1) % 4;
                setCycleProgress(next * 0.25);
              }}
              onStepBackward={() => {
                const prev = (stageIndex - 1 + 4) % 4;
                setCycleProgress(prev * 0.25);
              }}
              onRunSingleCycle={() => {
                setCycleProgress(0.0);
                setIsPlaying(true);
              }}
              currentStage={currentStage}
              onSelectStage={(stage) => {
                setCycleProgress((stage - 1) * 0.25);
              }}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              cycleCountCompleted={completedCycles}
            />
          </div>
        </div>
      </div>

      {/* 3. Mathematical P-V Indicator Diagram */}
      <div className="bg-[#0A0D14] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <CarnotPVDiagram
          cycle={cycleResults}
          instantState={instState}
          params={params}
        />
      </div>

      {/* 4. Minimalist KaTeX Formula Card */}
      <FormulaCard
        title="Carnot Engine Efficiency & 2nd Law of Thermodynamics"
        formula="\eta_{\text{Carnot}} = 1 - \frac{T_C}{T_H} = \frac{W_{\text{net}}}{Q_H}"
        additionalFormula="W_{\text{net}} = Q_H - Q_C \quad \text{and} \quad \oint \frac{dQ_{\text{rev}}}{T} = 0 \iff \Delta S_{\text{cycle}} = 0"
        description="The Carnot cycle represents the upper thermodynamic bound on efficiency for any thermal engine operating between two temperature reservoirs. Maximizing work extraction requires minimizing the cold reservoir temperature TC relative to the combustion source TH."
        parameters={[
          { symbol: 'T_H', name: 'Hot Temperature', unit: 'K' },
          { symbol: 'T_C', name: 'Cold Temperature', unit: 'K' },
          { symbol: '\\eta', name: 'Theoretical Efficiency', unit: '%' },
          { symbol: 'Q_H', name: 'Input Thermal Energy', unit: 'J' },
          { symbol: 'Q_C', name: 'Exhaust Heat', unit: 'J' },
          { symbol: 'W_{\\text{net}}', name: 'Extracted Work', unit: 'J' },
        ]}
      />

      {/* Presets Modal */}
      {isPresetsOpen && (
        <CarnotPresetsModal
          isOpen={isPresetsOpen}
          onClose={handleClosePresets}
          onSelectPreset={(newParams) => {
            setParams(newParams);
            handleClosePresets();
          }}
        />
      )}
    </div>
  );
};
