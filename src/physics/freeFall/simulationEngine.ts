/**
 * EQUATION 1 — Free Fall Simulation Engine
 * High-precision, decoupled time-stepping engine using requestAnimationFrame.
 */

import {
  calculateFreeFallAnalytical,
  computeFreeFallStateAtTime,
} from './model';
import {
  FreeFallAnalytical,
  FreeFallParameters,
  FreeFallState,
} from './types';

export type FreeFallTickListener = (state: FreeFallState, analytical: FreeFallAnalytical) => void;
export type FreeFallStatusListener = (isPlaying: boolean, isCompleted: boolean) => void;

export class FreeFallSimulationEngine {
  private params: FreeFallParameters;
  private analytical: FreeFallAnalytical;
  private currentTime = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private lastRafTime: number | null = null;
  private rafId: number | null = null;

  private tickListeners: Set<FreeFallTickListener> = new Set();
  private statusListeners: Set<FreeFallStatusListener> = new Set();

  constructor(initialParams: FreeFallParameters) {
    this.params = { ...initialParams };
    this.analytical = calculateFreeFallAnalytical(this.params);
  }

  public updateParameters(params: FreeFallParameters): void {
    const wasPlaying = this.isPlaying;
    this.params = { ...params };
    this.analytical = calculateFreeFallAnalytical(this.params);

    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;
    if (this.currentTime >= maxTime) {
      this.currentTime = 0;
      if (wasPlaying) {
        this.pause();
      }
    }

    this.notifyTick();
  }

  public getParameters(): FreeFallParameters {
    return { ...this.params };
  }

  public getAnalyticalResults(): FreeFallAnalytical {
    return this.analytical;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getCurrentState(): FreeFallState {
    return computeFreeFallStateAtTime(this.params, this.currentTime);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  public setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(10, speed));
  }

  public play(): void {
    if (this.isPlaying) return;

    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;
    if (this.currentTime >= maxTime) {
      this.currentTime = 0;
    }

    this.isPlaying = true;
    this.lastRafTime = performance.now();
    this.notifyStatus();
    this.scheduleNextFrame();
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.lastRafTime = null;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notifyStatus();
  }

  public togglePlayPause(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public reset(): void {
    this.pause();
    this.currentTime = 0;
    this.notifyTick();
    this.notifyStatus();
  }

  public restart(): void {
    this.reset();
    this.play();
  }

  public seekTo(time: number): void {
    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;
    const clamped = Math.max(0, Math.min(maxTime, time));
    this.currentTime = clamped;
    this.notifyTick();
  }

  public stepForward(stepSeconds = 0.05): void {
    this.pause();
    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;
    const nextTime = Math.min(maxTime, this.currentTime + stepSeconds);
    this.currentTime = nextTime;
    this.notifyTick();
  }

  public stepBackward(stepSeconds = 0.05): void {
    this.pause();
    const prevTime = Math.max(0, this.currentTime - stepSeconds);
    this.currentTime = prevTime;
    this.notifyTick();
  }

  public onTick(listener: FreeFallTickListener): () => void {
    this.tickListeners.add(listener);
    return () => this.tickListeners.delete(listener);
  }

  public onStatusChange(listener: FreeFallStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public destroy(): void {
    this.pause();
    this.tickListeners.clear();
    this.statusListeners.clear();
  }

  private scheduleNextFrame(): void {
    this.rafId = requestAnimationFrame((now) => this.onFrame(now));
  }

  private onFrame(now: number): void {
    if (!this.isPlaying) return;

    if (this.lastRafTime === null) {
      this.lastRafTime = now;
    }

    const elapsedRealSec = (now - this.lastRafTime) / 1000;
    this.lastRafTime = now;

    // Safety clamp (max 100ms real delta)
    const clampedRealSec = Math.min(0.1, elapsedRealSec);
    const simDt = clampedRealSec * this.playbackSpeed;

    this.currentTime += simDt;

    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;

    if (this.currentTime >= maxTime) {
      this.currentTime = maxTime;
      this.pause();
      this.notifyTick();
      return;
    }

    this.notifyTick();
    this.scheduleNextFrame();
  }

  private notifyTick(): void {
    const state = this.getCurrentState();
    this.tickListeners.forEach((listener) => {
      try {
        listener(state, this.analytical);
      } catch (err) {
        console.error('Error in Free Fall tick listener', err);
      }
    });
  }

  private notifyStatus(): void {
    const maxTime = isFinite(this.analytical.timeToGround) ? this.analytical.timeToGround : 100;
    const isCompleted = this.currentTime >= maxTime;
    this.statusListeners.forEach((listener) => {
      try {
        listener(this.isPlaying, isCompleted);
      } catch (err) {
        console.error('Error in Free Fall status listener', err);
      }
    });
  }
}
