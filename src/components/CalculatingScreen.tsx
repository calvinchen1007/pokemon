import React, { useEffect, useState } from 'react';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Synthesizing 5 instinctive choices...',
  'Calibrating signature aura frequency...',
  'Querying official Pokédex telemetry via PokéAPI...',
  'Generating collectible exhibition card...',
];

export const CalculatingScreen: React.FC<CalculatingScreenProps> = ({
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 1750);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      {/* Geometric Pokéball / Exhibition Resonance Graphic */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* Pulsing glow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-ping opacity-25" />
        <div className="absolute inset-2 rounded-full border border-dashed border-zinc-300 animate-spin [animation-duration:8s]" />
        
        {/* Center Pokéball element */}
        <div className="relative w-20 h-20 rounded-full border-2 border-zinc-800 bg-white flex flex-col overflow-hidden shadow-xl shadow-amber-400/15">
          <div className="h-1/2 w-full bg-gradient-to-b from-red-500 to-red-600 border-b-2 border-zinc-900" />
          <div className="h-1/2 w-full bg-zinc-100" />
          {/* Center button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-mono-code text-xs text-amber-600 font-bold uppercase tracking-widest">
          CALCULATING ARCHETYPE MATRIX
        </p>
        <h2 className="font-display text-2xl font-bold text-zinc-900">
          {STEPS[currentStepIndex]}
        </h2>
        <p className="text-xs text-zinc-500 font-mono-code">
          TAIWAN EXPO RESONANCE ALGORITHM // RUNNING
        </p>
      </div>

      {/* Progress ticker dots */}
      <div className="flex items-center gap-2 mt-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStepIndex
                ? 'w-6 bg-amber-500'
                : i < currentStepIndex
                ? 'w-1.5 bg-amber-300'
                : 'w-1.5 bg-zinc-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
