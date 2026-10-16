/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Server,
  ExternalLink,
  RefreshCw,
  Check,
  Search,
  Code2,
} from 'lucide-react';
import { PokemonCharacteristic } from '../types';
import { fetchAllCharacteristicsFromApi, fetchCharacteristicFromApi } from '../services/pokeApi';

interface CharacteristicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStat?: string;
  onSelectCharacteristic?: (char: PokemonCharacteristic) => void;
}

const STAT_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'hp': { label: 'HP (Hit Points)', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  'attack': { label: 'Attack', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  'defense': { label: 'Defense', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  'special-attack': { label: 'Sp. Attack', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
  'special-defense': { label: 'Sp. Defense', color: '#EC4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.25)' },
  'speed': { label: 'Speed', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
};

export const CharacteristicsModal: React.FC<CharacteristicsModalProps> = ({
  isOpen,
  onClose,
  initialStat,
  onSelectCharacteristic,
}) => {
  const [characteristics, setCharacteristics] = useState<PokemonCharacteristic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatFilter, setActiveStatFilter] = useState<string>(initialStat || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChar, setSelectedChar] = useState<PokemonCharacteristic | null>(null);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetchAllCharacteristicsFromApi()
      .then((items) => {
        setCharacteristics(items);
        if (items.length > 0 && !selectedChar) {
          if (initialStat && initialStat !== 'all') {
            const match = items.find((c) => c.highest_stat === initialStat);
            setSelectedChar(match || items[0]);
          } else {
            setSelectedChar(items[0]);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, initialStat]);

  if (!isOpen) return null;

  const filteredItems = characteristics.filter((item) => {
    const matchesStat =
      activeStatFilter === 'all' || item.highest_stat.toLowerCase() === activeStatFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.description.toLowerCase().includes(q) ||
      (item.description_zh && item.description_zh.toLowerCase().includes(q)) ||
      (item.description_ja && item.description_ja.toLowerCase().includes(q)) ||
      item.highest_stat.toLowerCase().includes(q) ||
      String(item.id) === q;
    return matchesStat && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#11141c] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0e14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                  PokéAPI Characteristics API
                </h2>
                <span className="font-mono-code text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SERVERLESS (api.js)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Live official Pokémon personality traits from <code className="text-zinc-300">https://pokeapi.co/api/v2/characteristic/</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonRaw(!showJsonRaw)}
              className="px-2.5 py-1 text-xs font-mono-code rounded-lg border border-white/15 text-zinc-300 hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle API response JSON"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showJsonRaw ? 'Card View' : 'Raw API'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source and Endpoint Details Banner */}
        <div className="px-6 py-2.5 bg-[#090b10] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">GET</span>
            <span className="text-zinc-200">/api/characteristic</span>
            <span className="text-zinc-500">→</span>
            <span className="text-zinc-400 hidden xs:inline">Source: https://pokeapi.co/api/ (No key)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <a
              href="https://pokeapi.co/docs/v2#characteristics"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>PokéAPI Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="px-6 py-3 border-b border-white/10 bg-[#0d1017] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Stat tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveStatFilter('all')}
              className={`px-2.5 py-1 rounded-md font-mono-code uppercase font-semibold transition-colors cursor-pointer ${
                activeStatFilter === 'all'
                  ? 'bg-white text-zinc-900'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              All (30)
            </button>
            {Object.entries(STAT_LABELS).map(([statKey, info]) => (
              <button
                key={statKey}
                type="button"
                onClick={() => setActiveStatFilter(statKey)}
                className={`px-2.5 py-1 rounded-md font-mono-code text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeStatFilter === statKey
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                style={{
                  backgroundColor: activeStatFilter === statKey ? info.bg : 'rgba(255,255,255,0.03)',
                  borderColor: activeStatFilter === statKey ? info.border : 'transparent',
                  borderWidth: 1,
                  color: activeStatFilter === statKey ? info.color : undefined,
                }}
              >
                {statKey.replace('special-', 'Sp. ')}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter characteristics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161a24] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f121a]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <p className="text-sm font-mono-code">Fetching characteristics via serverless function /api.js...</p>
            </div>
          ) : showJsonRaw ? (
            <div className="bg-[#090b10] border border-white/10 rounded-2xl p-4 font-mono-code text-xs text-emerald-300 overflow-x-auto max-h-[500px]">
              <pre>{JSON.stringify({
                serverless_function: '/api.js',
                source: 'https://pokeapi.co/api/v2/characteristic/',
                filter: activeStatFilter,
                count: filteredItems.length,
                data: filteredItems,
              }, null, 2)}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const statMeta = STAT_LABELS[item.highest_stat] || {
                  label: item.highest_stat,
                  color: '#A1A1AA',
                  bg: 'rgba(255,255,255,0.05)',
                  border: 'rgba(255,255,255,0.1)',
                };
                const isSelected = selectedChar?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedChar(item)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#181d29] shadow-lg ring-1 ring-amber-400/50'
                        : 'bg-[#121620] hover:bg-[#161a26]'
                    }`}
                    style={{ borderColor: isSelected ? '#FBBF24' : statMeta.border }}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/5 font-mono-code text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 font-bold">#{item.id}</span>
                        <span
                          className="px-1.5 py-0.2 rounded uppercase text-[10px] font-bold"
                          style={{
                            color: statMeta.color,
                            backgroundColor: statMeta.bg,
                            borderColor: statMeta.border,
                            borderWidth: 1,
                          }}
                        >
                          {item.highest_stat.replace('special-', 'Sp. ')}
                        </span>
                      </div>
                      <span className="text-zinc-500 text-[10px]">
                        mod {item.gene_modulo}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-display font-bold text-white text-sm">
                        {item.description}
                      </p>
                      {item.description_zh && (
                        <p className="text-xs text-amber-300/90 font-medium">
                          {item.description_zh}
                        </p>
                      )}
                      {item.description_ja && (
                        <p className="text-[11px] text-zinc-400">
                          {item.description_ja}
                        </p>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-code text-zinc-500">
                      <span>Values: {item.possible_values.slice(0, 3).join(', ')}...</span>
                      {onSelectCharacteristic && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCharacteristic(item);
                            onClose();
                          }}
                          className="text-amber-400 hover:underline cursor-pointer"
                        >
                          Apply to Quiz
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0c0e14] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Connected to <code className="text-zinc-200">api.js</code> serverless function</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
