/**
 * EQUATION 1 — Resonance Laboratory HTML5 Canvas Renderer
 * Scientific rendering of a driven, damped mass-spring system:
 * - Fixed rigid support wall with structural hatching
 * - Helical spring with dynamic stretch/compression coils
 * - Viscous fluid dashpot / damper cylinder
 * - Movable mass with specular gradient and mass label
 * - External periodic driving force vector and eccentric driving crank
 * - Equilibrium line (x = 0), displacement scale/ruler, and amplitude envelope
 */

import { ResonanceParameters, LiveOscillatorState } from '../physics/resonance/types';

export function renderResonanceOscillator(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: ResonanceParameters,
  state: LiveOscillatorState,
  steadyStateAmp: number
) {
  ctx.clearRect(0, 0, width, height);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#07111F');
  bgGrad.addColorStop(1, '#050D18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Visual Geometry Setup
  const wallX = 60;
  const centerY = height * 0.48;
  const trackY = centerY + 50;

  // Pixels per meter conversion
  // Typical displacement is between -0.8m and +0.8m
  const ppm = Math.min(260, (width - 240) / 2.2);

  // Equilibrium position of mass center in screen pixels
  const eqX = width * 0.44;

  // Current screen position of mass center
  const massCenterX = eqX + state.displacement * ppm;

  // 1. Horizontal Guide Track / Ruler
  ctx.save();
  // Track surface
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(wallX, trackY, width - wallX - 30, 8);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(wallX, trackY, width - wallX - 30, 8);

  // Metric Ruler Marks along track
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';

  const rulerStepM = 0.1; // 10 cm marks
  for (let m = -1.0; m <= 1.0; m += rulerStepM) {
    const rx = eqX + m * ppm;
    if (rx >= wallX + 20 && rx <= width - 40) {
      const isMajor = Math.abs(Math.round(m * 10) % 5) === 0;
      const tickH = isMajor ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(rx, trackY + 8);
      ctx.lineTo(rx, trackY + 8 + tickH);
      ctx.stroke();

      if (isMajor) {
        ctx.fillText(`${m > 0 ? `+${m.toFixed(1)}` : m.toFixed(1)}m`, rx, trackY + 28);
      }
    }
  }
  ctx.restore();

  // 2. Fixed Rigid Support Wall
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(wallX - 25, centerY - 80, 25, 160);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(wallX - 25, centerY - 80, 25, 160);

  // Diagonal Hatch Lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let y = centerY - 75; y <= centerY + 75; y += 10) {
    ctx.moveTo(wallX - 25, y);
    ctx.lineTo(wallX - 5, y + 10);
  }
  ctx.stroke();

  // Anchor plate
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(wallX - 4, centerY - 45, 8, 90);
  ctx.strokeStyle = '#64748b';
  ctx.strokeRect(wallX - 4, centerY - 45, 8, 90);
  ctx.restore();

  // 3. Equilibrium Marker (x = 0)
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(eqX, centerY - 95);
  ctx.lineTo(eqX, trackY + 35);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Equilibrium (x = 0)', eqX, centerY - 102);
  ctx.restore();

  // 4. Amplitude Envelope Boundaries (± A_steady)
  if (steadyStateAmp > 0.01 && steadyStateAmp < 2.5) {
    const ampPx = steadyStateAmp * ppm;
    const leftAmpX = eqX - ampPx;
    const rightAmpX = eqX + ampPx;

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 1.2;

    // -A line
    if (leftAmpX > wallX + 30) {
      ctx.beginPath();
      ctx.moveTo(leftAmpX, centerY - 70);
      ctx.lineTo(leftAmpX, trackY);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('-A_max', leftAmpX, centerY - 75);
    }

    // +A line
    if (rightAmpX < width - 40) {
      ctx.beginPath();
      ctx.moveTo(rightAmpX, centerY - 70);
      ctx.lineTo(rightAmpX, trackY);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('+A_max', rightAmpX, centerY - 75);
    }
    ctx.restore();
  }

  // 5. Mass Block Dimensions
  const massSize = Math.max(50, Math.min(84, 52 + params.mass * 6));
  const massHalf = massSize / 2;
  const massLeft = massCenterX - massHalf;
  const massTop = trackY - massSize;

  // 6. Helical Spring (between wall and massLeft)
  const springStartY = centerY - 15;
  const springStartX = wallX;
  const springEndX = massLeft;
  const springLength = Math.max(25, springEndX - springStartX);
  const coilCount = 14;
  const coilRadius = 14;

  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(springStartX, springStartY);

  // Initial straight segment
  const leadIn = 12;
  ctx.lineTo(springStartX + leadIn, springStartY);

  const activeSpringLen = springLength - leadIn * 2;
  const stepX = activeSpringLen / coilCount;

  for (let i = 0; i < coilCount; i++) {
    const cx1 = springStartX + leadIn + (i + 0.25) * stepX;
    const cy1 = springStartY - coilRadius;
    const cx2 = springStartX + leadIn + (i + 0.75) * stepX;
    const cy2 = springStartY + coilRadius;
    ctx.lineTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
  }

  ctx.lineTo(springEndX - leadIn, springStartY);
  ctx.lineTo(springEndX, springStartY);
  ctx.stroke();

  // Spring label
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`k = ${params.springConstant.toFixed(0)} N/m`, springStartX + springLength * 0.45, springStartY - coilRadius - 6);
  ctx.restore();

  // 7. Viscous Damper (Dashpot) (parallel underneath spring)
  const damperY = centerY + 24;
  const damperCylinderLen = 70;
  const damperStartX = wallX;
  const damperRodStartX = damperStartX + damperCylinderLen * 0.6;
  const damperRodEndX = massLeft;

  ctx.save();
  // Fixed cylinder attached to wall
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;

  // Mounting rod to wall
  ctx.beginPath();
  ctx.moveTo(damperStartX, damperY);
  ctx.lineTo(damperStartX + 12, damperY);
  ctx.stroke();

  // Outer fluid housing cylinder
  ctx.fillStyle = 'rgba(167, 139, 250, 0.15)';
  ctx.fillRect(damperStartX + 12, damperY - 8, damperCylinderLen, 16);
  ctx.strokeRect(damperStartX + 12, damperY - 8, damperCylinderLen, 16);

  // Damping Fluid
  ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
  ctx.fillRect(damperStartX + 14, damperY - 6, damperCylinderLen - 4, 12);

  // Moving Piston rod attached to mass
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(damperRodEndX, damperY);
  const pistonHeadX = Math.max(damperStartX + 18, Math.min(damperStartX + damperCylinderLen + 4, damperStartX + 42 + state.displacement * 25));
  ctx.lineTo(pistonHeadX, damperY);
  ctx.stroke();

  // Piston head inside cylinder
  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(pistonHeadX - 3, damperY - 6, 6, 12);

  // Damper label
  ctx.fillStyle = '#a78bfa';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`c = ${params.dampingCoefficient.toFixed(2)} N·s/m`, damperStartX + damperCylinderLen * 0.6, damperY + 20);
  ctx.restore();

  // 8. Mass Block
  ctx.save();
  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  // Mass body gradient
  const massGrad = ctx.createLinearGradient(massLeft, massTop, massLeft + massSize, massTop + massSize);
  massGrad.addColorStop(0, '#1e293b');
  massGrad.addColorStop(0.5, '#0f172a');
  massGrad.addColorStop(1, '#020617');

  ctx.fillStyle = massGrad;
  ctx.fillRect(massLeft, massTop, massSize, massSize);

  // Border highlight
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(massLeft, massTop, massSize, massSize);

  // Wheels / Low friction pads under mass
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(massLeft + 12, trackY - 3, 4, 0, Math.PI * 2);
  ctx.arc(massLeft + massSize - 12, trackY - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Mass Labels & Telemetry
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${params.mass.toFixed(1)} kg`, massCenterX, massTop + massSize * 0.42);

  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`x: ${state.displacement >= 0 ? '+' : ''}${state.displacement.toFixed(3)}m`, massCenterX, massTop + massSize * 0.72);
  ctx.restore();

  // 9. Periodic External Driving Force Vector Arrow & Crank
  ctx.save();
  const Fdrive = state.drivingForce; // F_0 sin(ω_d t)
  const maxArrowLen = 65;
  const arrowScale = params.drivingForceAmplitude > 0 ? maxArrowLen / params.drivingForceAmplitude : 0;
  const arrowLen = Fdrive * arrowScale;

  const arrowY = massTop - 20;

  // Center point on mass top
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(massCenterX, arrowY, 3, 0, Math.PI * 2);
  ctx.fill();

  if (Math.abs(arrowLen) > 3) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(massCenterX, arrowY);
    ctx.lineTo(massCenterX + arrowLen, arrowY);
    ctx.stroke();

    // Arrowhead
    const dir = Math.sign(arrowLen);
    const headX = massCenterX + arrowLen;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(headX, arrowY);
    ctx.lineTo(headX - dir * 8, arrowY - 5);
    ctx.lineTo(headX - dir * 8, arrowY + 5);
    ctx.closePath();
    ctx.fill();
  }

  // Driving force label
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    `F_drive = ${Fdrive >= 0 ? '+' : ''}${Fdrive.toFixed(2)} N`,
    massCenterX,
    arrowY - 12
  );
  ctx.restore();

  // 10. Velocity Vector Arrow
  ctx.save();
  const v = state.velocity;
  const vArrowLen = Math.max(-55, Math.min(55, v * 35));
  if (Math.abs(vArrowLen) > 3) {
    const vY = massTop + massSize + 22;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(massCenterX, vY);
    ctx.lineTo(massCenterX + vArrowLen, vY);
    ctx.stroke();

    const dir = Math.sign(vArrowLen);
    const vHeadX = massCenterX + vArrowLen;
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(vHeadX, vY);
    ctx.lineTo(vHeadX - dir * 6, vY - 3.5);
    ctx.lineTo(vHeadX - dir * 6, vY + 3.5);
    ctx.closePath();
    ctx.fill();

    ctx.font = '9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`v = ${v >= 0 ? '+' : ''}${v.toFixed(2)} m/s`, massCenterX, vY + 14);
  }
  ctx.restore();

  // 11. Rotating Motor / Eccentric Crank Visualizer (Right Support)
  ctx.save();
  const motorX = width - 75;
  const motorY = centerY - 15;
  const motorRadius = 24;

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(motorX, motorY, motorRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rotating crank arm representing periodic driving phase ω_d t
  const omegaD = 2 * Math.PI * params.drivingFrequencyHz;
  const crankAngle = omegaD * state.time;
  const pinX = motorX + Math.cos(crankAngle) * (motorRadius - 6);
  const pinY = motorY + Math.sin(crankAngle) * (motorRadius - 6);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(motorX, motorY);
  ctx.lineTo(pinX, pinY);
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Driver Motor', motorX, motorY + motorRadius + 15);
  ctx.fillText(`f_d = ${params.drivingFrequencyHz.toFixed(2)} Hz`, motorX, motorY + motorRadius + 27);
  ctx.restore();
}
