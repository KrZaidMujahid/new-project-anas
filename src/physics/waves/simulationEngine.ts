/**
 * EQUATION 1 — Wave Interference Simulation Engine
 * Decoupled requestAnimationFrame time stepper with timeline scrubbing and speed multiplier.
 */

export type WaveEngineTickListener = (time: number) => void;
export type WaveEngineStatusListener = (isPlaying: boolean) => void;

export class WaveSimulationEngine {
  private currentTime = 0;
  private isPlaying = true;
  private playbackSpeed = 1.0;
  private maxDuration = 20.0;
  private loop = true;
  private lastRafTime: number | null = null;
  private rafId: number | null = null;

  private tickListeners: Set<WaveEngineTickListener> = new Set();
  private statusListeners: Set<WaveEngineStatusListener> = new Set();

  constructor(maxDuration = 20.0, loop = true) {
    this.maxDuration = maxDuration;
    this.loop = loop;
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
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
  }

  public setMaxDuration(duration: number): void {
    this.maxDuration = Math.max(1.0, duration);
  }

  public getMaxDuration(): number {
    return this.maxDuration;
  }

  public play(): void {
    if (this.isPlaying) return;

    if (this.currentTime >= this.maxDuration && !this.loop) {
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
    let next = this.currentTime + stepSeconds;
    if (next > this.maxDuration) {
      next = this.loop ? next % this.maxDuration : this.maxDuration;
    }
    this.currentTime = next;
    this.notifyTick();
  }

  public stepBackward(stepSeconds = 0.05): void {
    this.pause();
    let next = this.currentTime - stepSeconds;
    if (next < 0) {
      next = this.loop ? this.maxDuration + next : 0;
    }
    this.currentTime = Math.max(0, next);
    this.notifyTick();
  }

  public onTick(listener: WaveEngineTickListener): () => void {
    this.tickListeners.add(listener);
    return () => {
      this.tickListeners.delete(listener);
    };
  }

  public onStatusChange(listener: WaveEngineStatusListener): () => void {
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
        // Limit delta to 0.1s to avoid huge time jumps when switching tabs
        const deltaSec = Math.min(0.1, (now - this.lastRafTime) / 1000);
        const simDelta = deltaSec * this.playbackSpeed;
        let newTime = this.currentTime + simDelta;

        if (newTime >= this.maxDuration) {
          if (this.loop) {
            newTime = newTime % this.maxDuration;
            this.currentTime = newTime;
            this.notifyTick();
          } else {
            this.currentTime = this.maxDuration;
            this.pause();
            this.notifyTick();
            return;
          }
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
