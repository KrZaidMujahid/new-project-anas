/**
 * EQUATION 1 — Photoelectric Effect Interactive Vacuum Apparatus (SVG)
 * Comprehensive laboratory apparatus with:
 * - Animated incident photon quanta stream from light source to cathode
 * - Animated photoelectrons with Fermi velocity distribution & electric field dynamics
 * - Evacuated quartz vacuum tube, metal cathode (emitter) & anode (collector)
 * - Variable electric field vectors (accelerating / retarding)
 * - Battery / DC potential divider, digital microammeter & voltmeter
 * - Play / Pause / Resume, Reset animation, and 0.5x / 1x / 2x speed controls
 * - Color-coded visible light spectrum & symbolic UV representation
 */

import React, { useRef, useEffect, useState } from 'react';
import { Eye, Zap, Play, Pause, RotateCcw, FastForward, Activity } from 'lucide-react';
import { PhotoelectricParameters, PhotoelectricCalculations } from '../../physics/photoelectric/types';

interface PhotoelectricApparatusSvgProps {
  params: PhotoelectricParameters;
  calc: PhotoelectricCalculations;
  onUpdateParams: (updater: (prev: PhotoelectricParameters) => PhotoelectricParameters) => void;
  onResetAnimation: () => void;
}

interface SimulatedPhoton {
  id: number;
  progress: number; // 0 to 1 along trajectory
  speed: number;
  offsetY: number;
}

interface SimulatedElectron {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energyFraction: number; // 0.2 to 1.0 of K_max
  hasTurnedAround: boolean;
  isDead: boolean;
  age: number;
}

