/**
 * EQUATION 1 — Newton's Laws Laboratory Canvas Renderer
 * Visualizes 1D dynamics, force vectors, friction, and Third Law interaction pairs.
 */

import {
  NewtonFirstLawParameters,
  NewtonFirstLawState,
  NewtonMode,
  NewtonSecondLawParameters,
  NewtonSecondLawState,
  NewtonThirdLawParameters,
  NewtonThirdLawState,
  NewtonVectorOptions,
} from '../physics/newton/types';

export class NewtonCanvasRenderer {
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

  public renderSecondLaw(
    params: NewtonSecondLawParameters,
    state: NewtonSecondLawState,
    vectorOpts: NewtonVectorOptions
  ): void {
    const { ctx, width, height } = this.setupContext();

    // Ground level at 68% height
    const groundY = height * 0.68;
    const originX = width * 0.35; // Origin slightly offset to allow forward motion

    // World to screen scale: pixels per meter (auto-fit or camera follow)
    const scale = Math.min(28, Math.max(8, width / 35));
    const blockScreenX = originX + state.position * scale;

    // Background
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, width, height);

    // Surface & Grid
    this.drawHorizontalTrack(ctx, width, height, groundY, originX, scale, vectorOpts.showSurfaceGrid);

    // Draw mass block
    const blockWidth = Math.min(80, Math.max(45, 35 + Math.sqrt(params.mass) * 12));
    const blockHeight = blockWidth * 0.75;
    const blockTopY = groundY - blockHeight;

    this.drawBlock(
      ctx,
      blockScreenX - blockWidth / 2,
      blockTopY,
      blockWidth,
      blockHeight,
      `m = ${params.mass.toFixed(1)} kg`,
      '#00e5ff'
    );

    // Vectors at center of mass
    const comX = blockScreenX;
    const comY = groundY - blockHeight / 2;

    this.drawSecondLawVectors(ctx, comX, comY, blockTopY, state, params, vectorOpts);

    // Coordinate convention HUD
    this.drawConventionBanner(ctx, 'Mode: Second Law (ΣF = ma)');

