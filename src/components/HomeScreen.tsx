import React from 'react';
import { ArrowRight, Sparkles, Layers, ShieldCheck, HeartHandshake } from 'lucide-react';
import { POKEMON_ARCHETYPES } from '../data/archetypes';

interface HomeScreenProps {
  onStartQuiz: () => void;
  onExploreArchetypes: () => void;
  onGoTalkToUs?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onExploreArchetypes,
  onGoTalkToUs,
}) => {
  // Select 4 showcase Pokémon for the collage
  const showcase = [
    POKEMON_ARCHETYPES.find((p) => p.id === 'gengar')!,
    POKEMON_ARCHETYPES.find((p) => p.id === 'pikachu')!,
    POKEMON_ARCHETYPES.find((p) => p.id === 'sylveon')!,
    POKEMON_ARCHETYPES.find((p) => p.id === 'snorlax')!,
  ];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-5xl my-auto">
        {/* Exhibition Kicker Badge (Taiwan Design Expo aesthetic) */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono-code text-zinc-400">
          <span className="text-amber-400 font-semibold tracking-wider">EXP.2026</span>
          <span aria-hidden="true">·</span>
          <span>TAIWAN DESIGN EXPO INSPIRED</span>
          <span aria-hidden="true">·</span>
          <span className="hidden xs:inline text-zinc-400">5-DIMENSION MATRIX</span>
        </div>

        {/* Main Grid: Responsive 2-column on desktop, mobile-first hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.08]">
                Which Pokémon Are You?
              </h1>
              <p className="font-display text-xl sm:text-2xl font-semibold text-amber-300/95 tracking-tight">
                Your vibe has a face. Let’s find it.
              </p>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              5 questions. Zero wrong answers. One Pokémon that gets you.
            </p>

            {/* Feature Points - Clean typography with no pill enclosures */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>10 Curated Archetypes</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live PokéAPI Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant Card Export</span>
              </div>
            </div>

            {/* CTA Thumb Zone */}
            <div className="pt-4 space-y-3">
              <button
                onClick={onStartQuiz}
                className="group w-full sm:w-auto min-h-[52px] px-8 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-base font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
              >
                <span>Find My Pokémon</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="font-mono-code text-[11px] text-zinc-400 tracking-wider">
                NO KNOWLEDGE REQUIRED · JUST TRUST YOUR INSTINCTS
              </p>
            </div>
          </div>

          {/* Right Column: Visual Collage with Taiwan Design Expo Stamp Poster */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md p-5 rounded-2xl bg-[#141720]/90 border border-white/10 shadow-2xl backdrop-blur-md">
              {/* Card Header Stamp */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[11px] font-mono-code text-zinc-400">
                <span className="text-zinc-300 font-semibold">COLLECTIBLE SPECIMEN</span>
                <span className="text-amber-400">SERIES 01 // 10</span>
              </div>

              {/* Showcase Grid of 4 Pokémon */}
              <div className="grid grid-cols-2 gap-3">
                {showcase.map((p, idx) => (
                  <div
                    key={p.id}
                    className="group relative p-3 rounded-xl border border-white/5 bg-[#0f1118]/80 hover:border-amber-400/40 transition-all text-left overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
                      style={{ backgroundColor: p.colorScheme.primary }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-zinc-400 mb-1">
                      <span>{p.catalogNumber}</span>
                      <span className="uppercase">{p.typePrimary}</span>
                    </div>
                    <div className="h-24 flex items-center justify-center relative">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.pokeApiId}.png`}
                        alt={p.displayName}
                        referrerPolicy="no-referrer"
                        className="max-h-20 w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        loading={idx < 2 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="font-display text-sm font-bold text-white tracking-tight">
                        {p.displayName}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {p.archetypeTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Stamp Footnote */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                <button
                  onClick={onExploreArchetypes}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Explore 10 archetypes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {onGoTalkToUs && (
                  <button
                    onClick={onGoTalkToUs}
                    className="text-zinc-300 hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    Talk to Us →
                  </button>
                )}
                <span className="font-mono-code text-zinc-400 hidden xs:inline">~60s QUIZ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
