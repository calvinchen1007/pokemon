import React, { useState } from 'react';
import { X, Volume2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { POKEMON_ARCHETYPES } from '../data/archetypes';
import { PokemonArchetype } from '../types';

interface RosterGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchetype?: (archetype: PokemonArchetype) => void;
}

export const RosterGalleryModal: React.FC<RosterGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectArchetype,
}) => {
  const [selectedArch, setSelectedArch] = useState<PokemonArchetype>(
    POKEMON_ARCHETYPES[0]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-xs text-amber-600 font-bold tracking-wider">
                EXPO CATALOGUE
              </span>
              <span className="text-zinc-400 text-xs">/</span>
              <span className="text-zinc-600 text-xs font-medium">10 CURATED SPECIMENS</span>
            </div>
            <h3 className="font-display text-xl font-bold text-zinc-900">
              The Pokémon Personality Archetypes
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view on desktop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-white">
          {/* Left Column: Archetype List */}
          <div className="md:col-span-5 space-y-2">
            <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-wider mb-2 font-medium">
              SELECT AN ARCHETYPE
            </p>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {POKEMON_ARCHETYPES.map((arch) => {
                const isSelected = selectedArch.id === arch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArch(arch)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-xs'
                        : 'bg-zinc-50/70 border-zinc-200 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arch.pokeApiId}.png`}
                      alt={arch.displayName}
                      className="w-10 h-10 object-contain drop-shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-zinc-900 truncate">
                          {arch.displayName}
                        </span>
                        <span className="font-mono-code text-[10px] text-zinc-500 font-medium">
                          {arch.catalogNumber}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {arch.archetypeTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Specimen Profile */}
          <div className="md:col-span-7 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-[11px] text-amber-600 font-bold">
                      {selectedArch.catalogNumber}
                    </span>
                    <span className="text-xs font-mono-code text-zinc-600 uppercase px-2 py-0.5 rounded border border-zinc-200 bg-white font-medium">
                      {selectedArch.typePrimary}
                    </span>
                  </div>
                  <h4 className="font-display text-2xl font-extrabold text-zinc-900 mt-1">
                    {selectedArch.displayName}
                  </h4>
                  <p className="text-sm font-bold text-amber-600">
                    {selectedArch.archetypeTitle}
                  </p>
                </div>

                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedArch.pokeApiId}.png`}
                  alt={selectedArch.displayName}
                  className="w-24 h-24 object-contain drop-shadow-md"
                />
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {selectedArch.description}
              </p>

              <div className="space-y-2 text-xs border-t border-zinc-200 pt-3">
                <div>
                  <span className="font-mono-code text-zinc-500 uppercase text-[10px] block font-medium">
                    Core Energy
                  </span>
                  <span className="text-zinc-900 font-semibold">
                    {selectedArch.coreEnergy}
                  </span>
                </div>
                <div>
                  <span className="font-mono-code text-zinc-500 uppercase text-[10px] block font-medium">
                    Secret Talent
                  </span>
                  <span className="text-zinc-800 font-medium">
                    {selectedArch.secretTalent}
                  </span>
                </div>
                <div>
                  <span className="font-mono-code text-rose-600 uppercase text-[10px] block font-bold">
                    Playful Red Flag
                  </span>
                  <span className="text-zinc-700 italic">
                    “{selectedArch.redFlag}”
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-zinc-500">
                DATA: POKÉAPI (POKEAPI.CO)
              </span>

              {onSelectArchetype && (
                <button
                  onClick={() => {
                    onSelectArchetype(selectedArch);
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-xs font-bold rounded-lg transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  View Specimen Card
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
