/**
 * EQUATION 1 — Simple Harmonic Motion Canvas Renderer
 * High-DPI interactive scientific rendering of Horizontal Spring, Vertical Spring,
 * and Simple Pendulum with dynamic vectors, equilibrium references, and smooth animations.
 */

import { SHMParameters, SHMState, SHMDerivedValues, SHMVectorDisplayOptions } from '../physics/shm/types';

export interface SHMDragInfo {
  isDragging: boolean;
  systemType: 'horizontal-spring' | 'vertical-spring' | 'pendulum';
  startCoord: number;
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  lineWidth = 2.5,
  arrowSize = 8
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  // Draw main shaft
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle - Math.PI / 6),
    toY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle + Math.PI / 6),
    toY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a realistic helical spring with depth/shading between (x1, y1) and (x2, y2).
 */
export function drawHelicalSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  coils: number,
  coilRadius: number,
  wireColor = '#38bdf8'
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 10) return;

  const angle = Math.atan2(dy, dx);
  const perpAngle = angle + Math.PI / 2;

  ctx.save();
  ctx.translate(x1, y1);
  ctx.rotate(angle);

  // Lead-in and lead-out segments
  const leadLength = Math.min(25, dist * 0.1);
  const activeDist = dist - 2 * leadLength;
  const totalTurns = Math.max(5, coils);
  const segmentLength = activeDist / (totalTurns * 2);

  ctx.strokeStyle = wireColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Lead-in
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(leadLength, 0);

  // Helical zigzag / wave coils
  for (let i = 0; i < totalTurns * 2; i++) {
    const progressX = leadLength + (i + 0.5) * segmentLength;
    const sign = i % 2 === 0 ? 1 : -1;
    const offsetY = sign * coilRadius;

    // Use smooth curve
    const prevX = leadLength + i * segmentLength;
    const prevY = i === 0 ? 0 : (i % 2 === 1 ? coilRadius : -coilRadius);
    const midX = (prevX + progressX) / 2;

    ctx.quadraticCurveTo(midX, offsetY * 1.05, progressX, offsetY);
  }

  // Final coil to lead-out
  ctx.quadraticCurveTo(
    dist - leadLength * 0.5,
    0,
    dist - leadLength,
    0
  );
  ctx.lineTo(dist, 0);
  ctx.stroke();

  // Subtle metallic highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the fixed support wall with mechanical diagonal cross-hatching.
 */
function drawSupportWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  orientation: 'left' | 'top'
) {
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Border highlight
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (orientation === 'left') {
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + h);
  } else {
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
  }
  ctx.stroke();

  // Cross hatching
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  const step = 10;
  if (orientation === 'left') {
    for (let py = y - w; py < y + h; py += step) {
      ctx.beginPath();
      ctx.moveTo(x, Math.max(y, py));
      ctx.lineTo(Math.min(x + w, x + py - y + w), Math.min(y + h, py + w));
      ctx.stroke();
    }
  } else {
    for (let px = x - h; px < x + w; px += step) {
      ctx.beginPath();
      ctx.moveTo(Math.max(x, px), y);
      ctx.lineTo(Math.min(x + w, px + h), Math.min(y + h, y + px - x + h));
      ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Main render function for the Simple Harmonic Motion Canvas.
 */
export function renderSHMCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  params: SHMParameters,
  derived: SHMDerivedValues,
  state: SHMState,
  options: SHMVectorDisplayOptions,
  isDragging = false
): { massBounds?: { x: number; y: number; w: number; h: number; center: { x: number; y: number } } } {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Deep scientific laboratory background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  bgGrad.addColorStop(0, '#070b13');
  bgGrad.addColorStop(1, '#05070c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Subtle coordinate grid if enabled
  if (options.showGrid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (params.systemType === 'horizontal-spring') {
    return renderHorizontalSpring(
      ctx,
      canvasWidth,
      canvasHeight,
      params,
      derived,
      state,
      options,
      isDragging
    );
  } else if (params.systemType === 'vertical-spring') {
    return renderVerticalSpring(
      ctx,
      canvasWidth,
      canvasHeight,
      params,
      derived,
      state,
      options,
      isDragging
    );
  } else {
    return renderSimplePendulum(
      ctx,
      canvasWidth,
      canvasHeight,
      params,
      derived,
      state,
      options,
      isDragging
    );
  }
}

/**
 * Render 1: Horizontal Mass-Spring System
 */
function renderHorizontalSpring(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: SHMParameters,
  derived: SHMDerivedValues,
  state: SHMState,
  options: SHMVectorDisplayOptions,
  isDragging: boolean
) {
  const wallX = 60;
  const wallWidth = 24;
  const centerY = height * 0.52;
  const trackHeight = 12;
  const trackY = centerY + 35;

  // Horizontal track / floor
  ctx.save();
  ctx.fillStyle = '#090d16';
  ctx.fillRect(wallX, trackY, width - wallX - 30, trackHeight);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(wallX, trackY, width - wallX - 30, trackHeight);

  // Ruler tick marks along track
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let rx = wallX + 20; rx < width - 40; rx += 25) {
    ctx.beginPath();
    ctx.moveTo(rx, trackY);
    ctx.lineTo(rx, trackY + 4);
    ctx.stroke();
  }
  ctx.restore();

  // Draw Support Wall on left
  drawSupportWall(ctx, wallX - wallWidth, centerY - 90, wallWidth, 160, 'left');

  // Coordinate mapping:
  // Let equilibrium position be at centerX
  const equilibriumX = width * 0.52;
  // Determine pixel scale: max amplitude ~0.5m maps to width * 0.35
  const maxVisualRange = Math.max(0.35, derived.effectiveAmplitude * 1.5);
  const pxPerMeter = (width * 0.32) / maxVisualRange;

  const currentMassCenterX = equilibriumX + state.displacement * pxPerMeter;
  const massWidth = 64;
  const massHeight = 56;
  const massLeft = currentMassCenterX - massWidth / 2;
  const massTop = trackY - massHeight;

  // Amplitude boundaries (-A and +A)
  if (options.showAmplitudeBounds && derived.effectiveAmplitude > 0.005) {
    const leftBoundX = equilibriumX - derived.effectiveAmplitude * pxPerMeter;
    const rightBoundX = equilibriumX + derived.effectiveAmplitude * pxPerMeter;

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;

    // -A line
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)'; // Purple
    ctx.beginPath();
    ctx.moveTo(leftBoundX, centerY - 70);
    ctx.lineTo(leftBoundX, trackY + 25);
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('-A', leftBoundX, centerY - 78);
    ctx.fillText(`-${derived.effectiveAmplitude.toFixed(2)}m`, leftBoundX, trackY + 38);

    // +A line
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.beginPath();
    ctx.moveTo(rightBoundX, centerY - 70);
    ctx.lineTo(rightBoundX, trackY + 25);
    ctx.stroke();

    ctx.fillText('+A', rightBoundX, centerY - 78);
    ctx.fillText(`+${derived.effectiveAmplitude.toFixed(2)}m`, rightBoundX, trackY + 38);

    ctx.restore();
  }

  // Equilibrium Line (x = 0)
  if (options.showEquilibriumMarker) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)'; // Cyan
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(equilibriumX, centerY - 85);
    ctx.lineTo(equilibriumX, trackY + 25);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Equilibrium (x = 0)', equilibriumX, centerY - 95);
    ctx.fillText('0.00m', equilibriumX, trackY + 38);
    ctx.restore();
  }

  // Draw the spring: from wall to left edge of mass
  const springAttachWallX = wallX;
  const springAttachWallY = trackY - massHeight / 2;
  const springAttachMassX = massLeft;
  const springAttachMassY = springAttachWallY;

  const coilCount = Math.max(8, Math.round(12 * (params.springConstant / 20)));
  drawHelicalSpring(
    ctx,
    springAttachWallX,
    springAttachWallY,
    springAttachMassX,
    springAttachMassY,
    coilCount,
    18,
    '#38bdf8'
  );

  // Draw Mass Block
  ctx.save();
  // Drag highlight glow
  if (isDragging) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
  }

  // Block gradient
  const blockGrad = ctx.createLinearGradient(massLeft, massTop, massLeft, massTop + massHeight);
  blockGrad.addColorStop(0, '#1e293b');
  blockGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = blockGrad;
  ctx.strokeStyle = isDragging ? '#38bdf8' : '#475569';
  ctx.lineWidth = isDragging ? 2.5 : 2;

  // Rounded rectangle
  const radius = 6;
  ctx.beginPath();
  ctx.roundRect(massLeft, massTop, massWidth, massHeight, radius);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Wheels / glide pads underneath
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(massLeft + 14, trackY - 3, 3, 0, Math.PI * 2);
  ctx.arc(massLeft + massWidth - 14, trackY - 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Mass Label inside block
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${params.mass.toFixed(1)} kg`, currentMassCenterX, massTop + massHeight * 0.42);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('m', currentMassCenterX, massTop + massHeight * 0.72);

  // Hook bracket on left of block
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(massLeft, springAttachMassY, 4, -Math.PI / 2, Math.PI / 2, true);
  ctx.stroke();

  ctx.restore();

  // Instantaneous Displacement Dimension Line
  if (Math.abs(state.displacement) > 0.005) {
    ctx.save();
    const dimY = massTop - 18;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;

    // Horizontal dimension line with arrows
    drawArrow(
      ctx,
      equilibriumX,
      dimY,
      currentMassCenterX,
      dimY,
      '#93c5fd',
      1.5,
      6
    );

    // Dimension label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    const dispLabel = `x = ${state.displacement >= 0 ? '+' : ''}${state.displacement.toFixed(3)} m`;
    ctx.fillText(dispLabel, (equilibriumX + currentMassCenterX) / 2, dimY - 7);
    ctx.restore();
  }

  // Dynamic Vectors
  const vectorOriginX = currentMassCenterX;
  const vectorOriginY = massTop - 38;

  // 1. Velocity Vector v(t) (Cyan)
  if (options.showVelocityVector && Math.abs(state.velocity) > 0.01) {
    const vScale = 45 / (derived.vMax || 1);
    const vDx = state.velocity * vScale;
    drawArrow(
      ctx,
      vectorOriginX,
      vectorOriginY,
      vectorOriginX + vDx,
      vectorOriginY,
      '#06b6d4', // Cyan
      2.5,
      7
    );

    ctx.save();
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = vDx >= 0 ? 'left' : 'right';
    ctx.fillText(
      `v = ${state.velocity >= 0 ? '+' : ''}${state.velocity.toFixed(2)} m/s`,
      vectorOriginX + vDx + (vDx >= 0 ? 6 : -6),
      vectorOriginY - 4
    );
    ctx.restore();
  }

  // 2. Restoring Force Vector F(t) = -kx (Rose / Red)
  if (options.showForceVector && Math.abs(state.restoringForce) > 0.05) {
    const fScale = 45 / (derived.fMax || 1);
    const fDx = state.restoringForce * fScale;
    const forceY = vectorOriginY - 20;

    drawArrow(
      ctx,
      vectorOriginX,
      forceY,
      vectorOriginX + fDx,
      forceY,
      '#f43f5e', // Rose
      2.5,
      7
    );

    ctx.save();
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = fDx >= 0 ? 'left' : 'right';
    ctx.fillText(
      `F = ${state.restoringForce >= 0 ? '+' : ''}${state.restoringForce.toFixed(1)} N`,
      vectorOriginX + fDx + (fDx >= 0 ? 6 : -6),
      forceY - 4
    );
    ctx.restore();
  }

  // 3. Acceleration Vector a(t) = -ω²x (Amber)
  if (options.showAccelerationVector && Math.abs(state.acceleration) > 0.05) {
    const aScale = 45 / (derived.aMax || 1);
    const aDx = state.acceleration * aScale;
    const accY = vectorOriginY - 40;

    drawArrow(
      ctx,
      vectorOriginX,
      accY,
      vectorOriginX + aDx,
      accY,
      '#f59e0b', // Amber
      2.5,
      7
    );

    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = aDx >= 0 ? 'left' : 'right';
    ctx.fillText(
      `a = ${state.acceleration >= 0 ? '+' : ''}${state.acceleration.toFixed(2)} m/s²`,
      vectorOriginX + aDx + (aDx >= 0 ? 6 : -6),
      accY - 4
    );
    ctx.restore();
  }

  // Drag invitation cue
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Interactive: Drag mass to set initial displacement x₀', 20, height - 16);
  ctx.restore();

  return {
    massBounds: {
      x: massLeft,
      y: massTop,
      w: massWidth,
      h: massHeight,
      center: { x: currentMassCenterX, y: massTop + massHeight / 2 },
    },
  };
}

/**
 * Render 2: Vertical Mass-Spring System
 */
function renderVerticalSpring(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: SHMParameters,
  derived: SHMDerivedValues,
  state: SHMState,
  options: SHMVectorDisplayOptions,
  isDragging: boolean
) {
  const centerX = width * 0.45;
  const ceilingY = 50;
  const ceilingWidth = 140;
  const ceilingHeight = 18;

  // Ceiling support at top
  drawSupportWall(ctx, centerX - ceilingWidth / 2, ceilingY - ceilingHeight, ceilingWidth, ceilingHeight, 'top');

  // Scale mapping
  // Natural length of spring (visual baseline)
  const naturalSpringLength = 90;
  const naturalEquilibriumY = ceilingY + naturalSpringLength;

  // Static extension ΔL = mg / k
  const maxSpanMeters = Math.max(0.6, derived.staticExtension + derived.effectiveAmplitude * 1.5);
  const pxPerMeter = (height * 0.48) / maxSpanMeters;

  const staticExtensionPx = derived.staticExtension * pxPerMeter;
  const staticEquilibriumY = naturalEquilibriumY + staticExtensionPx;
  const oscillationOffsetPx = state.displacement * pxPerMeter;
  const currentMassY = staticEquilibriumY + oscillationOffsetPx;

  const massWidth = 60;
  const massHeight = 50;
  const massLeft = centerX - massWidth / 2;
  const massTop = currentMassY;

  // 1. Natural Length reference line (unstretched)
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(centerX - 100, naturalEquilibriumY);
  ctx.lineTo(centerX + 180, naturalEquilibriumY);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Unstretched Spring (y = 0)', centerX + 90, naturalEquilibriumY - 6);
  ctx.restore();

  // 2. Static Equilibrium Line: shifted by ΔL = mg/k
  if (options.showEquilibriumMarker) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, staticEquilibriumY);
    ctx.lineTo(centerX + 180, staticEquilibriumY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Equilibrium: ΔL = mg/k = ${(derived.staticExtension * 100).toFixed(1)} cm`,
      centerX + 90,
      staticEquilibriumY - 6
    );
    ctx.restore();
  }

  // 3. Amplitude boundaries around static equilibrium
  if (options.showAmplitudeBounds && derived.effectiveAmplitude > 0.005) {
    const topBoundY = staticEquilibriumY - derived.effectiveAmplitude * pxPerMeter;
    const botBoundY = staticEquilibriumY + derived.effectiveAmplitude * pxPerMeter;

    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;

    // Top bound (-A)
    ctx.beginPath();
    ctx.moveTo(centerX - 80, topBoundY);
    ctx.lineTo(centerX + 70, topBoundY);
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('-A', centerX - 90, topBoundY + 4);

    // Bottom bound (+A)
    ctx.beginPath();
    ctx.moveTo(centerX - 80, botBoundY);
    ctx.lineTo(centerX + 70, botBoundY);
    ctx.stroke();

    ctx.fillText('+A', centerX - 90, botBoundY + 4);
    ctx.restore();
  }

  // Draw Vertical Helical Spring
  const coilCount = Math.max(9, Math.round(14 * (params.springConstant / 20)));
  drawHelicalSpring(
    ctx,
    centerX,
    ceilingY,
    centerX,
    massTop,
    coilCount,
    16,
    '#38bdf8'
  );

  // Draw Hanging Mass Block
  ctx.save();
  if (isDragging) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
  }

  const blockGrad = ctx.createLinearGradient(massLeft, massTop, massLeft, massTop + massHeight);
  blockGrad.addColorStop(0, '#1e293b');
  blockGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = blockGrad;
  ctx.strokeStyle = isDragging ? '#38bdf8' : '#475569';
  ctx.lineWidth = isDragging ? 2.5 : 2;

  ctx.beginPath();
  ctx.roundRect(massLeft, massTop, massWidth, massHeight, 6);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Mass Hook on top
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, massTop, 5, 0, Math.PI, true);
  ctx.stroke();

  // Mass label
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${params.mass.toFixed(1)} kg`, centerX, massTop + massHeight * 0.45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('m', centerX, massTop + massHeight * 0.75);

  ctx.restore();

  // Dimension bracket showing static extension ΔL from unstretched to equilibrium
  ctx.save();
  const bracketX = centerX - 120;
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(bracketX, naturalEquilibriumY);
  ctx.lineTo(bracketX - 6, naturalEquilibriumY);
  ctx.moveTo(bracketX - 3, naturalEquilibriumY);
  ctx.lineTo(bracketX - 3, staticEquilibriumY);
  ctx.moveTo(bracketX, staticEquilibriumY);
  ctx.lineTo(bracketX - 6, staticEquilibriumY);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ΔL = mg/k', bracketX - 10, (naturalEquilibriumY + staticEquilibriumY) / 2 + 4);
  ctx.restore();

  // Dynamic Vectors on Vertical Spring
  const vectorOriginX = massLeft + massWidth + 24;
  const vectorOriginY = massTop + massHeight / 2;

  // 1. Velocity Vector (Cyan)
  if (options.showVelocityVector && Math.abs(state.velocity) > 0.01) {
    const vScale = 45 / (derived.vMax || 1);
    const vDy = state.velocity * vScale;
    drawArrow(
      ctx,
      vectorOriginX,
      vectorOriginY,
      vectorOriginX,
      vectorOriginY + vDy,
      '#06b6d4',
      2.5,
      7
    );

    ctx.save();
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `v = ${state.velocity >= 0 ? '+' : ''}${state.velocity.toFixed(2)} m/s`,
      vectorOriginX + 12,
      vectorOriginY + vDy / 2
    );
    ctx.restore();
  }

  // 2. Net Restoring Force relative to equilibrium (Rose)
  if (options.showForceVector && Math.abs(state.restoringForce) > 0.05) {
    const fScale = 45 / (derived.fMax || 1);
    const fDy = state.restoringForce * fScale;
    const forceX = vectorOriginX + 75;

    drawArrow(
      ctx,
      forceX,
      vectorOriginY,
      forceX,
      vectorOriginY + fDy,
      '#f43f5e',
      2.5,
      7
    );

    ctx.save();
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `F_net = ${state.restoringForce >= 0 ? '+' : ''}${state.restoringForce.toFixed(1)} N`,
      forceX + 10,
      vectorOriginY + fDy / 2
    );
    ctx.restore();
  }

  // Educational note on vertical spring
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    'Gravity shifts equilibrium by ΔL = mg/k; small-oscillation period T = 2π√(m/k) remains identical!',
    20,
    height - 16
  );
  ctx.restore();

  return {
    massBounds: {
      x: massLeft,
      y: massTop,
      w: massWidth,
      h: massHeight,
      center: { x: centerX, y: massTop + massHeight / 2 },
    },
  };
}

/**
 * Render 3: Simple Pendulum Mode
 */
function renderSimplePendulum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: SHMParameters,
  derived: SHMDerivedValues,
  state: SHMState,
  options: SHMVectorDisplayOptions,
  isDragging: boolean
) {
  const pivotX = width * 0.5;
  const pivotY = 70;

  // Top mount support
  drawSupportWall(ctx, pivotX - 60, pivotY - 20, 120, 20, 'top');

  // Pendulum length mapping
  // Map L (0.2 to 3.0m) to visual pixels (140 to 240px)
  const visualLength = 170 * (params.pendulumLength / 1.0);
  const angleRad = state.pendulumAngleRad ?? 0;

  const bobX = pivotX + visualLength * Math.sin(angleRad);
  const bobY = pivotY + visualLength * Math.cos(angleRad);
  const bobRadius = 18;

  // 1. Plumb Vertical Equilibrium Line (θ = 0)
  if (options.showEquilibriumMarker) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + visualLength + 35);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Equilibrium (θ = 0°)', pivotX, pivotY + visualLength + 50);
    ctx.restore();
  }

  // 2. Trajectory Arc
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([2, 4]);
  const maxTheta = derived.effectiveAmplitude;
  ctx.beginPath();
  ctx.arc(
    pivotX,
    pivotY,
    visualLength,
    Math.PI / 2 - maxTheta - 0.05,
    Math.PI / 2 + maxTheta + 0.05
  );
  ctx.stroke();
  ctx.restore();

  // 3. Angular arc at pivot
  if (Math.abs(angleRad) > 0.02) {
    ctx.save();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    const arcRadius = 40;
    const startA = Math.PI / 2;
    const endA = Math.PI / 2 + angleRad;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, arcRadius, Math.min(startA, endA), Math.max(startA, endA));
    ctx.stroke();

    ctx.fillStyle = '#e9d5ff';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = angleRad >= 0 ? 'left' : 'right';
    const angleDegStr = `${(angleRad * 180 / Math.PI).toFixed(1)}°`;
    ctx.fillText(angleDegStr, pivotX + (angleRad >= 0 ? arcRadius + 6 : -arcRadius - 6), pivotY + 36);
    ctx.restore();
  }

  // 4. Pendulum Rod / String
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Pivot Bearing
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. Pendulum Bob
  ctx.save();
  if (isDragging) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
  }

  // 3D Spherical metallic radial gradient
  const sphereGrad = ctx.createRadialGradient(
    bobX - bobRadius * 0.35,
    bobY - bobRadius * 0.35,
    bobRadius * 0.1,
    bobX,
    bobY,
    bobRadius
  );
  sphereGrad.addColorStop(0, '#38bdf8');
  sphereGrad.addColorStop(0.4, '#0284c7');
  sphereGrad.addColorStop(1, '#082f49');

  ctx.fillStyle = sphereGrad;
  ctx.strokeStyle = isDragging ? '#7dd3fc' : '#0369a1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Bob mass label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${params.mass.toFixed(1)}kg`, bobX, bobY);
  ctx.restore();

  // 6. Tangential Velocity Vector
  if (options.showVelocityVector && Math.abs(state.velocity) > 0.01) {
    const vScale = 35 / (derived.vMax || 1);
    // Tangent angle is angleRad + PI
    const tangentAngle = angleRad; // Direction perpendicular to rod
    const vLength = state.velocity * vScale;
    const vX = bobX + vLength * Math.cos(tangentAngle);
    const vY = bobY - vLength * Math.sin(tangentAngle);

    drawArrow(ctx, bobX, bobY, vX, vY, '#06b6d4', 2.5, 7);

    ctx.save();
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`v = ${state.velocity.toFixed(2)} m/s`, vX + 6, vY);
    ctx.restore();
  }

  // 7. Restoring Tangential Force Vector
  if (options.showForceVector && Math.abs(state.restoringForce) > 0.05) {
    const fScale = 35 / (derived.fMax || 1);
    const tangentAngle = angleRad;
    const fLength = state.restoringForce * fScale;
    const fX = bobX + fLength * Math.cos(tangentAngle);
    const fY = bobY - fLength * Math.sin(tangentAngle);

    drawArrow(ctx, bobX, bobY, fX, fY, '#f43f5e', 2.5, 7);

    ctx.save();
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`F_t = ${state.restoringForce.toFixed(1)} N`, fX + 6, fY);
    ctx.restore();
  }

  // Small angle warning / validation notice
  ctx.save();
  ctx.fillStyle = derived.isPendulumSmallAngleValid ? '#64748b' : '#f59e0b';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  const smallAngleText = derived.isPendulumSmallAngleValid
    ? 'Small-angle approximation sin(θ) ≈ θ holds (θ ≤ 15°): linear SHM T = 2π√(L/g)'
    : 'Notice: For larger angles (θ > 15°), true pendulum period exceeds the ideal SHM approximation!';
  ctx.fillText(smallAngleText, 20, height - 16);
  ctx.restore();

  return {
    massBounds: {
      x: bobX - bobRadius,
      y: bobY - bobRadius,
      w: bobRadius * 2,
      h: bobRadius * 2,
      center: { x: bobX, y: bobY },
    },
  };
}
