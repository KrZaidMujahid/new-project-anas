import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, StepForward, Trash2, Eye, Compass, Layers } from 'lucide-react';
import { LorentzParameters, TrajectoryPoint, LorentzMotionMode, Vector3D } from '../../physics/lorentz/types';
import { borisStep, getFieldVectors, calculateLorentzForce, vectorMagnitude } from '../../physics/lorentz/model';

interface LorentzSimulationCanvasProps {
  params: LorentzParameters;
  onUpdateParams: (updater: (prev: LorentzParameters) => LorentzParameters) => void;
  onSelectMode: (mode: LorentzMotionMode) => void;
}

export const LorentzSimulationCanvas: React.FC<LorentzSimulationCanvasProps> = ({
  params,
  onUpdateParams,
  onSelectMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [view3DMode, setView3DMode] = useState(false); // for helical 3D isometric projection
  const [time, setTime] = useState(0);

  // Canvas geometry
  const width = 840;
  const height = 460;
  const centerX = width / 2;
  const centerY = height / 2;

  // Refs for tracking simulation animation state
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Physical scaling:
  // Speed is ~2e6 m/s. Radius is typically 0.04m (4cm) for proton in 0.5T.
  // We map physical meters to canvas pixels: scale = 1800 px/m (so 0.04m radius ≈ 72px)
  const scale = 1600; // pixels per physical meter

  // Initial state setup
  const getInitialState = useCallback(() => {
    const { speed, angleThetaDeg, initialVelocityAngleDeg } = params;
    const thetaRad = (angleThetaDeg * Math.PI) / 180;
    const phiRad = (initialVelocityAngleDeg * Math.PI) / 180;

    const vPerp = speed * Math.sin(thetaRad);
    const vPar = speed * Math.cos(thetaRad);

    // Initial position
    let initX = 0;
    let initY = 0;
    let initZ = 0;

    // Center circular orbit conveniently
    if (params.mode === 'perpendicular') {
      initX = 0;
      initY = -0.04; // start slightly below center so orbit stays centered
    } else if (params.mode === 'helical') {
      initX = -0.16;
      initY = -0.04;
      initZ = -0.12;
    } else if (params.mode === 'crossed-fields' || params.mode === 'electric-only') {
      initX = -0.22;
      initY = 0;
    }

    return {
      time: 0,
      pos: { x: initX, y: initY, z: initZ } as Vector3D,
      vel: {
        x: vPerp * Math.cos(phiRad),
        y: vPerp * Math.sin(phiRad),
        z: vPar,
      } as Vector3D,
      trajectory: [] as TrajectoryPoint[],
    };
  }, [params]);

  const stateRef = useRef(getInitialState());

  // Reset function
  const handleReset = useCallback(() => {
    stateRef.current = getInitialState();
    setTime(0);
  }, [getInitialState]);

  // Clear trail only
  const handleClearTrail = () => {
    stateRef.current.trajectory = [];
  };

  // Toggle Play/Pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Single step forward
  const handleStepForward = () => {
    const dt = 1e-8; // 10 nanoseconds
    const { bVec, eVec } = getFieldVectors(params);
    const stepRes = borisStep(
      stateRef.current.pos,
      stateRef.current.vel,
      params.charge,
      params.mass,
      eVec,
      bVec,
      dt
    );
    stateRef.current.pos = stepRes.nextPos;
    stateRef.current.vel = stepRes.nextVel;
    stateRef.current.time += dt;

    stateRef.current.trajectory.push({
      x: centerX + stepRes.nextPos.x * scale,
      y: centerY - stepRes.nextPos.y * scale, // SVG y is inverted
      z: stepRes.nextPos.z * scale,
      vx: stepRes.nextVel.x,
      vy: stepRes.nextVel.y,
      vz: stepRes.nextVel.z,
      time: stateRef.current.time,
    });
    setTime(stateRef.current.time);
  };

  // Reset when key mode or field direction changes
  useEffect(() => {
    handleReset();
  }, [params.mode, params.bFieldDirection, params.chargeNumber, handleReset]);

  // Main Numerical Simulation Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const rawDelta = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        const { bVec, eVec } = getFieldVectors(params);
        // Physical cyclotron period is ~1.3e-7 s for proton.
        // We advance sub-steps for smooth high-accuracy trajectory
        const timeScale = 1.2e-7 * params.animationSpeed;
        const totalDt = rawDelta * timeScale;
        const subSteps = 16;
        const subDt = totalDt / subSteps;

        for (let i = 0; i < subSteps; i++) {
          const stepRes = borisStep(
            stateRef.current.pos,
            stateRef.current.vel,
            params.charge,
            params.mass,
            eVec,
            bVec,
            subDt
          );
          stateRef.current.pos = stepRes.nextPos;
          stateRef.current.vel = stepRes.nextVel;
          stateRef.current.time += subDt;

          // Boundary wrapping / resetting if particle flies out of bounds
          const currentPxX = stateRef.current.pos.x * scale;
          const currentPxY = stateRef.current.pos.y * scale;
          if (
            Math.abs(currentPxX) > width * 0.46 ||
            Math.abs(currentPxY) > height * 0.46
          ) {
            // wrap around smoothly for crossed fields / straight lines
            if (params.mode === 'crossed-fields' || params.mode === 'parallel') {
              stateRef.current.pos.x = -0.22;
              stateRef.current.trajectory = [];
            }
          }
        }

        // Record visual trajectory point
        const ptX = centerX + stateRef.current.pos.x * scale;
        const ptY = centerY - stateRef.current.pos.y * scale;
        const ptZ = stateRef.current.pos.z * scale;

        // Keep last 400 points
        if (stateRef.current.trajectory.length > 400) {
          stateRef.current.trajectory.shift();
        }

        stateRef.current.trajectory.push({
          x: ptX,
          y: ptY,
          z: ptZ,
          vx: stateRef.current.vel.x,
          vy: stateRef.current.vel.y,
          vz: stateRef.current.vel.z,
          time: stateRef.current.time,
        });

        setTime(stateRef.current.time);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, params, scale, centerX, centerY, width, height]);

  // Current Particle Position & Velocity
  const curPos = stateRef.current.pos;
  const curVel = stateRef.current.vel;
  const { bVec, eVec } = getFieldVectors(params);
  const { fVec, fbVec, feVec } = calculateLorentzForce(params.charge, curVel, eVec, bVec);

  // Visual Screen Projection:
  // Standard 2D: X = centerX + pos.x * scale, Y = centerY - pos.y * scale
  // 3D Isometric Projection (for helical mode):
  // X_proj = centerX + (pos.x * 0.866 - pos.z * 0.5) * scale
  // Y_proj = centerY - (pos.y + pos.z * 0.3) * scale
  const is3D = view3DMode || params.mode === 'helical';

  const projectPoint = useCallback(
    (xPhys: number, yPhys: number, zPhys: number) => {
      if (!is3D) {
        return {
          x: centerX + xPhys * scale,
          y: centerY - yPhys * scale,
        };
      }
      // Isometric 3D angle
      const isoX = centerX + (xPhys * 0.88 - zPhys * 0.45) * scale;
      const isoY = centerY - (yPhys * 0.88 + zPhys * 0.28) * scale;
      return { x: isoX, y: isoY };
    },
    [is3D, centerX, centerY, scale]
  );

  const particleScreenPos = projectPoint(curPos.x, curPos.y, curPos.z);

  // Vector drawing scales (arrow lengths in pixels)
  const vMag = vectorMagnitude(curVel);
  const vScale = vMag > 0 ? 55 / vMag : 0;
  const vArrowX = curVel.x * vScale;
  const vArrowY = -curVel.y * vScale; // inverted SVG Y

  const fbMag = vectorMagnitude(fbVec);
  const fbScale = fbMag > 0 ? 50 / fbMag : 0;
  const fbArrowX = fbVec.x * fbScale;
  const fbArrowY = -fbVec.y * fbScale;

  const fMag = vectorMagnitude(fVec);
  const fScale = fMag > 0 ? 55 / fMag : 0;
  const fArrowX = fVec.x * fScale;
  const fArrowY = -fVec.y * fScale;

  // Grid of Magnetic Field Symbols across the Canvas (⊙ or ⊗)
  const bSymbols = useMemo(() => {
    const symbols: { x: number; y: number }[] = [];
    const cols = 9;
    const rows = 5;
    const xStep = width / (cols + 1);
    const yStep = height / (rows + 1);

    for (let c = 1; c <= cols; c++) {
      for (let r = 1; r <= rows; r++) {
        symbols.push({ x: c * xStep, y: r * yStep });
      }
    }
    return symbols;
  }, [width, height]);

  // Construct trajectory SVG path
  const trajectoryPath = useMemo(() => {
    const pts = stateRef.current.trajectory;
    if (pts.length < 2) return '';

    let d = '';
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      // compute projection if 3D
      let ptX = pt.x;
      let ptY = pt.y;
      if (is3D) {
        // undo raw 2D and reproject
        const physX = (pt.x - centerX) / scale;
        const physY = (centerY - pt.y) / scale;
        const physZ = pt.z / scale;
        const pr = projectPoint(physX, physY, physZ);
        ptX = pr.x;
        ptY = pr.y;
      }
      if (i === 0) d += `M ${ptX} ${ptY}`;
      else d += ` L ${ptX} ${ptY}`;
    }
    return d;
  }, [stateRef.current.trajectory, is3D, projectPoint, centerX, centerY, scale]);

  const isPositive = params.chargeNumber > 0;
  const particleColor = isPositive ? '#FBBF24' : '#38BDF8';
  const particleGlow = isPositive ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.4)';

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-3">
      {/* Motion Mode Selector Tabs (Part 8) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#26364D]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mr-1">
            Modes:
          </span>

          <button
            onClick={() => {
              onSelectMode('perpendicular');
              onUpdateParams((p) => ({
                ...p,
                mode: 'perpendicular',
                angleThetaDeg: 90,
                electricFieldEnabled: false,
              }));
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              params.mode === 'perpendicular'
                ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            1. Circular (v ⊥ B)
          </button>

          <button
            onClick={() => {
              onSelectMode('parallel');
              onUpdateParams((p) => ({
                ...p,
                mode: 'parallel',
                angleThetaDeg: 0,
                electricFieldEnabled: false,
              }));
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              params.mode === 'parallel'
                ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            2. Straight (v ∥ B)
          </button>

          <button
            onClick={() => {
              onSelectMode('helical');
              onUpdateParams((p) => ({
                ...p,
                mode: 'helical',
                angleThetaDeg: 45,
                electricFieldEnabled: false,
              }));
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              params.mode === 'helical'
                ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            3. Helical (Spiral)
          </button>

          <button
            onClick={() => {
              onSelectMode('electric-only');
              onUpdateParams((p) => ({
                ...p,
                mode: 'electric-only',
                bFieldStrength: 0,
                electricFieldEnabled: true,
                eFieldStrength: 5.0e5,
                eFieldDirection: 'up',
              }));
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              params.mode === 'electric-only'
                ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            4. Electric Only (E)
          </button>

          <button
            onClick={() => {
              onSelectMode('crossed-fields');
              onUpdateParams((p) => ({
                ...p,
                mode: 'crossed-fields',
                angleThetaDeg: 90,
                bFieldStrength: 0.5,
                bFieldDirection: 'out-of-screen',
                electricFieldEnabled: true,
                eFieldStrength: 1.0e6,
                eFieldDirection: 'up',
                speed: 2.0e6, // exact E/B
                initialVelocityAngleDeg: 0,
              }));
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              params.mode === 'crossed-fields'
                ? 'bg-[#38BDF8] text-[#07111F] font-bold shadow-xs'
                : 'bg-[#17263B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#26364D]'
            }`}
          >
            5. Crossed Fields (v = E/B)
          </button>
        </div>

        {/* 3D Perspective Toggle for Helical Mode */}
        {params.mode === 'helical' && (
          <button
            onClick={() => setView3DMode((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#17263B] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-semibold hover:bg-[#1E334D] cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{view3DMode ? 'View: 3D Isometric' : 'View: 2D Projection'}</span>
          </button>
        )}
      </div>

      {/* Playback Controls & Speed Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs ${
              isPlaying
                ? 'bg-[#17263B] text-[#FBBF24] hover:bg-[#1E334D] border border-[#FBBF24]/40'
                : 'bg-[#38BDF8] text-[#07111F] hover:bg-[#7DD3FC]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleStepForward}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#17263B] text-[#F1F5F9] hover:bg-[#1E334D] border border-[#26364D] transition-colors cursor-pointer"
            title="Step simulation forward 10 nanoseconds"
          >
            <StepForward className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#17263B] text-[#F1F5F9] hover:bg-[#1E334D] border border-[#26364D] transition-colors cursor-pointer"
            title="Reset particle to initial position"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleClearTrail}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#17263B] text-[#94A3B8] hover:text-[#FB7185] hover:bg-[#1E334D] border border-[#26364D] transition-colors cursor-pointer"
            title="Clear trajectory trail"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Trail</span>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#17263B] p-1 rounded-lg border border-[#26364D] text-xs">
            <span className="text-[10px] text-[#94A3B8] px-1 font-mono">Sim Speed:</span>
            {[0.5, 1.0, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => onUpdateParams((p) => ({ ...p, animationSpeed: spd }))}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  params.animationSpeed === spd
                    ? 'bg-[#38BDF8] text-[#07111F] font-bold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1728] border border-[#26364D] text-xs font-mono text-[#F1F5F9]">
            <span className="text-[#94A3B8]">t =</span>
            <span className="text-[#38BDF8] font-bold">{(time * 1e9).toFixed(1)} ns</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Scientific Simulation Canvas */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#26364D] shadow-inner bg-[#0A1526]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none"
          style={{ minHeight: '380px' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="lorentzCanvasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#17263B" strokeWidth="0.8" />
            </pattern>

            {/* Vector Arrow Markers */}
            <marker id="vArrowMarker" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#34D399" />
            </marker>
            <marker id="fbArrowMarker" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FB7185" />
            </marker>
            <marker id="fArrowMarker" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FBBF24" />
            </marker>
            <marker id="eArrowMarker" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#A78BFA" />
            </marker>

            {/* Particle Glow Filter */}
            <filter id="particleGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={width} height={height} fill="#0A1526" />
          <rect width={width} height={height} fill="url(#lorentzCanvasGrid)" />

          {/* Magnetic Field Region Backdrop & Symbols */}
          {params.bFieldStrength > 0 && (
            <g>
              <rect
                x="20"
                y="20"
                width={width - 40}
                height={height - 40}
                fill="#38BDF8"
                fillOpacity="0.03"
                stroke="#38BDF8"
                strokeWidth="1"
                strokeDasharray="4 4"
                rx="8"
              />

              {/* Draw Magnetic Field Direction Symbols ⊙ or ⊗ */}
              {bSymbols.map((sym, i) => (
                <g key={i} transform={`translate(${sym.x}, ${sym.y})`} opacity="0.45">
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
                  {params.bFieldDirection === 'out-of-screen' ? (
                    /* ⊙ Out of Screen: Circle with Dot */
                    <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
                  ) : (
                    /* ⊗ Into Screen: Circle with X */
                    <g stroke="#38BDF8" strokeWidth="1.2">
                      <line x1="-5" y1="-5" x2="5" y2="5" />
                      <line x1="5" y1="-5" x2="-5" y2="5" />
                    </g>
                  )}
                </g>
              ))}

              {/* Magnetic Field Region Watermark */}
              <text
                x={width - 40}
                y="40"
                textAnchor="end"
                fill="#38BDF8"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
                opacity="0.8"
              >
                B = {params.bFieldStrength} T ({params.bFieldDirection === 'out-of-screen' ? '⊙ Out of Screen' : '⊗ Into Screen'})
              </text>
            </g>
          )}

          {/* Electric Field Vector Arrows Across Background (if enabled) */}
          {params.electricFieldEnabled && params.eFieldStrength > 0 && (
            <g opacity="0.35">
              {[120, 240, 360, 480, 600, 720].map((ex) => (
                <g key={ex}>
                  <line
                    x1={ex}
                    y1={params.eFieldDirection === 'up' ? 360 : 100}
                    x2={ex}
                    y2={params.eFieldDirection === 'up' ? 100 : 360}
                    stroke="#A78BFA"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    markerEnd="url(#eArrowMarker)"
                  />
                </g>
              ))}
              <text
                x="35"
                y="40"
                fill="#A78BFA"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                E = {(params.eFieldStrength / 1e5).toFixed(1)}×10⁵ N/C ({params.eFieldDirection.toUpperCase()})
              </text>
            </g>
          )}

          {/* Coordinate Reference Axes in background */}
          <line x1={centerX} y1="30" x2={centerX} y2={height - 30} stroke="#17263B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1={centerY} x2={width - 30} y2={centerY} stroke="#17263B" strokeWidth="1" strokeDasharray="3 3" />

          {/* Trajectory Trail */}
          {trajectoryPath && (
            <path
              d={trajectoryPath}
              fill="none"
              stroke={particleColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />
          )}

          {/* VECTORS AT CURRENT PARTICLE POSITION */}
          {/* 1. Velocity Vector (Green #34D399) */}
          {vMag > 0 && (
            <g>
              <line
                x1={particleScreenPos.x}
                y1={particleScreenPos.y}
                x2={particleScreenPos.x + vArrowX}
                y2={particleScreenPos.y + vArrowY}
                stroke="#34D399"
                strokeWidth="2.8"
                markerEnd="url(#vArrowMarker)"
              />
              <text
                x={particleScreenPos.x + vArrowX * 1.15}
                y={particleScreenPos.y + vArrowY * 1.15}
                fill="#34D399"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                v
              </text>
            </g>
          )}

          {/* 2. Magnetic Force Vector F_B (Red #FB7185) */}
          {fbMag > 1e-15 && (
            <g>
              <line
                x1={particleScreenPos.x}
                y1={particleScreenPos.y}
                x2={particleScreenPos.x + fbArrowX}
                y2={particleScreenPos.y + fbArrowY}
                stroke="#FB7185"
                strokeWidth="2.8"
                markerEnd="url(#fbArrowMarker)"
              />
              <text
                x={particleScreenPos.x + fbArrowX * 1.2}
                y={particleScreenPos.y + fbArrowY * 1.2}
                fill="#FB7185"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                F_B
              </text>
            </g>
          )}

          {/* 3. Total Force Vector F_net (Yellow #FBBF24) if electric field is present */}
          {params.electricFieldEnabled && fMag > 1e-15 && (
            <g>
              <line
                x1={particleScreenPos.x}
                y1={particleScreenPos.y}
                x2={particleScreenPos.x + fArrowX}
                y2={particleScreenPos.y + fArrowY}
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                markerEnd="url(#fArrowMarker)"
              />
              <text
                x={particleScreenPos.x + fArrowX * 1.2}
                y={particleScreenPos.y + fArrowY * 1.2}
                fill="#FBBF24"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                F_net
              </text>
            </g>
          )}

          {/* CHARGED PARTICLE */}
          <g transform={`translate(${particleScreenPos.x}, ${particleScreenPos.y})`}>
            {/* Halo Glow */}
            <circle cx="0" cy="0" r="22" fill={particleColor} fillOpacity="0.25" filter="url(#particleGlowFilter)" />
            {/* Core Body */}
            <circle cx="0" cy="0" r="13" fill={particleColor} stroke="#FFFFFF" strokeWidth="2.2" />

            {/* Charge Sign Inside Particle */}
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#07111F"
              fontSize="14"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              {isPositive ? '+' : '-'}
            </text>

            {/* Charge Badge Label */}
            <rect
              x="-36"
              y="-32"
              width="72"
              height="18"
              rx="4"
              fill="#101D30"
              stroke={particleColor}
              strokeWidth="1"
            />
            <text
              x="0"
              y="-20"
              textAnchor="middle"
              fill={particleColor}
              fontSize="10"
              fontWeight="bold"
              fontFamily="ui-monospace, monospace"
            >
              q = {params.chargeNumber > 0 ? `+${params.chargeNumber}e` : `${params.chargeNumber}e`}
            </text>
          </g>

          {/* Visual Legend (Part 3 Requirement 8) */}
          <g transform="translate(30, 70)">
            <rect x="0" y="0" width="210" height="110" rx="6" fill="#101D30" fillOpacity="0.9" stroke="#26364D" strokeWidth="1" />
            <text x="12" y="18" fill="#F1F5F9" fontSize="10" fontWeight="bold">VISUAL LEGEND</text>

            <line x1="12" y1="34" x2="32" y2="34" stroke="#34D399" strokeWidth="2.5" markerEnd="url(#vArrowMarker)" />
            <text x="40" y="38" fill="#34D399" fontSize="10">Velocity Vector (v)</text>

            <line x1="12" y1="52" x2="32" y2="52" stroke="#FB7185" strokeWidth="2.5" markerEnd="url(#fbArrowMarker)" />
            <text x="40" y="56" fill="#FB7185" fontSize="10">Magnetic Force (F_B = q v × B)</text>

            <circle cx="22" cy="70" r="5" fill="#38BDF8" />
            <text x="40" y="74" fill="#38BDF8" fontSize="10">B-Field (⊙ Out / ⊗ In)</text>

            <line x1="12" y1="88" x2="32" y2="88" stroke="#A78BFA" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#eArrowMarker)" />
            <text x="40" y="92" fill="#A78BFA" fontSize="10">Electric Field (E)</text>
          </g>
        </svg>
      </div>

      {/* Quick Footnote on Energy Conservation */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#94A3B8] pt-1">
        <span>
          <strong className="text-[#F1F5F9]">Crucial Invariant:</strong> Magnetic force acts perpendicular to velocity (<code className="font-mono text-[#38BDF8]">F_B ⊥ v</code>), performing zero work (<code className="font-mono text-[#38BDF8]">W = 0</code>). Speed and kinetic energy remain constant under B alone!
        </span>
        <span className="font-mono text-[#34D399]">
          Speed = {(vMag / 1e6).toFixed(2)} × 10⁶ m/s
        </span>
      </div>
    </div>
  );
};
