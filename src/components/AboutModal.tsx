import React from 'react';
import { X, Sparkles, HeartHandshake, ShieldCheck, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#12151f] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-mono-code text-[11px] text-amber-400 uppercase tracking-wider block">
              CURATORIAL STATEMENT
            </span>
            <h3 className="font-display text-xl font-bold text-white">
              About PokéVibe
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative */}
        <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-white">PokéVibe</strong> is inspired by the iconic personality tests designed for the Taiwan Design Expo—celebrated worldwide for transforming abstract self-reflection into playful, collectible visual design.
          </p>
          <p>
            Rather than relying on tedious clinical surveys or trivia memory tests, PokéVibe evaluates five core instinctive axes: energy spectrum, emotional core, creative drive, response to crisis, and signature aura.
          </p>
          <p>
            Every result links directly with official live telemetry from <strong className="text-amber-300">PokéAPI</strong>, streaming real official artwork, height, weight, genus, and authentic Pokémon sound cries.
          </p>
        </div>

        {/* Guarantees */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Private · Zero personal data stored or collected</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Creative personality matching for Pokémon fans everywhere</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono-code text-zinc-400">
          <span>DATA: POKEAPI.CO</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-xs font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