export const PhotoelectricApparatusSvg: React.FC<PhotoelectricApparatusSvgProps> = ({
  params,
  calc,
  onUpdateParams,
  onResetAnimation,
}) => {
  const width = 760;
  const height = 410;

  // Geometry references inside SVG coordinates
  const cathodeX = 220;
  const anodeX = 540;
  const tubeTopY = 60;
  const tubeBottomY = 240;
  const tubeMidY = (tubeTopY + tubeBottomY) / 2;
  const lightSourceX = 65;
  const lightSourceY = 55;

  // Particle state refs
  const photonsRef = useRef<SimulatedPhoton[]>([]);
  const electronsRef = useRef<SimulatedElectron[]>([]);
  const nextPhotonIdRef = useRef<number>(1);
  const nextElectronIdRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const electronSpawnTimerRef = useRef<number>(0);
  const photonSpawnTimerRef = useRef<number>(0);
  const [, setRenderTick] = useState(0);

  const { isEmissionPossible, maxKineticEnergyEV, appliedVoltage } = {
    isEmissionPossible: calc.isEmissionPossible,
    maxKineticEnergyEV: calc.maxKineticEnergyEV,
    appliedVoltage: params.appliedVoltage,
  };
  const intensityPercent = params.intensityPercent;
  const isPaused = params.isPaused;
  const animSpeed = params.animationSpeed || 1.0;

  // Reset animation callback
  const handleResetAnim = () => {
    photonsRef.current = [];
    electronsRef.current = [];
    electronSpawnTimerRef.current = 0;
    photonSpawnTimerRef.current = 0;
    onResetAnimation();
  };

  // Animation Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const rawDelta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      if (!isPaused) {
        const dt = rawDelta * animSpeed;

        // --------------------------------------------------------------------
        // A. SIMULATE INCIDENT PHOTONS (Light source -> Cathode)
        // --------------------------------------------------------------------
        if (intensityPercent > 0) {
          // Spawn rate proportional to intensity
          const photonInterval = Math.max(0.04, 0.45 - (intensityPercent / 100) * 0.4);
          photonSpawnTimerRef.current += dt;

          if (photonSpawnTimerRef.current >= photonInterval) {
            photonSpawnTimerRef.current = 0;
            const count = intensityPercent > 65 ? 2 : 1;
            for (let c = 0; c < count; c++) {
              photonsRef.current.push({
                id: nextPhotonIdRef.current++,
                progress: 0,
                speed: 1.1 + Math.random() * 0.3, // Traversal speed factor
                offsetY: (Math.random() - 0.5) * 60,
              });
            }
          }
        }

        // Integrate photons
        const activePhotons: SimulatedPhoton[] = [];
        for (let i = 0; i < photonsRef.current.length; i++) {
          const ph = photonsRef.current[i];
          ph.progress += ph.speed * dt;
          if (ph.progress < 1.0) {
            activePhotons.push(ph);
          }
        }
        photonsRef.current = activePhotons.slice(-40); // Cap count for smooth 60fps

        // --------------------------------------------------------------------
        // B. SIMULATE PHOTOELECTRONS (Cathode -> Anode / Retarding)
        // --------------------------------------------------------------------
        if (isEmissionPossible && intensityPercent > 0) {
          const electronInterval = Math.max(0.04, 0.5 - (intensityPercent / 100) * 0.43);
          electronSpawnTimerRef.current += dt;

          if (electronSpawnTimerRef.current >= electronInterval) {
            electronSpawnTimerRef.current = 0;
            const count = intensityPercent > 70 ? 2 : 1;
            for (let c = 0; c < count; c++) {
              const startY = tubeMidY + (Math.random() - 0.5) * 110;
              // Fermi-Dirac energy distribution factor between 0.25 and 1.0
              const energyFraction = 0.25 + 0.75 * Math.pow(Math.random(), 0.75);

              // Speed scales with sqrt(K_max * fraction)
              const speedScale = 145 * Math.sqrt(Math.max(0.05, maxKineticEnergyEV * energyFraction));
              // Forward emission cone ±28°
              const angleRad = (Math.random() - 0.5) * 0.65;

              electronsRef.current.push({
                id: nextElectronIdRef.current++,
                startX: cathodeX + 8,
                startY,
                x: cathodeX + 8,
                y: startY,
                vx: speedScale * Math.cos(angleRad),
                vy: speedScale * Math.sin(angleRad),
                energyFraction,
                hasTurnedAround: false,
                isDead: false,
                age: 0,
              });
            }
          }
        } else {
          electronSpawnTimerRef.current = 0;
        }

        // Electric field acceleration (F = -e E, E = -V/d => a_x = e V / (m d))
        const tubeDistancePx = anodeX - cathodeX;
        const accelX = (appliedVoltage * 860) / tubeDistancePx;

        const activeElectrons: SimulatedElectron[] = [];
        for (let i = 0; i < electronsRef.current.length; i++) {
          const el = electronsRef.current[i];
          el.age += dt;

          el.vx += accelX * dt;
          el.x += el.vx * dt;
          el.y += el.vy * dt;

          if (el.vx < 0) {
            el.hasTurnedAround = true;
          }

          // Boundary checks
          if (el.x >= anodeX) {
            el.isDead = true; // Collected at anode
          } else if (el.x <= cathodeX && el.hasTurnedAround) {
            el.isDead = true; // Retarded and returned to cathode
          } else if (el.y < tubeTopY || el.y > tubeBottomY || el.age > 4.5) {
            el.isDead = true;
          } else {
            activeElectrons.push(el);
          }
        }
        electronsRef.current = activeElectrons.slice(-55);
      }

      setRenderTick((t) => (t + 1) % 1000000);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isEmissionPossible, intensityPercent, maxKineticEnergyEV, appliedVoltage, isPaused, animSpeed, tubeMidY]);

  const beamColor = calc.spectralColorHex;
  const beamOpacity = Math.max(0.18, (params.intensityPercent / 100) * 0.7);

  return (
    <div className="bg-[#10243D] rounded-xl border border-[#29415F] p-4 sm:p-5 shadow-2xl flex flex-col gap-3">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#29415F]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse"></div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#EAF2FF]">
            Photoelectric Vacuum Chamber
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#142B47] text-[#38BDF8] border border-[#29415F]">
            Cathode: {calc.metal.name} (φ = {calc.metal.workFunctionEV.toFixed(2)} eV)
          </span>
        </div>

        {/* Playback & Overlay Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => onUpdateParams((p) => ({ ...p, isPaused: !p.isPaused }))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isPaused
                ? 'bg-[#FBBF24]/20 border-[#FBBF24] text-[#FBBF24] hover:bg-[#FBBF24]/30'
                : 'bg-[#142B47] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF]'
            }`}
            title={isPaused ? 'Resume animation' : 'Pause animation'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Reset Animation */}
          <button
            onClick={handleResetAnim}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-[#142B47] border border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF] transition-colors cursor-pointer"
            title="Clear and reset active particles"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#142B47] border border-[#29415F] rounded-lg p-0.5 text-[10px] font-mono">
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => onUpdateParams((p) => ({ ...p, animationSpeed: spd }))}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  (params.animationSpeed || 1.0) === spd
                    ? 'bg-[#38BDF8] text-[#071426] font-bold'
                    : 'text-[#9FB3CC] hover:text-[#EAF2FF]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Electric Field Toggle */}
          <button
            onClick={() => onUpdateParams((p) => ({ ...p, showElectricField: !p.showElectricField }))}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              params.showElectricField
                ? 'bg-[#818CF8]/20 border-[#818CF8] text-[#818CF8]'
                : 'bg-[#142B47] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Field</span>
          </button>

          {/* Trajectories Toggle */}
          <button
            onClick={() => onUpdateParams((p) => ({ ...p, showTrajectories: !p.showTrajectories }))}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              params.showTrajectories
                ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                : 'bg-[#142B47] border-[#29415F] text-[#9FB3CC] hover:text-[#EAF2FF]'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Trails</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#29415F] bg-[#071426] shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '330px' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="peGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10243D" strokeWidth="0.8" />
            </pattern>

            {/* Glowing filter for emitted photoelectrons & photons */}
            <filter id="peGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Light beam gradient */}
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={beamColor} stopOpacity={beamOpacity} />
              <stop offset="100%" stopColor={beamColor} stopOpacity={beamOpacity * 0.35} />
            </linearGradient>

            {/* Arrow Markers */}
            <marker id="peLightArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={beamColor} />
            </marker>
            <marker id="peFieldArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#818CF8" />
            </marker>
          </defs>

          {/* Background grid */}
          <rect width={width} height={height} fill="#071426" />
          <rect width={width} height={height} fill="url(#peGrid)" />

          {/* 1. Vacuum Tube Envelope (Evacuated quartz glass cylinder) */}
          <rect
            x="160"
            y="50"
            width="440"
            height="200"
            rx="42"
            fill="#10243D"
            fillOpacity="0.4"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeDasharray="6 2.5"
          />
          <text
            x="380"
            y="74"
            fill="#38BDF8"
            fontSize="10"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            opacity="0.75"
          >
            EVACUATED QUARTZ VACUUM TUBE
          </text>

          {/* 2. Metal Cathode Plate (Emitter, Left) */}
          <g transform={`translate(${cathodeX}, ${tubeMidY})`}>
            {/* Cathode Metal bar */}
            <rect
              x="-12"
              y="-70"
              width="14"
              height="140"
              rx="3"
              fill={calc.metal.color}
              stroke="#EAF2FF"
              strokeWidth="1.6"
            />
            {/* Label */}
            <text
              x="-24"
              y="-78"
              fill={calc.metal.color}
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              CATHODE (-)
            </text>
            <text
              x="-24"
              y="-64"
              fill="#9FB3CC"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              Emitter ({calc.metal.symbol})
            </text>
          </g>

          {/* 3. Collector Anode Plate (Collector, Right) */}
          <g transform={`translate(${anodeX}, ${tubeMidY})`}>
            {/* Anode Metal bar */}
            <rect
              x="-2"
              y="-70"
              width="14"
              height="140"
              rx="3"
              fill="#64748B"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />
            {/* Label */}
            <text
              x="10"
              y="-78"
              fill="#94A3B8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              ANODE (+)
            </text>
            <text
              x="10"
              y="-64"
              fill="#9FB3CC"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              textAnchor="middle"
            >
              Collector Plate
            </text>
          </g>

          {/* 4. Incident Light Source on Left */}
          <g transform={`translate(${lightSourceX}, ${lightSourceY})`}>
            {/* Lamp Housing */}
            <path d="M -15 -10 L 40 45 L 20 65 L -35 10 Z" fill="#142B47" stroke="#29415F" strokeWidth="1.5" />
            <circle cx="15" cy="20" r="15" fill={beamColor} fillOpacity="0.85" filter="url(#peGlow)" />
            {/* Monochromatic Label */}
            <text
              x="5"
              y="-12"
              fill={beamColor}
              fontSize="11"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
            >
              {calc.spectralColorName} ({calc.wavelengthNm.toFixed(0)} nm)
            </text>
            <text
              x="5"
              y="2"
              fill="#9FB3CC"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
            >
              f = {(calc.frequencyHz / 1e14).toFixed(2)} &times; 10¹⁴ Hz &middot; E = {calc.photonEnergyEV.toFixed(2)} eV
            </text>
            {calc.isUltraviolet && (
              <text
                x="5"
                y="16"
                fill="#818CF8"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                [UV: Non-visible radiation - symbolic styling]
              </text>
            )}
          </g>

          {/* Incident Light Beam Polygon striking cathode */}
          <polygon
            points={`${lightSourceX + 25},${lightSourceY + 20} ${cathodeX - 4},80 ${cathodeX - 4},220 ${lightSourceX + 45},${lightSourceY + 45}`}
            fill="url(#beamGradient)"
            stroke={calc.isUltraviolet ? '#818CF8' : 'none'}
            strokeWidth={calc.isUltraviolet ? '1' : '0'}
            strokeDasharray={calc.isUltraviolet ? '4 2' : 'none'}
          />

          {/* Central beam ray with arrow marker */}
          <line
            x1={lightSourceX + 20}
            y1={lightSourceY + 25}
            x2={cathodeX - 8}
            y2={tubeMidY}
            stroke={beamColor}
            strokeWidth="2.5"
            markerEnd="url(#peLightArrow)"
            strokeDasharray={calc.isUltraviolet ? '4 3' : '6 3'}
          />

          {/* 5. Animated Incident Photons (Quanta flying along beam) */}
          {params.intensityPercent > 0 &&
            photonsRef.current.map((ph) => {
              // Interpolate from light source to cathode
              const x = lightSourceX + 30 + ph.progress * (cathodeX - 10 - (lightSourceX + 30));
              const y = lightSourceY + 30 + ph.progress * (tubeMidY - (lightSourceY + 30)) + ph.offsetY * ph.progress;

              return (
                <g key={ph.id} transform={`translate(${x}, ${y})`}>
                  {/* Wave packet or circular photon token */}
                  <circle cx="0" cy="0" r="3.5" fill={beamColor} filter="url(#peGlow)" />
                  <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
                  {/* Small wave crest symbol */}
                  <path
                    d="M -5 0 Q -2.5 -3 0 0 T 5 0"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                </g>
              );
            })}

          {/* 6. Electric Field Vector Overlay across tube */}
          {params.showElectricField && Math.abs(appliedVoltage) > 0.05 && (
            <g opacity="0.5">
              {[95, 125, 155, 185, 215].map((yPos) => (
                <g key={yPos}>
                  {appliedVoltage > 0 ? (
                    // Accelerating: Anode positive (+), Cathode negative (-).
                    // Electric field E points right-to-left (+ to -).
                    // Force on electron F = -e E points left-to-right (towards anode).
                    <line
                      x1={anodeX - 20}
                      y1={yPos}
                      x2={cathodeX + 25}
                      y2={yPos}
                      stroke="#818CF8"
                      strokeWidth="1.5"
                      markerEnd="url(#peFieldArrow)"
                      strokeDasharray="4 3"
                    />
                  ) : (
                    // Retarding: Anode negative (-), Cathode positive (+).
                    // Electric field E points left-to-right.
                    // Force on electron F = -e E points right-to-left (opposes motion).
                    <line
                      x1={cathodeX + 25}
                      y1={yPos}
                      x2={anodeX - 20}
                      y2={yPos}
                      stroke="#818CF8"
                      strokeWidth="1.5"
                      markerEnd="url(#peFieldArrow)"
                      strokeDasharray="4 3"
                    />
                  )}
                </g>
              ))}
              <text
                x="380"
                y="235"
                fill="#818CF8"
                fontSize="10"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                E-Field: {appliedVoltage > 0 ? 'Accelerating (Anode +)' : 'Retarding (Anode -)'}
              </text>
            </g>
          )}

          {/* 7. Emitted Photoelectrons and Trajectories */}
          {isEmissionPossible &&
            electronsRef.current.map((el) => {
              const elColor = el.hasTurnedAround ? '#FB7185' : '#60A5FA';
              return (
                <g key={el.id}>
                  {/* Faint trail */}
                  {params.showTrajectories && (
                    <line
                      x1={el.startX}
                      y1={el.startY}
                      x2={el.x}
                      y2={el.y}
                      stroke={elColor}
                      strokeWidth="1"
                      strokeOpacity="0.35"
                    />
                  )}
                  {/* Glowing blue electron */}
                  <circle
                    cx={el.x}
                    cy={el.y}
                    r="4"
                    fill={elColor}
                    filter="url(#peGlow)"
                  />
                  <circle cx={el.x} cy={el.y} r="2" fill="#FFFFFF" />
                  {/* Minus sign symbol on electron */}
                  <line
                    x1={el.x - 1.2}
                    y1={el.y}
                    x2={el.x + 1.2}
                    y2={el.y}
                    stroke="#071426"
                    strokeWidth="0.8"
                  />
                </g>
              );
            })}

          {/* Banner: No Photoemission */}
          {!isEmissionPossible && (
            <g transform="translate(380, 150)">
              <rect
                x="-155"
                y="-25"
                width="310"
                height="50"
                rx="10"
                fill="#10243D"
                stroke="#FB7185"
                strokeWidth="1.5"
                fillOpacity="0.95"
              />
              <text
                x="0"
                y="-5"
                fill="#FB7185"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                NO PHOTOELECTRON EMISSION (E &lt; φ)
              </text>
              <text
                x="0"
                y="14"
                fill="#9FB3CC"
                fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                hf ({calc.photonEnergyEV.toFixed(2)} eV) &lt; φ ({calc.metal.workFunctionEV.toFixed(2)} eV) &middot; Photocurrent = 0.00 µA
              </text>
            </g>
          )}

          {/* Banner: Retarding Cutoff */}
          {isEmissionPossible && calc.isCollectorCurrentZero && appliedVoltage <= -calc.stoppingPotentialVolts && (
            <g transform="translate(380, 150)">
              <rect
                x="-155"
                y="-25"
                width="310"
                height="50"
                rx="10"
                fill="#10243D"
                stroke="#FBBF24"
                strokeWidth="1.5"
                fillOpacity="0.95"
              />
              <text
                x="0"
                y="-5"
                fill="#FBBF24"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                RETARDING CUT-OFF REACHED (I = 0)
              </text>
              <text
                x="0"
                y="14"
                fill="#9FB3CC"
                fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                V_applied ({appliedVoltage.toFixed(2)} V) &le; -V_stop (-{calc.stoppingPotentialVolts.toFixed(2)} V) &middot; All electrons arrested
              </text>
            </g>
          )}

          {/* 8. External Connecting Circuit with Microammeter and Voltmeter */}
          {/* External wire running from cathode (x=220) down to y=330, across supply to anode (x=540) */}
          <path
            d="M 220 220 L 220 330 L 330 330 
               M 430 330 L 540 330 L 540 220"
            fill="none"
            stroke="#29415F"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Digital Microammeter (A) at (275, 330) */}
          <g transform="translate(275, 330)">
            <rect x="-38" y="-22" width="76" height="44" rx="8" fill="#10243D" stroke="#34D399" strokeWidth="1.6" />
            <text x="0" y="-7" fill="#34D399" fontSize="9" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="middle">
              PHOTOCURRENT
            </text>
            <text x="0" y="13" fill="#34D399" fontSize="13" fontWeight="900" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {calc.photocurrentMicroAmps.toFixed(2)} µA
            </text>
          </g>

          {/* Variable DC Voltage Source (Battery) at (380, 330) */}
          <g transform="translate(380, 330)">
            <circle cx="0" cy="0" r="23" fill="#10243D" stroke="#FBBF24" strokeWidth="2" />
            {/* Battery symbol lines inside */}
            <line x1="-8" y1="-9" x2="8" y2="-9" stroke="#FBBF24" strokeWidth="2.5" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#FBBF24" strokeWidth="3.5" />
            <line x1="-8" y1="9" x2="8" y2="9" stroke="#FBBF24" strokeWidth="2.5" />
            <text x="0" y="-28" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="middle">
              V_ext (DC)
            </text>
          </g>

          {/* Digital Voltmeter (V) at (485, 330) */}
          <g transform="translate(485, 330)">
            <rect x="-38" y="-22" width="76" height="44" rx="8" fill="#10243D" stroke="#38BDF8" strokeWidth="1.6" />
            <text x="0" y="-7" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="ui-monospace, monospace" textAnchor="middle">
              VOLTMETER
            </text>
            <text x="0" y="13" fill="#38BDF8" fontSize="13" fontWeight="900" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {appliedVoltage >= 0 ? `+${appliedVoltage.toFixed(2)} V` : `${appliedVoltage.toFixed(2)} V`}
            </text>
          </g>

          {/* Anode & Cathode connection polarity signs */}
          <text x="210" y="275" fill="#FB7185" fontSize="12" fontWeight="bold" fontFamily="ui-monospace, monospace">
            -
          </text>
          <text x="548" y="275" fill="#38BDF8" fontSize="12" fontWeight="bold" fontFamily="ui-monospace, monospace">
            +
          </text>
        </svg>
      </div>

      {/* Apparatus Footer & Telemetry */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#9FB3CC] pt-1">
        <span className="flex items-center gap-1.5">
          <strong className="text-[#EAF2FF]">Physical Regime:</strong> {calc.regimeMessage}
        </span>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-[#38BDF8]">
            V_stop = {calc.stoppingPotentialVolts.toFixed(2)} V
          </span>
          <span className="text-[#34D399]">
            K_max = {calc.maxKineticEnergyEV.toFixed(2)} eV ({calc.isEmissionPossible ? (calc.maxKineticEnergyJoules / 1e-19).toFixed(2) : '0.00'} &times; 10⁻¹⁹ J)
          </span>
          <span className="text-[#FBBF24]">
            v_max = {(calc.maxElectronSpeedMs / 1e5).toFixed(2)} &times; 10⁵ m/s
          </span>
        </div>
      </div>
    </div>
  );
};
