/**
 * EQUATION 1 — Bohr Atom Interactive Visualization
 * Scaled SVG visualization of the hydrogen atom showing:
 * - Central proton nucleus (+) with subtle glow
 * - Quantized orbital radii r_n ∝ n^2 for n = 1 to 6
 * - Animated electron with speed v_n ∝ 1/n
 * - Interactive orbit selection on click
 * - Animated photon absorption (incoming wavepacket) and emission (outgoing wavepacket)
 * - Quantum transition trajectories and educational modern QM notes
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  PrincipalQuantumNumber,
  ElectronTransition,
  BohrEnergyLevel,
} from '../../physics/bohr/types';
import { calculateEnergyLevel } from '../../physics/bohr/model';
import { Atom, Zap, Info, Play, Pause, RotateCcw } from 'lucide-react';

interface BohrAtomVisualizationProps {
  currentLevel: PrincipalQuantumNumber;
  onSelectLevel: (n: PrincipalQuantumNumber) => void;
  activeTransition: ElectronTransition | null;
  isTransitioning: boolean;
  transitionProgress: number; // 0 to 1
  isPlaying: boolean;
  onTogglePlay: () => void;
  showOrbitLabels?: boolean;
}

export const BohrAtomVisualization: React.FC<BohrAtomVisualizationProps> = ({
  currentLevel,
  onSelectLevel,
  activeTransition,
  isTransitioning,
  transitionProgress,
  isPlaying,
  onTogglePlay,
  showOrbitLabels = true,
}) => {
  const [hoveredOrbit, setHoveredOrbit] = useState<PrincipalQuantumNumber | null>(null);

  // Electron angular position around orbit (in radians)
  const [electronAngle, setElectronAngle] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Orbit radius mapping:
  // r_n ∝ n^2: n=1 -> 1, n=2 -> 4, n=3 -> 9, n=4 -> 16, n=5 -> 25, n=6 -> 36.
  // To keep n=1 visible and n=6 inside viewBox (center at 300, 300; max radius 265):
  // Formula: R(n) = minR + (maxR - minR) * ((n^2 - 1) / (36 - 1))
  // With minR = 40px (n=1) and maxR = 260px (n=6), the relative n^2 spacing is preserved!
  const minSvgRadius = 42;
  const maxSvgRadius = 260;
  const getSvgOrbitRadius = (n: PrincipalQuantumNumber): number => {
    const fraction = (n * n - 1) / (6 * 6 - 1); // 0 at n=1, 1.0 at n=6
    return minSvgRadius + fraction * (maxSvgRadius - minSvgRadius);
  };

  // Compute instantaneous electron radius during quantum transition
  let effectiveRadius = getSvgOrbitRadius(currentLevel);
  if (isTransitioning && activeTransition) {
    const rStart = getSvgOrbitRadius(activeTransition.initialLevel);
    const rEnd = getSvgOrbitRadius(activeTransition.finalLevel);
    // Smooth transition
    effectiveRadius = rStart + (rEnd - rStart) * transitionProgress;
  }

  // Animation loop for electron orbital revolution
  useEffect(() => {
    const animate = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        // Orbital speed decreases with n: v ∝ 1/n
        const baseSpeed = 2.2 / currentLevel; // rad/s
        setElectronAngle((prev) => (prev + baseSpeed * dt) % (2 * Math.PI));
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentLevel]);

  // Electron coordinates
  const electronX = 300 + Math.cos(electronAngle) * effectiveRadius;
  const electronY = 300 + Math.sin(electronAngle) * effectiveRadius;

  // Level data for tooltip/display
  const currentLevelData = calculateEnergyLevel(currentLevel);

  // Photon animation path for transition
  // Absorption: photon travels from edge of atom (e.g., x=50, y=100) toward electron
  // Emission: photon travels from electron outward to edge
  const photonColor =
    activeTransition?.visibleColorHex ||
    (activeTransition?.spectralRegion === 'ultraviolet' ? '#C084FC' : '#F43F5E');

  const allLevels: PrincipalQuantumNumber[] = [1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-[#10243D] border border-[#29415F] rounded-xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]/70">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Interactive Bohr Atomic Visualization
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#142B47] text-[#38BDF8] border border-[#29415F]">
            r_n = a₀ · n²
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-[#142B47] text-white hover:bg-[#1E3B61] border border-[#29415F]'
                : 'bg-[#38BDF8] text-slate-950 hover:bg-[#0284C7]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Orbit</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Orbit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="relative w-full aspect-square max-h-[520px] mx-auto my-2 flex items-center justify-center select-none">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full max-w-[560px] max-h-[560px]"
        >
          <defs>
            {/* Proton Nucleus Gradient */}
            <radialGradient id="protonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" stopOpacity="0.8" />
            </radialGradient>

            {/* Electron Gradient */}
            <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </radialGradient>

            {/* Active Glow Filter */}
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Radial Reference Grid */}
          <circle cx="300" cy="300" r="280" fill="none" stroke="#142B47" strokeWidth="1" strokeDasharray="4 4" />

          {/* Quantized Circular Orbits (n = 1 to 6) */}
          {allLevels.map((n) => {
            const r = getSvgOrbitRadius(n);
            const isSelected = currentLevel === n;
            const isHovered = hoveredOrbit === n;

            let strokeColor = '#29415F';
            let strokeWidth = 1.5;
            let strokeDash = '3 3';

            if (isSelected) {
              strokeColor = '#38BDF8';
              strokeWidth = 2.5;
              strokeDash = 'none';
            } else if (isHovered) {
              strokeColor = '#60A5FA';
              strokeWidth = 2;
            }

            return (
              <g
                key={`orbit-${n}`}
                className="cursor-pointer group"
                onClick={() => onSelectLevel(n)}
                onMouseEnter={() => setHoveredOrbit(n)}
                onMouseLeave={() => setHoveredOrbit(null)}
              >
                {/* Invisible wide hit area for easy clicking */}
                <circle cx="300" cy="300" r={r} fill="none" stroke="transparent" strokeWidth="16" />

                {/* Visible Orbit Line */}
                <circle
                  cx="300"
                  cy="300"
                  r={r}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  className="transition-colors duration-200"
                />

                {/* Orbit Label (Top Center) */}
                {showOrbitLabels && (
                  <g transform={`translate(300, ${300 - r})`}>
                    <rect
                      x="-22"
                      y="-12"
                      width="44"
                      height="15"
                      rx="4"
                      fill={isSelected ? '#38BDF8' : '#0B1B31'}
                      stroke={isSelected ? '#38BDF8' : '#29415F'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-1"
                      textAnchor="middle"
                      fill={isSelected ? '#071426' : '#9FB3CC'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      n = {n}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Central Nucleus: Proton (+) */}
          <g transform="translate(300, 300)" filter="url(#glowFilter)">
            {/* Nucleus Outer Aura */}
            <circle cx="0" cy="0" r="22" fill="#FB7185" opacity="0.15" className="animate-pulse" />
            <circle cx="0" cy="0" r="14" fill="url(#protonGlow)" stroke="#FFF" strokeWidth="1.5" />
            {/* Plus sign */}
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              +
            </text>
          </g>

          {/* Nucleus Label */}
          <text
            x="300"
            y="324"
            textAnchor="middle"
            fill="#FB7185"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Proton (Z = 1)
          </text>

          {/* Animated Photon Wavepacket during Transition */}
          {isTransitioning && activeTransition && (
            <g>
              {activeTransition.type === 'emission' ? (
                // Emission: Photon shoots outward from electron
                (() => {
                  const pX = electronX + (300 - electronX) * -1.8 * transitionProgress;
                  const pY = electronY + (300 - electronY) * -1.8 * transitionProgress;
                  return (
                    <g transform={`translate(${pX}, ${pY})`}>
                      <circle cx="0" cy="0" r="14" fill={photonColor} opacity="0.4" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill={photonColor} stroke="#FFFFFF" strokeWidth="1.5" />
                      {/* Sinusoidal Wavelet */}
                      <path
                        d="M -16 0 Q -8 -10 0 0 T 16 0"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="20"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        hν ({activeTransition.wavelengthNM.toFixed(1)} nm)
                      </text>
                    </g>
                  );
                })()
              ) : (
                // Absorption: Photon flies inward into electron
                (() => {
                  const startX = 60;
                  const startY = 80;
                  const pX = startX + (electronX - startX) * transitionProgress;
                  const pY = startY + (electronY - startY) * transitionProgress;
                  return (
                    <g transform={`translate(${pX}, ${pY})`}>
                      <circle cx="0" cy="0" r="14" fill={photonColor} opacity="0.4" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill={photonColor} stroke="#FFFFFF" strokeWidth="1.5" />
                      <path
                        d="M -16 0 Q -8 -10 0 0 T 16 0"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="-14"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Incoming hν ({activeTransition.wavelengthNM.toFixed(1)} nm)
                      </text>
                    </g>
                  );
                })()
              )}
            </g>
          )}

          {/* Revolving Electron */}
          <g transform={`translate(${electronX}, ${electronY})`} filter="url(#glowFilter)">
            {/* Electron Halo */}
            <circle cx="0" cy="0" r="14" fill="#60A5FA" opacity="0.25" />
            {/* Electron Core */}
            <circle cx="0" cy="0" r="8" fill="url(#electronGlow)" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Minus Sign */}
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="black"
              fontFamily="sans-serif"
            >
              −
            </text>
          </g>

          {/* Electron State Indicator Label beside electron */}
          <g transform={`translate(${electronX + 14}, ${electronY - 14})`}>
            <rect x="0" y="0" width="75" height="18" rx="4" fill="#0B1B31" stroke="#38BDF8" strokeWidth="1" />
            <text x="37.5" y="12" textAnchor="middle" fill="#EAF2FF" fontSize="9" fontWeight="bold" fontFamily="monospace">
              e⁻ (n = {currentLevel})
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Historical Model Scientific Disclaimer Note */}
      <div className="mt-2 p-3 rounded-lg bg-[#0B1B31] border border-[#29415F] flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-[#9FB3CC] text-[11px] leading-relaxed">
          <strong className="text-white">Scientific Context:</strong> The planetary circular orbits shown above depict Niels Bohr’s historical 1913 semi-classical model. In modern quantum mechanics, the electron does not follow a classical trajectory; it is described by a 3D probability cloud / wavefunction <span className="font-mono text-[#38BDF8]">|ψ(r, θ, φ)|²</span> satisfying the Schrödinger equation.
        </div>
      </div>
    </div>
  );
};
