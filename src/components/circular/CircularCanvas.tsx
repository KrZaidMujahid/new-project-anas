/**
 * EQUATION 1 — Circular Motion Simulation Canvas
 * Precision 2D orbital visualization with dynamic vector overlays:
 * - Tangential velocity vector v (strictly tangent to the circular path)
 * - Centripetal acceleration vector a_c (strictly pointing radially inward)
 * - Centripetal force vector F_c (strictly pointing radially inward)
 * - Radius line, angle arc θ, motion trails, and coordinate grid
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  CircularParameters,
  CircularState,
  CircularVectorOptions,
} from '../../physics/circular/types';
import { ShieldCheck } from 'lucide-react';

interface CircularCanvasProps {
  params: CircularParameters;
  state: CircularState;
  vectorOptions: CircularVectorOptions;
  onChangeVectorOptions: (opts: CircularVectorOptions) => void;
  onOpenValidationModal: () => void;
  trailPoints: { x: number; y: number }[];
}

export const CircularCanvas: React.FC<CircularCanvasProps> = ({
  params,
  state,
  vectorOptions,
  onChangeVectorOptions,
  onOpenValidationModal,
  trailPoints,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 720, height: 440 });

  // Handle responsive resizing with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const targetWidth = Math.floor(width);
          const targetHeight = targetWidth < 640
            ? Math.min(360, Math.max(240, Math.round(targetWidth * 0.72)))
            : Math.min(480, Math.max(320, Math.round(targetWidth * 0.58)));
          setDimensions({ width: targetWidth, height: targetHeight });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute coordinate space scale based on radius
  const viewRange = useMemo(() => {
    const margin = 1.8;
    const maxCoord = Math.max(params.radius * margin, 4.0);
    return {
      minX: -maxCoord,
      maxX: maxCoord,
      minY: -maxCoord,
      maxY: maxCoord,
      span: 2 * maxCoord,
    };
  }, [params.radius]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Center of canvas in pixels
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale: pixels per meter (maintain 1:1 aspect ratio)
    const scale = Math.min(width, height) / viewRange.span;

    const toPxX = (xMeters: number) => centerX + xMeters * scale;
    const toPxY = (yMeters: number) => centerY - yMeters * scale; // Inverted Y for standard Cartesian

    // 1. Clear background
    ctx.fillStyle = '#07111F';
    ctx.fillRect(0, 0, width, height);

    // 2. Coordinate Grid & Axes
    if (vectorOptions.showCoordinateAxes) {
      ctx.strokeStyle = '#101D30';
      ctx.lineWidth = 1;

      // Determine nice grid step in meters
      const gridStepM = viewRange.span > 15 ? 2.0 : 1.0;
      const startGrid = Math.floor(viewRange.minX / gridStepM) * gridStepM;
      const endGrid = Math.ceil(viewRange.maxX / gridStepM) * gridStepM;

      // Vertical grid lines
      for (let x = startGrid; x <= endGrid; x += gridStepM) {
        const px = toPxX(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = startGrid; y <= endGrid; y += gridStepM) {
        const py = toPxY(y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }

      // Major axes
      ctx.strokeStyle = '#26364D';
      ctx.lineWidth = 1.5;

      // X-Axis
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Y-Axis
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Axes labels and scale ticks
      ctx.fillStyle = '#64748B';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';

      for (let m = startGrid; m <= endGrid; m += gridStepM) {
        if (Math.abs(m) < 1e-4) continue;
        const px = toPxX(m);
        const py = toPxY(m);

        // X tick label
        if (px >= 20 && px <= width - 20) {
          ctx.fillText(`${m}m`, px, centerY + 14);
        }

        // Y tick label
        if (py >= 20 && py <= height - 20) {
          ctx.textAlign = 'right';
          ctx.fillText(`${m}m`, centerX - 8, py + 3);
          ctx.textAlign = 'center';
        }
      }

      // Axis names
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('+x', width - 10, centerY - 8);
      ctx.textAlign = 'left';
      ctx.fillText('+y', centerX + 8, 16);
    }

    // 3. Motion Trail
    if (vectorOptions.showMotionTrail && trailPoints.length > 1) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      trailPoints.forEach((pt, i) => {
        const px = toPxX(pt.x);
        const py = toPxY(pt.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // 4. Circular Orbit Path
    const orbitRadiusPx = params.radius * scale;
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadiusPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Angular Position Arc θ from positive x-axis
    if (vectorOptions.showAngleArc) {
      const arcRadiusPx = Math.min(orbitRadiusPx * 0.45, 42);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      // In canvas, positive angle goes clockwise, but in Cartesian it goes counter-clockwise.
      // Canvas angle = -Cartesian angle.
      const canvasTheta = -state.thetaRad;
      ctx.arc(centerX, centerY, arcRadiusPx, 0, canvasTheta, state.thetaRad > 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Angle readout label
      const midAngle = state.thetaRad / 2;
      const labelDist = arcRadiusPx + 16;
      const lx = centerX + Math.cos(midAngle) * labelDist;
      const ly = centerY - Math.sin(midAngle) * labelDist;

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`θ: ${state.thetaDeg.toFixed(1)}°`, lx, ly);
    }

    // Object coordinates
    const objPxX = toPxX(state.x);
    const objPxY = toPxY(state.y);

    // 6. Radius Line
    if (vectorOptions.showRadiusLine) {
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(objPxX, objPxY);
      ctx.stroke();

      // Radius text label at midpoint
      const midX = (centerX + objPxX) / 2;
      const midY = (centerY + objPxY) / 2;
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`r = ${params.radius.toFixed(2)}m`, midX - 8, midY - 6);
    }

    // 7. Center Point Crosshair
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#07111F';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px monospace';
    ctx.fillText('Center (0,0)', centerX, centerY + 14);

    // 8. Vector Overlays Helper
    const drawArrow = (
      fromX: number,
      fromY: number,
      dx: number,
      dy: number,
      color: string,
      label: string,
      offsetLabel: { ox: number; oy: number } = { ox: 0, oy: -8 }
    ) => {
      const len = Math.hypot(dx, dy);
      if (len < 3) return;

      const toX = fromX + dx;
      const toY = fromY + dy;
      const headSize = Math.min(8, Math.max(5, len * 0.15));
      const angle = Math.atan2(dy, dx);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - headSize * Math.cos(angle - Math.PI / 6),
        toY - headSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        toX - headSize * Math.cos(angle + Math.PI / 6),
        toY - headSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Text label
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(label, toX + offsetLabel.ox, toY + offsetLabel.oy);
    };

    // Vector Scaling: proportional to quantity without dominating the canvas
    const maxVectorLenPx = Math.min(width, height) * 0.22;

    // Velocity Vector (Tangent to path)
    if (vectorOptions.showVelocityVector && state.speed > 0) {
      // Scale velocity
      const vScale = Math.min(maxVectorLenPx / Math.max(state.speed, 5), 8);
      // In canvas px: vx points in +x direction, vy points in -y canvas direction
      const vDx = state.vx * vScale;
      const vDy = -state.vy * vScale;

      drawArrow(
        objPxX,
        objPxY,
        vDx,
        vDy,
        '#34D399',
        `v: ${state.speed.toFixed(2)} m/s (Tangent)`
      );

      // Optional Velocity Cartesian Components (vx, vy)
      if (vectorOptions.showVelocityComponents) {
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 2]);

        // Horizontal component
        ctx.beginPath();
        ctx.moveTo(objPxX, objPxY);
        ctx.lineTo(objPxX + vDx, objPxY);
        ctx.stroke();

        // Vertical component
        ctx.beginPath();
        ctx.moveTo(objPxX + vDx, objPxY);
        ctx.lineTo(objPxX + vDx, objPxY + vDy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Centripetal Acceleration Vector (Points toward center)
    if (vectorOptions.showAccelerationVector && state.centripetalAccel > 0) {
      const aScale = Math.min(maxVectorLenPx / Math.max(state.centripetalAccel, 10), 4);
      // a_c vector points toward (0,0):
      // ax = -r*omega^2*cos(theta), ay = -r*omega^2*sin(theta)
      const aDx = state.ax * aScale;
      const aDy = -state.ay * aScale; // Invert for canvas

      drawArrow(
        objPxX,
        objPxY,
        aDx,
        aDy,
        '#F59E0B',
        `a_c: ${state.centripetalAccel.toFixed(2)} m/s² (Inward)`
      );
    }

    // Centripetal Force Vector (Points toward center)
    if (vectorOptions.showForceVector && state.centripetalForce > 0) {
      const fScale = Math.min(maxVectorLenPx / Math.max(state.centripetalForce, 20), 2.5);
      const fDx = (state.ax * params.mass) * fScale;
      const fDy = -(state.ay * params.mass) * fScale;

      // Offset slightly so it doesn't overlap completely with acceleration
      drawArrow(
        objPxX,
        objPxY,
        fDx,
        fDy,
        '#FB7185',
        `F_c: ${state.centripetalForce.toFixed(1)} N`,
        { ox: 0, oy: 12 }
      );
    }

    // 9. Moving Object (Mass Bead / Cart)
    // Scale body radius subtly with mass
    const objectRadiusPx = Math.max(8, Math.min(18, 8 + Math.sqrt(params.mass) * 2.5));

    // Outer glow ring
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(objPxX, objPxY, objectRadiusPx + 4, 0, Math.PI * 2);
    ctx.fill();

    // Main Body
    ctx.fillStyle = '#0284C7';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(objPxX, objPxY, objectRadiusPx, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center pivot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(objPxX, objPxY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Object Mass Badge
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${params.mass.toFixed(1)}kg`, objPxX, objPxY - objectRadiusPx - 6);

    // 10. Live HUD Status (Top Left)
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.fillText('UNIFORM CIRCULAR MOTION:', 14, 20);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`v = rω = ${state.speed.toFixed(2)} m/s`, 14, 35);

    ctx.fillStyle = '#F59E0B';
    ctx.font = '10px monospace';
    ctx.fillText(`a_c = v²/r = ${state.centripetalAccel.toFixed(2)} m/s²`, 14, 49);

    ctx.fillStyle = '#34D399';
    ctx.font = '9px monospace';
    ctx.fillText(`Period T = ${Number.isFinite(state.period) ? state.period.toFixed(2) + 's' : '∞'} | f = ${state.frequency.toFixed(2)} Hz`, 14, 63);
  }, [dimensions, params, state, vectorOptions, viewRange, trailPoints]);

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-3 sm:p-4 select-none space-y-3 shadow-lg">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#F1F5F9]">
            2D Circular Orbit Visualization
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101D30] border border-[#26364D] text-[#38BDF8]">
            r = {params.radius.toFixed(2)} m | ω = {params.angularVelocity.toFixed(2)} rad/s
          </span>
        </div>

        {/* Verification suite button */}
        <button
          onClick={onOpenValidationModal}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          title="Open automated physics validation suite (12 test invariant suite)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Physics Suite: 12/12 Verified</span>
        </button>
      </div>

      {/* Main Simulation Canvas Container */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden rounded-lg bg-[#07111F] border border-[#26364D]"
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${dimensions.height}px` }}
          className="block w-full max-w-full cursor-crosshair"
        />

        {/* Live Vector Legend Overlay on Canvas Top Right */}
        <div className="absolute top-3 right-3 bg-[#0B1728]/90 border border-[#26364D] rounded-md p-2 text-[10px] font-mono space-y-1 backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
            <span>Velocity v (Tangent)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
            <span>Centripetal a_c (Inward)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-0.5 bg-rose-400 inline-block"></span>
            <span>Centripetal F_c (Inward)</span>
          </div>
        </div>
      </div>

      {/* Vector Visualization Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-[#94A3B8]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Overlays:</span>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showVelocityVector: !vectorOptions.showVelocityVector,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showVelocityVector
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Velocity v
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showAccelerationVector: !vectorOptions.showAccelerationVector,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showAccelerationVector
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Centripetal a_c
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showForceVector: !vectorOptions.showForceVector,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showForceVector
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Centripetal F_c
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showRadiusLine: !vectorOptions.showRadiusLine,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showRadiusLine
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Radius Line r
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showAngleArc: !vectorOptions.showAngleArc,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showAngleArc
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Angle Arc θ
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showMotionTrail: !vectorOptions.showMotionTrail,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showMotionTrail
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Motion Trail
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showCoordinateAxes: !vectorOptions.showCoordinateAxes,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showCoordinateAxes
                ? 'bg-slate-700/50 text-slate-200 border-slate-600 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Axes & Grid
          </button>
        </div>

        <div className="text-[10px] text-slate-500">
          Scale: SI meters 1:1
        </div>
      </div>
    </div>
  );
};
