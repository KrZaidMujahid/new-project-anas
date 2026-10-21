/**
 * EQUATION 1 — Real-World Resonance Demonstrations (Light Theme)
 * 4 interactive physical demonstrations:
 * - Demonstration A: Playground Swing (Push timing synchronization)
 * - Demonstration B: Musical Instrument (Acoustic string standing waves)
 * - Demonstration C: Bridge Structural Vibration (Periodic vortex excitation & damping)
 * - Demonstration D: Acoustic Tuning Fork (Sympathetic acoustic resonator)
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Volume2, Wind, Music, Play, RotateCcw } from 'lucide-react';

export const RealWorldDemonstrations: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'swing' | 'music' | 'bridge' | 'fork'>('swing');

  // Demo A: Swing state
  const [swingPushFreq, setSwingPushFreq] = useState(0.5); // Hz (Natural is ~0.5 Hz for 1m rope)
  const [swingTime, setSwingTime] = useState(0);

  // Demo B: Music state
  const [musicFreq, setMusicFreq] = useState(440); // Hz

  // Demo C: Bridge state
  const [bridgeWindSpeed, setBridgeWindSpeed] = useState(1.2); // Hz vortex shedding
  const [bridgeDamping, setBridgeDamping] = useState(true);

  // Demo D: Tuning fork state
  const [forkDriverFreq, setForkDriverFreq] = useState(440);

  // Simple animation timer for demonstrations
  useEffect(() => {
    const id = setInterval(() => {
      setSwingTime((t) => t + 0.05);
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Compute swing amplitude based on frequency matching:
  const swingDetuning = Math.abs(swingPushFreq - 0.5);
  const currentSwingAngle = (45 / (1 + swingDetuning * 20)) * Math.sin(2 * Math.PI * swingPushFreq * swingTime);

  // Bridge oscillation amplitude
  const bridgeDetuning = Math.abs(bridgeWindSpeed - 1.2);
  const bridgeDampingFactor = bridgeDamping ? 3.0 : 1.0;
  const bridgeAmp = (24 / (1 + bridgeDetuning * 15 * bridgeDampingFactor)) / (bridgeDamping ? 2.5 : 1.0);

  // Tuning fork response
  const forkDetuning = Math.abs(forkDriverFreq - 440);
  const forkResponse = 100 / (1 + forkDetuning * 0.8);

  return (
    <div className="space-y-4 text-[#172033]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#172033]">
              Resonance in the Real World
            </h2>
            <p className="text-xs text-[#64748B]">
              Interactive physical case studies demonstrating mechanical and acoustic resonance
            </p>
          </div>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveDemo('swing')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeDemo === 'swing'
                ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            A. Playground Swing
          </button>
          <button
            onClick={() => setActiveDemo('music')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeDemo === 'music'
                ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            B. Musical Instrument
          </button>
          <button
            onClick={() => setActiveDemo('bridge')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeDemo === 'bridge'
                ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            C. Bridge Vibration
          </button>
          <button
            onClick={() => setActiveDemo('fork')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeDemo === 'fork'
                ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            D. Tuning Fork
          </button>
        </div>
      </div>

      {/* DEMO A: PLAYGROUND SWING */}
      {activeDemo === 'swing' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-[#EAF6FF] border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[240px]">
            {/* Ceiling */}
            <div className="w-48 h-3 bg-slate-300 rounded-full mb-1" />
            {/* Pivot */}
            <div className="w-3.5 h-3.5 bg-[#2563EB] rounded-full z-10" />
            {/* Rope & Swing seat rotated by currentSwingAngle */}
            <div
              className="origin-top flex flex-col items-center transition-transform"
              style={{
                height: '140px',
                transform: `rotate(${currentSwingAngle.toFixed(1)}deg)`,
              }}
            >
              <div className="w-0.5 h-full bg-[#64748B]" />
              <div className="w-12 h-3.5 bg-[#F97316] rounded-sm shadow-md" />
              <div className="w-6 h-8 rounded-t-full bg-[#2563EB] mt-0.5" />
            </div>

            <div className="absolute bottom-2 text-center text-xs font-mono font-bold text-[#2563EB]">
              Angle: {currentSwingAngle.toFixed(1)}° | Max Amplitude: {(45 / (1 + swingDetuning * 20)).toFixed(1)}°
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 text-xs text-[#172033] leading-relaxed">
            <h4 className="font-extrabold text-[#172033] text-sm">Synchronizing Pushes on a Playground Swing</h4>
            <p className="text-[#64748B]">
              A playground swing acts as a pendulum with a fixed natural frequency (<code className="font-mono text-[#2563EB]">f₀ ≈ 0.50 Hz</code> for a 1-meter rope). Pushing at this exact cadence injects mechanical energy in-phase with the velocity, causing the swing to soar higher with minimal effort.
            </p>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#172033]">Pushing Frequency (f_push):</span>
                <span className="font-mono font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {swingPushFreq.toFixed(2)} Hz
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.02"
                value={swingPushFreq}
                onChange={(e) => setSwingPushFreq(parseFloat(e.target.value))}
                className="w-full accent-[#F97316] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                <span>0.20 Hz (Too slow)</span>
                <span className="text-emerald-700 font-bold">Natural: 0.50 Hz</span>
                <span>0.90 Hz (Too fast)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEMO B: MUSICAL INSTRUMENT */}
      {activeDemo === 'music' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-[#EAF6FF] border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[240px]">
            <div className="text-xs font-mono font-bold text-[#2563EB] mb-3">Vibrating String Harmonics (Standing Wave Mode)</div>
            {/* Visual standing wave */}
            <svg viewBox="0 0 320 80" className="w-full max-w-xs">
              <line x1="20" y1="40" x2="300" y2="40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
              {/* String curve */}
              <path
                d={`M 20 40 Q 90 ${40 - (Math.abs(musicFreq - 440) < 40 ? 30 : 5) * Math.sin(swingTime * 15)}, 160 40 Q 230 ${40 + (Math.abs(musicFreq - 440) < 40 ? 30 : 5) * Math.sin(swingTime * 15)}, 300 40`}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="20" cy="40" r="5" fill="#64748B" />
              <circle cx="160" cy="40" r="4" fill="#94A3B8" />
              <circle cx="300" cy="40" r="5" fill="#64748B" />
            </svg>
            <div className="text-[11px] font-mono text-[#64748B] mt-3">
              Fundamental Mode: λ = 2L | Resonant Note = 440 Hz (A4)
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 text-xs text-[#172033] leading-relaxed">
            <h4 className="font-extrabold text-[#172033] text-sm">Resonant Acoustic Standing Waves</h4>
            <p className="text-[#64748B]">
              Guitars, violins, and brass instruments work because their strings and air chambers possess discrete natural frequencies (<code className="font-mono text-[#2563EB]">fₙ = n v / 2L</code>). Excitation at these resonant modal frequencies produces rich, loud musical notes.
            </p>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#172033]">Excitation Frequency:</span>
                <span className="font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {musicFreq} Hz
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="880"
                step="10"
                value={musicFreq}
                onChange={(e) => setMusicFreq(parseInt(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                <span>220 Hz (A3)</span>
                <span className="text-[#2563EB] font-bold">Resonant A4: 440 Hz</span>
                <span>880 Hz (A5)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEMO C: BRIDGE VIBRATION */}
      {activeDemo === 'bridge' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-[#EAF6FF] border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[240px]">
            <div className="text-xs font-mono font-bold text-[#DC2626] mb-3">Bridge Deck Structural Response</div>
            <svg viewBox="0 0 320 90" className="w-full max-w-xs">
              <rect x="50" y="10" width="12" height="70" fill="#94A3B8" rx="2" />
              <rect x="250" y="10" width="12" height="70" fill="#94A3B8" rx="2" />
              <path d="M 10 70 Q 56 10, 160 50 Q 256 10, 310 70" fill="none" stroke="#64748B" strokeWidth="2" />
              <line
                x1="20"
                y1={50 + bridgeAmp * Math.sin(swingTime * 8)}
                x2="300"
                y2={50 - bridgeAmp * Math.sin(swingTime * 8)}
                stroke="#DC2626"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-[11px] font-mono font-bold text-[#DC2626] mt-3">
              Vibration Amplitude: {bridgeAmp.toFixed(1)} mm | Structural Risk: {bridgeAmp > 12 ? 'HIGH DANGER' : 'CONTROLLED'}
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 text-xs text-[#172033] leading-relaxed">
            <h4 className="font-extrabold text-[#172033] text-sm">Structural Dynamics &amp; Tuned Mass Dampers</h4>
            <p className="text-[#64748B]">
              When wind vortex shedding or pedestrian footsteps match a bridge deck&apos;s natural resonance frequency (like the 1940 Tacoma Narrows incident), oscillation amplitudes build up catastrophically. Civil engineers install Tuned Mass Dampers to absorb this vibration energy.
            </p>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#172033]">Vortex Excitation Frequency:</span>
                <span className="font-mono font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {bridgeWindSpeed.toFixed(2)} Hz
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={bridgeWindSpeed}
                onChange={(e) => setBridgeWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#DC2626] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                <span>0.5 Hz (Calm breeze)</span>
                <span className="text-[#DC2626] font-bold">Resonant: 1.20 Hz</span>
                <span>2.2 Hz (Storm gale)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-[#172033]">Tuned Mass Damper:</span>
              <button
                onClick={() => setBridgeDamping(!bridgeDamping)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  bridgeDamping
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-red-100 text-[#DC2626] border-red-300'
                }`}
              >
                {bridgeDamping ? 'Enabled (Safe Damping Active)' : 'Disabled (High Vulnerability)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO D: TUNING FORK */}
      {activeDemo === 'fork' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-[#EAF6FF] border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[240px]">
            <svg viewBox="0 0 160 140" className="w-36">
              <rect x="76" y="80" width="8" height="50" fill="#64748B" rx="2" />
              <path d="M 60 40 L 60 75 Q 80 85, 100 75 L 100 40" fill="none" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
              <line
                x1={60 + (forkResponse > 50 ? 5 : 1) * Math.sin(swingTime * 20)}
                y1="15"
                x2="60"
                y2="40"
                stroke="#2563EB"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1={100 - (forkResponse > 50 ? 5 : 1) * Math.sin(swingTime * 20)}
                y1="15"
                x2="100"
                y2="40"
                stroke="#2563EB"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-[11px] font-mono font-bold text-[#2563EB] mt-3">
              Acoustic Resonance Response: {forkResponse.toFixed(1)}%
            </div>
          </div>

          <div className="md:col-span-6 space-y-3 text-xs text-[#172033] leading-relaxed">
            <h4 className="font-extrabold text-[#172033] text-sm">Acoustic Tuning Fork Resonance</h4>
            <p className="text-[#64748B]">
              When two matched 440 Hz tuning forks stand nearby, striking the first emits pressure waves that excite the second into loud sympathetic vibration purely by acoustic resonance.
            </p>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#172033]">External Sound Frequency:</span>
                <span className="font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {forkDriverFreq} Hz
                </span>
              </div>
              <input
                type="range"
                min="380"
                max="500"
                step="2"
                value={forkDriverFreq}
                onChange={(e) => setForkDriverFreq(parseInt(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                <span>380 Hz</span>
                <span className="text-[#2563EB] font-bold">Natural: 440 Hz</span>
                <span>500 Hz</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
