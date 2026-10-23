"use client";

import { useEffect, useRef } from "react";
import { useDepthStore } from "@/store/useDepthStore";

/**
 * Procedural underwater ambient sound generator using Web Audio API.
 * 100% self-contained, 0KB external audio assets, works seamlessly on all browsers.
 */
export function useAmbientOceanAudio() {
  const soundEnabled = useDepthStore((state) => state.soundEnabled);
  const depth = useDepthStore((state) => state.depth);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!soundEnabled) {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.4
        );
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create Brown Noise for authentic deep oceanic ambient rumble
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 1.8; // boost low rumble
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      noiseSourceRef.current = whiteNoise;

      // Low pass filter simulating deep water pressure
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filterRef.current = filter;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
      masterGainRef.current = masterGain;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Graceful fallback if Web Audio is restricted
    }

    return () => {
      if (noiseSourceRef.current) {
        try {
          noiseSourceRef.current.stop();
          noiseSourceRef.current.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, [soundEnabled]);

  // Adjust lowpass frequency as depth increases
  useEffect(() => {
    if (filterRef.current && audioCtxRef.current && soundEnabled) {
      // Frequency goes lower (deeper and more muffled) as depth reaches 100m
      const targetFreq = Math.max(90, 240 - depth * 1.4);
      filterRef.current.frequency.setTargetAtTime(
        targetFreq,
        audioCtxRef.current.currentTime,
        0.3
      );
    }
  }, [depth, soundEnabled]);
}
