import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenTalkToUs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTalkToUs }) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0c10] py-8 text-xs text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-medium text-zinc-300">
              PokéVibe Personality Resonance Test
            </p>
            <p className="text-zinc-400">
              Inspired by the Taiwan Design Expo identity concept. Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and GAME FREAK inc.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="flex items-center gap-3">
              {onOpenTalkToUs && (
                <button
                  onClick={onOpenTalkToUs}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Talk to Us (Disqus Forum)</span>
                </button>
              )}
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="font-mono-code text-zinc-300">
                Data: <a href="https://pokeapi.co" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">PokéAPI</a>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Zero personal data collected · Session-only state
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
