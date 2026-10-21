/**
 * EQUATION 1 — Optics Simulation Canvas
 * Scientifically accurate, interactive SVG bench for Planar Snell's Law,
 * Parallel Slab Lateral Shift, Triangular Prism Dispersion, Semicircular Block TIR,
 * and Optical Fiber Waveguides.
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Maximize2,
  RefreshCw,
  Compass,
  Eye,
  Sliders,
  Sparkles,
  AlertTriangle,
  ArrowRightLeft,
  Sun,
} from 'lucide-react';
import {
  SnellParameters,
  PlanarOpticsResult,
  SlabOpticsResult,
  PrismOpticsResult,
  FiberOpticsResult,
} from '../../physics/optics/types';
import {
  OPTICAL_MEDIA_DATABASE,
  wavelengthToHexColor,
} from '../../physics/optics/opticsModel';

interface OpticsSimulationCanvasProps {
  params: SnellParameters;
  onParamChange: <K extends keyof SnellParameters>(key: K, value: SnellParameters[K]) => void;
  planarResult: PlanarOpticsResult;
  slabResult: SlabOpticsResult;
  prismResult: PrismOpticsResult;
  fiberResult: FiberOpticsResult;
}

export const OpticsSimulationCanvas: React.FC<OpticsSimulationCanvasProps> = ({
  params,
  onParamChange,
  planarResult,
  slabResult,
  prismResult,
  fiberResult,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDraggingLaser, setIsDraggingLaser] = useState(false);
  const [animTime, setAnimTime] = useState(0);

  // Animation frame loop for photon pulse propagation along rays
  useEffect(() => {
    let animId: number;
    const update = (time: number) => {
      setAnimTime(time * 0.001);
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Canvas coordinates
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;

  // Medium 1 and 2 details
  const med1 = useMemo(
    () => OPTICAL_MEDIA_DATABASE.find((m) => m.id === params.medium1Id) || OPTICAL_MEDIA_DATABASE[0],
    [params.medium1Id]
  );
  const med2 = useMemo(
    () => OPTICAL_MEDIA_DATABASE.find((m) => m.id === params.medium2Id) || OPTICAL_MEDIA_DATABASE[2],
    [params.medium2Id]
  );

  const rayColor = useMemo(
    () => (params.isWhiteLight ? '#F8FAFC' : wavelengthToHexColor(params.wavelengthNm)),
    [params.isWhiteLight, params.wavelengthNm]
  );

  // Mouse drag handler to change angle of incidence directly on canvas
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingLaser(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLaser || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    // Relative to point of incidence (centerX, centerY)
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    // Light travels down from upper half (dy < 0)
    // Angle measured with normal (y-axis): theta = atan2(|dx|, |dy|)
    if (params.geometry === 'planar' || params.geometry === 'slab' || params.geometry === 'semicircle') {
      const angleRad = Math.atan2(Math.abs(dx), Math.max(10, Math.abs(dy)));
      let angleDeg = (angleRad * 180) / Math.PI;
      angleDeg = Math.min(88, Math.max(0, angleDeg));
      onParamChange('angleDeg', Math.round(angleDeg * 10) / 10);
    } else if (params.geometry === 'prism') {
      const angleRad = Math.atan2(Math.abs(dy), Math.max(10, Math.abs(dx)));
      let angleDeg = (angleRad * 180) / Math.PI;
      angleDeg = Math.min(80, Math.max(5, angleDeg));
      onParamChange('angleDeg', Math.round(angleDeg * 10) / 10);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingLaser(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Geometry specific render calculations
  const theta1Rad = (params.angleDeg * Math.PI) / 180;
  const theta2Rad = planarResult.theta2Rad;

  // Incident ray geometry (comes from top-left toward center)
  const rayLength = 320;
  const incStartX = centerX - rayLength * Math.sin(theta1Rad);
  const incStartY = centerY - rayLength * Math.cos(theta1Rad);

  // Reflected ray (bounces back into medium 1)
  const refEndX = centerX + rayLength * Math.sin(theta1Rad);
  const refEndY = centerY - rayLength * Math.cos(theta1Rad);

  // Refracted ray (bends into medium 2)
  const refrEndX =
    theta2Rad !== null
      ? centerX + rayLength * Math.sin(theta2Rad)
      : centerX;
  const refrEndY =
    theta2Rad !== null
      ? centerY + rayLength * Math.cos(theta2Rad)
      : centerY;

  // Photon pulse animation positions
  // Speed factor proportional to v1 vs v2
  const v1Factor = planarResult.v1 / 3e8;
  const v2Factor = planarResult.v2 / 3e8;
  const photonIncProgress = (animTime * 0.8 * v1Factor) % 1;
  const photonIncX = incStartX + (centerX - incStartX) * photonIncProgress;
  const photonIncY = incStartY + (centerY - incStartY) * photonIncProgress;

  const photonRefProgress = (animTime * 0.8 * v1Factor) % 1;
  const photonRefX = centerX + (refEndX - centerX) * photonRefProgress;
  const photonRefY = centerY + (refEndY - centerY) * photonRefProgress;

  const photonRefrProgress = (animTime * 0.8 * v2Factor) % 1;
  const photonRefrX = centerX + (refrEndX - centerX) * photonRefrProgress;
  const photonRefrY = centerY + (refrEndY - centerY) * photonRefrProgress;

  return (
    <div className="flex flex-col bg-[#101D30] rounded-xl border border-[#26364D] overflow-hidden shadow-xl">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0B1728] border-b border-[#26364D] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#F1F5F9]">
              Optical Simulation Bench
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#94A3B8] ml-2">
              (Interactive Ray Tracer &amp; Snell's Goniometer)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Swap Media Button */}
          <button
            onClick={() => {
              const prev1 = params.medium1Id;
              const prev2 = params.medium2Id;
              const prevC1 = params.medium1CustomN;
              const prevC2 = params.medium2CustomN;
              onParamChange('medium1Id', prev2);
              onParamChange('medium2Id', prev1);
              onParamChange('medium1CustomN', prevC2);
              onParamChange('medium2CustomN', prevC1);
            }}
            title="Swap Medium 1 and Medium 2"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17263B] hover:bg-[#26364D] border border-[#26364D] text-[11px] font-semibold text-[#38BDF8] transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Media</span>
          </button>

          {/* Reverse Light Path Button */}
          <button
            onClick={() => onParamChange('isReversed', !params.isReversed)}
            title="Principle of Reversibility: Light retraces its exact path in reverse"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
              params.isReversed
                ? 'bg-[#A78BFA] text-[#07111F] border-[#A78BFA] font-bold'
                : 'bg-[#17263B] hover:bg-[#26364D] text-[#A78BFA] border-[#26364D]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${params.isReversed ? 'animate-spin' : ''}`} />
            <span>Reversible Path</span>
          </button>

          {/* Protractor Toggle */}
          <button
            onClick={() => onParamChange('showProtractor', !params.showProtractor)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
              params.showProtractor
                ? 'bg-[#FBBF24] text-[#07111F] border-[#FBBF24]'
                : 'bg-[#17263B] hover:bg-[#26364D] text-[#94A3B8] border-[#26364D]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Protractor</span>
          </button>

          {/* Wavefronts Toggle */}
          <button
            onClick={() => onParamChange('showWavefronts', !params.showWavefronts)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
              params.showWavefronts
                ? 'bg-[#34D399] text-[#07111F] border-[#34D399]'
                : 'bg-[#17263B] hover:bg-[#26364D] text-[#94A3B8] border-[#26364D]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Wavefronts</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive SVG Canvas */}
      <div className="relative w-full aspect-[16/10] max-h-[520px] bg-[#0A1526] select-none touch-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="opticsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#26364D" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Glowing ray filters */}
            <filter id="glowYellow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowOrange" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={width} height={height} fill="url(#opticsGrid)" />

          {/* ======================================================== */}
          {/* GEOMETRY 1: PLANAR BOUNDARY */}
          {/* ======================================================== */}
          {params.geometry === 'planar' && (
            <>
              {/* Medium 1 Region (Top) */}
              <rect
                x="0"
                y="0"
                width={width}
                height={centerY}
                fill={med1.colorTint}
                stroke="#26364D"
                strokeWidth="1"
              />

              {/* Medium 2 Region (Bottom) */}
              <rect
                x="0"
                y={centerY}
                width={width}
                height={centerY}
                fill={med2.colorTint}
                stroke="#26364D"
                strokeWidth="1"
              />

              {/* Optical Interface Line */}
              <line
                x1="0"
                y1={centerY}
                x2={width}
                y2={centerY}
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />

              {/* Medium Labels */}
              <g className="font-sans pointer-events-none">
                {/* Medium 1 Badge */}
                <rect x="20" y="20" width="180" height="58" rx="8" fill="#101D30" stroke="#26364D" opacity="0.9" />
                <text x="32" y="40" fill="#38BDF8" fontSize="12" fontWeight="bold">
                  MEDIUM 1: {med1.name.toUpperCase()}
                </text>
                <text x="32" y="56" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                  n₁ = {planarResult.n1.toFixed(4)} | v₁ = {(planarResult.v1 / 1e8).toFixed(2)}×10⁸ m/s
                </text>
                <text x="32" y="70" fill="#FBBF24" fontSize="10" fontFamily="monospace">
                  λ₁ = {planarResult.lambda1Nm.toFixed(1)} nm
                </text>

                {/* Medium 2 Badge */}
                <rect x="20" y={height - 78} width="180" height="58" rx="8" fill="#101D30" stroke="#26364D" opacity="0.9" />
                <text x="32" y={height - 58} fill="#34D399" fontSize="12" fontWeight="bold">
                  MEDIUM 2: {med2.name.toUpperCase()}
                </text>
                <text x="32" y={height - 42} fill="#94A3B8" fontSize="11" fontFamily="monospace">
                  n₂ = {planarResult.n2.toFixed(4)} | v₂ = {(planarResult.v2 / 1e8).toFixed(2)}×10⁸ m/s
                </text>
                <text x="32" y={height - 28} fill="#38BDF8" fontSize="10" fontFamily="monospace">
                  λ₂ = {planarResult.lambda2Nm.toFixed(1)} nm
                </text>
              </g>

              {/* Normal Line (dashed perpendicular) */}
              {params.showNormal && (
                <g className="pointer-events-none">
                  <line
                    x1={centerX}
                    y1="20"
                    x2={centerX}
                    y2={height - 20}
                    stroke="#E2E8F0"
                    strokeWidth="1.8"
                    strokeDasharray="6,5"
                    strokeOpacity="0.75"
                  />
                  <text x={centerX + 6} y="32" fill="#E2E8F0" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    NORMAL (N)
                  </text>
                </g>
              )}

              {/* Interactive Protractor */}
              {params.showProtractor && (
                <g className="pointer-events-none opacity-85">
                  {/* Top semicircle */}
                  <path
                    d={`M ${centerX - 160} ${centerY} A 160 160 0 0 1 ${centerX + 160} ${centerY}`}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    strokeOpacity="0.5"
                  />
                  {/* Bottom semicircle */}
                  <path
                    d={`M ${centerX - 160} ${centerY} A 160 160 0 0 0 ${centerX + 160} ${centerY}`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    strokeOpacity="0.5"
                  />
                  {/* Degree angle ticks at 0°, 30°, 45°, 60°, 90° */}
                  {[0, 15, 30, 45, 60, 75, 90].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    // Top left quadrant (incident side)
                    const xTop = centerX - 160 * Math.sin(rad);
                    const yTop = centerY - 160 * Math.cos(rad);
                    // Bottom right quadrant (refraction side)
                    const xBot = centerX + 160 * Math.sin(rad);
                    const yBot = centerY + 160 * Math.cos(rad);

                    return (
                      <React.Fragment key={`tick-${deg}`}>
                        <circle cx={xTop} cy={yTop} r="2" fill="#FBBF24" opacity="0.8" />
                        <text x={xTop - 12} y={yTop - 6} fill="#FBBF24" fontSize="9" fontFamily="monospace">
                          {deg}°
                        </text>
                        {deg > 0 && (
                          <>
                            <circle cx={xBot} cy={yBot} r="2" fill="#38BDF8" opacity="0.8" />
                            <text x={xBot + 4} y={yBot + 12} fill="#38BDF8" fontSize="9" fontFamily="monospace">
                              {deg}°
                            </text>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </g>
              )}

              {/* Critical Angle Indicator Arc & Line (if n1 > n2) */}
              {planarResult.criticalAngleDeg !== null && (
                <g className="pointer-events-none">
                  {(() => {
                    const cRad = (planarResult.criticalAngleDeg * Math.PI) / 180;
                    const cX = centerX - 240 * Math.sin(cRad);
                    const cY = centerY - 240 * Math.cos(cRad);
                    return (
                      <>
                        <line
                          x1={centerX}
                          y1={centerY}
                          x2={cX}
                          y2={cY}
                          stroke="#A78BFA"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                          opacity="0.8"
                        />
                        <text
                          x={cX - 18}
                          y={cY - 8}
                          fill="#A78BFA"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          θ_c = {planarResult.criticalAngleDeg.toFixed(1)}°
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Wavefronts (Huygens' Principle Demonstration) */}
              {params.showWavefronts && (
                <g className="pointer-events-none opacity-40">
                  {/* Wavefronts in Medium 1 */}
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const waveDist = ((idx * 30 + animTime * 40 * v1Factor) % 240);
                    const perpAngle = theta1Rad + Math.PI / 2;
                    const wMidX = centerX - waveDist * Math.sin(theta1Rad);
                    const wMidY = centerY - waveDist * Math.cos(theta1Rad);
                    const span = 60;
                    return (
                      <line
                        key={`wave1-${idx}`}
                        x1={wMidX - span * Math.sin(perpAngle)}
                        y1={wMidY - span * Math.cos(perpAngle)}
                        x2={wMidX + span * Math.sin(perpAngle)}
                        y2={wMidY + span * Math.cos(perpAngle)}
                        stroke="#FBBF24"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Wavefronts in Medium 2 (compressed/expanded spacing) */}
                  {!planarResult.isTIR && theta2Rad !== null && (
                    <>
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const waveDist = ((idx * 30 * (planarResult.n1 / planarResult.n2) + animTime * 40 * v2Factor) % 240);
                        const perpAngle = theta2Rad + Math.PI / 2;
                        const wMidX = centerX + waveDist * Math.sin(theta2Rad);
                        const wMidY = centerY + waveDist * Math.cos(theta2Rad);
                        const span = 60;
                        return (
                          <line
                            key={`wave2-${idx}`}
                            x1={wMidX - span * Math.sin(perpAngle)}
                            y1={wMidY - span * Math.cos(perpAngle)}
                            x2={wMidX + span * Math.sin(perpAngle)}
                            y2={wMidY + span * Math.cos(perpAngle)}
                            stroke="#38BDF8"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </>
                  )}
                </g>
              )}

              {/* Optical Rays */}
              {params.showRays && (
                <g>
                  {/* Incident Ray (Yellow) */}
                  <line
                    x1={incStartX}
                    y1={incStartY}
                    x2={centerX}
                    y2={centerY}
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    filter="url(#glowYellow)"
                    strokeLinecap="round"
                  />

                  {/* Reflected Ray (Orange, intensity modulated) */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={refEndX}
                    y2={refEndY}
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeOpacity={params.showIntensityFading ? Math.max(0.2, planarResult.fresnel.rUnpolarized) : 0.9}
                    filter="url(#glowOrange)"
                    strokeLinecap="round"
                  />

                  {/* Refracted Ray (Cyan, intensity modulated) or Evanescent Wave */}
                  {!planarResult.isTIR ? (
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={refrEndX}
                      y2={refrEndY}
                      stroke="#38BDF8"
                      strokeWidth="3.5"
                      strokeOpacity={params.showIntensityFading ? Math.max(0.1, planarResult.fresnel.tUnpolarized) : 1}
                      filter="url(#glowCyan)"
                      strokeLinecap="round"
                    />
                  ) : (
                    /* Evanescent field along boundary during TIR */
                    <g className="pointer-events-none">
                      <line
                        x1={centerX}
                        y1={centerY + 2}
                        x2={centerX + 120}
                        y2={centerY + 2}
                        stroke="#FB7185"
                        strokeWidth="2.5"
                        strokeDasharray="4,3"
                        opacity="0.8"
                      />
                      <text x={centerX + 30} y={centerY + 18} fill="#FB7185" fontSize="10" fontFamily="monospace">
                        Evanescent Wave
                      </text>
                    </g>
                  )}

                  {/* Point of Incidence Marker */}
                  <circle cx={centerX} cy={centerY} r="5" fill="#F1F5F9" stroke="#38BDF8" strokeWidth="2" />

                  {/* Photons moving along rays */}
                  {params.showPhotons && (
                    <g className="pointer-events-none">
                      {/* Incident Photon */}
                      <circle cx={photonIncX} cy={photonIncY} r="4" fill="#FFFFFF" filter="url(#glowYellow)" />
                      {/* Reflected Photon */}
                      <circle cx={photonRefX} cy={photonRefY} r="3" fill="#FFFFFF" filter="url(#glowOrange)" />
                      {/* Refracted Photon */}
                      {!planarResult.isTIR && (
                        <circle cx={photonRefrX} cy={photonRefrY} r="4" fill="#FFFFFF" filter="url(#glowCyan)" />
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* Angle Sector Arcs and Labels */}
              <g className="pointer-events-none font-mono text-xs">
                {/* Incidence Angle θ1 Arc */}
                {(() => {
                  const arcR = 50;
                  const startX = centerX;
                  const startY = centerY - arcR;
                  const endX = centerX - arcR * Math.sin(theta1Rad);
                  const endY = centerY - arcR * Math.cos(theta1Rad);
                  return (
                    <path
                      d={`M ${startX} ${startY} A ${arcR} ${arcR} 0 0 0 ${endX} ${endY}`}
                      fill="#FBBF24"
                      fillOpacity="0.15"
                      stroke="#FBBF24"
                      strokeWidth="1.5"
                    />
                  );
                })()}
                <text
                  x={centerX - 55 * Math.sin(theta1Rad / 2) - 24}
                  y={centerY - 55 * Math.cos(theta1Rad / 2)}
                  fill="#FBBF24"
                  fontWeight="bold"
                >
                  θ₁ = {planarResult.theta1Deg.toFixed(1)}°
                </text>

                {/* Reflection Angle θr Arc */}
                {(() => {
                  const arcR = 45;
                  const startX = centerX;
                  const startY = centerY - arcR;
                  const endX = centerX + arcR * Math.sin(theta1Rad);
                  const endY = centerY - arcR * Math.cos(theta1Rad);
                  return (
                    <path
                      d={`M ${startX} ${startY} A ${arcR} ${arcR} 0 0 1 ${endX} ${endY}`}
                      fill="#F97316"
                      fillOpacity="0.12"
                      stroke="#F97316"
                      strokeWidth="1.5"
                    />
                  );
                })()}
                <text
                  x={centerX + 45 * Math.sin(theta1Rad / 2) + 8}
                  y={centerY - 45 * Math.cos(theta1Rad / 2)}
                  fill="#F97316"
                  fontWeight="bold"
                >
                  θ_r = {planarResult.thetaRDeg.toFixed(1)}°
                </text>

                {/* Refraction Angle θ2 Arc (if not TIR) */}
                {!planarResult.isTIR && theta2Rad !== null && planarResult.theta2Deg !== null && (
                  <>
                    {(() => {
                      const arcR = 60;
                      const startX = centerX;
                      const startY = centerY + arcR;
                      const endX = centerX + arcR * Math.sin(theta2Rad);
                      const endY = centerY + arcR * Math.cos(theta2Rad);
                      return (
                        <path
                          d={`M ${startX} ${startY} A ${arcR} ${arcR} 0 0 0 ${endX} ${endY}`}
                          fill="#38BDF8"
                          fillOpacity="0.18"
                          stroke="#38BDF8"
                          strokeWidth="1.5"
                        />
                      );
                    })()}
                    <text
                      x={centerX + 65 * Math.sin(theta2Rad / 2) + 8}
                      y={centerY + 65 * Math.cos(theta2Rad / 2) + 4}
                      fill="#38BDF8"
                      fontWeight="bold"
                    >
                      θ₂ = {planarResult.theta2Deg.toFixed(1)}°
                    </text>
                  </>
                )}
              </g>

              {/* Draggable Laser Emitter Widget */}
              <g
                transform={`translate(${incStartX}, ${incStartY})`}
                className="cursor-grab active:cursor-grabbing"
              >
                <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
                <Sun className="w-4 h-4 text-[#FBBF24] -translate-x-2 -translate-y-2 pointer-events-none" />
                <text x="18" y="4" fill="#FBBF24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  LASER (DRAG ME)
                </text>
              </g>

              {/* Total Internal Reflection Alert Banner on Canvas */}
              {planarResult.isTIR && (
                <g transform={`translate(${centerX - 160}, ${centerY + 60})`} className="pointer-events-none">
                  <rect
                    width="320"
                    height="50"
                    rx="8"
                    fill="#17263B"
                    stroke="#FB7185"
                    strokeWidth="2"
                    filter="url(#glowRed)"
                  />
                  <text x="160" y="24" fill="#FB7185" fontSize="12" fontWeight="900" textAnchor="middle">
                    ⚡ TOTAL INTERNAL REFLECTION (TIR)
                  </text>
                  <text x="160" y="40" fill="#F1F5F9" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    θ₁ ({planarResult.theta1Deg.toFixed(1)}°) &gt; θ_c ({planarResult.criticalAngleDeg?.toFixed(1)}°) | 100% Light Reflected
                  </text>
                </g>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* GEOMETRY 2: PARALLEL SLAB (LATERAL SHIFT) */}
          {/* ======================================================== */}
          {params.geometry === 'slab' && (
            <>
              {(() => {
                const slabThicknessPx = (params.slabThicknessMm / 150) * 160 + 60;
                const slabTopY = centerY - slabThicknessPx / 2;
                const slabBottomY = centerY + slabThicknessPx / 2;

                // Slab ray points:
                // 1. Entry point at top surface:
                const entryX = centerX - 60;
                const entryY = slabTopY;

                // Incident start
                const sStartX = entryX - 220 * Math.sin(theta1Rad);
                const sStartY = entryY - 220 * Math.cos(theta1Rad);

                // Inside slab: angle is theta2
                const rRad = slabResult.theta2Rad ?? theta1Rad;
                const deltaXInside = slabThicknessPx * Math.tan(rRad);
                const exitX = entryX + deltaXInside;
                const exitY = slabBottomY;

                // Emergent ray: parallel to incident (angle theta1)
                const emerEndX = exitX + 220 * Math.sin(theta1Rad);
                const emerEndY = exitY + 220 * Math.cos(theta1Rad);

                // Undeviated original path line for comparison
                const undeviatedEndX = entryX + (exitY - entryY + 220) * Math.tan(theta1Rad);
                const undeviatedEndY = exitY + 220 * Math.cos(theta1Rad);

                return (
                  <>
                    {/* Outside Medium (Air/Med1) */}
                    <rect x="0" y="0" width={width} height={height} fill={med1.colorTint} />

                    {/* Slab Medium 2 */}
                    <rect
                      x="80"
                      y={slabTopY}
                      width={width - 160}
                      height={slabThicknessPx}
                      fill={med2.colorTint}
                      stroke="#38BDF8"
                      strokeWidth="2"
                      rx="4"
                    />

                    {/* Slab Labels */}
                    <text x="96" y={slabTopY + 24} fill="#38BDF8" fontSize="12" fontWeight="bold">
                      PARALLEL SLAB: {med2.name.toUpperCase()} (n = {slabResult.n2.toFixed(3)})
                    </text>
                    <text x="96" y={slabTopY + 40} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      Thickness t = {params.slabThicknessMm} mm | Shift d = {slabResult.lateralShiftMm.toFixed(2)} mm
                    </text>

                    {/* Surface Normals */}
                    {params.showNormal && (
                      <>
                        <line
                          x1={entryX}
                          y1={slabTopY - 60}
                          x2={entryX}
                          y2={slabTopY + 60}
                          stroke="#E2E8F0"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                          opacity="0.6"
                        />
                        <line
                          x1={exitX}
                          y1={slabBottomY - 60}
                          x2={exitX}
                          y2={slabBottomY + 60}
                          stroke="#E2E8F0"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                          opacity="0.6"
                        />
                      </>
                    )}

                    {/* Undeviated path guideline */}
                    <line
                      x1={entryX}
                      y1={entryY}
                      x2={undeviatedEndX}
                      y2={undeviatedEndY}
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                      strokeDasharray="5,4"
                      opacity="0.4"
                    />

                    {/* Incident Ray */}
                    <line
                      x1={sStartX}
                      y1={sStartY}
                      x2={entryX}
                      y2={entryY}
                      stroke="#FBBF24"
                      strokeWidth="3.5"
                      filter="url(#glowYellow)"
                    />

                    {/* Inside Refracted Ray */}
                    <line
                      x1={entryX}
                      y1={entryY}
                      x2={exitX}
                      y2={exitY}
                      stroke="#38BDF8"
                      strokeWidth="3.5"
                      filter="url(#glowCyan)"
                    />

                    {/* Emergent Parallel Ray */}
                    <line
                      x1={exitX}
                      y1={exitY}
                      x2={emerEndX}
                      y2={emerEndY}
                      stroke="#FBBF24"
                      strokeWidth="3.5"
                      filter="url(#glowYellow)"
                    />

                    {/* Lateral Shift Bracket */}
                    {Math.abs(slabResult.lateralShiftMm) > 0.5 && (
                      <g className="pointer-events-none">
                        <line
                          x1={exitX}
                          y1={exitY + 40}
                          x2={exitX + (undeviatedEndX - emerEndX) * 0.25}
                          y2={exitY + 40}
                          stroke="#FB7185"
                          strokeWidth="2"
                        />
                        <text x={exitX + 10} y={exitY + 36} fill="#FB7185" fontSize="11" fontWeight="bold" fontFamily="monospace">
                          Lateral Shift d = {slabResult.lateralShiftMm.toFixed(2)} mm
                        </text>
                      </g>
                    )}

                    {/* Laser Handle */}
                    <g
                      transform={`translate(${sStartX}, ${sStartY})`}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
                      <Sun className="w-4 h-4 text-[#FBBF24] -translate-x-2 -translate-y-2 pointer-events-none" />
                    </g>
                  </>
                );
              })()}
            </>
          )}

          {/* ======================================================== */}
          {/* GEOMETRY 3: TRIANGULAR PRISM (DISPERSION & DEVIATION) */}
          {/* ======================================================== */}
          {params.geometry === 'prism' && (
            <>
              {(() => {
                const apexAngle = params.prismApexAngleDeg;
                const halfApexRad = ((apexAngle / 2) * Math.PI) / 180;
                const prismH = 260;
                const prismBaseW = 2 * prismH * Math.tan(halfApexRad);
                const apexX = centerX;
                const apexY = centerY - prismH / 2;
                const leftBaseX = centerX - prismBaseW / 2;
                const rightBaseX = centerX + prismBaseW / 2;
                const baseY = centerY + prismH / 2;

                // Entry point on left face (about halfway down)
                const entryX = apexX - (prismBaseW / 4);
                const entryY = apexY + prismH / 2;

                // Normal to left face
                // Left face vector: (leftBaseX - apexX, baseY - apexY)
                const faceAngle = Math.atan2(baseY - apexY, leftBaseX - apexX);
                const normalAngle = faceAngle - Math.PI / 2;

                const iRad = (params.angleDeg * Math.PI) / 180;
                const rayAngle = normalAngle + iRad;

                const pStartX = entryX - 220 * Math.cos(rayAngle);
                const pStartY = entryY - 220 * Math.sin(rayAngle);

                return (
                  <>
                    {/* Background Air */}
                    <rect x="0" y="0" width={width} height={height} fill="#07111F" />

                    {/* Triangular Prism Glass Body */}
                    <polygon
                      points={`${apexX},${apexY} ${leftBaseX},${baseY} ${rightBaseX},${baseY}`}
                      fill={med2.colorTint}
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Apex Angle Label */}
                    <text x={apexX} y={apexY - 12} fill="#F1F5F9" fontSize="12" fontWeight="bold" textAnchor="middle">
                      Apex Angle A = {apexAngle}°
                    </text>

                    {/* Prism Material */}
                    <text x={centerX} y={baseY - 16} fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                      {med2.name.toUpperCase()} (Base n = {prismResult.nPrismBase.toFixed(3)})
                    </text>

                    {/* Incident Ray (White or Monochromatic) */}
                    <line
                      x1={pStartX}
                      y1={pStartY}
                      x2={entryX}
                      y2={entryY}
                      stroke={rayColor}
                      strokeWidth="3.5"
                      filter="url(#glowYellow)"
                    />

                    {/* Spectral Rays emerging from Prism */}
                    {params.isWhiteLight ? (
                      prismResult.spectralRays.map((spec) => {
                        // Exit point on right face
                        const exitX = apexX + (prismBaseW / 4) + (spec.wavelengthNm - 550) * 0.05;
                        const exitY = apexY + prismH / 2 + (spec.wavelengthNm - 550) * 0.04;
                        const devRad = ((spec.deviationAngleDeg ?? 35) * Math.PI) / 180;
                        const outEndX = exitX + 220 * Math.cos(rayAngle - devRad);
                        const outEndY = exitY + 220 * Math.sin(rayAngle - devRad);

                        return (
                          <React.Fragment key={spec.colorName}>
                            {/* Inside ray */}
                            <line
                              x1={entryX}
                              y1={entryY}
                              x2={exitX}
                              y2={exitY}
                              stroke={spec.colorHex}
                              strokeWidth="2"
                              opacity="0.8"
                            />
                            {/* Emergent ray */}
                            {!spec.isTIRFace2 && (
                              <line
                                x1={exitX}
                                y1={exitY}
                                x2={outEndX}
                                y2={outEndY}
                                stroke={spec.colorHex}
                                strokeWidth="2.5"
                                opacity="0.95"
                              />
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      /* Monochromatic Ray */
                      (() => {
                        const exitX = apexX + (prismBaseW / 4);
                        const exitY = apexY + prismH / 2;
                        const devRad = ((prismResult.deviationAngleDeg ?? 35) * Math.PI) / 180;
                        const outEndX = exitX + 220 * Math.cos(rayAngle - devRad);
                        const outEndY = exitY + 220 * Math.sin(rayAngle - devRad);

                        return (
                          <>
                            <line
                              x1={entryX}
                              y1={entryY}
                              x2={exitX}
                              y2={exitY}
                              stroke="#38BDF8"
                              strokeWidth="3"
                              filter="url(#glowCyan)"
                            />
                            {!prismResult.isTIRFace2 && (
                              <line
                                x1={exitX}
                                y1={exitY}
                                x2={outEndX}
                                y2={outEndY}
                                stroke={rayColor}
                                strokeWidth="3"
                                filter="url(#glowYellow)"
                              />
                            )}
                          </>
                        );
                      })()
                    )}

                    {/* Minimum Deviation Info Badge */}
                    <g transform={`translate(20, 20)`} className="pointer-events-none">
                      <rect width="260" height="66" rx="8" fill="#101D30" stroke="#26364D" opacity="0.9" />
                      <text x="14" y="22" fill="#FBBF24" fontSize="11" fontWeight="bold">
                        PRISM DEVIATION: δ = {prismResult.deviationAngleDeg?.toFixed(1) ?? 'TIR'}°
                      </text>
                      <text x="14" y="38" fill="#34D399" fontSize="10" fontFamily="monospace">
                        Minimum Deviation δ_m = {prismResult.minimumDeviationAngleDeg.toFixed(1)}°
                      </text>
                      <text x="14" y="52" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                        Occurs when i = e = {prismResult.angleForMinDeviationDeg.toFixed(1)}°
                      </text>
                    </g>

                    {/* Laser Handle */}
                    <g
                      transform={`translate(${pStartX}, ${pStartY})`}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
                      <Sun className="w-4 h-4 text-[#FBBF24] -translate-x-2 -translate-y-2 pointer-events-none" />
                    </g>
                  </>
                );
              })()}
            </>
          )}

          {/* ======================================================== */}
          {/* GEOMETRY 4: SEMICIRCULAR BLOCK (CRITICAL ANGLE BENCH) */}
          {/* ======================================================== */}
          {params.geometry === 'semicircle' && (
            <>
              {(() => {
                const radius = 180;
                return (
                  <>
                    {/* Background Air */}
                    <rect x="0" y="0" width={width} height={height} fill="#07111F" />

                    {/* Semicircular D-Block in bottom half */}
                    <path
                      d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX + radius} ${centerY} Z`}
                      fill={med2.colorTint}
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />

                    {/* Diameter Flat Boundary */}
                    <line x1={centerX - radius - 40} y1={centerY} x2={centerX + radius + 40} y2={centerY} stroke="#38BDF8" strokeWidth="2" />

                    {/* Normal Line */}
                    <line x1={centerX} y1="40" x2={centerX} y2={height - 40} stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.7" />

                    {/* Radial Ray entering curved surface at 90° (no refraction at curved surface!) */}
                    {(() => {
                      // Light goes from glass (bottom) to air (top) to show TIR!
                      const inRad = (params.angleDeg * Math.PI) / 180;
                      const inX = centerX - radius * Math.sin(inRad);
                      const inY = centerY + radius * Math.cos(inRad);

                      // Refracted into air (if not TIR)
                      const sinAir = (planarResult.n2 / 1.0) * Math.sin(inRad);
                      const isTIR = sinAir > 1.0;
                      const outRad = isTIR ? 0 : Math.asin(sinAir);
                      const outX = centerX - 200 * Math.sin(outRad);
                      const outY = centerY - 200 * Math.cos(outRad);

                      // Reflected ray
                      const refX = centerX + radius * Math.sin(inRad);
                      const refY = centerY + radius * Math.cos(inRad);

                      return (
                        <>
                          {/* Radial incident ray inside glass */}
                          <line x1={inX} y1={inY} x2={centerX} y2={centerY} stroke="#FBBF24" strokeWidth="3.5" filter="url(#glowYellow)" />

                          {/* Reflected ray back into glass */}
                          <line x1={centerX} y1={centerY} x2={refX} y2={refY} stroke="#F97316" strokeWidth="3" filter="url(#glowOrange)" />

                          {/* Refracted ray into air */}
                          {!isTIR && (
                            <line x1={centerX} y1={centerY} x2={outX} y2={outY} stroke="#38BDF8" strokeWidth="3.5" filter="url(#glowCyan)" />
                          )}

                          {/* Incident point marker */}
                          <circle cx={centerX} cy={centerY} r="5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />

                          {/* Critical angle indicator */}
                          {planarResult.criticalAngleDeg && (
                            <text x={centerX + 20} y={centerY + 60} fill="#A78BFA" fontSize="11" fontFamily="monospace">
                              Glass-to-Air θ_c = {planarResult.criticalAngleDeg.toFixed(1)}°
                            </text>
                          )}

                          {/* Laser handle on curved perimeter */}
                          <g transform={`translate(${inX}, ${inY})`} className="cursor-grab active:cursor-grabbing">
                            <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
                            <Sun className="w-4 h-4 text-[#FBBF24] -translate-x-2 -translate-y-2 pointer-events-none" />
                          </g>
                        </>
                      );
                    })()}
                  </>
                );
              })()}
            </>
          )}

          {/* ======================================================== */}
          {/* GEOMETRY 5: OPTICAL FIBER (WAVEGUIDE TIR) */}
          {/* ======================================================== */}
          {params.geometry === 'fiber' && (
            <>
              {(() => {
                const fiberLeftX = 120;
                const fiberRightX = width - 40;
                const coreH = 90;
                const cladH = 45;
                const coreTopY = centerY - coreH / 2;
                const coreBottomY = centerY + coreH / 2;

                // Launch ray
                const launchAngleRad = (params.angleDeg * Math.PI) / 180;
                const launchStartX = fiberLeftX - 100 * Math.cos(launchAngleRad);
                const launchStartY = centerY - 100 * Math.sin(launchAngleRad);

                // Internal bounce calculation
                const bounces: { x: number; y: number }[] = [{ x: fiberLeftX, y: centerY }];
                const stepX = 80;
                let curY = centerY;
                let goingUp = true;

                for (let bx = fiberLeftX + stepX; bx <= fiberRightX; bx += stepX) {
                  curY = goingUp ? coreTopY + 2 : coreBottomY - 2;
                  bounces.push({ x: bx, y: curY });
                  goingUp = !goingUp;
                }

                return (
                  <>
                    {/* Upper Cladding */}
                    <rect
                      x={fiberLeftX}
                      y={coreTopY - cladH}
                      width={fiberRightX - fiberLeftX}
                      height={cladH}
                      fill="#1E293B"
                      stroke="#26364D"
                    />
                    <text x={fiberLeftX + 16} y={coreTopY - 18} fill="#94A3B8" fontSize="11" fontFamily="monospace">
                      CLADDING (n_clad = {fiberResult.nClad.toFixed(2)})
                    </text>

                    {/* Fiber Core */}
                    <rect
                      x={fiberLeftX}
                      y={coreTopY}
                      width={fiberRightX - fiberLeftX}
                      height={coreH}
                      fill="#38BDF822"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x={fiberLeftX + 16} y={centerY + 4} fill="#38BDF8" fontSize="12" fontWeight="bold">
                      OPTICAL FIBER CORE (n_core = {fiberResult.nCore.toFixed(2)})
                    </text>

                    {/* Lower Cladding */}
                    <rect
                      x={fiberLeftX}
                      y={coreBottomY}
                      width={fiberRightX - fiberLeftX}
                      height={cladH}
                      fill="#1E293B"
                      stroke="#26364D"
                    />
                    <text x={fiberLeftX + 16} y={coreBottomY + 28} fill="#94A3B8" fontSize="11" fontFamily="monospace">
                      CLADDING (n_clad = {fiberResult.nClad.toFixed(2)})
                    </text>

                    {/* External Launch Ray */}
                    <line
                      x1={launchStartX}
                      y1={launchStartY}
                      x2={fiberLeftX}
                      y2={centerY}
                      stroke="#FBBF24"
                      strokeWidth="3.5"
                      filter="url(#glowYellow)"
                    />

                    {/* Zigzag internal reflections inside core */}
                    {fiberResult.willPropagate ? (
                      <polyline
                        points={bounces.map((b) => `${b.x},${b.y}`).join(' ')}
                        fill="none"
                        stroke="#34D399"
                        strokeWidth="3"
                        filter="url(#glowCyan)"
                      />
                    ) : (
                      /* Light escapes into cladding (leakage) */
                      <g className="pointer-events-none">
                        <line
                          x1={fiberLeftX}
                          y1={centerY}
                          x2={fiberLeftX + 80}
                          y2={coreTopY - 25}
                          stroke="#FB7185"
                          strokeWidth="2.5"
                          strokeDasharray="4,4"
                        />
                        <text x={fiberLeftX + 90} y={coreTopY - 20} fill="#FB7185" fontSize="11" fontWeight="bold">
                          Exceeds Acceptance Cone — Refracts Out!
                        </text>
                      </g>
                    )}

                    {/* Acceptance Cone Telemetry */}
                    <g transform="translate(20, 20)" className="pointer-events-none">
                      <rect width="250" height="66" rx="8" fill="#101D30" stroke="#26364D" opacity="0.95" />
                      <text x="14" y="22" fill="#38BDF8" fontSize="11" fontWeight="bold">
                        NUMERICAL APERTURE: NA = {fiberResult.numericalAperture.toFixed(3)}
                      </text>
                      <text x="14" y="38" fill="#FBBF24" fontSize="10" fontFamily="monospace">
                        Acceptance Angle θ_a = {fiberResult.acceptanceAngleDeg.toFixed(1)}°
                      </text>
                      <text
                        x="14"
                        y="52"
                        fill={fiberResult.willPropagate ? '#34D399' : '#FB7185'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        Status: {fiberResult.willPropagate ? 'Guided by TIR (Lossless)' : 'Light Leaking into Cladding'}
                      </text>
                    </g>
                  </>
                );
              })()}
            </>
          )}
        </svg>
      </div>

      {/* 3. Footer Telemetry & Quick Angle Presets */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0B1728] border-t border-[#26364D] text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8] font-mono text-[11px]">Quick Angles:</span>
          {[0, 15, 30, 45, 60].map((deg) => (
            <button
              key={deg}
              onClick={() => onParamChange('angleDeg', deg)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
                Math.round(params.angleDeg) === deg
                  ? 'bg-[#38BDF8] text-[#07111F] font-bold border-[#38BDF8]'
                  : 'bg-[#17263B] hover:bg-[#26364D] text-[#F1F5F9] border-[#26364D]'
              }`}
            >
              {deg}°
            </button>
          ))}

          {/* Quick Critical Angle Button (if exists) */}
          {planarResult.criticalAngleDeg !== null && (
            <button
              onClick={() => onParamChange('angleDeg', Math.round(planarResult.criticalAngleDeg! * 10) / 10)}
              className="px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/50 hover:bg-[#A78BFA]/30 font-bold"
            >
              θ_c ({planarResult.criticalAngleDeg.toFixed(1)}°)
            </button>
          )}

          {/* Brewster Angle Button */}
          <button
            onClick={() => onParamChange('angleDeg', Math.round(planarResult.brewsterAngleDeg * 10) / 10)}
            className="px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/50 hover:bg-[#34D399]/30 font-bold"
          >
            θ_B ({planarResult.brewsterAngleDeg.toFixed(1)}°)
          </button>
        </div>

        {/* Live Ray Angle Summary */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-[#FBBF24]">
            θ₁: <strong>{planarResult.theta1Deg.toFixed(1)}°</strong>
          </span>
          <span className="text-[#F97316]">
            θ_r: <strong>{planarResult.thetaRDeg.toFixed(1)}°</strong>
          </span>
          <span className="text-[#38BDF8]">
            θ₂: <strong>{planarResult.isTIR ? 'TIR (None)' : `${planarResult.theta2Deg?.toFixed(1)}°`}</strong>
          </span>
          <span className="text-[#34D399]">
            v₂/v₁: <strong>{(planarResult.v2 / planarResult.v1).toFixed(3)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
