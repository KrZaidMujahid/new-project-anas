/**
 * EQUATION 1 — Wave Superposition Canvas Renderer
 * High-DPI rendering of 1D wave superposition, individual sinusoidal waves,
 * resultant wave, amplitude markings, equilibrium axis, and draggable spatial probe.
 */

import {
  WaveSuperpositionParameters,
} from '../physics/waves/types';
import {
  calculateWaveNumber,
  calculateAngularFrequency,
  calculateSinusoidalDisplacement,
  calculateSuperposition,
  calculateResultantAmplitude,
} from '../physics/waves/model';

export function renderWaveSuperposition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: WaveSuperpositionParameters,
  time: number
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Deep dark scientific canvas background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#070b13');
  bgGrad.addColorStop(1, '#05070c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const padding = { top: 35, right: 40, bottom: 45, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const midY = padding.top + plotHeight / 2;

  // Maximum visual amplitude bound: at least max(A1+A2, 1.0) * 1.15
  const maxCombinedA = params.wave1.amplitude + params.wave2.amplitude;
  const yRange = Math.max(1.2, maxCombinedA * 1.25);
  const pxPerMeterY = (plotHeight * 0.45) / yRange;
  const pxPerMeterX = plotWidth / params.spatialSpanMeters;

  const toScreenX = (x: number) => padding.left + x * pxPerMeterX;
  const toScreenY = (y: number) => midY - y * pxPerMeterY;

  // 1. Subtle Background Grid
  ctx.save();
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
  ctx.lineWidth = 1;

  // Vertical spatial grid lines
  const xStep = params.spatialSpanMeters <= 5 ? 0.5 : params.spatialSpanMeters <= 12 ? 1.0 : 2.0;
  for (let x = 0; x <= params.spatialSpanMeters; x += xStep) {
    const sx = toScreenX(x);
    ctx.beginPath();
    ctx.moveTo(sx, padding.top);
    ctx.lineTo(sx, padding.top + plotHeight);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${x.toFixed(1)}m`, sx, padding.top + plotHeight + 16);
  }

  // Horizontal displacement grid lines
  const yStep = yRange <= 1.5 ? 0.5 : 1.0;
  for (let y = -Math.floor(yRange); y <= Math.floor(yRange); y += yStep) {
    if (Math.abs(y) < 0.001) continue; // skip 0 for equilibrium line
    const sy = toScreenY(y);
    if (sy >= padding.top && sy <= padding.top + plotHeight) {
      ctx.beginPath();
      ctx.moveTo(padding.left, sy);
      ctx.lineTo(padding.left + plotWidth, sy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${y >= 0 ? '+' : ''}${y.toFixed(1)}m`, padding.left - 8, sy + 3);
    }
  }
  ctx.restore();

  // 2. Equilibrium Baseline (y = 0)
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, midY);
  ctx.lineTo(padding.left + plotWidth, midY);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('0.0m (Equilibrium)', padding.left - 8, midY + 3);
  ctx.restore();

  // 3. Amplitude Limit Boundaries (Dotted Lines)
  if (params.showResultant && maxCombinedA > 0.05) {
    // If waves have same frequency & wavelength, compute theoretical resultant amplitude
    const sameK = Math.abs(params.wave1.wavelength - params.wave2.wavelength) < 0.01;
    const sameOmega = Math.abs(params.wave1.frequency - params.wave2.frequency) < 0.01;
    const sameDir = params.wave1.direction === params.wave2.direction;

    if (sameK && sameOmega && sameDir) {
      const deltaPhiRad = ((params.wave2.initialPhaseDeg - params.wave1.initialPhaseDeg) * Math.PI) / 180;
      const aR = calculateResultantAmplitude(params.wave1.amplitude, params.wave2.amplitude, deltaPhiRad);

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)'; // Amber dotted
      ctx.lineWidth = 1.2;

      const topSy = toScreenY(aR);
      const botSy = toScreenY(-aR);

      ctx.beginPath();
      ctx.moveTo(padding.left, topSy);
      ctx.lineTo(padding.left + plotWidth, topSy);
      ctx.moveTo(padding.left, botSy);
      ctx.lineTo(padding.left + plotWidth, botSy);
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`+A_R = +${aR.toFixed(2)}m`, padding.left + plotWidth + 6, topSy + 3);
      ctx.fillText(`-A_R = -${aR.toFixed(2)}m`, padding.left + plotWidth + 6, botSy + 3);
      ctx.restore();
    }
  }

  // Precompute wave parameters
  const k1 = calculateWaveNumber(params.wave1.wavelength);
  const k2 = calculateWaveNumber(params.wave2.wavelength);
  const omega1 = calculateAngularFrequency(params.wave1.frequency);
  const omega2 = calculateAngularFrequency(params.wave2.frequency);
  const phi1Rad = (params.wave1.initialPhaseDeg * Math.PI) / 180;
  const phi2Rad = (params.wave2.initialPhaseDeg * Math.PI) / 180;

  // Sampling resolution along x axis (high fidelity: 400 sample points)
  const sampleCount = Math.max(200, Math.min(800, Math.round(plotWidth)));
  const dx = params.spatialSpanMeters / (sampleCount - 1);

  const ptsWave1: { sx: number; sy: number; y: number }[] = [];
  const ptsWave2: { sx: number; sy: number; y: number }[] = [];
  const ptsResultant: { sx: number; sy: number; y: number }[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const x = i * dx;
    const sx = toScreenX(x);

    const y1 = calculateSinusoidalDisplacement(
      params.wave1.amplitude,
      k1,
      omega1,
      phi1Rad,
      x,
      time,
      params.wave1.direction
    );
    const y2 = calculateSinusoidalDisplacement(
      params.wave2.amplitude,
      k2,
      omega2,
      phi2Rad,
      x,
      time,
      params.wave2.direction
    );
    const yR = calculateSuperposition(y1, y2);

    ptsWave1.push({ sx, sy: toScreenY(y1), y: y1 });
    ptsWave2.push({ sx, sy: toScreenY(y2), y: y2 });
    ptsResultant.push({ sx, sy: toScreenY(yR), y: yR });
  }

  // Helper to draw smooth path
  const drawPath = (pts: { sx: number; sy: number }[], color: string, lineWidth: number, dash?: number[]) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (dash) ctx.setLineDash(dash);

    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i].sx, pts[i].sy);
      else ctx.lineTo(pts[i].sx, pts[i].sy);
    }
    ctx.stroke();
    ctx.restore();
  };

  // 4. Render Wave 1 (Cyan)
  if (params.wave1.visible) {
    drawPath(ptsWave1, '#06b6d4', 2.0);
  }

  // 5. Render Wave 2 (Violet / Purple)
  if (params.wave2.visible) {
    drawPath(ptsWave2, '#a855f7', 2.0, [6, 3]);
  }

  // 6. Render Resultant Wave (High-contrast Amber / Yellow with glow)
  if (params.showResultant) {
    ctx.save();
    ctx.shadowColor = 'rgba(250, 204, 21, 0.4)';
    ctx.shadowBlur = 8;
    drawPath(ptsResultant, '#facc15', 3.5);
    ctx.restore();
  }

  // 7. Spatial Probe Marker at x = probeX
  const probeX = Math.max(0, Math.min(params.spatialSpanMeters, params.probeX));
  const probeSx = toScreenX(probeX);

  const probeY1 = calculateSinusoidalDisplacement(
    params.wave1.amplitude,
    k1,
    omega1,
    phi1Rad,
    probeX,
    time,
    params.wave1.direction
  );
  const probeY2 = calculateSinusoidalDisplacement(
    params.wave2.amplitude,
    k2,
    omega2,
    phi2Rad,
    probeX,
    time,
    params.wave2.direction
  );
  const probeYR = calculateSuperposition(probeY1, probeY2);

  // Vertical probe line
  ctx.save();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(probeSx, padding.top - 10);
  ctx.lineTo(probeSx, padding.top + plotHeight + 10);
  ctx.stroke();

  // Probe Top Header Handle
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(probeSx - 35, padding.top - 28, 70, 20, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`x = ${probeX.toFixed(2)}m`, probeSx, padding.top - 14);

  // Probe intersection dots
  if (params.wave1.visible) {
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(probeSx, toScreenY(probeY1), 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (params.wave2.visible) {
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(probeSx, toScreenY(probeY2), 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (params.showResultant) {
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(probeSx, toScreenY(probeYR), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 8. Axis & Legend Annotations
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Position x (meters) →', padding.left + plotWidth - 110, padding.top + plotHeight + 35);

  ctx.save();
  ctx.translate(padding.left - 42, midY);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Displacement y (meters)', 0, 0);
  ctx.restore();

  // Floating Live Legend at Top Right
  const legendX = padding.left + 15;
  const legendY = padding.top + 10;
  ctx.fillStyle = 'rgba(11, 16, 27, 0.85)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(legendX, legendY, 260, 68, 6);
  ctx.fill();
  ctx.stroke();

  // Wave 1 legend item
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(legendX + 12, legendY + 12, 16, 3);
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Wave 1: y₁ = ${probeY1 >= 0 ? '+' : ''}${probeY1.toFixed(3)} m`, legendX + 36, legendY + 16);

  // Wave 2 legend item
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(legendX + 12, legendY + 30, 16, 3);
  ctx.fillText(`Wave 2: y₂ = ${probeY2 >= 0 ? '+' : ''}${probeY2.toFixed(3)} m`, legendX + 36, legendY + 34);

  // Resultant legend item
  ctx.fillStyle = '#facc15';
  ctx.fillRect(legendX + 12, legendY + 48, 16, 4);
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.fillText(`Resultant: y_R = ${probeYR >= 0 ? '+' : ''}${probeYR.toFixed(3)} m`, legendX + 36, legendY + 52);

  ctx.restore();
}
