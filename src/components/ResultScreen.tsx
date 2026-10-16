import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import {
  PersonalityScoreResult,
  LivePokemonData,
  ApiFetchState,
} from '../types';
import { ResultCard } from './ResultCard';

interface ResultScreenProps {
  scoreResult: PersonalityScoreResult;
  liveData: LivePokemonData | null;
  apiState: ApiFetchState;
  onRetryApi: () => void;
  onRetakeQuiz: () => void;
  onOpenArchetypes: () => void;
  onSelectPokemonById: (id: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scoreResult,
  liveData,
  apiState,
  onRetryApi,
  onRetakeQuiz,
  onOpenArchetypes,
  onSelectPokemonById,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger celebratory confetti on initial reveal
  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          scoreResult.archetype.colorScheme.primary,
          '#FBBF24',
          '#F472B6',
          '#60A5FA',
        ],
      });
    } catch {
      // Ignored if confetti fails
    }
  }, [scoreResult.archetype.id]);

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#11141c',
      });
      const link = document.createElement('a');
      link.download = `pokevibe-${scoreResult.archetype.id}-card.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage('Saved Pokémon card image to your downloads!');
    } catch (err) {
      setToastMessage('Could not export image. You can screenshot the card!');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareToGroupChat = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?pokemon=${scoreResult.archetype.id}`;
    const textToShare = `I took the PokéVibe personality test and matched with ${scoreResult.archetype.displayName.toUpperCase()} (${scoreResult.archetype.archetypeTitle})!\n\nCore energy: ${scoreResult.archetype.coreEnergy}\nRed flag: ${scoreResult.archetype.redFlag}\n\nFind your Pokémon vibe: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `PokéVibe Result: ${scoreResult.archetype.displayName}`,
          text: textToShare,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(textToShare);
      setToastMessage('Copied summary & link to clipboard for your group chat!');
    } catch {
      setToastMessage('Share link: ' + shareUrl);
    }
  };

  const handleCopyLinkOnly = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?pokemon=${scoreResult.archetype.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage('Direct link copied to clipboard!');
    } catch {
      setToastMessage(shareUrl);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-zinc-900 border border-amber-400/50 text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Lead & Headline */}
      <div className="text-center space-y-2 mb-6">
        <span className="font-mono-code text-[11px] text-amber-400 tracking-widest uppercase">
          RESONANCE MATCH CONFIRMED
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your Pokémon Specimen
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Generated from your 5 instinctive responses · Complete with live PokéAPI telemetry.
        </p>
      </div>

      {/* Collectible Character Card (Export target) */}
      <div className="w-full mb-8 flex justify-center">
        <ResultCard
          scoreResult={scoreResult}
          liveData={liveData}
          apiState={apiState}
          onRetryApi={onRetryApi}
          cardRef={cardRef}
          onSelectPokemonById={onSelectPokemonById}
        />
      </div>

      {/* Action CTA Grid */}
      <div className="w-full max-w-xl space-y-3">
        {/* Primary & Secondary Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary CTA: Save My Pokémon Card */}
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="w-full min-h-[48px] px-5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-amber-400/20 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Saving Card...' : 'Save My Pokémon Card'}</span>
          </button>

          {/* Secondary CTA: Send This to Your Group Chat */}
          <button
            onClick={handleShareToGroupChat}
            className="w-full min-h-[48px] px-5 bg-[#181b26] hover:bg-[#202534] text-white border border-white/15 font-display text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Send to Group Chat</span>
          </button>
        </div>

        {/* Secondary row: Retake Quiz + Explore Archetypes + Copy Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <button
            onClick={onRetakeQuiz}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLinkOnly}
              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>

            <button
              onClick={onOpenArchetypes}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer font-semibold"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 10 Archetypes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
