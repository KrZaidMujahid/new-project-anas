/**
 * EQUATION 1 — Resonance Numerical Simulation Engine
 * Decoupled requestAnimationFrame time-stepper using RK4 sub-stepping,
 * circular displacement history buffer, power integration, and speed controls.
 */

import {
  ResonanceParameters,
  LiveOscillatorState,
  OscillatorHistoryPoint,
} from './types';
import { rk4Step, computeLiveOscillatorState } from './model';

export type ResonanceTickListener = (state: LiveOscillatorState) => void;
export type ResonanceStatusListener = (isPlaying: boolean) => void;

export class ResonanceSimulationEngine {
  private params: ResonanceParameters;
  private time = 0;
  private x = 0;
  private v = 0;
  private cumulativeDissipation = 0;
  private cumulativeWork = 0;

  private isPlaying = false;
  private playbackSpeed = 1.0;
  private animFrameId: number | null = null;
  private lastTimestamp: number | null = null;

  // Fixed size history buffer for live oscillation graphing (max 500 samples)
  private maxHistorySamples = 500;
  private history: OscillatorHistoryPoint[] = [];

  private tickListeners: Set<ResonanceTickListener> = new Set();
  private statusListeners: Set<ResonanceStatusListener> = new Set();

  constructor(initialParams: ResonanceParameters) {
    this.params = { ...initialParams };
    this.x = initialParams.initialDisplacement || 0;
    this.v = initialParams.initialVelocity || 0;
    this.recordHistoryPoint();
  }

  public updateParameters(newParams: ResonanceParameters) {
    this.params = { ...newParams };
  }

  public getParameters(): ResonanceParameters {
    return { ...this.params };
  }

  public getCurrentState(): LiveOscillatorState {
    return computeLiveOscillatorState(
      this.params,
      this.time,
      this.x,
      this.v,
      this.cumulativeDissipation,
      this.cumulativeWork
    );
  }

  public getHistory(): OscillatorHistoryPoint[] {
    return this.history;
  }

  public onTick(listener: ResonanceTickListener): () => void {
    this.tickListeners.add(listener);
    return () => this.tickListeners.delete(listener);
  }

  public onStatusChange(listener: ResonanceStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = null;
    this.notifyStatus(true);
    this.loop();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.lastTimestamp = null;
    this.notifyStatus(false);
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  public reset(newDisplacement = 0, newVelocity = 0) {
    this.pause();
    this.time = 0;
    this.x = newDisplacement;
    this.v = newVelocity;
    this.cumulativeDissipation = 0;
    this.cumulativeWork = 0;
    this.history = [];
    this.recordHistoryPoint();
    this.notifyTick();
  }

  public setPlaybackSpeed(speed: number) {
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
  }

  public stepForward(dtSeconds = 0.02) {
    this.advanceTime(dtSeconds);
    this.notifyTick();
  }

  public destroy() {
    this.pause();
    this.tickListeners.clear();
    this.statusListeners.clear();
  }

  private advanceTime(dt: number) {
    // Internal RK4 sub-stepping with fixed subDt = 0.001s for numerical stability
    const subDt = 0.001;
    let remaining = dt;

    while (remaining > 0) {
      const stepDt = Math.min(remaining, subDt);
      const step = rk4Step(this.params, this.time, this.x, this.v, stepDt);

      // Power integration
      const avgV = 0.5 * (this.v + step.vNext);
      const avgT = this.time + 0.5 * stepDt;
      const omegaD = 2 * Math.PI * this.params.drivingFrequencyHz;
      const avgFdrive = this.params.drivingForceAmplitude * Math.sin(omegaD * avgT);

      this.cumulativeDissipation += this.params.dampingCoefficient * avgV * avgV * stepDt;
      this.cumulativeWork += avgFdrive * avgV * stepDt;

      this.time = step.tNext;
      this.x = step.xNext;
      this.v = step.vNext;

      remaining -= stepDt;
    }

    // Safety checks against numerical overflow or NaN
    if (!Number.isFinite(this.x) || Math.abs(this.x) > 20.0) {
      this.x = Math.sign(this.x) * 1.5;
      this.v = 0;
    }

    this.recordHistoryPoint();
  }

  private recordHistoryPoint() {
    const omegaD = 2 * Math.PI * this.params.drivingFrequencyHz;
    const normForce =
      this.params.drivingForceAmplitude > 0
        ? Math.sin(omegaD * this.time)
        : 0;

    const k = this.params.springConstant;
    const m = this.params.mass;

    const point: OscillatorHistoryPoint = {
      time: this.time,
      displacement: this.x,
      drivingForceNormalized: normForce,
      velocity: this.v,
      kineticEnergy: 0.5 * m * this.v * this.v,
      potentialEnergy: 0.5 * k * this.x * this.x,
    };

    this.history.push(point);
    if (this.history.length > this.maxHistorySamples) {
      this.history.shift();
    }
  }

  private loop = (timestamp?: number) => {
    if (!this.isPlaying) return;

    if (timestamp !== undefined) {
      if (this.lastTimestamp !== null) {
        const deltaMs = timestamp - this.lastTimestamp;
        // Limit max delta to 0.1s to prevent huge jumps when switching tabs
        const dt = Math.min(0.1, deltaMs / 1000) * this.playbackSpeed;
        this.advanceTime(dt);
        this.notifyTick();
      }
      this.lastTimestamp = timestamp;
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private notifyTick() {
    const state = this.getCurrentState();
    this.tickListeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Tick listener error:', err);
      }
    });
  }

  private notifyStatus(playing: boolean) {
    this.statusListeners.forEach((listener) => {
      try {
        listener(playing);
      } catch (err) {
        console.error('Status listener error:', err);
      }
    });
  }
}
