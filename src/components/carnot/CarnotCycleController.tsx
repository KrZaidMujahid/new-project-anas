/**
 * EQUATION 1 — Carnot Four-Stage Cycle Controller
 * Playback, single-cycle run, stage-by-stage stepping,
 * simulation speed regulation, and direct stage jumper.
 */

import React from 'react';
import { CarnotStageId } from '../../physics/carnot/types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Gauge,
  Flame,
  Snowflake,
  Shield,
  Zap,
} from 'lucide-react';

interface CarnotCycleControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRunSingleCycle: () => void;
  currentStage: CarnotStageId;
  onSelectStage: (stage: CarnotStageId) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  cycleCountCompleted: number;
}

export const CarnotCycleController: React.FC<CarnotCycleControllerProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onStepForward,
  onStepBackward,
  onRunSingleCycle,
  currentStage,
  onSelectStage,
  speed,
  onSpeedChange,
  cycleCountCompleted,
}) => {
  const speeds = [0.25, 0.5, 1, 1.5, 2, 3];

  const stagesMeta: {
    id: CarnotStageId;
    name: string;
    sub: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 1,
      name: 'Stage 1: Isothermal Expansion',
      sub: 'A → B · Heat In Q_H',
      icon: <Flame className="w-3.5 h-3.5 text-[#F97316]" />,
      color: 'border-[#F97316] text-[#FB923C]',
    },
    {
      id: 2,
      name: 'Stage 2: Adiabatic Expansion',
      sub: 'B → C · Insulated (Q=0)',
      icon: <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />,
      color: 'border-[#22D3EE] text-[#22D3EE]',
    },
    {
      id: 3,
      name: 'Stage 3: Isothermal Compression',
      sub: 'C → D · Heat Out Q_C',
      icon: <Snowflake className="w-3.5 h-3.5 text-[#60A5FA]" />,
      color: 'border-[#60A5FA] text-[#60A5FA]',
    },
    {
      id: 4,
      name: 'Stage 4: Adiabatic Compression',
      sub: 'D → A · Insulated (Q=0)',
      icon: <Zap className="w-3.5 h-3.5 text-[#C084FC]" />,
      color: 'border-[#C084FC] text-[#C084FC]',
    },
  ];

  return (
    <div className="bg-[#102740] border border-[#29445F] rounded-xl p-5 shadow-xl flex flex-col gap-4">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#29445F]/70">
        {/* Playback Primary Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-extrabold'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Engine</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Engine</span>
              </>
            )}
          </button>

          <button
            onClick={onRunSingleCycle}
            title="Run one full cycle (A→B→C→D→A) and stop"
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#16334F] hover:bg-[#1E4369] text-white border border-[#29445F] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Run 1 Cycle</span>
          </button>

          <button
            onClick={onStepBackward}
            title="Step to previous stage"
            className="p-2 rounded-lg bg-[#0B1F36] hover:bg-[#16334F] text-[#AFC2D8] hover:text-white border border-[#29445F] transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onStepForward}
            title="Step to next stage"
            className="p-2 rounded-lg bg-[#0B1F36] hover:bg-[#16334F] text-[#AFC2D8] hover:text-white border border-[#29445F] transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            title="Reset engine to State A"
            className="p-2 rounded-lg bg-[#0B1F36] hover:bg-[#16334F] text-[#AFC2D8] hover:text-white border border-[#29445F] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls & Cycle Counter */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#0B1F36] px-2.5 py-1.5 rounded-lg border border-[#29445F]">
            <span className="text-[#AFC2D8]">Speed:</span>
            <div className="flex items-center gap-1">
              {speeds.map((s) => (
                <button
                  key={`speed-${s}`}
                  onClick={() => onSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    speed === s
                      ? 'bg-[#38BDF8] text-slate-950'
                      : 'text-[#AFC2D8] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B1F36] px-3 py-1.5 rounded-lg border border-[#29445F] text-[#AFC2D8]">
            <span>Cycles Done:</span>
            <span className="text-[#38BDF8] font-bold text-sm">{cycleCountCompleted}</span>
          </div>
        </div>
      </div>

      {/* Stage Stepper Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stagesMeta.map((st) => {
          const isActive = currentStage === st.id;
          return (
            <button
              key={`stage-tab-${st.id}`}
              onClick={() => onSelectStage(st.id)}
              className={`p-2.5 rounded-lg text-left transition-all cursor-pointer border flex flex-col justify-between ${
                isActive
                  ? `bg-[#16334F] ${st.color} shadow-sm border-2`
                  : 'bg-[#0B1F36] border-[#29445F] text-[#AFC2D8] hover:border-slate-500 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                  {st.icon}
                  Stage {st.id}
                </span>
                {isActive && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/10 text-white font-bold">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] font-medium text-[#AFC2D8] mt-1 truncate">
                {st.name.replace(`Stage ${st.id}: `, '')}
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                {st.sub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
