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
  Server,
  ExternalLink,
} from 'lucide-react';
import {
  PokemonArchetype,
  LivePokemonData,
  ApiFetchState,
  PersonalityScoreResult,
  PokemonCharacteristic,
} from '../types';
import { playPokemonCry } from '../services/pokeApi';

interface ResultCardProps {
  scoreResult: PersonalityScoreResult;
  liveData: LivePokemonData | null;
  apiState: ApiFetchState;
  onRetryApi: () => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onSelectPokemonById?: (id: string) => void;
  onOpenCharacteristicsModal?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  scoreResult,
  liveData,
  apiState,
  onRetryApi,
  cardRef,
  onSelectPokemonById,
  onOpenCharacteristicsModal,
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
      className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border p-5 sm:p-7 shadow-2xl transition-card text-left select-none"
      style={{
        backgroundColor: '#11141c',
        borderColor: archetype.colorScheme.border,
        boxShadow: `0 20px 40px -15px ${archetype.colorScheme.bgGlow}, 0 0 0 1px ${archetype.colorScheme.border}`,
      }}
    >
      {/* Ambient background glow behind the card */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: archetype.colorScheme.primary }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: archetype.colorScheme.secondary }}
        aria-hidden="true"
      />

      {/* TOP HEADER: Taiwan Design Expo Exhibition Badge & Specimen ID */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 mb-4 border-b border-white/10 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: archetype.colorScheme.primary }} />
          <span className="font-bold tracking-wider text-white">
            {archetype.catalogNumber}
          </span>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-400 uppercase tracking-widest hidden xs:inline">
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
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              {archetype.displayName}
            </h1>
            <span className="font-display text-base sm:text-lg text-zinc-400 font-medium">
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
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              {archetype.typePrimary}
            </span>
            {archetype.typeSecondary && (
              <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded border border-white/10 text-zinc-400 bg-white/5">
                {archetype.typeSecondary}
              </span>
            )}
          </div>
        </div>

        {/* Archetype Title */}
        <p className="font-display text-lg sm:text-xl font-bold tracking-tight text-amber-300">
          {archetype.archetypeTitle}
        </p>
      </div>

      {/* MAIN SPECIMEN VISUAL & POKEDEX CALLOUT */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-[#0b0d14]/75 border border-white/10 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Official Artwork */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
            <div
              className="absolute inset-2 rounded-full filter blur-xl opacity-35"
              style={{ backgroundColor: archetype.colorScheme.primary }}
            />
            <img
              src={artworkSrc}
              alt={archetype.displayName}
              referrerPolicy="no-referrer"
              className="relative max-h-40 sm:max-h-44 w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Pokédex Metrics & Audio Cry button */}
          <div className="w-full sm:w-auto flex-1 space-y-2.5 text-xs text-zinc-300">
            <div className="space-y-1">
              <span className="font-mono-code text-[10px] uppercase text-zinc-400 tracking-wider">
                POKÉDEX CLASSIFICATION
              </span>
              <p className="font-semibold text-white text-sm">
                {liveData?.genus || 'Rare Specimen'}
              </p>
            </div>

            {/* Height & Weight from live API */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code pt-1 border-t border-white/5">
              <div>
                <span className="text-zinc-400 block text-[9px]">HEIGHT</span>
                <span className="text-zinc-200 font-semibold">
                  {heightMeters ? `${heightMeters} m` : '···'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[9px]">WEIGHT</span>
                <span className="text-zinc-200 font-semibold">
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
                  className="w-full min-h-[36px] px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-[11px] font-medium flex items-center justify-center gap-2 text-zinc-200 cursor-pointer"
                  title="Play official audio cry from PokéAPI"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-400 animate-bounce' : 'text-zinc-400'}`} />
                  <span>{isPlayingAudio ? 'Playing Cry...' : 'Play Pokémon Cry'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live PokéAPI Telemetry Status in Plain Words */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
          {apiState.status === 'loading' && (
            <div className="flex items-center gap-2 text-amber-300">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Connecting to PokéAPI for official Pokédex data...</span>
            </div>
          )}
          {apiState.status === 'slow' && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>PokéAPI is responding slower than usual; metrics loaded.</span>
            </div>
          )}
          {apiState.status === 'error' && (
            <div className="flex items-center justify-between w-full text-rose-300">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[260px]">
                  {apiState.errorMessage || 'PokéAPI request was refused or timed out.'}
                </span>
              </div>
              <button
                type="button"
                onClick={onRetryApi}
                className="text-amber-400 hover:underline font-mono-code text-[10px] ml-2 shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
          {apiState.status === 'success' && (
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono-code text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Live data verified via PokéAPI (pokeapi.co)</span>
            </div>
          )}
        </div>
      </div>

      {/* AUTHENTIC POKÉAPI CHARACTERISTIC TRAIT (Served via serverless function api.js -> https://pokeapi.co/api/v2/characteristic/) */}
      <div className="relative z-10 my-3.5 p-3.5 rounded-2xl bg-[#0e121a]/90 border border-white/10 text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5 font-mono-code text-[10px] text-zinc-400 uppercase tracking-wider">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>PokéAPI Official Characteristic</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono-code text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300">api.js</span>
            {onOpenCharacteristicsModal && (
              <button
                type="button"
                onClick={onOpenCharacteristicsModal}
                className="text-amber-400 hover:underline cursor-pointer ml-1.5"
              >
                Explore All (30) →
              </button>
            )}
          </div>
        </div>

        {liveData?.characteristic ? (
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-display font-bold text-base sm:text-lg text-white">
                  “{liveData.characteristic.description}”
                </span>
                {liveData.characteristic.description_zh && (
                  <span className="text-amber-300 text-xs font-medium">
                    ({liveData.characteristic.description_zh})
                  </span>
                )}
              </div>
              <span className="font-mono-code text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 shrink-0 uppercase">
                {liveData.characteristic.highest_stat.replace('special-', 'Sp. ')}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Official characteristic calculated for highest stat{' '}
              <span className="text-zinc-200 capitalize font-mono-code">
                {liveData.characteristic.highest_stat}
              </span>{' '}
              (gene modulo {liveData.characteristic.gene_modulo}).
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-zinc-400 text-xs py-1">
            <span>Querying characteristic via /api.js serverless function...</span>
            {onOpenCharacteristicsModal && (
              <button
                type="button"
                onClick={onOpenCharacteristicsModal}
                className="text-amber-400 hover:underline font-mono-code text-[10px] cursor-pointer"
              >
                Browse All
              </button>
            )}
          </div>
        )}
      </div>

      {/* PERSONALITY DESCRIPTION PARAGRAPH */}
      <div className="relative z-10 space-y-3 py-1">
        <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
          {archetype.description}
        </p>

        {/* VIBE TAGS - Clean unboxed text with middle-dot separators */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code text-zinc-400 pt-1">
          {archetype.vibeKeywords.map((kw, i) => (
            <React.Fragment key={kw}>
              <span className="text-zinc-300">{kw}</span>
              {i < archetype.vibeKeywords.length - 1 && (
                <span aria-hidden="true" className="text-zinc-400">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CORE SPECIFICATIONS: Core energy, Secret talent, Red flag */}
      <div className="relative z-10 my-4 space-y-2.5 pt-3 border-t border-white/10 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-semibold uppercase text-zinc-400 shrink-0 min-w-[100px]">
            Core energy:
          </span>
          <span className="font-medium text-amber-300">
            {archetype.coreEnergy}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-semibold uppercase text-zinc-400 shrink-0 min-w-[100px]">
            Secret talent:
          </span>
          <span className="text-zinc-200">
            {archetype.secretTalent}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono-code font-semibold uppercase text-rose-400 shrink-0 min-w-[100px]">
            Your red flag:
          </span>
          <span className="text-zinc-300 italic">
            “{archetype.redFlag}”
          </span>
        </div>
      </div>

      {/* COMPATIBILITY: Soulmate & Clash */}
      <div className="relative z-10 pt-3 border-t border-white/10 space-y-2">
        <span className="font-mono-code text-[10px] text-zinc-400 uppercase tracking-widest block">
          RESONANCE COMPATIBILITY
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Soulmate */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-0.5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Soulmate: {archetype.soulmateId.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-normal">
              {archetype.soulmateReason}
            </p>
          </div>

          {/* Clash */}
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Chaos Clash: {archetype.clashId.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-normal">
              {archetype.clashReason}
            </p>
          </div>
        </div>
      </div>

      {/* CARD FOOTER WATERMARK / STAMP */}
      <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex flex-col xs:flex-row items-center justify-between gap-2 text-[10px] font-mono-code text-zinc-400">
        <div>
          <span>POKÉVIBE PERSONALITY TEST · </span>
          <span className="text-zinc-300 font-semibold">DATA: POKÉAPI (POKEAPI.CO)</span>
        </div>
        <div className="text-zinc-400">
          EXHIBIT CERTIFIED #2026
        </div>
      </div>
    </div>
  );
};
