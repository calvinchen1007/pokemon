import React from 'react';
import { X, Sparkles, HeartHandshake, ShieldCheck, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="font-mono-code text-[11px] text-amber-600 font-bold uppercase tracking-wider block">
              CURATORIAL STATEMENT
            </span>
            <h3 className="font-display text-xl font-bold text-zinc-900">
              About PokéVibe
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative */}
        <div className="space-y-3.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
          <p>
            <strong className="text-zinc-900 font-bold">PokéVibe</strong> is inspired by the iconic personality tests designed for the Taiwan Design Expo—celebrated worldwide for transforming abstract self-reflection into playful, collectible visual design.
          </p>
          <p>
            Rather than relying on tedious clinical surveys or trivia memory tests, PokéVibe evaluates five core instinctive axes: energy spectrum, emotional core, creative drive, response to crisis, and signature aura.
          </p>
          <p>
            Every result links directly with official live telemetry from <strong className="text-amber-600 font-bold">PokéAPI</strong>, streaming real official artwork, height, weight, genus, and authentic Pokémon sound cries.
          </p>
        </div>

        {/* Guarantees */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Private · Zero personal data stored or collected</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-700">
            <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Creative personality matching for Pokémon fans everywhere</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs font-mono-code text-zinc-500">
          <span>DATA: POKEAPI.CO</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-xs font-bold rounded-lg transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
