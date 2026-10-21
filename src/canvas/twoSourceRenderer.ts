/**
 * EQUATION 1 — Two-Source Wave Interference 2D Canvas Renderer
 * High-performance, scientifically accurate rendering of 2D circular wave fields,
 * expanding wavefronts, hyperbolic antinodal/nodal lines, 2D intensity maps,
 * resultant wave overlays, and interactive observation point P(x, y).
 */

import { TwoSourceParameters, PointInterferenceAnalysis } from '../physics/waves/types';
import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculateDistance,
  analyzeTwoSourcePoint,
} from '../physics/waves/model';

export interface TwoSourceRenderResult {
  source1Screen: { x: number; y: number };
  source2Screen: { x: number; y: number };
  probeScreen: { x: number; y: number };
  analysis: PointInterferenceAnalysis;
  toMeters: (screenX: number, screenY: number) => { x: number; y: number };
}

export function renderTwoSourceInterference(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: TwoSourceParameters,
  time: number,
  isDraggingProbe = false
): TwoSourceRenderResult {
  ctx.clearRect(0, 0, width, height);

  // Field spatial dimensions in meters
  const fieldW = params.fieldWidthMeters || 12.0;
  const fieldH = params.fieldHeightMeters || 8.0;

  // Coordinate origin (0,0) located horizontally at width * 0.18, vertically at height * 0.50
  const originX = width * 0.18;
  const originY = height * 0.5;

  const scale = Math.min(
    (width * 0.76) / (fieldW * 0.85),
    (height * 0.88) / fieldH
  );

  const toScreenX = (x: number) => originX + x * scale;
  const toScreenY = (y: number) => originY - y * scale;
  const toMetersX = (sx: number) => (sx - originX) / scale;
  const toMetersY = (sy: number) => (originY - sy) / scale;

  const toMeters = (sx: number, sy: number) => ({
    x: Math.max(0.05, Math.min(fieldW, toMetersX(sx))),
    y: Math.max(-fieldH / 2, Math.min(fieldH / 2, toMetersY(sy))),
  });

  // Source coordinates in meters: S1 at (0, +d/2), S2 at (0, -d/2)
  const halfD = params.separation / 2;
  const s1Meters = { x: 0, y: halfD };
  const s2Meters = { x: 0, y: -halfD };

  const s1Screen = { x: toScreenX(s1Meters.x), y: toScreenY(s1Meters.y) };
  const s2Screen = { x: toScreenX(s2Meters.x), y: toScreenY(s2Meters.y) };
  const probeScreen = {
    x: toScreenX(params.probePoint.x),
    y: toScreenY(params.probePoint.y),
  };

  const k = calculateWaveNumber(params.wavelength);
  const omega = calculateAngularFrequency(params.frequency);
  const phi1 = (params.sourcePhase1Deg * Math.PI) / 180;
  const phi2 = (params.sourcePhase2Deg * Math.PI) / 180;
  const sourceAmp = params.amplitude || 1.0;

  const vizMode = params.activeVizMode || 'two-source';

  // 1. Draw 2D Background Wave Field / Intensity Pattern
  if (vizMode === 'intensity') {
    // Mode 5: Pure 2D Interference Intensity Map: I = I_max * cos²(Δφ / 2)
    const step = 4;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    for (let r = 0; r < rows; r++) {
      const sy = r * step;
      const my = toMetersY(sy + step / 2);

      for (let c = 0; c < cols; c++) {
        const sx = c * step;
        const mx = toMetersX(sx + step / 2);

        if (mx < -0.6) {
          ctx.fillStyle = '#07111f';
          ctx.fillRect(sx, sy, step, step);
          continue;
        }

        const r1 = Math.sqrt(mx * mx + (my - halfD) * (my - halfD));
        const r2 = Math.sqrt(mx * mx + (my + halfD) * (my + halfD));
        const deltaR = r2 - r1;
        const deltaPhi = k * deltaR + (phi2 - phi1);

        // Normalized intensity I / I_max = cos²(Δφ / 2) ∈ [0, 1]
        const normalizedI = Math.cos(deltaPhi / 2) ** 2;

        // Color mapping:
        // High Intensity (Constructive, I=1): Bright Yellow (#fbbf24) / White-Yellow
        // Medium Intensity (I=0.5): Deep Cyan / Emerald
        // Low Intensity (Destructive, I=0): Deep Navy/Black (#07111f)
        let red: number;
        let green: number;
        let blue: number;

        if (normalizedI > 0.5) {
          const t = (normalizedI - 0.5) * 2; // 0 to 1
          // from cyan/green (20, 180, 160) to bright warm yellow (251, 191, 36)
          red = Math.round(20 + (251 - 20) * t);
          green = Math.round(180 + (191 - 180) * t);
          blue = Math.round(160 * (1 - t) + 36 * t);
        } else {
          const t = normalizedI * 2; // 0 to 1
          // from dark navy (7, 17, 31) to cyan/teal (20, 180, 160)
          red = Math.round(7 + (20 - 7) * t);
          green = Math.round(17 + (180 - 17) * t);
          blue = Math.round(31 + (160 - 31) * t);
        }

        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.fillRect(sx, sy, step, step);
      }
    }
  } else {
    // Mode 1, 2, 3, 4: Dynamic 2D Wavefield Superposition
    const step = 5;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    for (let r = 0; r < rows; r++) {
      const sy = r * step;
      const my = toMetersY(sy + step / 2);

      for (let c = 0; c < cols; c++) {
        const sx = c * step;
        const mx = toMetersX(sx + step / 2);

        if (mx < -0.6) {
          ctx.fillStyle = '#07111f';
          ctx.fillRect(sx, sy, step, step);
          continue;
        }

        const r1 = Math.sqrt(mx * mx + (my - halfD) * (my - halfD));
        const r2 = Math.sqrt(mx * mx + (my + halfD) * (my + halfD));

        const decay1 = 1 / Math.sqrt(1 + 0.08 * r1);
        const decay2 = 1 / Math.sqrt(1 + 0.08 * r2);

        const y1 = sourceAmp * decay1 * Math.sin(k * r1 - omega * time + phi1);
        const y2 = sourceAmp * decay2 * Math.sin(k * r2 - omega * time + phi2);
        const yR = (y1 + y2) / (2 * sourceAmp || 1); // normalized in [-1, +1]

        // Color coding required by prompt:
        // Constructive: bright yellow / green (#fbbf24, #34d399)
        // Destructive: dark blue / black (#07111f)
        const absVal = Math.abs(yR); // magnitude of resultant displacement

        let red: number;
        let green: number;
        let blue: number;

        if (absVal > 0.65) {
          // Intense constructive interference crest or trough
          const t = (absVal - 0.65) / 0.35;
          red = Math.round(251 * t + 56 * (1 - t));
          green = Math.round(191 * t + 189 * (1 - t));
          blue = Math.round(36 * t + 248 * (1 - t));
        } else if (absVal > 0.25) {
          // Moderate intermediate interference
          const t = (absVal - 0.25) / 0.40;
          red = Math.round(15 + 41 * t);
          green = Math.round(35 + 154 * t);
          blue = Math.round(65 + 183 * t);
        } else {
          // Destructive interference cancellation (dark navy/black)
          const t = absVal / 0.25;
          red = Math.round(7 + 8 * t);
          green = Math.round(17 + 18 * t);
          blue = Math.round(31 + 34 * t);
        }

        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.fillRect(sx, sy, step, step);
      }
    }
  }

  // 2. Spatial Metric Grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  const gridStepM = 1.0;
  for (let x = -1; x <= fieldW; x += gridStepM) {
    const sx = toScreenX(x);
    if (sx >= 0 && sx <= width) {
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
  }
  for (let y = -fieldH / 2; y <= fieldH / 2; y += gridStepM) {
    const sy = toScreenY(y);
    if (sy >= 0 && sy <= height) {
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }
  }
  ctx.restore();

  // 3. Concentric Expanding Circular Wavefront Rings
  // Wavefronts expand continuously from both sources: radius = (v * time) % λ + nλ
  if (params.showWavefronts || vizMode === 'two-source' || vizMode === 'constructive' || vizMode === 'destructive') {
    ctx.save();
    const wavelengthPx = params.wavelength * scale;
    const waveSpeed = params.lockSpeedToPhysics ? params.frequency * params.wavelength : params.waveSpeed;

    const phaseOffset1 =
      ((waveSpeed * time - (phi1 / (2 * Math.PI)) * params.wavelength) % params.wavelength +
        params.wavelength) %
      params.wavelength;
    const phaseOffset2 =
      ((waveSpeed * time - (phi2 / (2 * Math.PI)) * params.wavelength) % params.wavelength +
        params.wavelength) %
      params.wavelength;

    const maxRadiusPx = Math.max(width, height) * 1.3;

    // S1 wavefront rings: Cyan #38BDF8
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 1.6;
    for (let r = phaseOffset1 * scale; r <= maxRadiusPx; r += wavelengthPx) {
      if (r > 6) {
        ctx.beginPath();
        ctx.arc(s1Screen.x, s1Screen.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // S2 wavefront rings: Magenta / Purple #A78BFA
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.65)';
    ctx.lineWidth = 1.6;
    for (let r = phaseOffset2 * scale; r <= maxRadiusPx; r += wavelengthPx) {
      if (r > 6) {
        ctx.beginPath();
        ctx.arc(s2Screen.x, s2Screen.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // 4. Analytical Hyperbolic Curves
  // Hyperbola equation for path difference Δr = r2 - r1 = 2a:
  // Foci at (0, +d/2) and (0, -d/2), c = d/2, b² = c² - a²
  const cDist = halfD;

  const drawHyperbola = (
    pathDiff: number,
    color: string,
    lineWidth: number,
    dash?: number[],
    orderLabel?: string
  ) => {
    const aVal = Math.abs(pathDiff) / 2;
    if (aVal >= cDist || aVal <= 0.001) return;
    const bSq = cDist * cDist - aVal * aVal;
    if (bSq <= 0) return;
    const bVal = Math.sqrt(bSq);

    const sign = pathDiff > 0 ? 1 : -1;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (dash) ctx.setLineDash(dash);

    ctx.beginPath();
    let started = false;
    let labelScreenPos: { x: number; y: number } | null = null;

    for (let mx = 0; mx <= fieldW; mx += 0.08) {
      const my = sign * aVal * Math.sqrt(1 + (mx * mx) / (bVal * bVal));
      const sx = toScreenX(mx);
      const sy = toScreenY(my);

      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }

      // Record label position around x = 5.5m
      if (orderLabel && mx >= 5.0 && !labelScreenPos) {
        labelScreenPos = { x: sx, y: sy };
      }
    }
    ctx.stroke();

    // Render Order Badge on curve if label requested
    if (orderLabel && labelScreenPos) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(labelScreenPos.x - 2, labelScreenPos.y - 12, 42, 14);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(labelScreenPos.x - 2, labelScreenPos.y - 12, 42, 14);
      ctx.fillStyle = color;
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText(orderLabel, labelScreenPos.x + 2, labelScreenPos.y - 2);
    }

    ctx.restore();
  };

  // Constructive Hyperbolas: Δr = nλ (Modes: 'constructive', or when toggled)
  if (params.showConstructiveHyperbolas || vizMode === 'constructive') {
    const maxOrders = Math.floor(params.separation / params.wavelength);
    const isModeActive = vizMode === 'constructive';
    const lineColor = isModeActive ? '#fbbf24' : '#34d399';
    const lineWidth = isModeActive ? 2.8 : 1.8;

    for (let n = -maxOrders; n <= maxOrders; n++) {
      if (n === 0) {
        // Central Antinodal Line along perpendicular bisector y = 0
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = isModeActive ? 3.0 : 2.0;
        ctx.shadowColor = lineColor;
        ctx.shadowBlur = isModeActive ? 10 : 0;
        ctx.beginPath();
        ctx.moveTo(toScreenX(0), toScreenY(0));
        ctx.lineTo(toScreenX(fieldW), toScreenY(0));
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText('n=0 (Central Max, Δr=0)', toScreenX(fieldW * 0.65), toScreenY(0) - 6);
        ctx.restore();
      } else {
        const pathDiff = n * params.wavelength;
        drawHyperbola(
          pathDiff,
          lineColor,
          lineWidth,
          undefined,
          isModeActive ? `n=${n > 0 ? `+${n}` : n}` : undefined
        );
      }
    }
  }

  // Destructive Hyperbolas: Δr = (n + 1/2)λ (Modes: 'destructive', or when toggled)
  if (params.showDestructiveHyperbolas || vizMode === 'destructive') {
    const maxDestructiveOrders = Math.floor(params.separation / params.wavelength - 0.5);
    const isModeActive = vizMode === 'destructive';
    const lineColor = isModeActive ? '#f43f5e' : '#fb7185';
    const lineWidth = isModeActive ? 2.6 : 1.6;

    for (let n = -maxDestructiveOrders; n <= maxDestructiveOrders; n++) {
      const pathDiff = (n + 0.5) * params.wavelength;
      drawHyperbola(
        pathDiff,
        lineColor,
        lineWidth,
        [6, 4],
        isModeActive ? `n=${n >= 0 ? `+${n}` : n}½` : undefined
      );
    }
  }

  // 5. Point Sources S1 and S2
  const drawSource = (sx: number, sy: number, label: string, color: string, sublabel: string) => {
    ctx.save();
    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(label, sx - 14, sy - 2);

    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    ctx.fillText(sublabel, sx - 14, sy + 11);
    ctx.restore();
  };

  drawSource(s1Screen.x, s1Screen.y, 'S₁', '#38bdf8', 'Cyan Source');
  drawSource(s2Screen.x, s2Screen.y, 'S₂', '#a78bfa', 'Purple Source');

  // Source Separation Dimension Line
  ctx.save();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  const bracketX = s1Screen.x - 34;
  ctx.beginPath();
  ctx.moveTo(bracketX + 6, s1Screen.y);
  ctx.lineTo(bracketX, s1Screen.y);
  ctx.lineTo(bracketX, s2Screen.y);
  ctx.lineTo(bracketX + 6, s2Screen.y);
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(
    `d = ${params.separation.toFixed(2)} m`,
    bracketX - 6,
    (s1Screen.y + s2Screen.y) / 2 + 3
  );
  ctx.restore();

  // 6. Interactive Observation Point P(x, y)
  const analysis = analyzeTwoSourcePoint(params, params.probePoint.x, params.probePoint.y, time);

  // Path r1 ray from S1 to P (Cyan dashed)
  ctx.save();
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(s1Screen.x, s1Screen.y);
  ctx.lineTo(probeScreen.x, probeScreen.y);
  ctx.stroke();

  // Path r2 ray from S2 to P (Purple dashed)
  ctx.strokeStyle = '#a78bfa';
  ctx.beginPath();
  ctx.moveTo(s2Screen.x, s2Screen.y);
  ctx.lineTo(probeScreen.x, probeScreen.y);
  ctx.stroke();

  // Mid-ray distance labels
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`r₁=${analysis.r1.toFixed(2)}m`, (s1Screen.x + probeScreen.x) / 2 - 25, (s1Screen.y + probeScreen.y) / 2 - 6);

  ctx.fillStyle = '#a78bfa';
  ctx.fillText(`r₂=${analysis.r2.toFixed(2)}m`, (s2Screen.x + probeScreen.x) / 2 - 25, (s2Screen.y + probeScreen.y) / 2 + 14);

  // Probe Point P Halo & Body
  const isConstructive = analysis.classification === 'constructive';
  const isDestructive = analysis.classification === 'destructive';
  const probeColor = isConstructive ? '#34d399' : isDestructive ? '#f43f5e' : '#fbbf24';

  if (isDraggingProbe) {
    ctx.shadowColor = probeColor;
    ctx.shadowBlur = 20;
  }
  ctx.fillStyle = '#090d16';
  ctx.strokeStyle = probeColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(probeScreen.x, probeScreen.y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = probeColor;
  ctx.beginPath();
  ctx.arc(probeScreen.x, probeScreen.y, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Probe Point Metadata Card
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#090d16cc';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  const cardW = 190;
  const cardH = 54;
  const cardX = probeScreen.x + 14;
  const cardY = probeScreen.y - 25;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Point P (${params.probePoint.x.toFixed(2)}m, ${params.probePoint.y.toFixed(2)}m)`, cardX + 8, cardY + 16);

  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Δr = ${analysis.pathDifference >= 0 ? '+' : ''}${analysis.pathDifference.toFixed(3)} m (${analysis.pathDifferenceInWavelengths.toFixed(2)}λ)`, cardX + 8, cardY + 32);

  ctx.fillStyle = probeColor;
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  const classificationText =
    analysis.classification === 'constructive'
      ? '★ Constructive (Reinforcement)'
      : analysis.classification === 'destructive'
      ? '✕ Destructive (Cancellation)'
      : '≈ Intermediate Phase';
  ctx.fillText(classificationText, cardX + 8, cardY + 46);
  ctx.restore();

  // 7. Visual Legend & Guidance at bottom
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(12, height - 38, width - 24, 28);
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
  ctx.strokeRect(12, height - 38, width - 24, 28);

  // Legend Items
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.textBaseline = 'middle';
  const legendY = height - 24;

  let legX = 22;
  // S1
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(legX, legendY, 4, 0, Math.PI * 2);
  ctx.fill();
  legX += 8;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Source S₁', legX, legendY);
  legX += 70;

  // S2
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(legX, legendY, 4, 0, Math.PI * 2);
  ctx.fill();
  legX += 8;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Source S₂', legX, legendY);
  legX += 70;

  // Constructive
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(legX - 4, legendY - 3, 8, 6);
  legX += 8;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Constructive (Δr = nλ)', legX, legendY);
  legX += 130;

  // Destructive
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(legX - 4, legendY - 3, 8, 6);
  legX += 8;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Destructive (Δr = [n+½]λ)', legX, legendY);
  legX += 140;

  // Probe Hint
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'italic 10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Click anywhere to place Observation Point P', legX, legendY);

  ctx.restore();

  return {
    source1Screen: s1Screen,
    source2Screen: s2Screen,
    probeScreen,
    analysis,
    toMeters,
  };
}
