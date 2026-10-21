import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Calculator, CheckCircle2 } from 'lucide-react';

export const DopplerTheoryPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header with Accordion Toggle */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between pb-2 border-b border-[#26364D] cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h3 className="text-base font-extrabold text-[#F1F5F9] uppercase tracking-wide">
              Physics Behind the Doppler Effect
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Comprehensive theoretical derivation, sign conventions, and worked example
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] font-semibold bg-[#17263B] px-3 py-1.5 rounded-lg border border-[#26364D]">
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-4 text-xs text-[#F1F5F9] leading-relaxed pt-1">
          {/* Section 1: Physical Essence */}
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-[#38BDF8]">1. Fundamental Concept</h4>
            <p className="text-[#94A3B8]">
              The <strong>Doppler Effect</strong> (first described by Christian Doppler in 1842) is the apparent shift in the frequency of a wave received by an observer when there is relative motion between the wave source, the observer, or the surrounding medium.
            </p>
            <ul className="list-disc pl-5 text-[#94A3B8] space-y-1">
              <li>
                <strong className="text-[#F1F5F9]">Emitted Frequency (fs):</strong> The actual rate of periodic crest generation measured in the rest frame of the source.
              </li>
              <li>
                <strong className="text-[#F1F5F9]">Observed Frequency (fo):</strong> The rate at which wave crests physically arrive at and pass the detector.
              </li>
            </ul>
          </div>

          {/* Section 2: General Governing Equation */}
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-[#38BDF8]">2. General Governing Equation (Stationary Medium)</h4>
            <div className="font-mono bg-[#0A1526] p-3 rounded-lg border border-[#26364D] text-[#38BDF8] text-sm text-center font-bold tracking-wide">
              f_observed = f_source × [ (v + v_observer) / (v - v_source) ]
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D]">
                <strong className="text-[#38BDF8] block">Variable Definitions:</strong>
                <ul className="mt-1 space-y-1 text-[#94A3B8] text-[11px]">
                  <li><code className="text-[#F1F5F9]">f_observed</code> = Observed frequency (Hz)</li>
                  <li><code className="text-[#F1F5F9]">f_source</code> = Emitted source frequency (Hz)</li>
                  <li><code className="text-[#F1F5F9]">v</code> = Speed of sound in the air medium (~343 m/s)</li>
                </ul>
              </div>

              <div className="bg-[#101D30] p-2.5 rounded-lg border border-[#26364D]">
                <strong className="text-[#FBBF24] block">Sign Convention (Toward is Positive):</strong>
                <ul className="mt-1 space-y-1 text-[#94A3B8] text-[11px]">
                  <li><code className="text-[#34D399]">+v_observer</code> = Observer moves toward source</li>
                  <li><code className="text-[#FB7185]">-v_observer</code> = Observer moves away from source</li>
                  <li><code className="text-[#FBBF24]">+v_source</code> = Source moves toward observer</li>
                  <li><code className="text-[#FB7185]">-v_source</code> = Source moves away from observer</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Wavelength Formulas */}
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-[#38BDF8]">3. Wavelength Equations (Moving Source)</h4>
            <p className="text-[#94A3B8]">
              Because the sound source moves forward while shedding crests, the physical wavelength in the medium is altered:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] text-[#38BDF8]">
                <span className="text-[#94A3B8] block text-[10px]">Wavelength in front of moving source:</span>
                <span className="text-sm font-bold">λ_front = (v - v_source) / f_source</span>
                <span className="text-[#94A3B8] block text-[10px] mt-1">Crests are crowded closer together</span>
              </div>

              <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] text-[#FB7185]">
                <span className="text-[#94A3B8] block text-[10px]">Wavelength behind moving source:</span>
                <span className="text-sm font-bold">λ_behind = (v + v_source) / f_source</span>
                <span className="text-[#94A3B8] block text-[10px] mt-1">Crests are stretched farther apart</span>
              </div>
            </div>
          </div>

          {/* Section 4: Worked Example */}
          <div className="bg-[#17263B] border border-[#26364D] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#34D399]">
              <Calculator className="w-4 h-4" />
              <span>4. Step-by-Step Worked Numerical Example</span>
            </div>

            <p className="text-[#94A3B8]">
              An ambulance approaches a stationary pedestrian (<code className="text-[#F1F5F9]">v_observer = 0 m/s</code>) at a speed of <code className="text-[#F1F5F9]">v_source = 30 m/s</code> (~108 km/h). Its siren emits sound at <code className="text-[#F1F5F9]">f_source = 500 Hz</code> in air where <code className="text-[#F1F5F9]">v = 343 m/s</code>.
            </p>

            <div className="bg-[#0A1526] p-3 rounded-lg border border-[#26364D] font-mono text-xs space-y-1.5">
              <div className="text-[#94A3B8]">Step 1: Identify given variables</div>
              <div className="text-[#F1F5F9]">f_s = 500 Hz, v = 343 m/s, v_s = +30 m/s, v_o = 0 m/s</div>
              <div className="text-[#94A3B8] pt-1">Step 2: Substitute into Doppler formula</div>
              <div className="text-[#38BDF8]">f_obs = 500 × [ 343 / (343 - 30) ]</div>
              <div className="text-[#38BDF8]">f_obs = 500 × [ 343 / 313 ]</div>
              <div className="text-[#34D399] font-bold text-sm pt-1">
                f_obs = 500 × 1.09585 ≈ 547.92 Hz
              </div>
              <div className="text-[#94A3B8] text-[11px] pt-1">
                The pedestrian hears a pitch that is <strong className="text-[#34D399]">+47.92 Hz higher</strong> (~9.6% pitch jump).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
