/**
 * EQUATION 1 — Double-Slit Experiment Presets Modal
 * Part 5: Comprehensive Optical Bench Presets & Instructional Configurations
 */

import React from 'react';
import { X, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { DoubleSlitParameters } from '../../physics/doubleslit/types';

export interface DoubleSlitPreset {
  id: string;
  name: string;
  category: 'laser' | 'instructional' | 'geometry' | 'envelope';
  tag: string;
  description: string;
  keyTakeaway: string;
  params: Partial<DoubleSlitParameters>;
}

export const DOUBLE_SLIT_PRESETS: DoubleSlitPreset[] = [
  {
    id: 'hene-red',
    name: 'Helium-Neon (He-Ne) Red Laser Standard',
    category: 'laser',
    tag: '632.8 nm • Lab Standard',
    description: 'The ubiquitous 632.8 nm gas laser found in university physics laboratories worldwide.',
    keyTakeaway: 'Produces wide, brilliant red fringes with high spatial coherence and sharp visibility.',
    params: {
      wavelengthNm: 632.8,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.04,
      screenDistanceM: 2.0,
      intensityPercent: 75,
      isWhiteLight: false,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0003,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'green-dpss',
    name: 'Frequency-Doubled Nd:YAG Green Laser',
    category: 'laser',
    tag: '532.0 nm • High Visibility',
    description: 'Diode-pumped solid-state 532 nm laser near the peak human photopic eye sensitivity (555 nm).',
    keyTakeaway: 'Notice narrower fringe spacing compared to red light (β ∝ λ) due to shorter wavelength.',
    params: {
      wavelengthNm: 532,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      intensityPercent: 80,
      isWhiteLight: false,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0003,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'violet-bluray',
    name: 'Gallium Nitride (GaN) Violet Blu-ray Diode',
    category: 'laser',
    tag: '405.0 nm • Shortest Visible λ',
    description: 'Near-ultraviolet/deep violet diode laser used in high-density optical disc data storage.',
    keyTakeaway: 'Produces extremely fine, closely packed fringes; verifies fringe width shrinkage with minimum λ.',
    params: {
      wavelengthNm: 405,
      slitSeparationMm: 0.20,
      slitWidthMm: 0.03,
      screenDistanceM: 2.0,
      intensityPercent: 70,
      isWhiteLight: false,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0003,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'sodium-d',
    name: 'Sodium Vapor Lamp D-Line Doublet',
    category: 'laser',
    tag: '589.0 nm • Classical Standard',
    description: 'Historical sodium doublet (589.0 nm / 589.6 nm) used in seminal 19th-century optical interferometry.',
    keyTakeaway: 'Warm golden yellow fringes; ideal for calibrating high-precision optical bench micrometers.',
    params: {
      wavelengthNm: 589,
      slitSeparationMm: 0.30,
      slitWidthMm: 0.06,
      screenDistanceM: 1.8,
      intensityPercent: 85,
      isWhiteLight: false,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0003,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'argon-cyan',
    name: 'Argon-Ion Cyan Laser Standard',
    category: 'laser',
    tag: '488.0 nm • Noble Gas Laser',
    description: 'High-power argon laser transition widely deployed in flow cytometry, holography, and lithography.',
    keyTakeaway: 'Crisp cyan interference lines demonstrating intermediate fringe spacing between blue and green.',
    params: {
      wavelengthNm: 488,
      slitSeparationMm: 0.22,
      slitWidthMm: 0.04,
      screenDistanceM: 2.2,
      intensityPercent: 70,
      isWhiteLight: false,
      mediumPreset: 'air',
      mediumRefractiveIndex: 1.0003,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'classroom-demo',
    name: 'Classroom Demonstration Standard',
    category: 'instructional',
    tag: 'λ=650nm • d=0.25mm • L=2.0m',
    description: 'Standard textbook optical bench layout yielding exactly β = 5.20 mm between bright fringes.',
    keyTakeaway: 'Fringes are easily visible and resolvable with an ordinary classroom metric ruler.',
    params: {
      wavelengthNm: 650,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      intensityPercent: 70,
      isWhiteLight: false,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'wide-spacing',
    name: 'Wide Slit Separation (Densely Packed Fringes)',
    category: 'geometry',
    tag: 'd = 0.80 mm • High Density',
    description: 'Slits spaced far apart (d = 0.80 mm). Demonstrates the inverse relationship β ∝ 1/d.',
    keyTakeaway: 'Fringe separation collapses to β = 1.33 mm, creating dozens of closely packed razor-sharp lines.',
    params: {
      wavelengthNm: 532,
      slitSeparationMm: 0.80,
      slitWidthMm: 0.04,
      screenDistanceM: 2.0,
      intensityPercent: 80,
      isWhiteLight: false,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'narrow-spacing',
    name: 'Narrow Slit Separation (Broad Spreading)',
    category: 'geometry',
    tag: 'd = 0.08 mm • High Magnification',
    description: 'Slits placed extremely close together (d = 0.08 mm). Dramatically magnifies fringe width.',
    keyTakeaway: 'Fringe width widens up to β = 16.25 mm! Only a few fringes span the entire viewing window.',
    params: {
      wavelengthNm: 650,
      slitSeparationMm: 0.08,
      slitWidthMm: 0.02,
      screenDistanceM: 2.0,
      intensityPercent: 80,
      isWhiteLight: false,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'distant-screen',
    name: 'Long Screen Distance (Projection Hall)',
    category: 'geometry',
    tag: 'L = 4.5 m • Auditorium Scale',
    description: 'Screen placed at 4.5 meters distance, demonstrating direct linear scaling β ∝ L.',
    keyTakeaway: 'Diffraction angles stay constant while spatial positions y = L tanθ expand across the room.',
    params: {
      wavelengthNm: 532,
      slitSeparationMm: 0.20,
      slitWidthMm: 0.04,
      screenDistanceM: 4.5,
      intensityPercent: 90,
      isWhiteLight: false,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'missing-orders-3',
    name: 'Missing Orders Special: d = 3a Ratio',
    category: 'envelope',
    tag: 'd/a = 3.0 • m = ±3, ±6 Disappear',
    description: 'Slit separation is exactly 3 times the slit width (d = 0.30 mm, a = 0.10 mm).',
    keyTakeaway: 'The 3rd, 6th, and 9th interference maxima vanish because they coincide with single-slit diffraction minima.',
    params: {
      wavelengthNm: 550,
      slitSeparationMm: 0.30,
      slitWidthMm: 0.10,
      screenDistanceM: 2.0,
      intensityPercent: 75,
      isWhiteLight: false,
      showEnvelope: true,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'missing-orders-4',
    name: 'Missing Orders Special: d = 4a Ratio',
    category: 'envelope',
    tag: 'd/a = 4.0 • m = ±4, ±8 Disappear',
    description: 'Slit separation is exactly 4 times the slit width (d = 0.40 mm, a = 0.10 mm).',
    keyTakeaway: 'Exactly 7 interference fringes fit comfortably inside the central diffraction envelope.',
    params: {
      wavelengthNm: 550,
      slitSeparationMm: 0.40,
      slitWidthMm: 0.10,
      screenDistanceM: 2.0,
      intensityPercent: 75,
      isWhiteLight: false,
      showEnvelope: true,
      pureInterferenceMode: false,
    },
  },
  {
    id: 'water-immersion',
    name: 'Aqueous Immersion Tank (n = 1.333)',
    category: 'instructional',
    tag: 'Water n=1.333 • Wavelength Compression',
    description: 'The entire optical bench is submerged in purified water. Wavelength compresses to λ/n.',
    keyTakeaway: 'Fringe spacing compresses by 25% (β_water = β_air / 1.333), proving wave velocity slows in matter.',
    params: {
      wavelengthNm: 632.8,
      slitSeparationMm: 0.25,
      slitWidthMm: 0.05,
      screenDistanceM: 2.0,
      intensityPercent: 80,
      mediumPreset: 'water',
      mediumRefractiveIndex: 1.333,
      isWhiteLight: false,
      pureInterferenceMode: false,
    },
  },
];

interface DoubleSlitPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (params: Partial<DoubleSlitParameters>) => void;
}

export const DoubleSlitPresetsModal: React.FC<DoubleSlitPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [filter, setFilter] = React.useState<string>('all');

  if (!isOpen) return null;

  const filteredPresets =
    filter === 'all'
      ? DOUBLE_SLIT_PRESETS
      : DOUBLE_SLIT_PRESETS.filter((p) => p.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-4xl bg-[#0B1728] border border-[#26364D] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26364D] bg-[#101D30]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F1F5F9]">
                Double-Slit Optical Bench Presets
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Select real-world laser sources, geometric benchmarks, or instructional phenomena
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-md hover:bg-[#17263B] transition-colors cursor-pointer"
            aria-label="Close presets modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#26364D] bg-[#07111F]/60 text-xs">
          <span className="text-[#94A3B8] font-mono mr-1">Category:</span>
          {[
            { id: 'all', label: 'All Presets' },
            { id: 'laser', label: 'Monochromatic Lasers' },
            { id: 'geometry', label: 'Slit & Screen Geometry' },
            { id: 'envelope', label: 'Diffraction & Missing Orders' },
            { id: 'instructional', label: 'Instructional & Immersion' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                  : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Preset Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#07111F]">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset.params);
                onClose();
              }}
              className="group p-4 rounded-xl bg-[#101D30] border border-[#26364D] hover:border-[#38BDF8] hover:shadow-lg hover:shadow-[#38BDF8]/10 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#F1F5F9] group-hover:text-[#38BDF8] transition-colors">
                    {preset.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17263B] text-[#38BDF8] border border-[#26364D] shrink-0">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {preset.description}
                </p>
                <div className="p-2.5 rounded-lg bg-[#07111F] border border-[#26364D] text-[11px] text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                  <span>{preset.keyTakeaway}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#26364D] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3 font-mono text-[#94A3B8]">
                  {preset.params.wavelengthNm && (
                    <span>λ: {preset.params.wavelengthNm}nm</span>
                  )}
                  {preset.params.slitSeparationMm && (
                    <span>d: {preset.params.slitSeparationMm}mm</span>
                  )}
                  {preset.params.screenDistanceM && (
                    <span>L: {preset.params.screenDistanceM}m</span>
                  )}
                </div>
                <span className="text-[#38BDF8] font-bold group-hover:translate-x-0.5 transition-transform">
                  Load Setup →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#26364D] bg-[#101D30] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] bg-[#17263B] hover:bg-[#26364D] rounded-lg transition-colors border border-[#26364D] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
