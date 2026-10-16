import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Volume2, Sparkles, Layers } from 'lucide-react';
import { POKEMON_ARCHETYPES } from '../data/archetypes';

interface HomeScreenProps {
  onStartQuiz: () => void;
  onExploreArchetypes: () => void;
}

// 4 iconic showcase specimens for the dynamic stage
const SHOWCASE_IDS = ['pikachu', 'gengar', 'sylveon', 'snorlax'] as const;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onExploreArchetypes,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showcaseArchetypes = SHOWCASE_IDS.map(
    (id) => POKEMON_ARCHETYPES.find((p) => p.id === id)!
  );
  const currentArchetype = showcaseArchetypes[activeIndex];

  // Auto-cycle through showcase archetypes every 4.5s if user hasn't manually interacted
  useEffect(() => {
    if (isUserInteracting) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_IDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isUserInteracting]);

  // Play Pokémon sound cry
  const playCry = (pokeApiId: number) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokeApiId}.ogg`;
      const audio = new Audio(cryUrl);
      audio.volume = 0.45;
      audioRef.current = audio;
      setIsPlayingCry(true);

      audio.play().catch(() => {
        // Ignored if browser blocks audio without prior click
      });

      audio.onended = () => setIsPlayingCry(false);
      audio.onerror = () => setIsPlayingCry(false);
    } catch {
      setIsPlayingCry(false);
    }
  };

  const handleSelectSpecimen = (index: number) => {
    setIsUserInteracting(true);
    setActiveIndex(index);
    playCry(showcaseArchetypes[index].pokeApiId);
  };

  // Vibe badges surrounding the central character (inspired by Type of You)
  const vibeBadges = [
    {
      id: 0,
      label: '⚡ HIGH VOLTAGE',
      sub: 'Kinetic Optimism',
      color: '#FBBF24',
      position: 'top-2 sm:top-6 left-2 sm:left-6',
      anim: 'animate-float-smooth',
    },
    {
      id: 1,
      label: '👻 CHAOS CURATOR',
      sub: 'Mischievous Vision',
      color: '#A855F7',
      position: 'top-2 sm:top-6 right-2 sm:right-6',
      anim: 'animate-float-delayed',
    },
    {
      id: 2,
      label: '🎀 HYPER-EMPATHIC',
      sub: 'Harmonic Aura',
      color: '#EC4899',
      position: 'bottom-2 sm:bottom-6 left-2 sm:left-8',
      anim: 'animate-float-delayed',
    },
    {
      id: 3,
      label: '💤 ZEN BATTERY',
      sub: 'Recharge Mode',
      color: '#14B8A6',
      position: 'bottom-2 sm:bottom-6 right-2 sm:right-8',
      anim: 'animate-float-smooth',
    },
  ];

  return (
    <div className="relative w-full h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col justify-between px-4 sm:px-6 py-3 sm:py-5 select-none bg-[#0c0e12]">
      {/* Dynamic Background Ambient Glow matching active archetype */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-1000 opacity-20 blur-[110px]"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${currentArchetype.colorScheme.primary} 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle Archival Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-grain"
        aria-hidden="true"
      />

      {/* Corner Exhibition Crosshairs (Type of You Aesthetic) */}
      <div className="pointer-events-none absolute top-3 left-4 text-[10px] font-mono-code text-zinc-400 hidden sm:block">
        + SPECIMEN MATRIX
      </div>
      <div className="pointer-events-none absolute top-3 right-4 text-[10px] font-mono-code text-zinc-400 hidden sm:block">
        + 10 ARCHETYPES
      </div>
      <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] font-mono-code text-zinc-400 hidden sm:block">
        + 5-AXIS RESONANCE
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono-code text-zinc-400 hidden sm:block">
        + POKÉAPI TELEMETRY
      </div>

      {/* TOP BAR: Clean Exhibition Metadata (NO PILLS, NO EXP.2026) */}
      <div className="relative z-10 flex items-center justify-center pt-1">
        <div className="flex items-center gap-2 text-[11px] font-mono-code text-zinc-400">
          <span className="text-amber-400 font-semibold tracking-wider">POKÉVIBE</span>
          <span aria-hidden="true">·</span>
          <span>PERSONALITY RESONANCE MATRIX</span>
          <span aria-hidden="true" className="hidden xs:inline">·</span>
          <span className="hidden xs:inline">5 INSTINCTIVE AXES</span>
        </div>
      </div>

      {/* CENTER ZONE: The Animated "Type of You" Character Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full max-w-4xl mx-auto px-2">
        {/* Visual Stage Container */}
        <div className="relative w-full max-w-md h-52 sm:h-64 lg:h-72 flex items-center justify-center">
          {/* Layer 1: Outer Rotating Radar Ring */}
          <div
            className="absolute w-48 h-48 sm:w-60 sm:h-60 lg:w-68 lg:h-68 rounded-full border border-dashed border-white/15 animate-radar-spin pointer-events-none"
            aria-hidden="true"
          />

          {/* Layer 2: Counter-Rotating Ring with Calibrated Ticks */}
          <div
            className="absolute w-40 h-40 sm:w-52 sm:h-52 lg:w-56 lg:h-56 rounded-full border border-white/10 animate-radar-spin-rev pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

          {/* Layer 3: Central Ambient Glow Blob */}
          <div
            className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full transition-all duration-700 animate-pulse-glow pointer-events-none blur-xl"
            style={{ backgroundColor: currentArchetype.colorScheme.bgGlow }}
            aria-hidden="true"
          />

          {/* Layer 4: Floating "Type of You" Vibe Badges */}
          {vibeBadges.map((b) => {
            const isCurrent = activeIndex === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleSelectSpecimen(b.id)}
                className={`absolute ${b.position} ${b.anim} z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-lg ${
                  isCurrent
                    ? 'bg-white/15 border-white/40 scale-105 shadow-amber-400/10'
                    : 'bg-[#12151f]/85 border-white/10 hover:border-white/25 hover:scale-102 opacity-85 hover:opacity-100'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-[10px] sm:text-xs font-mono-code font-bold tracking-tight text-white">
                  {b.label}
                </span>
              </button>
            );
          })}

          {/* Layer 5: Central Featured Character (Interactive Cry Tap) */}
          <div
            onClick={() => playCry(currentArchetype.pokeApiId)}
            className="group relative z-10 cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200"
            title="Click to hear Pokémon cry!"
          >
            {/* Ripple wave when playing audio */}
            {isPlayingCry && (
              <div
                className="absolute inset-0 rounded-full border border-amber-400/60 animate-ripple pointer-events-none"
                aria-hidden="true"
              />
            )}

            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 flex items-center justify-center animate-float-smooth">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentArchetype.pokeApiId}.png`}
                alt={currentArchetype.displayName}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] filter transition-all duration-500"
              />

              {/* Sound indicator badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#181b26] border border-white/20 flex items-center justify-center text-amber-400 shadow-md group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <Volume2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isPlayingCry ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            {/* Specimen Identifier pill */}
            <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-code text-zinc-300 bg-[#0f1118]/85 px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
              <span className="text-amber-400 font-semibold">{currentArchetype.catalogNumber}</span>
              <span>·</span>
              <span className="font-bold text-white uppercase">{currentArchetype.displayName}</span>
              <span>·</span>
              <span className="text-zinc-400">{currentArchetype.coreEnergy}</span>
            </div>
          </div>
        </div>

        {/* Specimen Switcher Mini-Dock (Clickable 4 Archetypes) */}
        <div className="flex items-center gap-2 mt-2 sm:mt-3">
          {showcaseArchetypes.map((p, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectSpecimen(idx)}
                className={`relative px-3 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white/15 text-white font-bold border border-white/30 shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: p.colorScheme.primary }}
                />
                <span>{p.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ZONE: Bold Typography & Main Call to Action */}
      <div className="relative z-10 w-full max-w-xl mx-auto text-center space-y-2.5 pb-2">
        {/* Main Headline */}
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Which Pokémon Are You?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-md mx-auto">
            5 intuitive questions · Zero trivia · Discover your true character specimen
          </p>
        </div>

        {/* Primary Launch CTA Button */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={onStartQuiz}
            className="group relative w-full sm:w-auto min-h-[48px] px-8 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-sm sm:text-base font-extrabold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-xl shadow-amber-400/25 active:scale-[0.98] cursor-pointer"
          >
            <span>START TEST</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreArchetypes}
            className="w-full sm:w-auto min-h-[44px] px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>All 10 Archetypes</span>
          </button>
        </div>

        {/* Micro Sub-label */}
        <p className="text-[10px] font-mono-code text-zinc-400 tracking-wider pt-0.5">
          ~60 SECONDS · 100% PRIVATE · INSTANT SPECIMEN CARD
        </p>
      </div>
    </div>
  );
};
