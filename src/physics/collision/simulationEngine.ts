/**
 * EQUATION 1 — Collision Simulation Engine
 * Decoupled requestAnimationFrame time stepper with timeline scrubbing and playback control.
 * Frame-rate independent: Physics calculations do not depend on FPS.
 */

export type CollisionEngineTickListener = (time: number) => void;
export type CollisionEngineStatusListener = (isPlaying: boolean) => void;

export class CollisionSimulationEngine {
  private currentTime = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private maxDuration = 6.0;
  private lastRafTime: number | null = null;
  private rafId: number | null = null;

  private tickListeners: Set<CollisionEngineTickListener> = new Set();
  private statusListeners: Set<CollisionEngineStatusListener> = new Set();

  constructor(maxDuration = 6.0) {
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

  public onTick(listener: CollisionEngineTickListener): () => void {
    this.tickListeners.add(listener);
    return () => {
      this.tickListeners.delete(listener);
    };
  }

  public onStatusChange(listener: CollisionEngineStatusListener): () => void {
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
          this.currentTime = this.maxDuration;
          this.pause();
          this.notifyTick();
          return;
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
