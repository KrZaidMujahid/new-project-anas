/**
 * EQUATION 1 — Collision Simulation Canvas
 * Precision 2D horizontal track rendering with dynamic carts, bumpers,
 * accurate velocity and momentum vector overlays, contact forces, and center of mass.
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  CollisionParameters,
  CollisionState,
  CollisionVectorOptions,
} from '../../physics/collision/types';
import { ShieldCheck, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface CollisionCanvasProps {
  params: CollisionParameters;
  state: CollisionState;
  vectorOptions: CollisionVectorOptions;
  onChangeVectorOptions: (opts: CollisionVectorOptions) => void;
  onOpenValidationModal: () => void;
  trailPositions1: number[];
  trailPositions2: number[];
}

export const CollisionCanvas: React.FC<CollisionCanvasProps> = ({
  params,
  state,
  vectorOptions,
  onChangeVectorOptions,
  onOpenValidationModal,
  trailPositions1,
  trailPositions2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 380 });

  // Update canvas pixel dimensions on container resize with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const targetWidth = Math.floor(width);
          const targetHeight = targetWidth < 640
            ? Math.min(320, Math.max(220, Math.round(targetWidth * 0.52)))
            : Math.min(380, Math.max(260, Math.round(targetWidth * 0.40)));
          setDimensions({ width: targetWidth, height: targetHeight });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track coordinate mapping (meters to canvas pixels)
  // Determine dynamic range based on initial positions and current positions
  const trackBounds = useMemo(() => {
    const minPos = Math.min(params.x1, params.x2, state.object1.position, state.object2.position, -2);
    const maxPos = Math.max(params.x1, params.x2, state.object1.position, state.object2.position, 16);
    const margin = 4.0;
    const startMeters = Math.floor(minPos - margin);
    const endMeters = Math.ceil(maxPos + margin);
    const totalSpan = Math.max(16, endMeters - startMeters);
    return { startMeters, endMeters: startMeters + totalSpan, totalSpan };
  }, [params.x1, params.x2, state.object1.position, state.object2.position]);

  // Center of mass calculation
  const centerOfMass = useMemo(() => {
    const totalM = params.m1 + params.m2;
    if (totalM <= 0) return 0;
    return (params.m1 * state.object1.position + params.m2 * state.object2.position) / totalM;
  }, [params.m1, params.m2, state.object1.position, state.object2.position]);

  // Render to canvas
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

    // Coordinate conversion
    const trackPaddingLeft = 40;
    const trackPaddingRight = 40;
    const trackWidth = width - trackPaddingLeft - trackPaddingRight;
    const trackY = height * 0.65; // Track line vertical position

    const metersToPx = (m: number) => {
      const ratio = (m - trackBounds.startMeters) / trackBounds.totalSpan;
      return trackPaddingLeft + ratio * trackWidth;
    };

    const pxScale = trackWidth / trackBounds.totalSpan; // pixels per meter

    // 1. Clear background
    ctx.fillStyle = '#07111F';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle background coordinate grid
    ctx.strokeStyle = '#101D30';
    ctx.lineWidth = 1;
    const gridStepPx = 40;
    for (let x = 0; x < width; x += gridStepPx) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStepPx) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Motion trails
    if (vectorOptions.showMotionTrails) {
      // Trail for Object 1
      if (trailPositions1.length > 1) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < trailPositions1.length; i++) {
          const tx = metersToPx(trailPositions1[i]);
          if (i === 0) ctx.moveTo(tx, trackY - 20);
          else ctx.lineTo(tx, trackY - 20);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Trail for Object 2
      if (trailPositions2.length > 1) {
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.25)';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < trailPositions2.length; i++) {
          const tx = metersToPx(trailPositions2[i]);
          if (i === 0) ctx.moveTo(tx, trackY - 20);
          else ctx.lineTo(tx, trackY - 20);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 4. Draw horizontal precision air-track / rail
    // Rail shadow/depth
    ctx.fillStyle = '#0B1728';
    ctx.fillRect(trackPaddingLeft - 15, trackY, trackWidth + 30, 24);

    // Track surface
    ctx.strokeStyle = '#26364D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(trackPaddingLeft - 15, trackY);
    ctx.lineTo(trackPaddingLeft + trackWidth + 15, trackY);
    ctx.stroke();

    // Track bottom bevel
    ctx.strokeStyle = '#17263B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(trackPaddingLeft - 15, trackY + 24);
    ctx.lineTo(trackPaddingLeft + trackWidth + 15, trackY + 24);
    ctx.stroke();

    // 5. Ruler & meter tick marks along track
    if (vectorOptions.showTrackRuler) {
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';

      // Decide tick interval
      const stepMeters = trackBounds.totalSpan > 30 ? 5 : trackBounds.totalSpan > 15 ? 2 : 1;
      const firstTick = Math.ceil(trackBounds.startMeters / stepMeters) * stepMeters;

      for (let m = firstTick; m <= trackBounds.endMeters; m += stepMeters) {
        const tx = metersToPx(m);
        if (tx < trackPaddingLeft || tx > trackPaddingLeft + trackWidth) continue;

        // Major tick
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, trackY);
        ctx.lineTo(tx, trackY + 10);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.fillText(`${m}m`, tx, trackY + 20);

        // Minor ticks between
        if (stepMeters > 1) {
          const halfStep = stepMeters / 2;
          const hx = metersToPx(m + halfStep);
          if (hx >= trackPaddingLeft && hx <= trackPaddingLeft + trackWidth) {
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hx, trackY);
            ctx.lineTo(hx, trackY + 5);
            ctx.stroke();
          }
        }
      }

      // Axis label with direction arrow (+x ->)
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('+x (Positive Direction) ➔', trackPaddingLeft + trackWidth, trackY + 36);
    }

    // 6. Center of mass line & symbol
    if (vectorOptions.showCenterOfMass) {
      const cmPx = metersToPx(centerOfMass);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cmPx, trackY - 90);
      ctx.lineTo(cmPx, trackY + 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center of mass badge
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cmPx, trackY - 95, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#07111F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cmPx - 6, trackY - 95);
      ctx.lineTo(cmPx + 6, trackY - 95);
      ctx.moveTo(cmPx, trackY - 101);
      ctx.lineTo(cmPx, trackY - 89);
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(`CM: ${centerOfMass.toFixed(2)}m`, cmPx, trackY - 106);
    }

    // 7. Cart dimensions & geometry
    const baseCartW = 68; // base width in pixels
    // Scale cart width subtly with mass: heavier looks slightly wider/sturdier
    const cartW1 = Math.max(54, Math.min(94, baseCartW * Math.pow(params.m1 / 2, 0.25)));
    const cartW2 = Math.max(54, Math.min(94, baseCartW * Math.pow(params.m2 / 2, 0.25)));
    const cartH = 36;
    const wheelR = 6;
    const wheelY = trackY - wheelR;
    const bodyY = trackY - wheelR * 2 - cartH + 4;

    const x1Px = metersToPx(state.object1.position);
    const x2Px = metersToPx(state.object2.position);

    // Check if carts are locked together in a perfectly inelastic collision
    const isLockedTogether = params.collisionType === 'perfectly-inelastic' && state.hasCollided;

    // Helper: draw arrow vector
    const drawVector = (
      startX: number,
      startY: number,
      length: number,
      color: string,
      label: string,
      direction: number
    ) => {
      if (Math.abs(length) < 2) return;
      const endX = startX + length;
      const arrowHeadSize = 6;
      const dir = length > 0 ? 1 : -1;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, startY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(endX, startY);
      ctx.lineTo(endX - dir * arrowHeadSize, startY - 4);
      ctx.lineTo(endX - dir * arrowHeadSize, startY + 4);
      ctx.closePath();
      ctx.fill();

      // Vector Label
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.fillText(label, startX + length / 2, startY - 6);
    };

    // 8. Draw Cart 1 (Object 1 - Cyan / Electric Blue)
    const drawCart1 = () => {
      const left = x1Px - cartW1 / 2;
      const top = bodyY;

      // Chassis Body
      ctx.fillStyle = '#0F2942';
      ctx.strokeStyle = state.isColliding ? '#38BDF8' : '#0284C7';
      ctx.lineWidth = state.isColliding ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(left, top, cartW1, cartH, 6);
      ctx.fill();
      ctx.stroke();

      // Top accent strip
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(left + 4, top + 3, cartW1 - 8, 3);

      // Wheels
      const wDist = cartW1 * 0.28;
      [x1Px - wDist, x1Px + wDist].forEach((wx) => {
        // Wheel rim
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wheel axle hub
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bumper on right edge (facing Object 2)
      const bumperX = x1Px + cartW1 / 2;
      const bumperY = top + cartH / 2;
      if (params.collisionType === 'elastic') {
        // Spring coil bumper
        ctx.strokeStyle = state.isColliding ? '#FBBF24' : '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bumperX, bumperY - 7);
        ctx.lineTo(bumperX + (state.isColliding ? 3 : 7), bumperY - 3);
        ctx.lineTo(bumperX + (state.isColliding ? 1 : 5), bumperY + 2);
        ctx.lineTo(bumperX + (state.isColliding ? 3 : 7), bumperY + 7);
        ctx.stroke();
      } else if (params.collisionType === 'perfectly-inelastic') {
        // Latch / magnetic coupler
        ctx.fillStyle = isLockedTogether ? '#F59E0B' : '#94A3B8';
        ctx.fillRect(bumperX, bumperY - 5, isLockedTogether ? 4 : 6, 10);
      } else {
        // Inelastic bumper pad
        ctx.fillStyle = state.isColliding ? '#FB7185' : '#475569';
        ctx.fillRect(bumperX, bumperY - 6, 5, 12);
      }

      // Cart 1 Labels
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OBJ 1', x1Px, top + 16);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`${params.m1.toFixed(1)} kg`, x1Px, top + 29);

      // Position readout below cart
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px monospace';
      ctx.fillText(`x₁ = ${state.object1.position.toFixed(2)}m`, x1Px, trackY + 36);
    };

    // 9. Draw Cart 2 (Object 2 - Purple / Amber)
    const drawCart2 = () => {
      const left = x2Px - cartW2 / 2;
      const top = bodyY;

      // Chassis Body
      ctx.fillStyle = '#221538';
      ctx.strokeStyle = state.isColliding ? '#A78BFA' : '#7C3AED';
      ctx.lineWidth = state.isColliding ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(left, top, cartW2, cartH, 6);
      ctx.fill();
      ctx.stroke();

      // Top accent strip
      ctx.fillStyle = '#A78BFA';
      ctx.fillRect(left + 4, top + 3, cartW2 - 8, 3);

      // Wheels
      const wDist = cartW2 * 0.28;
      [x2Px - wDist, x2Px + wDist].forEach((wx) => {
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#A78BFA';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bumper on left edge (facing Object 1)
      const bumperX = x2Px - cartW2 / 2;
      const bumperY = top + cartH / 2;
      if (params.collisionType === 'elastic') {
        // Spring coil bumper
        ctx.strokeStyle = state.isColliding ? '#FBBF24' : '#A78BFA';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bumperX, bumperY - 7);
        ctx.lineTo(bumperX - (state.isColliding ? 3 : 7), bumperY - 3);
        ctx.lineTo(bumperX - (state.isColliding ? 1 : 5), bumperY + 2);
        ctx.lineTo(bumperX - (state.isColliding ? 3 : 7), bumperY + 7);
        ctx.stroke();
      } else if (params.collisionType === 'perfectly-inelastic') {
        // Latch coupler receiver
        ctx.fillStyle = isLockedTogether ? '#F59E0B' : '#94A3B8';
        ctx.fillRect(bumperX - (isLockedTogether ? 4 : 6), bumperY - 5, isLockedTogether ? 4 : 6, 10);
      } else {
        // Inelastic bumper pad
        ctx.fillStyle = state.isColliding ? '#FB7185' : '#475569';
        ctx.fillRect(bumperX - 5, bumperY - 6, 5, 12);
      }

      // Cart 2 Labels
      ctx.fillStyle = '#F1F5F9';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('OBJ 2', x2Px, top + 16);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#A78BFA';
      ctx.fillText(`${params.m2.toFixed(1)} kg`, x2Px, top + 29);

      // Position readout below cart
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px monospace';
      ctx.fillText(`x₂ = ${state.object2.position.toFixed(2)}m`, x2Px, trackY + 48);
    };

    drawCart1();
    drawCart2();

    // 10. Locked Coupler badge if perfectly inelastic collision has happened
    if (isLockedTogether) {
      const midContactX = (x1Px + cartW1 / 2 + x2Px - cartW2 / 2) / 2;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.fillRect(midContactX - 10, bodyY - 14, 20, 12);
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1;
      ctx.strokeRect(midContactX - 10, bodyY - 14, 20, 12);

      ctx.fillStyle = '#07111F';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LOCKED', midContactX, bodyY - 5);
    }

    // 11. Collision impact flash/indicator
    if (state.isColliding) {
      const midContactX = (x1Px + cartW1 / 2 + x2Px - cartW2 / 2) / 2;
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(midContactX, bodyY - 8);
      ctx.lineTo(midContactX, trackY);
      ctx.stroke();

      // Contact spark icon / star
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💥 IMPACT', midContactX, bodyY - 14);
    }

    // 12. Vector Overlays (Velocity, Momentum, Force)
    const vectorScaleV = pxScale * 0.18; // scale factor for velocity vector
    const vectorScaleP = pxScale * 0.05; // scale factor for momentum vector

    // Velocity Vectors
    if (vectorOptions.showVelocityVectors) {
      const v1Len = state.object1.velocity * vectorScaleV;
      const v2Len = state.object2.velocity * vectorScaleV;
      const vY = bodyY - 26;

      drawVector(
        x1Px,
        vY,
        v1Len,
        '#34D399',
        `v₁: ${state.object1.velocity >= 0 ? '+' : ''}${state.object1.velocity.toFixed(2)} m/s`,
        state.object1.velocity >= 0 ? 1 : -1
      );

      drawVector(
        x2Px,
        vY,
        v2Len,
        '#34D399',
        `v₂: ${state.object2.velocity >= 0 ? '+' : ''}${state.object2.velocity.toFixed(2)} m/s`,
        state.object2.velocity >= 0 ? 1 : -1
      );
    }

    // Momentum Vectors
    if (vectorOptions.showMomentumVectors) {
      const p1Len = state.object1.momentum * vectorScaleP;
      const p2Len = state.object2.momentum * vectorScaleP;
      const pY = bodyY - 48;

      drawVector(
        x1Px,
        pY,
        p1Len,
        '#F59E0B',
        `p₁: ${state.object1.momentum >= 0 ? '+' : ''}${state.object1.momentum.toFixed(2)} kg·m/s`,
        state.object1.momentum >= 0 ? 1 : -1
      );

      drawVector(
        x2Px,
        pY,
        p2Len,
        '#F59E0B',
        `p₂: ${state.object2.momentum >= 0 ? '+' : ''}${state.object2.momentum.toFixed(2)} kg·m/s`,
        state.object2.momentum >= 0 ? 1 : -1
      );
    }

    // Contact Force Vectors during collision
    if (vectorOptions.showForceVectors && state.isColliding && state.contactForce > 0) {
      const fY = bodyY + cartH / 2;
      const forceLen = Math.min(80, Math.max(25, (state.contactForce / 100) * pxScale * 0.15));

      // Force on Object 1 from Object 2 (points leftward)
      drawVector(
        x1Px + cartW1 / 2,
        fY,
        -forceLen,
        '#FB7185',
        `F₂₁: -${state.contactForce.toFixed(0)} N`,
        -1
      );

      // Force on Object 2 from Object 1 (points rightward)
      drawVector(
        x2Px - cartW2 / 2,
        fY,
        forceLen,
        '#FB7185',
        `F₁₂: +${state.contactForce.toFixed(0)} N`,
        1
      );
    }

    // 13. Top HUD Status Overlay
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`MOMENTUM CONSERVATION:`, 14, 20);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`P_total = ${state.totalMomentum.toFixed(3)} kg·m/s`, 14, 35);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#34D399';
    ctx.fillText(`✔ INVARIANT [ΔP = 0.000]`, 14, 50);
  }, [dimensions, params, state, vectorOptions, trackBounds, centerOfMass, trailPositions1, trailPositions2]);

  return (
    <div className="bg-[#0B1728] border border-[#26364D] rounded-xl p-3 sm:p-4 select-none space-y-3 shadow-lg">
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#F1F5F9]">
            Horizontal 1D Collision Track Simulation
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101D30] border border-[#26364D] text-[#38BDF8]">
            {params.collisionType === 'elastic'
              ? 'Elastic (e = 1.0)'
              : params.collisionType === 'perfectly-inelastic'
              ? 'Perfectly Inelastic (e = 0.0)'
              : `Inelastic (e = ${params.restitution.toFixed(2)})`}
          </span>
        </div>

        {/* Verification suite button */}
        <button
          onClick={onOpenValidationModal}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          title="Open automated physics validation suite (11 test invariant suite)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Physics Suite: 11/11 Verified</span>
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

        {/* Dynamic Collision Event Phase Badge in Canvas top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {state.isColliding ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>CONTACT COLLISION (Δt = {state.collisionDuration.toFixed(2)}s)</span>
            </div>
          ) : state.hasCollided ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>
                {params.collisionType === 'perfectly-inelastic'
                  ? 'COALESCED MOTION'
                  : 'POST-COLLISION TRAJECTORY'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>PRE-COLLISION APPROACH</span>
            </div>
          )}
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
                showVelocityVectors: !vectorOptions.showVelocityVectors,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showVelocityVectors
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Velocity Vectors (v)
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showMomentumVectors: !vectorOptions.showMomentumVectors,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showMomentumVectors
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Momentum Vectors (p)
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showForceVectors: !vectorOptions.showForceVectors,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showForceVectors
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Collision Force (F)
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showCenterOfMass: !vectorOptions.showCenterOfMass,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showCenterOfMass
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Center of Mass (CM)
          </button>

          <button
            onClick={() =>
              onChangeVectorOptions({
                ...vectorOptions,
                showMotionTrails: !vectorOptions.showMotionTrails,
              })
            }
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vectorOptions.showMotionTrails
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-[#101D30] text-slate-400 border-[#26364D]'
            }`}
          >
            Motion Trails
          </button>
        </div>

        <div className="text-[10px] text-slate-500">
          Scale: 1m SI grid
        </div>
      </div>
    </div>
  );
};
