/**
 * EQUATION 1 — Guided Optics Laboratory Investigations
 * 8 structured experiments for Class 11 & Class 12 physics with 1-click preset setup.
 */

import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { SnellParameters } from '../../physics/optics/types';

interface GuidedExperiment {
  id: string;
  title: string;
  category: 'Snell' | 'TIR' | 'Slab' | 'Prism' | 'Fiber';
  badgeColor: string;
  objective: string;
  setup: Partial<SnellParameters>;
  procedure: string[];
  keyObservation: string;
}

const GUIDED_EXPERIMENTS: GuidedExperiment[] = [
  {
    id: 'exp1',
    title: '1. Refraction: Rare to Dense Medium (Air → Crown Glass)',
    category: 'Snell',
    badgeColor: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10',
    objective: 'Demonstrate that light passing into an optically denser medium slows down and bends toward the normal line.',
    setup: {
      geometry: 'planar',
      medium1Id: 'air',
      medium2Id: 'crown_glass',
      angleDeg: 45,
      wavelengthNm: 589,
      isWhiteLight: false,
      showNormal: true,
      showProtractor: true,
      showWavefronts: false,
    },
    procedure: [
      'Load the apparatus setup (Air n=1.000, Crown Glass n=1.520).',
      'Set angle of incidence θ₁ = 45.0° using the goniometer slider.',
      'Read the angle of refraction θ₂ on the telemetry panel.',
      'Verify: sin(θ₂) = (1.000 / 1.520) · sin(45°) = 0.4652 ⟹ θ₂ = 27.7° < 45°.',
    ],
    keyObservation: 'The refracted ray bends closer to the normal line. Wave speed decreases from 3.0×10⁸ m/s to 1.97×10⁸ m/s.',
  },
  {
    id: 'exp2',
    title: '2. Refraction: Dense to Rare Medium (Glass → Air)',
    category: 'Snell',
    badgeColor: 'text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10',
    objective: 'Observe light speeding up and bending away from normal when traversing from dense to rarer media.',
    setup: {
      geometry: 'planar',
      medium1Id: 'crown_glass',
      medium2Id: 'air',
      angleDeg: 30,
      wavelengthNm: 589,
      isWhiteLight: false,
      showNormal: true,
      showProtractor: true,
    },
    procedure: [
      'Medium 1 is Crown Glass (n₁ = 1.520); Medium 2 is Air (n₂ = 1.000).',
      'Set angle of incidence θ₁ = 30.0° in glass.',
      'Observe the emerging ray in air at θ₂ = 49.5°.',
      'Confirm θ₂ > θ₁, proving rays bend away from normal in optically rarer media.',
    ],
    keyObservation: 'Angle of refraction θ₂ (49.5°) is noticeably greater than incidence angle θ₁ (30°).',
  },
  {
    id: 'exp3',
    title: '3. Critical Angle & Onset of Total Internal Reflection',
    category: 'TIR',
    badgeColor: 'text-[#A78BFA] border-[#A78BFA]/40 bg-[#A78BFA]/10',
    objective: 'Determine the exact critical angle for a Crown Glass to Air interface (θ_c = 41.14°) where refraction ceases.',
    setup: {
      geometry: 'planar',
      medium1Id: 'crown_glass',
      medium2Id: 'air',
      angleDeg: 41.1,
      wavelengthNm: 589,
      isWhiteLight: false,
      showNormal: true,
      showProtractor: true,
    },
    procedure: [
      'Gradually increase incidence angle θ₁ from 35° upwards toward 41°.',
      'Notice the refracted ray skims along the interface surface (θ₂ → 90°).',
      'At θ₁ = 41.14°, critical angle is reached: sin(θ_c) = 1.000 / 1.520 = 0.6579.',
      'Nudge angle to 42°: the refracted ray completely vanishes and 100% of light is reflected (TIR)!',
    ],
    keyObservation: 'Total internal reflection occurs only when light originates in the denser medium and angle exceeds θ_c.',
  },
  {
    id: 'exp4',
    title: '4. Semicircular D-Block G-Bench Investigation',
    category: 'TIR',
    badgeColor: 'text-[#FB7185] border-[#FB7185]/40 bg-[#FB7185]/10',
    objective: 'Demonstrate radial normal entry at curved boundary so that refraction occurs exclusively at the flat diametric boundary.',
    setup: {
      geometry: 'semicircle',
      medium1Id: 'air',
      medium2Id: 'flint_glass',
      angleDeg: 38,
      wavelengthNm: 589,
      isWhiteLight: false,
      showNormal: true,
    },
    procedure: [
      'Load the Semicircular Block geometry apparatus.',
      'A ray entering perpendicular to the circular perimeter suffers zero deviation because angle of incidence with curved normal is 0°.',
      'All deviation happens at the center of the straight diameter boundary.',
      'Test angles above and below the critical angle (θ_c = 37.0° for Flint Glass).',
    ],
    keyObservation: 'Zero refraction occurs at the curved surface; only diametral boundary refraction is measured.',
  },
  {
    id: 'exp5',
    title: '5. Lateral Displacement in a Parallel Glass Slab',
    category: 'Slab',
    badgeColor: 'text-[#FBBF24] border-[#FBBF24]/40 bg-[#FBBF24]/10',
    objective: 'Verify that emergent ray from a parallel slab is parallel to the incident ray, displaced by d = t·sin(i-r)/cos(r).',
    setup: {
      geometry: 'slab',
      medium1Id: 'air',
      medium2Id: 'crown_glass',
      slabThicknessMm: 100,
      angleDeg: 50,
      wavelengthNm: 589,
      showNormal: true,
    },
    procedure: [
      'Select Parallel Slab mode with thickness t = 100 mm.',
      'Set incidence angle i = 50.0° on the top face.',
      'Notice inside refraction angle r = 30.2°.',
      'Emerging ray on bottom face exits at 50.0°, parallel to incident beam.',
      'Measure lateral displacement: d = 100 · sin(50° - 30.2°) / cos(30.2°) = 39.2 mm.',
    ],
    keyObservation: 'Emergent ray suffers lateral shift without angular deviation.',
  },
  {
    id: 'exp6',
    title: '6. Angle of Minimum Deviation in Equilateral Prism (A = 60°)',
    category: 'Prism',
    badgeColor: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10',
    objective: 'Graph deviation angle δ versus incidence angle i and calculate prism refractive index using the minimum deviation formula.',
    setup: {
      geometry: 'prism',
      medium1Id: 'air',
      medium2Id: 'crown_glass',
      prismApexAngleDeg: 60,
      angleDeg: 49.5,
      isWhiteLight: false,
      wavelengthNm: 589,
    },
    procedure: [
      'Select Triangular Prism apparatus with equilateral apex angle A = 60°.',
      'Vary incidence angle from 30° to 75° and inspect the live deviation value δ.',
      'Observe that deviation hits a distinct minimum at i = 49.5° where δ_m = 39.0°.',
      'Compute n = sin[(60° + 39.0°) / 2] / sin(30°) = sin(49.5°) / 0.5 = 1.520.',
    ],
    keyObservation: 'At minimum deviation, the ray inside the prism travels horizontally parallel to its base.',
  },
  {
    id: 'exp7',
    title: '7. Chromatic Dispersion of White Light into Spectrum',
    category: 'Prism',
    badgeColor: 'text-[#A78BFA] border-[#A78BFA]/40 bg-[#A78BFA]/10',
    objective: 'Reproduce Newton’s famous 1666 prism experiment separating polychromatic white light into red, orange, yellow, green, blue, and violet.',
    setup: {
      geometry: 'prism',
      medium1Id: 'air',
      medium2Id: 'flint_glass',
      prismApexAngleDeg: 60,
      angleDeg: 52,
      isWhiteLight: true,
    },
    procedure: [
      'Activate Polychromatic White Light mode on a high-dispersion Flint Glass prism.',
      'Notice the white ray splits into 7 distinct spectral rays upon exiting face 2.',
      'Red (700 nm) has lowest index (n=1.650) and bends least (deviation = 48.2°).',
      'Violet (400 nm) has highest index (n=1.685) and bends most (deviation = 52.4°).',
    ],
    keyObservation: 'Angular dispersion Δδ = δ_violet - δ_red = 4.2° produces a vivid spectral rainbow fan.',
  },
  {
    id: 'exp8',
    title: '8. Optical Fiber Waveguide & Numerical Aperture Limit',
    category: 'Fiber',
    badgeColor: 'text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10',
    objective: 'Test the acceptance cone angle of an optical fiber core-cladding boundary and observe loss when launch angle exceeds θ_a.',
    setup: {
      geometry: 'fiber',
      medium1Id: 'crown_glass',
      fiberCladdingN: 1.38,
      angleDeg: 25,
      showNormal: true,
    },
    procedure: [
      'Select Optical Fiber waveguide mode (Core n=1.52, Cladding n=1.38).',
      'Calculate Numerical Aperture: NA = √(1.52² - 1.38²) = 0.637.',
      'Acceptance Angle: θ_a = arcsin(0.637) = 39.6°.',
      'Launch at 25°: ray undergoes repeated lossless TIR bounces down the core.',
      'Increase angle to 45° (> 39.6°): light escapes into cladding and propagation fails!',
    ],
    keyObservation: 'Light is successfully trapped inside core only when launched within the acceptance cone θ_a.',
  },
];

