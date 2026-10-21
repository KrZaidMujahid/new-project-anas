/**
 * EQUATION 1 — Inclined Plane Canvas Visualization Engine
 * Renders high-DPI 2D inclined plane wedge, sliding block, free-body diagram vectors, and calipers.
 */

import {
  InclineParameters,
  InclineState,
  InclineVectorOptions,
} from '../physics/incline/types';

export class InclineCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Could not obtain 2D rendering context');
    }
    this.ctx = context;
  }

  public render(
    params: InclineParameters,
    state: InclineState,
    vectorOpts: InclineVectorOptions,
    trailPositions: number[] = []
  ): void {
    const { ctx, width, height } = this.setupContext();

    // Background fill
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, width, height);

    // Compute geometry & scaling
    const thetaRad = (params.angleDeg * Math.PI) / 180;
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);

    const groundY = height * 0.78;
    const originX = width * 0.12;

    // Available space
    const availWidth = width * 0.72;
    const availHeight = height * 0.62;

    const rampLengthMeters = params.rampLength;
    const scaleX = availWidth / Math.max(1, rampLengthMeters * cosTheta + 3);
    const scaleY = availHeight / Math.max(1, rampLengthMeters * sinTheta + 2);
    const scale = Math.min(36, Math.max(12, Math.min(scaleX, scaleY)));

    const rampScreenLength = rampLengthMeters * scale;
    const wedgeBaseWidth = rampScreenLength * cosTheta;
    const wedgeHeight = rampScreenLength * sinTheta;

    const vBottomX = originX;
    const vBottomY = groundY;

    const vTopX = vBottomX + wedgeBaseWidth;
    const vTopY = vBottomY - wedgeHeight;

    const vCornerX = vTopX;
    const vCornerY = vBottomY;

    // 1. Draw horizontal ground line and background grid
    this.drawBackgroundGrid(ctx, width, height, groundY);

    // 2. Draw the Inclined Wedge
    this.drawWedge(
      ctx,
      vBottomX,
      vBottomY,
      vTopX,
      vTopY,
      vCornerX,
      vCornerY,
      params,
      scale
    );

    // 3. Draw Angle Arc & Calipers
    if (vectorOpts.showAngleArc && params.angleDeg > 1) {
      this.drawAngleArc(ctx, vBottomX, vBottomY, params.angleDeg, scale);
    }
    this.drawCalipers(
      ctx,
      vBottomX,
      vBottomY,
      vTopX,
      vTopY,
      vCornerX,
      vCornerY,
      wedgeHeight / scale,
      wedgeBaseWidth / scale
    );

    // 4. Motion Trails / Ghosts
    if (vectorOpts.showMotionTrail && trailPositions.length > 1) {
      this.drawMotionTrail(
        ctx,
        vBottomX,
        vBottomY,
        cosTheta,
        sinTheta,
        scale,
        trailPositions,
        params
      );
    }

    // 5. Compute Block Position & Center of Mass
    const blockMass = params.mass;
    const blockWidth = Math.min(70, Math.max(46, 38 + Math.sqrt(blockMass) * 6));
    const blockHeight = blockWidth * 0.72;

    // Position along ramp (s: meters from bottom)
    const clampedPos = Math.max(0, Math.min(params.rampLength, state.position));
    const blockDistPx = clampedPos * scale;

    const blockSurfaceX = vBottomX + blockDistPx * cosTheta;
    const blockSurfaceY = vBottomY - blockDistPx * sinTheta;

    // Normal unit vector away from surface: (-sinTheta, -cosTheta)
    const normX = -sinTheta;
    const normY = -cosTheta;

    // Tangent unit vector up the ramp: (+cosTheta, -sinTheta)
    const tangX = cosTheta;
    const tangY = -sinTheta;

    // Center of Mass (COM)
    const comX = blockSurfaceX + (blockHeight / 2) * normX;
    const comY = blockSurfaceY + (blockHeight / 2) * normY;

    // 6. Draw the sliding block
    this.drawBlock(
      ctx,
      comX,
      comY,
      blockWidth,
      blockHeight,
      thetaRad,
      params.mass,
      state.motionState
    );

    // 7. Free-Body Diagram Vectors
    this.drawVectors(
      ctx,
      comX,
      comY,
      tangX,
      tangY,
      normX,
      normY,
      params,
      state,
      vectorOpts
    );

    // 8. Tilted Coordinate HUD & Status
    this.drawHUD(ctx, width, height, tangX, tangY, normX, normY, state, params);

    ctx.restore();
  }

  private setupContext(): {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
  } {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
    }

    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    return { ctx: this.ctx, width, height };
  }

  private drawBackgroundGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundY: number
  ): void {
    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;

    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Ground platform line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Ground cross-hatching
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 10; x < width; x += 25) {
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 12, groundY + 14);
    }
    ctx.stroke();
  }

  private drawWedge(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    tx: number,
    ty: number,
    cx: number,
    cy: number,
    params: InclineParameters,
    scale: number
  ): void {
    // Wedge body
    const gradient = ctx.createLinearGradient(bx, ty, cx, by);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#070d18');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(tx, ty);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();

    // Subtle internal structural hatching
    ctx.save();
    ctx.clip(); // clip to wedge triangle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = bx - 100; x < cx + 200; x += 30) {
      ctx.moveTo(x, ty - 50);
      ctx.lineTo(x + 150, by + 50);
    }
    ctx.stroke();
    ctx.restore();

    // Wedge outline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Highlight ramp surface (the incline hypotenuse)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Distance tick marks along the ramp
    const thetaRad = (params.angleDeg * Math.PI) / 180;
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);
    const normX = -sinTheta;
    const normY = -cosTheta;

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tickInterval = params.rampLength > 15 ? 5 : 2;
    for (let s = 0; s <= params.rampLength; s += tickInterval) {
      const px = bx + s * scale * cosTheta;
      const py = by - s * scale * sinTheta;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - normX * 6, py - normY * 6);
      ctx.stroke();

      if (s > 0 && s < params.rampLength) {
        ctx.fillText(`${s}m`, px - normX * 14, py - normY * 14);
      }
    }

    // End-stop bumpers
    // Bottom bumper at (bx, by)
    ctx.fillStyle = '#475569';
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-thetaRad);
    ctx.fillRect(-6, -18, 6, 20);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -18, 6, 20);
    ctx.restore();

    // Top bumper at (tx, ty)
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(-thetaRad);
    ctx.fillRect(0, -18, 6, 20);
    ctx.strokeRect(0, -18, 6, 20);
    ctx.restore();
  }

  private drawAngleArc(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    angleDeg: number,
    scale: number
  ): void {
    const arcRadius = Math.min(65, Math.max(38, scale * 1.8));
    const angleRad = (angleDeg * Math.PI) / 180;

    // Dashed base reference line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + arcRadius + 20, by);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arc
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(bx, by, arcRadius, 0, -angleRad, true);
    ctx.stroke();

    // Angle text label
    const labelAngle = -angleRad / 2;
    const labelX = bx + (arcRadius + 16) * Math.cos(labelAngle);
    const labelY = by + (arcRadius + 16) * Math.sin(labelAngle);

    ctx.fillStyle = '#00e5ff';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`θ = ${angleDeg.toFixed(1)}°`, labelX, labelY);
  }

  private drawCalipers(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    tx: number,
    ty: number,
    cx: number,
    cy: number,
    heightMeters: number,
    baseMeters: number
  ): void {
    // Vertical height caliper on right side
    const offsetRight = 24;
    const calX = cx + offsetRight;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Top extension line
    ctx.moveTo(tx + 4, ty);
    ctx.lineTo(calX + 4, ty);
    // Bottom extension line
    ctx.moveTo(cx + 4, cy);
    ctx.lineTo(calX + 4, cy);
    // Vertical dimension line
    ctx.moveTo(calX, ty);
    ctx.lineTo(calX, cy);
    ctx.stroke();

    // Arrows
    this.drawArrowHead(ctx, calX, ty + 6, calX, ty, 5, 'rgba(148, 163, 184, 0.6)');
    this.drawArrowHead(ctx, calX, cy - 6, calX, cy, 5, 'rgba(148, 163, 184, 0.6)');

    // Height text
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(calX + 16, (ty + cy) / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`h = ${heightMeters.toFixed(2)} m`, 0, 0);
    ctx.restore();
  }

  private drawBlock(
    ctx: CanvasRenderingContext2D,
    comX: number,
    comY: number,
    w: number,
    h: number,
    thetaRad: number,
    mass: number,
    motionState: InclineState['motionState']
  ): void {
    ctx.save();
    ctx.translate(comX, comY);
    ctx.rotate(-thetaRad);

    // Dynamic glow depending on state
    if (motionState === 'moving-up') {
      ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
      ctx.shadowBlur = 12;
    } else if (motionState === 'moving-down') {
      ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
      ctx.shadowBlur = 12;
    } else if (motionState === 'stationary-equilibrium') {
      ctx.shadowColor = 'rgba(234, 179, 8, 0.3)';
      ctx.shadowBlur = 8;
    }

    // Block Body Gradient
    const blockGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    blockGrad.addColorStop(0, '#1e293b');
    blockGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = blockGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;

    const r = 5; // rounded corner radius
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, r);
    ctx.fill();
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // High-friction rubber pad on the bottom edge
    ctx.fillStyle = '#334155';
    ctx.fillRect(-w / 2 + 3, h / 2 - 3, w - 6, 3);

    // Center of mass dot
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Mass label text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${mass.toFixed(1)} kg`, 0, -3);

    ctx.restore();
  }

  private drawVectors(
    ctx: CanvasRenderingContext2D,
    comX: number,
    comY: number,
    tangX: number,
    tangY: number,
    normX: number,
    normY: number,
    params: InclineParameters,
    state: InclineState,
    vectorOpts: InclineVectorOptions
  ): void {
    // Vector scale factor: pixels per Newton
    const forceScale = 1.35;

    // 1. Weight Vector (W = mg straight down)
    if (vectorOpts.showWeightVector && state.weight > 0) {
      const wLen = Math.min(130, Math.max(25, state.weight * forceScale));
      const targetX = comX;
      const targetY = comY + wLen;
      this.drawArrow(
        ctx,
        comX,
        comY,
        targetX,
        targetY,
        '#06b6d4',
        2.5,
        vectorOpts.showForceValues ? `W = ${state.weight.toFixed(1)} N` : 'W'
      );
    }

    // 2. Gravity Components (Parallel and Perpendicular)
    if (vectorOpts.showGravityComponents) {
      // W_parallel: points DOWN the ramp (-tangent)
      if (state.gravityParallel > 0) {
        const parLen = Math.min(110, Math.max(18, state.gravityParallel * forceScale));
        const parX = comX - parLen * tangX;
        const parY = comY - parLen * tangY;
        this.drawArrow(
          ctx,
          comX,
          comY,
          parX,
          parY,
          '#38bdf8',
          1.8,
          vectorOpts.showForceValues
            ? `W∥ = ${state.gravityParallel.toFixed(1)} N`
            : 'W∥',
          [4, 3]
        );
      }

      // W_perpendicular: points INTO the ramp (-norm)
      if (state.gravityPerpendicular > 0) {
        const perpLen = Math.min(110, Math.max(18, state.gravityPerpendicular * forceScale));
        const perpX = comX - perpLen * normX;
        const perpY = comY - perpLen * normY;
        this.drawArrow(
          ctx,
          comX,
          comY,
          perpX,
          perpY,
          '#94a3b8',
          1.8,
          vectorOpts.showForceValues
            ? `W⊥ = ${state.gravityPerpendicular.toFixed(1)} N`
            : 'W⊥',
          [4, 3]
        );
      }
    }

    // 3. Normal Force (N = mg cos(θ) points perpendicularly OUT of ramp (+norm))
    if (vectorOpts.showNormalForce && state.normalForce > 0) {
      const nLen = Math.min(110, Math.max(18, state.normalForce * forceScale));
      const nX = comX + nLen * normX;
      const nY = comY + nLen * normY;
      this.drawArrow(
        ctx,
        comX,
        comY,
        nX,
        nY,
        '#f59e0b',
        2.4,
        vectorOpts.showForceValues ? `N = ${state.normalForce.toFixed(1)} N` : 'N'
      );
    }

    // 4. Applied Force
    if (vectorOpts.showAppliedForce && params.appliedForceMag > 0.05) {
      const appLen = Math.min(130, Math.max(20, params.appliedForceMag * forceScale));
      const dirMult = params.appliedForceDirection === 'up' ? 1 : -1;
      const appX = comX + appLen * dirMult * tangX;
      const appY = comY + appLen * dirMult * tangY;
      this.drawArrow(
        ctx,
        comX,
        comY,
        appX,
        appY,
        '#60a5fa',
        2.5,
        vectorOpts.showForceValues
          ? `F_app = ${params.appliedForceMag.toFixed(1)} N`
          : 'F_app'
      );
    }

    // 5. Friction Force
    if (
      vectorOpts.showFrictionForce &&
      params.frictionEnabled &&
      Math.abs(state.currentFrictionForce) > 0.05
    ) {
      const fMag = Math.abs(state.currentFrictionForce);
      const fLen = Math.min(100, Math.max(18, fMag * forceScale));
      const fSign = Math.sign(state.currentFrictionForce); // +1 up, -1 down
      const fX = comX + fLen * fSign * tangX;
      const fY = comY + fLen * fSign * tangY;
      const isStatic = state.frictionState === 'static-hold';
      this.drawArrow(
        ctx,
        comX,
        comY,
        fX,
        fY,
        '#f43f5e',
        2.3,
        vectorOpts.showForceValues
          ? `${isStatic ? 'fs' : 'fk'} = ${fMag.toFixed(1)} N`
          : isStatic
          ? 'fs'
          : 'fk'
      );
    }

    // 6. Net Force Vector
    if (vectorOpts.showNetForce && Math.abs(state.netForce) > 0.1) {
      const netMag = Math.abs(state.netForce);
      const netLen = Math.min(120, Math.max(18, netMag * forceScale));
      const netSign = Math.sign(state.netForce);
      const netX = comX + netLen * netSign * tangX;
      const netY = comY + netLen * netSign * tangY;
      this.drawArrow(
        ctx,
        comX,
        comY,
        netX,
        netY,
        '#10b981',
        2.8,
        vectorOpts.showForceValues
          ? `ΣF = ${state.netForce.toFixed(1)} N`
          : 'ΣF'
      );
    }

    // 7. Velocity Vector
    if (vectorOpts.showVelocityVector && Math.abs(state.velocity) > 0.05) {
      const vScale = 12;
      const vLen = Math.min(110, Math.max(20, Math.abs(state.velocity) * vScale));
      const vSign = Math.sign(state.velocity);
      const vX = comX + vLen * vSign * tangX;
      const vY = comY + vLen * vSign * tangY;
      this.drawArrow(
        ctx,
        comX,
        comY,
        vX,
        vY,
        '#22c55e',
        2.2,
        `v = ${state.velocity.toFixed(2)} m/s`
      );
    }

    // 8. Acceleration Vector
    if (vectorOpts.showAccelerationVector && Math.abs(state.acceleration) > 0.05) {
      const aScale = 10;
      const aLen = Math.min(100, Math.max(18, Math.abs(state.acceleration) * aScale));
      const aSign = Math.sign(state.acceleration);
      const aX = comX + aLen * aSign * tangX;
      const aY = comY + aLen * aSign * tangY;
      this.drawArrow(
        ctx,
        comX,
        comY,
        aX,
        aY,
        '#a855f7',
        2.2,
        `a = ${state.acceleration.toFixed(2)} m/s²`
      );
    }
  }

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    lineWidth: number,
    label?: string,
    dashPattern: number[] = []
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (dashPattern.length > 0) {
      ctx.setLineDash(dashPattern);
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.setLineDash([]);
    this.drawArrowHead(ctx, x1, y1, x2, y2, 8, color);

    if (label) {
      ctx.fillStyle = color;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Offset label slightly past arrow tip or to the side
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const uX = dx / len;
        const uY = dy / len;
        const perpX = -uY;
        const perpY = uX;
        const textX = x2 + uX * 12 + perpX * 8;
        const textY = y2 + uY * 12 + perpY * 8;
        ctx.fillText(label, textX, textY);
      }
    }

    ctx.restore();
  }

  private drawArrowHead(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number,
    color: string
  ): void {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - size * Math.cos(angle - Math.PI / 7),
      y2 - size * Math.sin(angle - Math.PI / 7)
    );
    ctx.lineTo(
      x2 - size * Math.cos(angle + Math.PI / 7),
      y2 - size * Math.sin(angle + Math.PI / 7)
    );
    ctx.closePath();
    ctx.fill();
  }

  private drawMotionTrail(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    cosTheta: number,
    sinTheta: number,
    scale: number,
    trailPositions: number[],
    params: InclineParameters
  ): void {
    ctx.save();
    const count = trailPositions.length;
    for (let i = 0; i < count; i += 2) {
      const pos = trailPositions[i];
      const alpha = 0.08 + (i / count) * 0.25;
      const px = bx + pos * scale * cosTheta;
      const py = by - pos * scale * sinTheta;

      ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawHUD(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    tangX: number,
    tangY: number,
    normX: number,
    normY: number,
    state: InclineState,
    params: InclineParameters
  ): void {
    // 1. Tilted coordinate convention in top right
    const axisX = width - 85;
    const axisY = 70;
    const axisLen = 38;

    ctx.save();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;

    // +s axis (up slope)
    ctx.beginPath();
    ctx.moveTo(axisX, axisY);
    ctx.lineTo(axisX + axisLen * tangX, axisY + axisLen * tangY);
    ctx.stroke();
    this.drawArrowHead(
      ctx,
      axisX,
      axisY,
      axisX + axisLen * tangX,
      axisY + axisLen * tangY,
      5,
      '#64748b'
    );

    // +n axis (normal)
    ctx.beginPath();
    ctx.moveTo(axisX, axisY);
    ctx.lineTo(axisX + axisLen * normX, axisY + axisLen * normY);
    ctx.stroke();
    this.drawArrowHead(
      ctx,
      axisX,
      axisY,
      axisX + axisLen * normX,
      axisY + axisLen * normY,
      5,
      '#64748b'
    );

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('+s (along ramp)', axisX + axisLen * tangX + 6, axisY + axisLen * tangY);
    ctx.fillText('+n (normal)', axisX + axisLen * normX - 10, axisY + axisLen * normY - 8);

    // 2. Dynamic state pill at top-left
    const stateBadgeMap: Record<string, { label: string; color: string; border: string }> = {
      'stationary-equilibrium': {
        label: 'STATIC EQUILIBRIUM (AT REST)',
        color: '#eab308',
        border: 'rgba(234, 179, 8, 0.4)',
      },
      'moving-up': {
        label: 'ACCELERATING UPHILL (+s)',
        color: '#22c55e',
        border: 'rgba(34, 197, 94, 0.4)',
      },
      'moving-down': {
        label: 'ACCELERATING DOWNHILL (-s)',
        color: '#00e5ff',
        border: 'rgba(0, 229, 255, 0.4)',
      },
      'stopped-at-bottom': {
        label: 'STOPPED AT BOTTOM (s = 0m)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.4)',
      },
      'stopped-at-top': {
        label: 'STOPPED AT TOP (s = L)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.4)',
      },
    };

    const info = stateBadgeMap[state.motionState] || {
      label: 'SIMULATING',
      color: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.4)',
    };

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = info.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(20, 20, 240, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = info.color;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(info.label, 32, 33);

    ctx.restore();
  }
}
