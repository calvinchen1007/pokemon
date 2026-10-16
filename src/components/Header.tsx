import React from 'react';

interface HeaderProps {
  currentStep: 'home' | 'quiz' | 'calculating' | 'result' | 'talk-to-us';
  onStartQuiz: () => void;
  onGoHome: () => void;
  onOpenArchetypes: () => void;
  onGoTalkToUs: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStartQuiz,
  onGoHome,
  onOpenArchetypes,
  onGoTalkToUs,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0e12]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2 text-left whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <span className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            PokéVibe
          </span>
          <span className="hidden sm:inline-block font-mono-code text-[11px] text-zinc-400 tracking-wider">
            / EXPO 2026
          </span>
        </button>

        {/* Zone 2: Nav links, 1-2 word labels, single-line */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-400">
          <button
            onClick={onGoHome}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentStep === 'home' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={onStartQuiz}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentStep === 'quiz' || currentStep === 'calculating'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Quiz
          </button>
          <button
            onClick={onOpenArchetypes}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer"
          >
            Archetypes
          </button>
          <button
            onClick={onGoTalkToUs}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentStep === 'talk-to-us' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Talk to Us
          </button>
          <button
            onClick={onOpenAbout}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer hidden xs:inline-block"
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {currentStep === 'result' || currentStep === 'quiz' ? (
            <button
              onClick={onStartQuiz}
              className="h-9 px-3.5 text-xs font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-amber-400/20"
            >
              Restart Quiz
            </button>
          ) : (
            <button
              onClick={onStartQuiz}
              className="h-9 px-4 text-xs font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-amber-400/20"
            >
              Find My Pokémon
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
