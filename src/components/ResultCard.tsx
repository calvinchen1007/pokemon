import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  RefreshCw,
  Heart,
  Zap,
  Info,
  Flame,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import {
  PokemonArchetype,
  LivePokemonData,
  ApiFetchState,
  PersonalityScoreResult,
} from '../types';
import { playPokemonCry } from '../services/pokeApi';

interface ResultCardProps {
  scoreResult: PersonalityScoreResult;
  liveData: LivePokemonData | null;
  apiState: ApiFetchState;
  onRetryApi: () => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSelectPokemonById?: (id: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  scoreResult,
  liveData,
  apiState,
  onRetryApi,
  cardRef,
  onSelectPokemonById,
}) => {
  const { archetype, matchPercentage, traitBreakdown } = scoreResult;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayCry = () => {
    if (!liveData?.cryUrl) return;
    setIsPlayingAudio(true);
    playPokemonCry(liveData.cryUrl);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  // Format height and weight from PokéAPI decimeters/hectograms
  const heightMeters = liveData ? (liveData.height / 10).toFixed(1) : null;
  const weightKg = liveData ? (liveData.weight / 10).toFixed(1) : null;

  const artworkSrc =
    liveData?.artworkUrl ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${archetype.pokeApiId}.png`;

  return (
    <div
      ref={cardRef}
      id="pokemon-personality-card"
      className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border p-5 sm:p-7 shadow-xl transition-card text-left select-none"
      style={{
        backgroundColor: '#ffffff',
        borderColor: archetype.colorScheme.border,
        boxShadow: `0 20px 40px -15px ${archetype.colorScheme.bgGlow}, 0 0 0 1px ${archetype.colorScheme.border}`,
      }}
    >
      {/* Ambient background glow behind the card */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: archetype.colorScheme.primary }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: archetype.colorScheme.secondary }}
        aria-hidden="true"
      />

      {/* TOP HEADER: Taiwan Design Expo Exhibition Badge & Specimen ID */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-200 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: archetype.colorScheme.primary }} />
          <span className="font-bold tracking-wider text-zinc-900">
            {archetype.catalogNumber}
          </span>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 uppercase tracking-widest hidden xs:inline">
            EXP.2026 TAIWAN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded font-mono-code tracking-wider text-zinc-900 font-bold" style={{ backgroundColor: archetype.colorScheme.accent }}>
            {matchPercentage}% MATCH
          </span>
        </div>
      </div>

      {/* POKÉMON TITLE & ARCHETYPE BANNER */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-zinc-900">
              {archetype.displayName}
            </h1>
            <span className="font-display text-base sm:text-lg text-zinc-500 font-medium">
              {archetype.japaneseName}
            </span>
          </div>

          {/* Elemental Types */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded border"
              style={{
                color: archetype.colorScheme.textAccent,
                borderColor: archetype.colorScheme.border,
                backgroundColor: 'rgba(0,0,0,0.03)',
              }}
            >
              {archetype.typePrimary}
            </span>
            {archetype.typeSecondary && (
              <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded border border-zinc-300 text-zinc-600 bg-zinc-100">
                {archetype.typeSecondary}
              </span>
            )}
          </div>
        </div>

        {/* Archetype Title */}
        <p className="font-display text-lg sm:text-xl font-bold tracking-tight text-amber-600">
          {archetype.archetypeTitle}
        </p>
      </div>

      {/* MAIN SPECIMEN VISUAL & POKEDEX CALLOUT */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Official Artwork */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
            <div
              className="absolute inset-2 rounded-full filter blur-xl opacity-25"
              style={{ backgroundColor: archetype.colorScheme.primary }}
            />
            <img
              src={artworkSrc}
              alt={archetype.displayName}
              referrerPolicy="no-referrer"
              className="relative max-h-40 sm:max-h-44 w-auto object-contain drop-shadow-xl transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Pokédex Metrics & Audio Cry button */}
          <div className="w-full sm:w-auto flex-1 space-y-2.5 text-xs text-zinc-700">
            <div className="space-y-1">
              <span className="font-mono-code text-[10px] uppercase text-zinc-500 tracking-wider">
                POKÉDEX CLASSIFICATION
              </span>
              <p className="font-bold text-zinc-900 text-sm">
                {liveData?.genus || 'Rare Specimen'}
              </p>
            </div>

            {/* Height & Weight from live API */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code pt-1 border-t border-zinc-200">
              <div>
                <span className="text-zinc-500 block text-[9px]">HEIGHT</span>
                <span className="text-zinc-800 font-semibold">
                  {heightMeters ? `${heightMeters} m` : '···'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">WEIGHT</span>
                <span className="text-zinc-800 font-semibold">
                  {weightKg ? `${weightKg} kg` : '···'}
                </span>
              </div>
            </div>

            {/* Listen to Cry Audio from PokéAPI */}
            {liveData?.cryUrl && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handlePlayCry}
                  disabled={isPlayingAudio}
                  className="w-full min-h-[36px] px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 active:scale-95 transition-all text-[11px] font-medium flex items-center justify-center gap-2 text-zinc-800 shadow-xs cursor-pointer"
                  title="Play official audio cry from PokéAPI"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-600 animate-bounce' : 'text-zinc-500'}`} />
                  <span>{isPlayingAudio ? 'Playing Cry...' : 'Play Pokémon Cry'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live PokéAPI Telemetry Status in Plain Words */}
        <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[11px]">
          {apiState.status === 'loading' && (
            <div className="flex items-center gap-2 text-amber-700 font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Connecting to PokéAPI for official Pokédex data...</span>
            </div>
          )}
          {apiState.status === 'slow' && (
            <div className="flex items-center gap-1.5 text-amber-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>PokéAPI is responding slower than usual; metrics loaded.</span>
            </div>
          )}
          {apiState.status === 'error' && (
            <div className="flex items-center justify-between w-full text-rose-600">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[260px]">
                  {apiState.errorMessage || 'PokéAPI request was refused or timed out.'}
                </span>
              </div>
              <button
                type="button"
                onClick={onRetryApi}
                className="text-amber-600 hover:underline font-mono-code text-[10px] ml-2 shrink-0 cursor-pointer font-bold"
              >
                Retry
              </button>
            </div>
          )}
          {apiState.status === 'success' && (
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono-code text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Live data verified via PokéAPI (pokeapi.co)</span>
            </div>
          )}
        </div>
      </div>

      {/* PERSONALITY DESCRIPTION PARAGRAPH */}
      <div className="relative z-10 space-y-3 py-1">
        <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
          {archetype.description}
        </p>

        {/* VIBE TAGS - Clean unboxed text with middle-dot separators */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code text-zinc-500 pt-1">
          {archetype.vibeKeywords.map((kw, i) => (
            <React.Fragment key={kw}>
              <span className="text-zinc-800 font-medium">{kw}</span>
              {i < archetype.vibeKeywords.length - 1 && (
                <span aria-hidden="true" className="text-zinc-400">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CORE SPECIFICATIONS: Core energy, Secret talent, Red flag */}
      <div className="relative z-10 my-4 space-y-2.5 pt-3 border-t border-zinc-200 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-bold uppercase text-zinc-500 shrink-0 min-w-[100px]">
            Core energy:
          </span>
          <span className="font-semibold text-amber-700">
            {archetype.coreEnergy}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-bold uppercase text-zinc-500 shrink-0 min-w-[100px]">
            Secret talent:
          </span>
          <span className="text-zinc-800 font-medium">
            {archetype.secretTalent}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-bold uppercase text-rose-600 shrink-0 min-w-[100px]">
            Your red flag:
          </span>
          <span className="text-zinc-700 italic">
            “{archetype.redFlag}”
          </span>
        </div>
      </div>

      {/* COMPATIBILITY: Soulmate & Clash */}
      <div className="relative z-10 pt-3 border-t border-zinc-200 space-y-2">
        <span className="font-mono-code text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
          RESONANCE COMPATIBILITY
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Soulmate */}
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-0.5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Soulmate: {archetype.soulmateId.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-normal">
              {archetype.soulmateReason}
            </p>
          </div>

          {/* Clash */}
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Chaos Clash: {archetype.clashId.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-normal">
              {archetype.clashReason}
            </p>
          </div>
        </div>
      </div>

      {/* CARD FOOTER WATERMARK / STAMP */}
      <div className="relative z-10 mt-5 pt-3 border-t border-zinc-200 flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] font-mono-code text-zinc-500">
        <div>
          <span>POKÉVIBE PERSONALITY TEST · </span>
          <span className="text-zinc-800 font-semibold">DATA: POKÉAPI (POKEAPI.CO)</span>
        </div>
        <div className="text-zinc-500">
          EXHIBIT CERTIFIED #2026
        </div>
      </div>
    </div>
  );
};