    ctx.restore();
  }

  public renderFirstLaw(
    params: NewtonFirstLawParameters,
    state: NewtonFirstLawState,
    vectorOpts: NewtonVectorOptions
  ): void {
    const { ctx, width, height } = this.setupContext();
    const groundY = height * 0.68;
    const originX = width * 0.25;
    const scale = Math.min(26, Math.max(8, width / 40));
    const blockScreenX = originX + state.position * scale;

    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, width, height);

    // Low-friction air-track
    this.drawAirTrack(ctx, width, groundY, originX, scale);

    const blockWidth = 55;
    const blockHeight = 40;
    const blockTopY = groundY - blockHeight;

    this.drawBlock(
      ctx,
      blockScreenX - blockWidth / 2,
      blockTopY,
      blockWidth,
      blockHeight,
      `m = ${params.mass.toFixed(1)} kg`,
      '#10b981'
    );

    const comX = blockScreenX;
    const comY = groundY - blockHeight / 2;

    // Velocity Vector
    if (vectorOpts.showVelocityVector && state.speed > 0.05) {
      const vPx = state.velocity * 6;
      this.drawArrow(ctx, comX, comY - 10, comX + vPx, comY - 10, '#00e5ff', 2);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00e5ff';
      ctx.textAlign = state.velocity >= 0 ? 'left' : 'right';
      ctx.fillText(`v = ${state.velocity.toFixed(2)} m/s (constant)`, comX + vPx + (state.velocity >= 0 ? 8 : -8), comY - 10);
    }

    // First law state tag
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    if (Math.abs(state.netForce) < 0.001) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('F_net = 0 N  ⟹  a = 0 m/s² (INERTIA: VELOCITY CONSTANT)', width / 2, 45);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`External Force Applied: F = ${state.netForce.toFixed(1)} N ⟹ a = ${state.acceleration.toFixed(2)} m/s²`, width / 2, 45);
    }

    this.drawConventionBanner(ctx, 'Mode: First Law (Inertia)');

    ctx.restore();
  }

  public renderThirdLaw(
    params: NewtonThirdLawParameters,
    state: NewtonThirdLawState,
    vectorOpts: NewtonVectorOptions
  ): void {
    const { ctx, width, height } = this.setupContext();
    const groundY = height * 0.68;
    const centerX = width * 0.5; // Center interface
    const scale = Math.min(24, Math.max(6, width / 45));

    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, width, height);

    this.drawHorizontalTrack(ctx, width, height, groundY, centerX, scale, vectorOpts.showSurfaceGrid);

    // Initial separation point is at centerX
    const blockWidthA = Math.min(75, Math.max(45, 35 + Math.sqrt(params.massA) * 11));
    const blockHeightA = blockWidthA * 0.75;
    const blockWidthB = Math.min(75, Math.max(45, 35 + Math.sqrt(params.massB) * 11));
    const blockHeightB = blockWidthB * 0.75;

    // Object A starts on left of center, Object B on right
    const screenXA = centerX - blockWidthA / 2 + state.posA * scale;
    const screenXB = centerX + blockWidthB / 2 + state.posB * scale;

    // Draw central interaction spring/force impulse line during push
    if (state.isPushing) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(screenXA + blockWidthA / 2, groundY - 20);
      ctx.lineTo(screenXB - blockWidthB / 2, groundY - 20);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Block A (Cyan)
    this.drawBlock(
      ctx,
      screenXA - blockWidthA / 2,
      groundY - blockHeightA,
      blockWidthA,
      blockHeightA,
      `A: ${params.massA.toFixed(1)} kg`,
      '#00e5ff'
    );

    // Draw Block B (Purple)
    this.drawBlock(
      ctx,
      screenXB - blockWidthB / 2,
      groundY - blockHeightB,
      blockWidthB,
      blockHeightB,
      `B: ${params.massB.toFixed(1)} kg`,
      '#c084fc'
    );

    // Action & Reaction Force Vectors
    if (state.isPushing && params.interactionForce > 0) {
      const fScale = 2.2;
      // Force on A: pointing LEFT
      const fPxA = -params.interactionForce * fScale;
      this.drawArrow(
        ctx,
        screenXA,
        groundY - blockHeightA - 15,
        screenXA + fPxA,
        groundY - blockHeightA - 15,
        '#f43f5e',
        2.5
      );
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.textAlign = 'right';
      ctx.fillText(`F_B→A = -${params.interactionForce.toFixed(0)} N`, screenXA + fPxA - 6, groundY - blockHeightA - 15);

      // Force on B: pointing RIGHT
      const fPxB = params.interactionForce * fScale;
      this.drawArrow(
        ctx,
        screenXB,
        groundY - blockHeightB - 15,
        screenXB + fPxB,
        groundY - blockHeightB - 15,
        '#f43f5e',
        2.5
      );
      ctx.textAlign = 'left';
      ctx.fillText(`F_A→B = +${params.interactionForce.toFixed(0)} N`, screenXB + fPxB + 6, groundY - blockHeightB - 15);
    }

    // Velocities of A and B
    if (vectorOpts.showVelocityVector) {
      if (Math.abs(state.velA) > 0.05) {
        const vPxA = state.velA * 5;
        this.drawArrow(ctx, screenXA, groundY - blockHeightA / 2, screenXA + vPxA, groundY - blockHeightA / 2, '#00e5ff', 2);
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00e5ff';
        ctx.textAlign = 'right';
        ctx.fillText(`v_A = ${state.velA.toFixed(1)} m/s`, screenXA + vPxA - 6, groundY - blockHeightA / 2);
      }

      if (Math.abs(state.velB) > 0.05) {
        const vPxB = state.velB * 5;
        this.drawArrow(ctx, screenXB, groundY - blockHeightB / 2, screenXB + vPxB, groundY - blockHeightB / 2, '#c084fc', 2);
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#c084fc';
        ctx.textAlign = 'left';
        ctx.fillText(`v_B = ${state.velB.toFixed(1)} m/s`, screenXB + vPxB + 6, groundY - blockHeightB / 2);
      }
    }

    this.drawConventionBanner(ctx, 'Mode: Third Law (Action & Reaction Pairs)');

    ctx.restore();
  }

  private setupContext() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (
      this.canvas.width !== Math.floor(width * dpr) ||
      this.canvas.height !== Math.floor(height * dpr)
    ) {
      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(dpr, dpr);
    return { ctx, width, height };
  }

  private drawHorizontalTrack(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundY: number,
    originX: number,
    scale: number,
    showGrid: boolean
  ): void {
    // Ground foundation gradient
    const grad = ctx.createLinearGradient(0, groundY, 0, height);
    grad.addColorStop(0, '#0c121e');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Surface line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    if (!showGrid) return;

    // Metric tick marks along track
    const desiredPxStep = 60;
    const rawStep = desiredPxStep / scale;
    let step = 5;
    if (rawStep <= 1) step = 1;
    else if (rawStep <= 2) step = 2;
    else if (rawStep <= 5) step = 5;
    else if (rawStep <= 10) step = 10;
    else step = Math.ceil(rawStep / 10) * 10;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const minX = -Math.ceil(originX / (scale * step)) * step;
    const maxX = Math.ceil((width - originX) / (scale * step)) * step;

    for (let x = minX; x <= maxX; x += step) {
      const px = originX + x * scale;
      if (px < 0 || px > width) continue;

      ctx.strokeStyle = x === 0 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = x === 0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, groundY + (x === 0 ? 10 : 5));
      ctx.stroke();

      ctx.fillStyle = x === 0 ? '#38bdf8' : '#64748b';
      ctx.fillText(`${x}m`, px, groundY + 12);
    }
  }

  private drawAirTrack(
    ctx: CanvasRenderingContext2D,
    width: number,
    groundY: number,
    originX: number,
    scale: number
  ): void {
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Air jets / holes
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    for (let px = 20; px < width; px += 25) {
      ctx.beginPath();
      ctx.arc(px, groundY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    accentColor: string
  ): void {
    ctx.save();

    // Block shadow / glow
    ctx.shadowColor = 'rgba(0, 229, 255, 0.2)';
    ctx.shadowBlur = 12;

    // Block body fill
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Label
    ctx.shadowBlur = 0;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2);

    ctx.restore();
  }

  private drawSecondLawVectors(
    ctx: CanvasRenderingContext2D,
    comX: number,
    comY: number,
    blockTopY: number,
    state: NewtonSecondLawState,
    params: NewtonSecondLawParameters,
    vectorOpts: NewtonVectorOptions
  ): void {
    const fScale = 2.0;

    // 1. Applied Force Vector
    if (vectorOpts.showAppliedForce && Math.abs(params.appliedForce) > 0.1) {
      const fPx = params.appliedForce * fScale;
      this.drawArrow(ctx, comX, comY, comX + fPx, comY, '#00e5ff', 2.5);
      if (vectorOpts.showForceLabels) {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00e5ff';
        ctx.textAlign = params.appliedForce >= 0 ? 'left' : 'right';
        ctx.fillText(`F_app = ${params.appliedForce.toFixed(1)} N`, comX + fPx + (params.appliedForce >= 0 ? 6 : -6), comY - 6);
      }
    }

    // 2. Opposing Force Vector (if non-zero)
    if (vectorOpts.showAppliedForce && Math.abs(params.opposingForce) > 0.1) {
      const fPx = params.opposingForce * fScale;
      this.drawArrow(ctx, comX, comY + 12, comX + fPx, comY + 12, '#38bdf8', 2);
      if (vectorOpts.showForceLabels) {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = params.opposingForce >= 0 ? 'left' : 'right';
        ctx.fillText(`F_opp = ${params.opposingForce.toFixed(1)} N`, comX + fPx + (params.opposingForce >= 0 ? 6 : -6), comY + 12);
      }
    }

    // 3. Friction Force Vector (amber)
    if (vectorOpts.showFrictionForce && Math.abs(state.frictionForce) > 0.1) {
      const fPx = state.frictionForce * fScale;
      this.drawArrow(ctx, comX, comY + 22, comX + fPx, comY + 22, '#f59e0b', 2);
      if (vectorOpts.showForceLabels) {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = state.frictionForce >= 0 ? 'left' : 'right';
        ctx.fillText(`f = ${state.frictionForce.toFixed(1)} N`, comX + fPx + (state.frictionForce >= 0 ? 6 : -6), comY + 22);
      }
    }

    // 4. Net Force Vector (Bold above block)
    if (vectorOpts.showNetForce && Math.abs(state.netForce) > 0.1) {
      const fPx = state.netForce * fScale;
      const netY = blockTopY - 18;
      this.drawArrow(ctx, comX, netY, comX + fPx, netY, '#10b981', 3);
      if (vectorOpts.showForceLabels) {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = state.netForce >= 0 ? 'left' : 'right';
        ctx.fillText(`ΣF = ${state.netForce.toFixed(1)} N`, comX + fPx + (state.netForce >= 0 ? 6 : -6), netY);
      }
    }

    // 5. Velocity Vector
    if (vectorOpts.showVelocityVector && state.speed > 0.05) {
      const vPx = state.velocity * 5;
      const vY = blockTopY - 36;
      this.drawArrow(ctx, comX, vY, comX + vPx, vY, '#00e5ff', 2);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00e5ff';
      ctx.textAlign = state.velocity >= 0 ? 'left' : 'right';
      ctx.fillText(`v = ${state.velocity.toFixed(2)} m/s`, comX + vPx + (state.velocity >= 0 ? 6 : -6), vY);
    }

    // 6. Acceleration Vector
    if (vectorOpts.showAccelerationVector && Math.abs(state.acceleration) > 0.05) {
      const aPx = state.acceleration * 8;
      const aY = blockTopY - 50;
      this.drawArrow(ctx, comX, aY, comX + aPx, aY, '#eab308', 2);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#eab308';
      ctx.textAlign = state.acceleration >= 0 ? 'left' : 'right';
      ctx.fillText(`a = ${state.acceleration.toFixed(2)} m/s²`, comX + aPx + (state.acceleration >= 0 ? 6 : -6), aY);
    }
  }

  private drawConventionBanner(ctx: CanvasRenderingContext2D, label: string): void {
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${label}  |  +x → Right, -x ← Left`, 16, 14);
    ctx.restore();
  }

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width = 2
  ): void {
    const headLength = 7;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
