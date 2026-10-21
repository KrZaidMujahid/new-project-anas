/**
 * EQUATION 1 — Free Fall Laboratory Canvas Renderer
 * High-precision vertical visualization: height axis, calipers, vectors, and motion trail.
 */

import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallSample,
  FreeFallState,
  FreeFallVectorOptions,
} from '../physics/freeFall/types';

export interface FreeFallViewportTransform {
  scale: number; // pixels per meter
  offsetX: number; // canvas pixels for vertical path
  offsetY: number; // canvas pixels for ground y = 0
  worldHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  rulerX: number;
}

export class FreeFallCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hoverWorldHeight: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Could not obtain 2D rendering context');
    }
    this.ctx = context;
  }

  public setHoverHeight(height: number | null): void {
    this.hoverWorldHeight = height;
  }

  /**
   * Calculates vertical scale to fit maximum height comfortably.
   */
  public calculateViewport(
    params: FreeFallParameters,
    analytical: FreeFallAnalytical,
    width: number,
    height: number
  ): FreeFallViewportTransform {
    const paddingTop = 45;
    const paddingBottom = 65;
    const rulerX = Math.min(100, Math.max(65, width * 0.16));
    const pathX = width * 0.52; // Centered vertical trajectory path

    // World height needed to display
    const peakHeight = Math.max(analytical.maxHeight, params.initialHeight, 5);
    const worldHeightNeeded = peakHeight * 1.18; // 18% breathing room at the top

    const availablePxH = Math.max(100, height - (paddingTop + paddingBottom));
    const scale = availablePxH / worldHeightNeeded;

    const groundCanvasY = height - paddingBottom;

    return {
      scale,
      offsetX: pathX,
      offsetY: groundCanvasY,
      worldHeight: worldHeightNeeded,
      canvasWidth: width,
      canvasHeight: height,
      rulerX,
    };
  }

  public worldYToCanvas(y: number, vp: FreeFallViewportTransform): number {
    return vp.offsetY - y * vp.scale;
  }

  public canvasYToWorld(cy: number, vp: FreeFallViewportTransform): number {
    return (vp.offsetY - cy) / vp.scale;
  }

  public render(
    params: FreeFallParameters,
    analytical: FreeFallAnalytical,
    currentState: FreeFallState,
    trajectorySamples: FreeFallSample[],
    vectorOpts: FreeFallVectorOptions
  ): void {
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

    const vp = this.calculateViewport(params, analytical, width, height);

    // 1. Deep space background
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, width, height);

    // 2. Coordinate convention header banner
    this.drawCoordinateConventionBanner(ctx, vp);

    // 3. Coordinate grid & Metric Ruler on height axis
    if (vectorOpts.showCoordinateGrid) {
      this.drawHeightRulerAndGrid(ctx, vp, analytical);
    }

    // 4. Ground Foundation Plane
    this.drawGroundPlane(ctx, vp);

    // 5. Release platform / Gantry at initial height y0
    this.drawReleasePlatform(ctx, vp, params.initialHeight);

    // 6. Apex marker (if object was thrown upward v0 > 0)
    if (vectorOpts.showApexMarker && analytical.timeToApex > 0) {
      this.drawApexMarker(ctx, vp, analytical);
    }

    // 7. Trajectory path and Stroboscopic motion trail
    this.drawMotionTrail(ctx, vp, trajectorySamples, currentState.time, vectorOpts);

    // 8. Horizontal laser caliper from falling object to ruler
    if (vectorOpts.showHeightRuler) {
      this.drawHeightLaserCaliper(ctx, vp, currentState);
    }

    // 9. Vectors at current position (velocity and gravity)
    this.drawVectors(ctx, vp, currentState, vectorOpts);

    // 10. Falling object (sphere with metallic highlight)
    this.drawFallingObject(ctx, vp, currentState);

    // 11. Interactive Hover Probe
    if (this.hoverWorldHeight !== null) {
      this.drawHoverProbe(ctx, vp, this.hoverWorldHeight, trajectorySamples);
    }

    ctx.restore();
  }

  private drawCoordinateConventionBanner(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform
  ): void {
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText('CONVENTION: +y ↑ (Altitude)  |  a = -g ↓', 16, 14);

    // Small coordinate axis glyph
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(vp.canvasWidth - 45, 28);
    ctx.lineTo(vp.canvasWidth - 45, 12);
    ctx.stroke();

    // Arrowhead up
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(vp.canvasWidth - 45, 10);
    ctx.lineTo(vp.canvasWidth - 49, 16);
    ctx.lineTo(vp.canvasWidth - 41, 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('+y', vp.canvasWidth - 45, 32);

    ctx.restore();
  }

  private drawGroundPlane(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform
  ): void {
    ctx.save();
    const groundY = vp.offsetY;

    // Ground fill
    const grad = ctx.createLinearGradient(0, groundY, 0, vp.canvasHeight);
    grad.addColorStop(0, '#0c121e');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, groundY, vp.canvasWidth, vp.canvasHeight - groundY);

    // Ground surface hairline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(vp.canvasWidth, groundY);
    ctx.stroke();

    // Ground level label (y = 0 m)
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Ground Datum (y = 0.0 m)', vp.rulerX + 16, groundY + 8);

    // Target pad right under drop line
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(vp.offsetX, groundY, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vp.offsetX - 10, groundY);
    ctx.lineTo(vp.offsetX + 10, groundY);
    ctx.stroke();

    ctx.restore();
  }

  private drawHeightRulerAndGrid(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    analytical: FreeFallAnalytical
  ): void {
    ctx.save();
    const rulerX = vp.rulerX;
    const maxY = (vp.offsetY - 20) / vp.scale;

    // Determine clean step size
    const desiredPxStep = 45;
    const rawStep = desiredPxStep / vp.scale;
    let step = 5;
    if (rawStep <= 1) step = 1;
    else if (rawStep <= 2) step = 2;
    else if (rawStep <= 5) step = 5;
    else if (rawStep <= 10) step = 10;
    else if (rawStep <= 20) step = 20;
    else if (rawStep <= 50) step = 50;
    else step = Math.ceil(rawStep / 50) * 50;

    // Ruler vertical spine
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rulerX, vp.offsetY);
    ctx.lineTo(rulerX, 25);
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let y = 0; y <= maxY; y += step) {
      const cy = this.worldYToCanvas(y, vp);
      if (cy < 20) break;

      // Tick on ruler
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rulerX - 5, cy);
      ctx.lineTo(rulerX + 5, cy);
      ctx.stroke();

      // Subtle horizontal grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.moveTo(rulerX + 6, cy);
      ctx.lineTo(vp.canvasWidth - 20, cy);
      ctx.stroke();

      // Number text
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${y}m`, rulerX - 8, cy);
    }

    // Axis title
    ctx.save();
    ctx.translate(rulerX - 38, vp.canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('Vertical Height y (meters)', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  private drawReleasePlatform(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    initialHeight: number
  ): void {
    ctx.save();
    const py = this.worldYToCanvas(initialHeight, vp);

    // Gantry / platform arm extending towards drop point
    const gantryWidth = 45;
    const gantryLeft = vp.offsetX - gantryWidth - 14;

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.rect(gantryLeft, py - 4, gantryWidth, 8);
    ctx.fill();
    ctx.stroke();

    // Release caliper dashed line across to ruler
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(vp.rulerX, py);
    ctx.lineTo(gantryLeft, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Platform label
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Release y₀ = ${initialHeight.toFixed(1)}m`, gantryLeft - 8, py);

    ctx.restore();
  }

  private drawApexMarker(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    analytical: FreeFallAnalytical
  ): void {
    ctx.save();
    const apexY = this.worldYToCanvas(analytical.maxHeight, vp);

    // Apex horizontal dashed caliper
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(vp.rulerX, apexY);
    ctx.lineTo(vp.offsetX + 40, apexY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cross tick at path
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(vp.offsetX - 8, apexY);
    ctx.lineTo(vp.offsetX + 8, apexY);
    ctx.stroke();

    // Apex text badge
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f3e8ff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Apex: ${analytical.maxHeight.toFixed(2)}m (t=${analytical.timeToApex.toFixed(2)}s)`, vp.offsetX + 14, apexY - 10);

    ctx.restore();
  }

  private drawMotionTrail(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    samples: FreeFallSample[],
    currentTime: number,
    vectorOpts: FreeFallVectorOptions
  ): void {
    ctx.save();

    // 1. Vertical trajectory line guide
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(vp.offsetX, 20);
    ctx.lineTo(vp.offsetX, vp.offsetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Traversed motion ribbon up to current time
    if (vectorOpts.showMotionTrail && currentTime > 0) {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      ctx.beginPath();
      let started = false;

      for (let i = 0; i < samples.length; i++) {
        if (samples[i].time > currentTime) break;
        const cy = this.worldYToCanvas(samples[i].height, vp);
        if (!started) {
          ctx.moveTo(vp.offsetX, cy);
          started = true;
        } else {
          ctx.lineTo(vp.offsetX, cy);
        }
      }
      ctx.stroke();

      // Stroboscopic ghost dots along the path (demonstrates acceleration visually!)
      const stepInterval = Math.max(1, Math.floor(samples.length / 20));
      ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';

      for (let i = 0; i < samples.length; i += stepInterval) {
        if (samples[i].time > currentTime) break;
        const cy = this.worldYToCanvas(samples[i].height, vp);
        ctx.beginPath();
        ctx.arc(vp.offsetX, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawHeightLaserCaliper(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    state: FreeFallState
  ): void {
    ctx.save();
    const cy = this.worldYToCanvas(state.height, vp);

    // Laser dashed line extending from falling object to ruler
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(vp.rulerX, cy);
    ctx.lineTo(vp.offsetX, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick indicator on ruler
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(vp.rulerX, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Measurement readout
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`y = ${state.height.toFixed(2)} m`, vp.offsetX + 22, cy);

    ctx.restore();
  }

  private drawVectors(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    state: FreeFallState,
    vectorOpts: FreeFallVectorOptions
  ): void {
    ctx.save();
    const cy = this.worldYToCanvas(state.height, vp);
    const cx = vp.offsetX;

    // Vector pixel scale (pixels per 1 m/s)
    const vScale = Math.min(2.5, Math.max(1.2, vp.scale * 0.15));

    // 1. Instantaneous Velocity Vector (signed: up if v > 0, down if v < 0)
    if (vectorOpts.showVelocityVector && state.speed > 0.05) {
      // In canvas, up is -Y, down is +Y.
      // If v > 0 (upward), length in canvas is negative (up).
      // If v < 0 (downward), length in canvas is positive (down).
      const dyPx = -state.velocity * vScale;
      const targetY = cy + dyPx;

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, targetY);
      ctx.stroke();

      this.drawArrowHead(ctx, cx, cy, cx, targetY, '#00e5ff', 7);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00e5ff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`v = ${state.velocity.toFixed(2)} m/s`, cx + 12, targetY);
    }

    // 2. Acceleration Vector a = -g (downward amber)
    if (vectorOpts.showAccelerationVector && Math.abs(state.acceleration) > 0.01) {
      const gOffsetLeft = cx - 22;
      const gLength = Math.min(45, Math.max(20, Math.abs(state.acceleration) * 2.5));
      const targetY = cy + gLength;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gOffsetLeft, cy);
      ctx.lineTo(gOffsetLeft, targetY);
      ctx.stroke();

      this.drawArrowHead(ctx, gOffsetLeft, cy, gOffsetLeft, targetY, '#f59e0b', 6);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`a = -${Math.abs(state.acceleration).toFixed(2)} m/s²`, gOffsetLeft - 6, (cy + targetY) / 2);
    }

    ctx.restore();
  }

  private drawArrowHead(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    size = 6
  ): void {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawFallingObject(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    state: FreeFallState
  ): void {
    ctx.save();
    const cx = vp.offsetX;
    const cy = this.worldYToCanvas(state.height, vp);
    const radius = 7.5;

    // Subtle radial glow
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
    glow.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
    glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    // Metallic sphere body
    const bodyGrad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, radius);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.4, '#e2e8f0');
    bodyGrad.addColorStop(0.8, '#94a3b8');
    bodyGrad.addColorStop(1, '#475569');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Cyan glowing rim
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  private drawHoverProbe(
    ctx: CanvasRenderingContext2D,
    vp: FreeFallViewportTransform,
    mouseHeight: number,
    samples: FreeFallSample[]
  ): void {
    if (samples.length === 0) return;

    // Find nearest sample to hovered height
    let closest = samples[0];
    let minDist = Math.abs(samples[0].height - mouseHeight);

    for (let i = 1; i < samples.length; i++) {
      const d = Math.abs(samples[i].height - mouseHeight);
      if (d < minDist) {
        minDist = d;
        closest = samples[i];
      }
    }

    const cy = this.worldYToCanvas(closest.height, vp);

    ctx.save();

    // Horizontal guide
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(vp.rulerX, cy);
    ctx.lineTo(vp.canvasWidth - 20, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Probe circle
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(vp.offsetX, cy, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Monospace HUD box
    const boxW = 120;
    const boxH = 58;
    const boxX = Math.min(vp.canvasWidth - boxW - 12, vp.offsetX + 35);
    const boxY = Math.max(10, Math.min(vp.canvasHeight - boxH - 10, cy - boxH / 2));

    ctx.fillStyle = '#0b101b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText(`t = ${closest.time.toFixed(2)} s`, boxX + 8, boxY + 16);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`y = ${closest.height.toFixed(2)} m`, boxX + 8, boxY + 30);

    ctx.fillStyle = '#00e5ff';
    ctx.fillText(`v = ${closest.velocity.toFixed(2)} m/s`, boxX + 8, boxY + 44);

    ctx.restore();
  }
}
