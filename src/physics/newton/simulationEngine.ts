/**
 * EQUATION 1 — Newton's Laws Simulation Engine
 * Decoupled requestAnimationFrame loop with high-precision time-stepping.
 */

export type NewtonEngineTickListener = (time: number) => void;
export type NewtonEngineStatusListener = (isPlaying: boolean) => void;

export class NewtonSimulationEngine {
  private currentTime = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private maxDuration = 10.0;
  private lastRafTime: number | null = null;
  private rafId: number | null = null;

  private tickListeners: Set<NewtonEngineTickListener> = new Set();
  private statusListeners: Set<NewtonEngineStatusListener> = new Set();

  constructor(maxDuration = 10.0) {
    this.maxDuration = maxDuration;
  }

  public getCurrentTime(): number {
    return this.currentTime;
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

  public setMaxDuration(duration: number): void {
    this.maxDuration = Math.max(1, duration);
  }

  public getMaxDuration(): number {
    return this.maxDuration;
  }

  public play(): void {
    if (this.isPlaying) return;

    if (this.currentTime >= this.maxDuration) {
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
    const clamped = Math.max(0, Math.min(this.maxDuration, time));
    this.currentTime = clamped;
    this.notifyTick();
  }

  public stepForward(stepSeconds = 0.05): void {
    this.pause();
    const next = Math.min(this.maxDuration, this.currentTime + stepSeconds);
    this.currentTime = next;
    this.notifyTick();
  }

  public stepBackward(stepSeconds = 0.05): void {
    this.pause();
    const prev = Math.max(0, this.currentTime - stepSeconds);
    this.currentTime = prev;
    this.notifyTick();
  }

  public onTick(listener: NewtonEngineTickListener): () => void {
    this.tickListeners.add(listener);
    return () => this.tickListeners.delete(listener);
  }

  public onStatusChange(listener: NewtonEngineStatusListener): () => void {
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

    if (this.currentTime >= this.maxDuration) {
      this.currentTime = this.maxDuration;
      this.pause();
      this.notifyTick();
      return;
    }

    this.notifyTick();
    this.scheduleNextFrame();
  }

  private notifyTick(): void {
    this.tickListeners.forEach((listener) => {
      try {
        listener(this.currentTime);
      } catch (err) {
        console.error('Error in Newton simulation tick listener', err);
      }
    });
  }

  private notifyStatus(): void {
    this.statusListeners.forEach((listener) => {
      try {
        listener(this.isPlaying);
      } catch (err) {
        console.error('Error in Newton simulation status listener', err);
      }
    });
  }
}
