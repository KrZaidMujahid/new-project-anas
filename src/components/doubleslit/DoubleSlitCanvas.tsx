/**
 * EQUATION 1 — Double-Slit Optical Bench & Simulation Canvas
 * Interactive, high-fidelity SVG/Canvas apparatus featuring:
 * - Animated coherent wavefield with Huygens wavelets and interference ripples
 * - Slit barrier with clickable slit toggles and aperture visualization
 * - Draggable detector cursor on the observation screen with live path-difference rays
 * - Screen photographic fringe preview with authentic spectral color rendering
 * - Aligned 1D Intensity distribution curve I(y) with single-slit diffraction envelope
 * - Quantum single-photon accumulation mode with hit counter and which-way observer
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  DoubleSlitParameters,
  DoubleSlitPhysicsResults,
  PhotonHit,
} from '../../physics/doubleslit/types';
import {
  calculateIntensityAtY,
  samplePhotonHit,
  wavelengthToRGB,
} from '../../physics/doubleslit/model';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Target,
  Maximize2,
  Trash2,
} from 'lucide-react';

interface DoubleSlitCanvasProps {
  params: DoubleSlitParameters;
  results: DoubleSlitPhysicsResults;
  onParamChange: <K extends keyof DoubleSlitParameters>(
    key: K,
    value: DoubleSlitParameters[K]
  ) => void;
  onSetDetectorY: (yMm: number) => void;
}

export const DoubleSlitCanvas: React.FC<DoubleSlitCanvasProps> = ({
  params,
  results,
  onParamChange,
  onSetDetectorY,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenStripCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animTime, setAnimTime] = useState<number>(0);
  const [isDraggingDetector, setIsDraggingDetector] = useState<boolean>(false);
  const [photonHits, setPhotonHits] = useState<PhotonHit[]>([]);
  const nextPhotonIdRef = useRef<number>(1);
  const lastPhotonSampleTimeRef = useRef<number>(0);

  // Bench coordinate layout
  const WIDTH = 920;
  const HEIGHT = 540;

  // Geometry layout inside SVG
  const laserX = 60;
  const laserY = HEIGHT / 2;
  const barrierX = 260;
  const screenX = 700;
  const graphWidth = 180;
  const graphX = screenX + 25;

  // Screen Y scaling: map y in mm [-30 mm, +30 mm] to canvas Y [40, HEIGHT - 40]
  const screenHalfSpanMm = 30; // +/- 30 mm span
  const screenTopY = 40;
  const screenBottomY = HEIGHT - 40;
  const screenCenterY = HEIGHT / 2;
  const mmToPx = (screenCenterY - screenTopY) / screenHalfSpanMm;

  const yMmToCanvasY = useCallback(
    (yMm: number) => screenCenterY - yMm * mmToPx,
    [screenCenterY, mmToPx]
  );

  const canvasYToYMm = useCallback(
    (canvasY: number) => (screenCenterY - canvasY) / mmToPx,
    [screenCenterY, mmToPx]
  );

  // Animation loop for wave phase and quantum photon accumulation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setAnimTime((prev) => (prev + dt * 3.0) % (2 * Math.PI));

        // Quantum photon generation
        if (params.quantumMode) {
          const emissionInterval = 1000 / Math.max(10, params.photonEmissionRate);
          if (currentTime - lastPhotonSampleTimeRef.current >= emissionInterval) {
            lastPhotonSampleTimeRef.current = currentTime;
            const newHitY = samplePhotonHit(params, screenHalfSpanMm);
            setPhotonHits((prev) => {
              const updated = [...prev, { id: nextPhotonIdRef.current++, yMm: newHitY, timestamp: currentTime }];
              // Keep last 1500 photons for smooth performance
              if (updated.length > 1500) {
                return updated.slice(updated.length - 1500);
              }
              return updated;
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, params]);

  // Reset photons when clearing or toggling quantum mode
  const handleClearPhotons = () => {
    setPhotonHits([]);
  };

  // Render 2D Wavefield or screen fringe strip onto Canvas
  useEffect(() => {
    const canvas = screenStripCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // If quantum mode is ON, render accumulated photon dots
    if (params.quantumMode) {
      // Dark screen background
      ctx.fillStyle = '#060E1A';
      ctx.fillRect(0, 0, w, h);

      // Render individual photon dots
      ctx.fillStyle = results.rgbColor;
      for (const hit of photonHits) {
        const hitCanvasY = yMmToCanvasY(hit.yMm);
        if (hitCanvasY >= 0 && hitCanvasY <= h) {
          const x = 5 + Math.random() * (w - 10);
          ctx.beginPath();
          ctx.arc(x, hitCanvasY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    }

    // Monochromatic or White light fringe rendering
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const brightnessFactor = (params.intensityPercent ?? 70) / 100;

    if (params.isWhiteLight) {
      // Superposition of spectrum
      const spectrumWavelengths = [410, 440, 470, 500, 530, 560, 590, 620, 650];
      for (let py = 0; py < h; py++) {
        const yMm = canvasYToYMm(py);
        const yM = yMm * 1e-3;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;

        for (const wl of spectrumWavelengths) {
          const calc = calculateIntensityAtY(yM, { ...params, wavelengthNm: wl });
          const rgb = wavelengthToRGB(wl);
          const r = parseInt(rgb.hex.slice(1, 3), 16);
          const g = parseInt(rgb.hex.slice(3, 5), 16);
          const b = parseInt(rgb.hex.slice(5, 7), 16);
          totalR += r * calc.intensity;
          totalG += g * calc.intensity;
          totalB += b * calc.intensity;
        }

        const avgR = Math.min(255, Math.round((totalR / 4.5) * brightnessFactor));
        const avgG = Math.min(255, Math.round((totalG / 4.5) * brightnessFactor));
        const avgB = Math.min(255, Math.round((totalB / 4.5) * brightnessFactor));

        for (let px = 0; px < w; px++) {
          const idx = (py * w + px) * 4;
          data[idx] = avgR;
          data[idx + 1] = avgG;
          data[idx + 2] = avgB;
          data[idx + 3] = 255;
        }
      }
    } else {
      // Single wavelength monochromatic
      const baseR = parseInt(results.rgbColor.slice(1, 3), 16);
      const baseG = parseInt(results.rgbColor.slice(3, 5), 16);
      const baseB = parseInt(results.rgbColor.slice(5, 7), 16);

      for (let py = 0; py < h; py++) {
        const yMm = canvasYToYMm(py);
        const yM = yMm * 1e-3;
        const { intensity } = calculateIntensityAtY(yM, params);

        const r = Math.min(255, Math.round(baseR * intensity * brightnessFactor));
        const g = Math.min(255, Math.round(baseG * intensity * brightnessFactor));
        const b = Math.min(255, Math.round(baseB * intensity * brightnessFactor));

        for (let px = 0; px < w; px++) {
          const idx = (py * w + px) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [params, results, yMmToCanvasY, canvasYToYMm, photonHits]);

  // Handle Dragging detector on screen
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const clickY = ((e.clientY - rect.top) / rect.height) * HEIGHT;

    // Check if clicked near the screen detector zone
    if (clickX >= screenX - 40 && clickX <= screenX + 60) {
      setIsDraggingDetector(true);
      const clampedY = Math.max(screenTopY, Math.min(screenBottomY, clickY));
      onSetDetectorY(canvasYToYMm(clampedY));
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingDetector) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const currentY = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    const clampedY = Math.max(screenTopY, Math.min(screenBottomY, currentY));
    onSetDetectorY(canvasYToYMm(clampedY));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDraggingDetector) {
      setIsDraggingDetector(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Slit coordinate calculations
  // Scaled slit separation for display: slit separation d in mm mapped to visually clear pixel offset
  const visualSlitSepPx = Math.max(16, Math.min(60, params.slitSeparationMm * 140));
  const slit1Y = laserY - visualSlitSepPx / 2;
  const slit2Y = laserY + visualSlitSepPx / 2;
  const visualSlitWidthPx = Math.max(3, Math.min(10, params.slitWidthMm * 80));

  // Detector canvas position
  const detectorCanvasY = yMmToCanvasY(params.detectorYMm);

  // Generate 1D intensity plot path
  const { intensityPathD, envelopePathD } = useMemo(() => {
    const steps = 140;
    const points: string[] = [];
    const envPoints: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const cy = screenTopY + (i / steps) * (screenBottomY - screenTopY);
      const yMm = canvasYToYMm(cy);
      const calc = calculateIntensityAtY(yMm * 1e-3, params);

      // Curve extends to the right from graphX
      const curX = graphX + calc.intensity * (graphWidth - 30);
      const envX = graphX + calc.diffractionFactor * (graphWidth - 30);

      points.push(`${i === 0 ? 'M' : 'L'} ${curX.toFixed(1)} ${cy.toFixed(1)}`);
      envPoints.push(`${i === 0 ? 'M' : 'L'} ${envX.toFixed(1)} ${cy.toFixed(1)}`);
    }

    return {
      intensityPathD: points.join(' '),
      envelopePathD: envPoints.join(' '),
    };
  }, [screenTopY, screenBottomY, canvasYToYMm, params, graphX, graphWidth]);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-4 shadow-xl flex flex-col gap-3">
      {/* Top Bench Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0B1728] px-3 py-2 rounded-lg border border-[#26364D]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-[#38BDF8]">
            <Target className="w-4 h-4 text-[#38BDF8]" />
            Optical Interference Bench
          </span>
          <span className="text-[#94A3B8] hidden sm:inline">|</span>
          <span className="text-[#94A3B8] hidden sm:inline font-mono">
            d = <strong className="text-[#FBBF24]">{(params.slitSeparationMm * 1000).toFixed(0)} μm</strong>,
            a = <strong className="text-[#34D399]">{(params.slitWidthMm * 1000).toFixed(0)} μm</strong>,
            D = <strong className="text-[#38BDF8]">{params.screenDistanceM.toFixed(2)} m</strong>
          </span>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggles */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#17263B] px-2 py-1 rounded-md border border-[#26364D] text-[11px]">
            <button
              onClick={() => onParamChange('showEnvelope', !params.showEnvelope)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                params.showEnvelope ? 'text-[#A78BFA] font-bold bg-[#A78BFA]/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Single-Slit Diffraction Envelope"
            >
              Envelope
            </button>
            <span className="text-[#26364D]">|</span>
            <button
              onClick={() => onParamChange('showFringeLabels', !params.showFringeLabels)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                params.showFringeLabels ? 'text-[#34D399] font-bold bg-[#34D399]/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Fringe Order Labels (m = 0, ±1...)"
            >
              Fringe Labels
            </button>
            <span className="text-[#26364D]">|</span>
            <button
              onClick={() => onParamChange('showIntensityScale', !params.showIntensityScale)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                params.showIntensityScale ? 'text-[#38BDF8] font-bold bg-[#38BDF8]/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Intensity Scale"
            >
              Scale
            </button>
            <span className="text-[#26364D]">|</span>
            <button
              onClick={() => onParamChange('showWaveField', !params.showWaveField)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                params.showWaveField ? 'text-[#FBBF24] font-bold bg-[#FBBF24]/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Animated 2D Wavefronts"
            >
              Wavefronts
            </button>
          </div>

          {params.quantumMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#17263B] border border-[#26364D] text-[11px] text-[#A78BFA]">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA] animate-spin" />
              <span>Photons: <strong className="text-white font-mono">{photonHits.length}</strong></span>
              <button
                onClick={handleClearPhotons}
                title="Clear accumulated photons"
                className="ml-1 text-slate-400 hover:text-rose-400 transition-colors p-0.5 rounded cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#17263B] hover:bg-[#26364D] text-[#F1F5F9] font-medium transition-colors cursor-pointer border border-[#26364D]"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#FBBF24]" /> : <Play className="w-3.5 h-3.5 text-[#34D399]" />}
            <span className="text-[11px]">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              setAnimTime(0);
              onSetDetectorY(0);
              handleClearPhotons();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#17263B] hover:bg-[#26364D] text-[#94A3B8] hover:text-[#F1F5F9] font-medium transition-colors cursor-pointer border border-[#26364D]"
            title="Reset simulation time and detector"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main SVG Simulation Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[920/540] bg-[#0A1526] rounded-lg border border-[#26364D] overflow-hidden select-none"
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#17263B" strokeWidth="0.8" />
            </pattern>

            {/* Laser glow gradient */}
            <radialGradient id="laserGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={results.rgbColor} stopOpacity="0.8" />
              <stop offset="60%" stopColor={results.rgbColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={results.rgbColor} stopOpacity="0" />
            </radialGradient>

            {/* Slit Aperture Gradient */}
            <linearGradient id="barrierGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Screen border gradient */}
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#26364D" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#26364D" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" />

          {/* Apparatus Section Header Labels (Horizontal Arrangement) */}
          <g className="apparatus-section-headers" opacity="0.9">
            <text x={laserX - 20} y={screenTopY - 14} textAnchor="middle" className="fill-[#38BDF8] font-mono text-[9px] font-bold">
              1. LIGHT SOURCE
            </text>
            <text x={(laserX + 25 + barrierX) / 2} y={screenTopY - 14} textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
              2. INCOMING BEAM →
            </text>
            <text x={barrierX} y={screenTopY - 14} textAnchor="middle" className="fill-[#FBBF24] font-mono text-[9px] font-bold">
              3. DOUBLE SLITS (S₁, S₂)
            </text>
            <text x={screenX} y={screenTopY - 14} textAnchor="middle" className="fill-[#38BDF8] font-mono text-[9px] font-bold">
              4. OBSERVATION SCREEN
            </text>
          </g>

          {/* 1. LASER SOURCE EMITTER */}
          <g className="laser-source">
            {/* Laser Casing */}
            <rect
              x={laserX - 45}
              y={laserY - 22}
              width="50"
              height="44"
              rx="6"
              fill="#101D30"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Laser Nozzle */}
            <rect
              x={laserX + 5}
              y={laserY - 12}
              width="12"
              height="24"
              rx="2"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            {/* Emission Glow */}
            <circle cx={laserX + 17} cy={laserY} r="14" fill="url(#laserGlow)" />
            {/* Laser Label */}
            <text
              x={laserX - 20}
              y={laserY + 36}
              textAnchor="middle"
              className="fill-slate-400 font-mono text-[10px]"
            >
              {params.isWhiteLight ? 'White Arc' : `${params.wavelengthNm} nm`}
            </text>

            {/* Collimated Laser Beam travelling to the Barrier */}
            <rect
              x={laserX + 17}
              y={laserY - visualSlitSepPx / 2 - 8}
              width={barrierX - (laserX + 17)}
              height={visualSlitSepPx + 16}
              fill={results.rgbColor}
              fillOpacity={((params.isWhiteLight ? 0.15 : 0.08) * (params.intensityPercent ?? 70)) / 70}
            />
            {/* Animated Plane Wavefronts before slit barrier */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const waveSpacing = 26;
              const curX = laserX + 25 + ((i * waveSpacing + animTime * 12) % (barrierX - laserX - 35));
              return (
                <line
                  key={`plane-${i}`}
                  x1={curX}
                  y1={laserY - visualSlitSepPx / 2 - 8}
                  x2={curX}
                  y2={laserY + visualSlitSepPx / 2 + 8}
                  stroke={results.rgbColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.45"
                  strokeDasharray="3 3"
                />
              );
            })}
          </g>

          {/* 2. HUYGENS INTERFERENCE WAVEFIELD (Animated Arcs between Barrier & Screen) */}
          {params.showWaveField && !params.quantumMode && (
            <g className="wavefield-arcs" opacity="0.75">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
                const radius = (i * 35 + animTime * 18) % 440;
                if (radius < 10) return null;
                const brightnessFactor = (params.intensityPercent ?? 70) / 100;
                return (
                  <React.Fragment key={`wave-pair-${i}`}>
                    {/* Slit 1 wavefront arc */}
                    {params.slit1Open && (
                      <path
                        d={`M ${barrierX + radius * Math.cos(-0.75)} ${slit1Y + radius * Math.sin(-0.75)} A ${radius} ${radius} 0 0 1 ${barrierX + radius * Math.cos(0.75)} ${slit1Y + radius * Math.sin(0.75)}`}
                        fill="none"
                        stroke={results.rgbColor}
                        strokeWidth={i % 2 === 0 ? '1.5' : '1'}
                        strokeOpacity={Math.max(0.02, 0.45 * (1 - radius / 460) * brightnessFactor)}
                      />
                    )}
                    {/* Slit 2 wavefront arc */}
                    {params.slit2Open && (
                      <path
                        d={`M ${barrierX + radius * Math.cos(-0.75)} ${slit2Y + radius * Math.sin(-0.75)} A ${radius} ${radius} 0 0 1 ${barrierX + radius * Math.cos(0.75)} ${slit2Y + radius * Math.sin(0.75)}`}
                        fill="none"
                        stroke={results.rgbColor}
                        strokeWidth={i % 2 === 0 ? '1.5' : '1'}
                        strokeOpacity={Math.max(0.02, 0.45 * (1 - radius / 460) * brightnessFactor)}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </g>
          )}

          {/* 3. OPTICAL RAYS FROM SLITS TO DETECTOR P(y) */}
          {params.showRays && (
            <g className="optical-rays">
              {/* Ray 1: Slit 1 -> Detector */}
              {params.slit1Open && (
                <line
                  x1={barrierX}
                  y1={slit1Y}
                  x2={screenX}
                  y2={detectorCanvasY}
                  stroke="#FBBF24"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}
              {/* Ray 2: Slit 2 -> Detector */}
              {params.slit2Open && (
                <line
                  x1={barrierX}
                  y1={slit2Y}
                  x2={screenX}
                  y2={detectorCanvasY}
                  stroke="#38BDF8"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
              )}

              {/* Slit-level path difference perpendicular triangle */}
              {params.slit1Open && params.slit2Open && Math.abs(params.detectorYMm) > 0.5 && (
                <g className="path-diff-callout">
                  {/* Normal from shorter ray to longer ray */}
                  <line
                    x1={barrierX + 3}
                    y1={params.detectorYMm > 0 ? slit1Y : slit2Y}
                    x2={barrierX + 16}
                    y2={params.detectorYMm > 0 ? slit1Y + (slit2Y - slit1Y) * 0.4 : slit2Y - (slit2Y - slit1Y) * 0.4}
                    stroke="#FB7185"
                    strokeWidth="1.5"
                  />
                  <text
                    x={barrierX + 22}
                    y={laserY}
                    className="fill-[#FB7185] font-mono text-[10px] font-bold"
                  >
                    Δx = {Math.abs(results.detector.pathDifferenceNm).toFixed(0)} nm
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 4. DOUBLE SLIT BARRIER */}
          <g className="barrier-structure">
            {/* Top Solid Segment */}
            <rect
              x={barrierX - 4}
              y={screenTopY}
              width="8"
              height={slit1Y - visualSlitWidthPx / 2 - screenTopY}
              fill="url(#barrierGrad)"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Middle Solid Segment (between Slit 1 and Slit 2) */}
            <rect
              x={barrierX - 4}
              y={slit1Y + visualSlitWidthPx / 2}
              width="8"
              height={slit2Y - visualSlitWidthPx / 2 - (slit1Y + visualSlitWidthPx / 2)}
              fill="url(#barrierGrad)"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Bottom Solid Segment */}
            <rect
              x={barrierX - 4}
              y={slit2Y + visualSlitWidthPx / 2}
              width="8"
              height={screenBottomY - (slit2Y + visualSlitWidthPx / 2)}
              fill="url(#barrierGrad)"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Slit 1 Aperture Indicator & Toggle */}
            <g
              className="cursor-pointer"
              onClick={() => onParamChange('slit1Open', !params.slit1Open)}
            >
              <title>Click to toggle Slit 1 open/closed</title>
              <rect
                x={barrierX - 5}
                y={slit1Y - visualSlitWidthPx / 2}
                width="10"
                height={visualSlitWidthPx}
                fill={params.slit1Open ? '#0A1526' : '#DC2626'}
                stroke={params.slit1Open ? results.rgbColor : '#EF4444'}
                strokeWidth="1.5"
              />
              <text
                x={barrierX - 14}
                y={slit1Y + 3}
                textAnchor="end"
                className={`font-mono text-[9px] font-bold ${params.slit1Open ? 'fill-[#38BDF8]' : 'fill-[#EF4444]'}`}
              >
                S₁ {params.slit1Open ? '✓' : '✗'}
              </text>
            </g>

            {/* Slit 2 Aperture Indicator & Toggle */}
            <g
              className="cursor-pointer"
              onClick={() => onParamChange('slit2Open', !params.slit2Open)}
            >
              <title>Click to toggle Slit 2 open/closed</title>
              <rect
                x={barrierX - 5}
                y={slit2Y - visualSlitWidthPx / 2}
                width="10"
                height={visualSlitWidthPx}
                fill={params.slit2Open ? '#0A1526' : '#DC2626'}
                stroke={params.slit2Open ? results.rgbColor : '#EF4444'}
                strokeWidth="1.5"
              />
              <text
                x={barrierX - 14}
                y={slit2Y + 3}
                textAnchor="end"
                className={`font-mono text-[9px] font-bold ${params.slit2Open ? 'fill-[#38BDF8]' : 'fill-[#EF4444]'}`}
              >
                S₂ {params.slit2Open ? '✓' : '✗'}
              </text>
            </g>

            {/* Slit separation dimension bracket */}
            <path
              d={`M ${barrierX - 8} ${slit1Y} L ${barrierX - 12} ${slit1Y} L ${barrierX - 12} ${slit2Y} L ${barrierX - 8} ${slit2Y}`}
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1"
            />
            <text
              x={barrierX - 16}
              y={laserY + 3}
              textAnchor="end"
              className="fill-[#FBBF24] font-mono text-[9px] font-bold"
            >
              d = {(params.slitSeparationMm * 1000).toFixed(0)}μm
            </text>

            {/* Which-Way Detector Observer Icon when active */}
            {params.quantumMode && params.whichWayDetector && (
              <g transform={`translate(${barrierX + 16}, ${laserY - 14})`}>
                <rect x="-3" y="-3" width="28" height="28" rx="4" fill="#17263B" stroke="#A78BFA" strokeWidth="1.5" />
                <Eye className="w-5 h-5 text-[#A78BFA] animate-pulse" />
                <text x="11" y="36" textAnchor="middle" className="fill-[#A78BFA] font-mono text-[8px] font-bold">
                  WHICH-WAY
                </text>
              </g>
            )}
          </g>

          {/* 5. SCREEN DISTANCE MARKER D */}
          <g className="screen-distance-ruler" opacity="0.7">
            <line
              x1={barrierX}
              y1={screenBottomY + 18}
              x2={screenX}
              y2={screenBottomY + 18}
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <path
              d={`M ${barrierX} ${screenBottomY + 14} L ${barrierX} ${screenBottomY + 22} M ${screenX} ${screenBottomY + 14} L ${screenX} ${screenBottomY + 22}`}
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <text
              x={(barrierX + screenX) / 2}
              y={screenBottomY + 30}
              textAnchor="middle"
              className="fill-[#38BDF8] font-mono text-[10px] font-bold"
            >
              Screen Distance D = {params.screenDistanceM.toFixed(2)} m
            </text>
          </g>

          {/* 6. DETECTION SCREEN FRAME & RULER */}
          <g className="screen-frame">
            {/* Screen structural bar */}
            <rect
              x={screenX - 3}
              y={screenTopY}
              width="6"
              height={screenBottomY - screenTopY}
              fill="url(#screenGrad)"
              stroke="#38BDF8"
              strokeWidth="1"
            />

            {/* Central Axis Marker */}
            {params.showCentralMarker && (
              <line
                x1={barrierX}
                y1={screenCenterY}
                x2={screenX + 35}
                y2={screenCenterY}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            )}

            {/* Central Maximum Indicator */}
            <line
              x1={screenX - 18}
              y1={screenCenterY}
              x2={screenX + 18}
              y2={screenCenterY}
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <text
              x={screenX - 22}
              y={screenCenterY + 3}
              textAnchor="end"
              className="fill-[#38BDF8] font-mono text-[9px] font-bold"
            >
              m = 0 (Central Max)
            </text>

            {/* Fringe Order Labels along screen (m = ±1, ±2...) */}
            {params.showFringeLabels &&
              [-3, -2, -1, 1, 2, 3].map((order) => {
                const yMm = order * results.fringeWidthMm;
                if (Math.abs(yMm) > screenHalfSpanMm) return null;
                const yPos = yMmToCanvasY(yMm);
                return (
                  <g key={`fringe-label-${order}`}>
                    <line
                      x1={screenX - 14}
                      y1={yPos}
                      x2={screenX - 4}
                      y2={yPos}
                      stroke="#34D399"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={screenX - 18}
                      y={yPos + 3}
                      textAnchor="end"
                      className="fill-[#34D399] font-mono text-[8px] font-bold"
                    >
                      m = {order > 0 ? `+${order}` : order}
                    </text>
                  </g>
                );
              })}

            {/* Millimeter Scale Ticks along Screen */}
            {params.showGrid &&
              [-20, -10, 0, 10, 20].map((tickMm) => {
                const tickY = yMmToCanvasY(tickMm);
                return (
                  <g key={`tick-${tickMm}`}>
                    <line
                      x1={screenX - 7}
                      y1={tickY}
                      x2={screenX + 7}
                      y2={tickY}
                      stroke="#64748B"
                      strokeWidth="1"
                    />
                    <text
                      x={screenX - 10}
                      y={tickY + 3}
                      textAnchor="end"
                      className="fill-slate-400 font-mono text-[8px]"
                    >
                      {tickMm > 0 ? `+${tickMm}` : tickMm}
                    </text>
                  </g>
                );
              })}
          </g>

          {/* 7. 1D INTENSITY GRAPH ALIGNED WITH SCREEN */}
          {params.showIntensityGraph && (
            <g className="intensity-graph">
              {/* Baseline axis */}
              <line
                x1={graphX}
                y1={screenTopY}
                x2={graphX}
                y2={screenBottomY}
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Peak axis */}
              <line
                x1={graphX + graphWidth - 30}
                y1={screenTopY}
                x2={graphX + graphWidth - 30}
                y2={screenBottomY}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Intensity Scale Grid Ticks */}
              {params.showIntensityScale && (
                <g className="intensity-scale-ticks">
                  {[0, 0.5, 1.0].map((frac) => {
                    const curX = graphX + frac * (graphWidth - 30);
                    return (
                      <g key={`int-tick-${frac}`}>
                        <line
                          x1={curX}
                          y1={screenTopY}
                          x2={curX}
                          y2={screenBottomY}
                          stroke="#1E293B"
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={curX}
                          y={screenBottomY + 12}
                          textAnchor="middle"
                          className="fill-slate-500 font-mono text-[8px]"
                        >
                          {(frac * 100).toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Single-slit diffraction envelope (dashed purple) */}
              {params.showEnvelope && (
                <path
                  d={envelopePathD}
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
              )}

              {/* Intensity curve I(y) */}
              <path
                d={intensityPathD}
                fill="none"
                stroke={results.rgbColor}
                strokeWidth="2"
                opacity="0.9"
              />

              {/* Graph Header Label */}
              <text
                x={graphX + (graphWidth - 30) / 2}
                y={screenTopY - 12}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[9px] font-bold"
              >
                Intensity I(y)
              </text>
            </g>
          )}

          {/* 8. DRAGGABLE DETECTOR CURSOR P(y) */}
          <g
            className="detector-cursor cursor-grab active:cursor-grabbing"
            transform={`translate(${screenX}, ${detectorCanvasY})`}
          >
            {/* Detector crosshair indicator */}
            <circle cx="0" cy="0" r="7" fill="#101D30" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="0" cy="0" r="2.5" fill="#FBBF24" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#FBBF24" strokeWidth="1.5" />

            {/* Readout tag */}
            <g transform="translate(18, -12)">
              <rect
                x="0"
                y="0"
                width="95"
                height="24"
                rx="4"
                fill="#0B1728"
                stroke="#26364D"
                strokeWidth="1"
              />
              <text x="6" y="11" className="fill-slate-200 font-mono text-[9px] font-bold">
                y = {params.detectorYMm > 0 ? `+${params.detectorYMm.toFixed(2)}` : params.detectorYMm.toFixed(2)} mm
              </text>
              <text x="6" y="20" className="fill-[#38BDF8] font-mono text-[8px]">
                I = {(results.detector.normalizedIntensity * 100).toFixed(1)}% | m = {results.detector.pathDifferenceWavelengths.toFixed(2)}λ
              </text>
            </g>
          </g>
        </svg>

        {/* PHOTOGRAPHIC FRINGE STRIP CANVAS (Right Screen projection) */}
        {params.showFringes && (
          <div
            className="absolute top-[40px] right-[205px] w-[26px] rounded border border-[#26364D] overflow-hidden shadow-inner bg-black pointer-events-none"
            style={{ height: `${screenBottomY - screenTopY}px` }}
          >
            <canvas
              ref={screenStripCanvasRef}
              width={26}
              height={screenBottomY - screenTopY}
              className="w-full h-full block"
            />
          </div>
        )}

        {/* Interactive Detector Drag Hint */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-500 font-mono bg-[#0B1728]/80 px-2 py-1 rounded border border-[#26364D]">
          💡 Click or drag on the screen ruler to probe point P(y)
        </div>
      </div>
    </div>
  );
};
