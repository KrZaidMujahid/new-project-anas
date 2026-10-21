/**
 * EQUATION 1 — Circular Motion Simulation Engine
 * Decoupled requestAnimationFrame time stepper with timeline scrubbing and playback control.
 * Frame-rate independent: Physics calculations do not depend on FPS.
 */

export type CircularEngineTickListener = (time: number) => void;
export type CircularEngineStatusListener = (isPlaying: boolean) => void;

export class CircularSimulationEngine {
  private currentTime = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private maxDuration = 10.0;
  private lastRafTime: number | null = null;
  private rafId: number | null = null;

  private tickListeners: Set<CircularEngineTickListener> = new Set();
  private statusListeners: Set<CircularEngineStatusListener> = new Set();

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
    const next = Math.max(0, this.currentTime - stepSeconds);
    this.currentTime = next;
    this.notifyTick();
  }

  public onTick(listener: CircularEngineTickListener): () => void {
    this.tickListeners.add(listener);
    return () => {
      this.tickListeners.delete(listener);
    };
  }

  public onStatusChange(listener: CircularEngineStatusListener): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private scheduleNextFrame(): void {
    if (!this.isPlaying) return;

    this.rafId = requestAnimationFrame((now) => {
      if (!this.isPlaying) return;

      if (this.lastRafTime !== null) {
        const deltaSec = (now - this.lastRafTime) / 1000;
        const simDelta = deltaSec * this.playbackSpeed;
        const newTime = this.currentTime + simDelta;

        if (newTime >= this.maxDuration) {
          // Loop seamlessly for continuous circular motion
          this.currentTime = newTime % this.maxDuration;
          this.notifyTick();
        } else {
          this.currentTime = newTime;
          this.notifyTick();
        }
      }

      this.lastRafTime = now;
      this.scheduleNextFrame();
    });
  }

  private notifyTick(): void {
    for (const listener of this.tickListeners) {
      listener(this.currentTime);
    }
  }

  private notifyStatus(): void {
    for (const listener of this.statusListeners) {
      listener(this.isPlaying);
    }
  }

  public destroy(): void {
    this.pause();
    this.tickListeners.clear();
    this.statusListeners.clear();
  }
}
