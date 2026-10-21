/**
 * EQUATION 1 — Guided Double-Slit Virtual Experiments
 * Part 17: "Perform Your Own Double-Slit Experiment"
 *
 * Implements 9 structured scientific investigations:
 * 1. Measure fringe width for a selected wavelength
 * 2. Investigate the effect of wavelength
 * 3. Investigate the effect of slit separation
 * 4. Investigate the effect of screen distance
 * 5. Investigate the effect of slit width
 * 6. Identify constructive interference
 * 7. Identify destructive interference
 * 8. Compare single-slit diffraction with double-slit interference
 * 9. Compare measured and theoretical fringe spacing
 *
 * Each activity features:
 * - Objective
 * - Instructions
 * - Expected observation
 * - Student response text area
 * - Mark Complete button
 * - Reset Activity button
 * - LocalStorage persistence for both student notes and completion marks
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Save,
  Check,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { DoubleSlitParameters } from '../../physics/doubleslit/types';

interface Activity {
  id: number;
  title: string;
  category: string;
  objective: string;
  instructions: string;
  expectedObservation: string;
  setupParams: Partial<DoubleSlitParameters>;
}

interface GuidedExperimentsProps {
  onApplySetup: (params: Partial<DoubleSlitParameters>) => void;
}

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: '1. Measure Fringe Width for a Selected Wavelength',
    category: 'Fringe Geometry',
    objective: 'Directly verify the fringe width formula β = λL / d for a monochromatic green DPSS laser (532 nm).',
    instructions: 'Click "Apply Setup" below to configure λ = 532 nm, d = 0.25 mm, and L = 2.0 m. Use the screen ruler or the Measure tab to record consecutive bright fringe positions.',
    expectedObservation: 'The bright fringes are uniformly separated by β = (532 nm × 2.0 m) / 0.25 mm = 4.256 mm.',
    setupParams: {
      wavelengthNm: 532,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      slitMode: 'double',
      slit1Open: true,
      slit2Open: true,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0,
      intensityPercent: 70,
    },
  },
  {
    id: 2,
    title: '2. Investigate the Effect of Wavelength (λ)',
    category: 'Spectral Dispersion',
    objective: 'Demonstrate that longer optical wavelengths yield wider interference fringes (β ∝ λ).',
    instructions: 'Switch between Violet (405 nm), Green (550 nm), and Deep Red (670 nm) lasers while keeping d = 0.25 mm and L = 2.0 m constant.',
    expectedObservation: 'Red light produces broad, spacious fringes (β = 5.36 mm), whereas violet light produces closely spaced, dense fringes (β = 3.24 mm).',
    setupParams: {
      wavelengthNm: 670,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      slitMode: 'double',
    },
  },
  {
    id: 3,
    title: '3. Investigate the Effect of Slit Separation (d)',
    category: 'Aperture Geometry',
    objective: 'Verify the inverse relationship between fringe width and slit separation (β ∝ 1/d).',
    instructions: 'Change slit separation d from 0.15 mm to 0.50 mm while keeping wavelength λ = 550 nm and L = 2.0 m constant.',
    expectedObservation: 'Doubling d cuts the fringe width in half, squeezing twice as many bright fringes into the same screen area.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.50,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      slitMode: 'double',
    },
  },
  {
    id: 4,
    title: '4. Investigate the Effect of Screen Distance (L)',
    category: 'Projection Scaling',
    objective: 'Prove that spatial fringe width magnifies linearly with distance (β ∝ L) under the far-field condition.',
    instructions: 'Increase the screen distance from L = 1.0 m to L = 3.0 m and measure the fringe width β on the screen.',
    expectedObservation: 'At L = 3.0 m, the fringe width expands threefold to β = 6.60 mm. The angular separation Δθ = λ/d remains unchanged.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 3.0,
      slitMode: 'double',
    },
  },
  {
    id: 5,
    title: '5. Investigate the Effect of Slit Width (a)',
    category: 'Diffraction Envelope',
    objective: 'Distinguish the single-slit diffraction envelope from the double-slit interference fringe spacing.',
    instructions: 'Increase slit width a from 0.02 mm to 0.12 mm while keeping d = 0.25 mm constant. Enable the Diffraction Envelope toggle.',
    expectedObservation: 'The positions and spacing of individual interference fringes do NOT change! However, the overall diffraction envelope narrows dramatically, causing outer fringes to dim rapidly.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.12,
      screenDistanceM: 2.0,
      slitMode: 'double',
      showEnvelope: true,
    },
  },
  {
    id: 6,
    title: '6. Identify Constructive Interference',
    category: 'Phase & Path Analysis',
    objective: 'Confirm that constructive interference occurs strictly when path difference δ = mλ and phase difference Δφ = 2mπ.',
    instructions: 'Use the detector slider to place the cursor on the 1st bright fringe (m = 1) and inspect the Interference Explorer.',
    expectedObservation: 'At y = β = 4.40 mm, the path difference is exactly δ = 550 nm = 1.0λ, phase difference Δφ = 360°, and the electric field vectors E₁ and E₂ arrive perfectly in phase.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      detectorYMm: 4.4,
      slitMode: 'double',
    },
  },
  {
    id: 7,
    title: '7. Identify Destructive Interference',
    category: 'Phase & Path Analysis',
    objective: 'Verify that destructive minima occur when path difference δ = (m + 1/2)λ and waves arrive 180° out of phase.',
    instructions: 'Drag the detector cursor to the first dark minimum at y = 0.5β = 2.20 mm.',
    expectedObservation: 'At y = 2.20 mm, path difference is δ = 275 nm = 0.5λ, phase difference is Δφ = 180° (π rad), and wave crests meet troughs resulting in zero net optical intensity.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      detectorYMm: 2.2,
      slitMode: 'double',
    },
  },
  {
    id: 8,
    title: '8. Compare Single-Slit Diffraction with Double-Slit Interference',
    category: 'Wave Superposition',
    objective: 'Understand how single-slit diffraction envelopes modulate double-slit interference fringes.',
    instructions: 'Close Slit 2 to observe pure single-slit diffraction, then re-open Slit 2 to watch fine Young interference fringes appear inside.',
    expectedObservation: 'With 1 slit open: smooth broad diffraction profile with central maximum width 2λL/a. With both slits open: sharp interference fringes appear within the same outer envelope profile.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      slitMode: 'double',
      slit1Open: true,
      slit2Open: false,
      showEnvelope: true,
    },
  },
  {
    id: 9,
    title: '9. Compare Measured and Theoretical Fringe Spacing',
    category: 'Error Analysis',
    objective: 'Calculate the percentage error between multi-fringe measured spacing β_measured = Δy / |m₂ - m₁| and the theoretical prediction β = λL / d.',
    instructions: 'Navigate to the "Measure Fringe Width" tab. Select m₁ = -3 and m₂ = +3. Compare Δy / 6 with theoretical β.',
    expectedObservation: 'Under paraxial approximation (L = 2.0 m ≫ d = 0.25 mm), the experimental and theoretical values agree with error &lt; 0.05%.',
    setupParams: {
      wavelengthNm: 550,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      slitMode: 'double',
      slit1Open: true,
      slit2Open: true,
    },
  },
];

const LOCAL_STORAGE_RESPONSES_KEY = 'eq1_doubleslit_responses';
const LOCAL_STORAGE_COMPLETED_KEY = 'eq1_doubleslit_completed';

export const DoubleSlitGuidedExperiments: React.FC<GuidedExperimentsProps> = ({
  onApplySetup,
}) => {
  const [selectedActId, setSelectedActId] = useState<number>(1);
  const [completed, setCompleted] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COMPLETED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [responses, setResponses] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RESPONSES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  // Sync to localStorage
  const handleResponseChange = (text: string) => {
    const updated = { ...responses, [selectedActId]: text };
    setResponses(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(updated));
    } catch {
      // Safe ignore
    }
  };

  const handleToggleComplete = () => {
    const updated = { ...completed, [selectedActId]: !completed[selectedActId] };
    setCompleted(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_COMPLETED_KEY, JSON.stringify(updated));
    } catch {
      // Safe ignore
    }
  };

  const handleResetActivity = () => {
    const updatedResponses = { ...responses, [selectedActId]: '' };
    const updatedCompleted = { ...completed, [selectedActId]: false };
    setResponses(updatedResponses);
    setCompleted(updatedCompleted);
    try {
      localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(updatedResponses));
      localStorage.setItem(LOCAL_STORAGE_COMPLETED_KEY, JSON.stringify(updatedCompleted));
    } catch {
      // Safe ignore
    }
  };

  const currentAct = ACTIVITIES.find((a) => a.id === selectedActId) || ACTIVITIES[0];
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl space-y-5 text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">Perform Your Own Double-Slit Experiment</h3>
            <p className="text-xs text-[#94A3B8]">
              9 guided laboratory investigations with automatic bench configuration, response logs, and completion tracking.
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-300">Progress:</span>
          <span className="px-2.5 py-1 rounded-md bg-[#17263B] border border-[#26364D] text-xs font-mono font-bold text-[#34D399]">
            {completedCount} / {ACTIVITIES.length} Complete
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Activity Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Select Investigation
          </label>
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {ACTIVITIES.map((act) => {
              const isDone = !!completed[act.id];
              const isSelected = act.id === selectedActId;
              return (
                <button
                  key={act.id}
                  onClick={() => setSelectedActId(act.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#17263B] border-[#38BDF8] text-white shadow-sm'
                      : 'bg-[#0B1728] border-[#26364D] text-[#94A3B8] hover:bg-[#17263B] hover:text-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-400">
                        {act.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">{act.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{act.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Investigation Card */}
        <div className="lg:col-span-8 bg-[#0B1728] p-5 rounded-xl border border-[#26364D] space-y-4">
          {/* Activity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                Investigation {currentAct.id} of {ACTIVITIES.length} • {currentAct.category}
              </span>
              <h4 className="font-bold text-base text-white mt-0.5">{currentAct.title}</h4>
            </div>

            <button
              onClick={() => onApplySetup(currentAct.setupParams)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8] text-[#07111F] text-xs font-bold hover:bg-[#38BDF8]/90 transition-colors cursor-pointer self-start sm:self-center shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Apply Bench Setup</span>
            </button>
          </div>

          {/* Objective & Instructions */}
          <div className="space-y-3 text-xs">
            <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
              <strong className="text-[#38BDF8] uppercase tracking-wider text-[10px] block">Objective</strong>
              <p className="text-slate-200">{currentAct.objective}</p>
            </div>

            <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
              <strong className="text-[#FBBF24] uppercase tracking-wider text-[10px] block">Instructions</strong>
              <p className="text-slate-300 leading-relaxed">{currentAct.instructions}</p>
            </div>

            <div className="bg-[#101D30] p-3 rounded-lg border border-[#26364D] space-y-1">
              <strong className="text-[#34D399] uppercase tracking-wider text-[10px] block">Expected Observation</strong>
              <p className="text-slate-300 leading-relaxed">{currentAct.expectedObservation}</p>
            </div>
          </div>

          {/* Student Response Field (Persisted in LocalStorage) */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                Your Recorded Observations &amp; Physics Conclusion:
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Auto-saved to LocalStorage</span>
            </label>
            <textarea
              rows={3}
              value={responses[selectedActId] || ''}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Record your measured fringe values, calculations, and physics conclusions here..."
              className="w-full bg-[#101D30] border border-[#26364D] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8] resize-none leading-relaxed placeholder:text-slate-600 font-sans"
            />
          </div>

          {/* Action Buttons: Mark Complete & Reset Activity */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#26364D]">
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                completed[selectedActId]
                  ? 'bg-[#34D399] text-[#07111F] hover:bg-[#34D399]/90'
                  : 'bg-[#17263B] text-slate-200 border border-[#26364D] hover:border-[#34D399] hover:text-[#34D399]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completed[selectedActId] ? 'Completed ✓ (Click to Unmark)' : 'Mark Activity Complete'}</span>
            </button>

            <button
              onClick={handleResetActivity}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#94A3B8] hover:text-white bg-[#17263B] hover:bg-[#26364D] rounded-lg border border-[#26364D] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Activity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
