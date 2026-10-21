import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Square, Info, Sparkles } from 'lucide-react';

interface DopplerAudioDemoProps {
  sourceFrequency: number;
  observedFrequency: number;
}

export const DopplerAudioDemo: React.FC<DopplerAudioDemoProps> = ({
  sourceFrequency,
  observedFrequency,
}) => {
  const [isPlaying, setIsPlaying] = useState<'none' | 'emitted' | 'observed'>('none');
  const [volume, setVolume] = useState(0.2); // safe comfortable default volume
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Initialize or get AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Stop currently playing tone
  const stopAudio = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }
    setIsPlaying('none');
  }, []);

  // Play a specific frequency
  const playTone = useCallback(
    (freq: number, mode: 'emitted' | 'observed') => {
      stopAudio();

      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Clamp frequency to reasonable audible band
        const safeFreq = Math.max(50, Math.min(3000, freq));
        osc.frequency.setValueAtTime(safeFreq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        // Soft attack to prevent click
        gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setIsPlaying(mode);
      } catch (err) {
        console.warn('Web Audio playback error:', err);
      }
    },
    [getAudioContext, stopAudio, volume]
  );

  // Update frequency live if slider changes while tone is actively playing
  useEffect(() => {
    if (isPlaying === 'emitted' && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(sourceFrequency, audioCtxRef.current.currentTime);
    } else if (isPlaying === 'observed' && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(observedFrequency, audioCtxRef.current.currentTime);
    }
  }, [sourceFrequency, observedFrequency, isPlaying]);

  // Adjust volume live
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAudio]);

  return (
    <div className="bg-[#101D30] rounded-xl border border-[#26364D] p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26364D]">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wide">
            Acoustic Pitch Auditory Demonstration
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-[#94A3B8]">Volume:</span>
          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-[#38BDF8] cursor-pointer"
          />
        </div>
      </div>

      {/* Button Cluster for Hearing Pitch Difference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Play Emitted Frequency */}
        <button
          onClick={() => playTone(sourceFrequency, 'emitted')}
          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
            isPlaying === 'emitted'
              ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] shadow-md ring-1 ring-[#38BDF8]'
              : 'bg-[#17263B] border-[#26364D] text-[#F1F5F9] hover:bg-[#1E334D] hover:border-[#38BDF8]/50'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold">1. Emitted Tone (fs)</span>
            <span className="text-sm font-mono font-bold text-[#38BDF8]">
              {sourceFrequency.toFixed(1)} Hz
            </span>
          </div>
          <Play className="w-4 h-4 fill-current shrink-0" />
        </button>

        {/* Play Observed Frequency */}
        <button
          onClick={() => playTone(observedFrequency, 'observed')}
          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
            isPlaying === 'observed'
              ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399] shadow-md ring-1 ring-[#34D399]'
              : 'bg-[#17263B] border-[#26364D] text-[#F1F5F9] hover:bg-[#1E334D] hover:border-[#34D399]/50'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold">2. Observed Pitch (f_obs)</span>
            <span className="text-sm font-mono font-bold text-[#34D399]">
              {observedFrequency.toFixed(1)} Hz
            </span>
          </div>
          <Play className="w-4 h-4 fill-current shrink-0" />
        </button>

        {/* Stop Sound */}
        <button
          onClick={stopAudio}
          disabled={isPlaying === 'none'}
          className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer ${
            isPlaying !== 'none'
              ? 'bg-[#FB7185]/20 border-[#FB7185] text-[#FB7185] hover:bg-[#FB7185]/30'
              : 'bg-[#17263B]/40 border-[#26364D] text-[#94A3B8] opacity-50 cursor-not-allowed'
          }`}
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop Audio</span>
        </button>
      </div>

      {/* Explanatory Notice */}
      <div className="bg-[#17263B] border border-[#26364D] rounded-lg p-3 text-xs text-[#94A3B8] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F1F5F9]">Educational Approximation:</strong> The Web Audio synthesizer generates pure sinusoidal tones at the calculated physical frequencies so you can directly perceive the pitch shift with your own ears. Listen to the pitch jump as you toggle between emitted and observed!
        </p>
      </div>
    </div>
  );
};