interface OpticsGuidedExperimentsProps {
  onApplySetup: (setup: Partial<SnellParameters>) => void;
}

export const OpticsGuidedExperiments: React.FC<OpticsGuidedExperimentsProps> = ({
  onApplySetup,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>('exp1');
  const [activeTabCat, setActiveTabCat] = useState<'All' | 'Snell' | 'TIR' | 'Slab' | 'Prism' | 'Fiber'>('All');

  const filtered = GUIDED_EXPERIMENTS.filter(
    (e) => activeTabCat === 'All' || e.category === activeTabCat
  );

  const currentExp = GUIDED_EXPERIMENTS.find((e) => e.id === selectedExpId) || GUIDED_EXPERIMENTS[0];

  return (
    <div className="space-y-6 text-[#F1F5F9]">
      {/* 1. Header Banner */}
      <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#F1F5F9] tracking-tight">
            GUIDED OPTICS INVESTIGATIONS &amp; LAB PROCEDURES
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
            Step-by-step syllabus practicals with one-click apparatus parameter loading for Class 11 and 12 physics.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Snell', 'TIR', 'Slab', 'Prism', 'Fiber'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTabCat(cat as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
              activeTabCat === cat
                ? 'bg-[#38BDF8] text-[#07111F] border-[#38BDF8]'
                : 'bg-[#101D30] text-[#94A3B8] hover:text-[#F1F5F9] border-[#26364D]'
            }`}
          >
            {cat} Experiments
          </button>
        ))}
      </div>

      {/* Main Grid: Experiment List on Left, Active Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filtered.map((exp) => {
            const isSelected = exp.id === selectedExpId;
            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpId(exp.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#17263B] border-[#38BDF8] shadow-md'
                    : 'bg-[#101D30] border-[#26364D] hover:bg-[#17263B]/60 text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#38BDF8]' : 'text-[#F1F5F9]'}`}>
                    {exp.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${exp.badgeColor}`}>
                    {exp.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {exp.objective}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7 bg-[#101D30] rounded-xl border border-[#26364D] p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26364D] gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
                {currentExp.category} Practical Procedure
              </span>
              <h3 className="text-base font-black text-[#F1F5F9] mt-0.5">
                {currentExp.title}
              </h3>
            </div>

            <button
              onClick={() => onApplySetup(currentExp.setup)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#07111F] text-xs font-black transition-all cursor-pointer shadow-md shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Load Apparatus Setup</span>
            </button>
          </div>

          {/* Objective */}
          <div className="bg-[#17263B] p-4 rounded-lg border border-[#26364D] space-y-1">
            <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider block">
              Objective:
            </span>
            <p className="text-xs text-[#F1F5F9] leading-relaxed">
              {currentExp.objective}
            </p>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#34D399] uppercase tracking-wider block">
              Experimental Steps:
            </span>
            <div className="space-y-2">
              {currentExp.procedure.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8] bg-[#0B1728] p-3 rounded-lg border border-[#26364D]">
                  <span className="w-5 h-5 rounded-full bg-[#17263B] border border-[#26364D] flex items-center justify-center text-[10px] font-mono font-bold text-[#38BDF8] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed text-[#F1F5F9]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Observation */}
          <div className="bg-[#0A1526] p-4 rounded-lg border border-[#26364D] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A78BFA] uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
              <span>Crucial Scientific Takeaway:</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {currentExp.keyObservation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
