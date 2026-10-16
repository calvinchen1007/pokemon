import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { CalculatingScreen } from './components/CalculatingScreen';
import { ResultScreen } from './components/ResultScreen';
import { RosterGalleryModal } from './components/RosterGalleryModal';
import { AboutModal } from './components/AboutModal';
import { QUIZ_QUESTIONS } from './data/quizData';
import { POKEMON_ARCHETYPES } from './data/archetypes';
import {
  PersonalityScoreResult,
  LivePokemonData,
  ApiFetchState,
  PokemonArchetype,
} from './types';
import { calculatePersonalityResult, getArchetypeById } from './utils/scoring';
import { fetchLivePokemonData } from './services/pokeApi';

export default function App() {
  const [currentStep, setCurrentStep] = useState<
    'home' | 'quiz' | 'calculating' | 'result'
  >('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, 'A' | 'B' | 'C' | 'D'>
  >({});

  // Computed result state
  const [scoreResult, setScoreResult] = useState<PersonalityScoreResult | null>(
    null
  );

  // Live PokeAPI data state
  const [liveData, setLiveData] = useState<LivePokemonData | null>(null);
  const [apiState, setApiState] = useState<ApiFetchState>({
    status: 'idle',
    isFallback: false,
  });

  // Modal states
  const [isArchetypesModalOpen, setIsArchetypesModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Check URL query parameters on initial mount (e.g. ?pokemon=gengar)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryPokemon = searchParams.get('pokemon');
      if (queryPokemon) {
        const found = POKEMON_ARCHETYPES.find(
          (a) =>
            a.id.toLowerCase() === queryPokemon.toLowerCase() ||
            a.pokeApiName.toLowerCase() === queryPokemon.toLowerCase()
        );
        if (found) {
          const directResult: PersonalityScoreResult = {
            archetype: found,
            matchPercentage: 96,
            secondaryMatch: POKEMON_ARCHETYPES.find((a) => a.id !== found.id),
            traitBreakdown: {
              extroversion: Math.round(((found.idealTraits.extroversion + 10) / 20) * 100),
              chaos: Math.round(((found.idealTraits.chaos + 10) / 20) * 100),
              warmth: Math.round(((found.idealTraits.warmth + 10) / 20) * 100),
              imagination: Math.round(((found.idealTraits.imagination + 10) / 20) * 100),
            },
          };
          setScoreResult(directResult);
          setCurrentStep('result');
          loadPokeApiData(found.pokeApiName);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Fetch live PokeAPI data with plain words state updates
  const loadPokeApiData = useCallback(async (pokeApiName: string) => {
    setApiState({
      status: 'loading',
      isFallback: false,
    });

    const res = await fetchLivePokemonData(pokeApiName, () => {
      // Slow callback if PokéAPI takes > 2.5s
      setApiState((prev) => ({
        ...prev,
        status: 'slow',
        errorMessage: 'PokéAPI is taking longer than usual to respond...',
      }));
    });

    if (res.status === 'success' || res.status === 'slow') {
      setLiveData(res.data);
      setApiState({
        status: res.status,
        isFallback: false,
      });
    } else {
      setLiveData(null);
      setApiState({
        status: 'error',
        errorMessage: res.message,
        isFallback: true,
      });
    }
  }, []);

  // Start fresh quiz
  const handleStartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setScoreResult(null);
    setLiveData(null);
    setCurrentStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User selects an answer card
  const handleSelectAnswer = (
    questionId: number,
    answerId: 'A' | 'B' | 'C' | 'D'
  ) => {
    const updatedAnswers = { ...userAnswers, [questionId]: answerId };
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      // Advance to next question after small transition delay
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 240);
    } else {
      // All 5 questions completed -> Calculate!
      const finalResult = calculatePersonalityResult(updatedAnswers);
      setScoreResult(finalResult);

      // Start preloading live data from PokéAPI right away
      loadPokeApiData(finalResult.archetype.pokeApiName);

      setTimeout(() => {
        setCurrentStep('calculating');
      }, 240);
    }
  };

  // Navigate to previous question without losing data
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Calculation finished -> show result
  const handleCalculationComplete = () => {
    setCurrentStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a specific archetype from the roster gallery modal
  const handleSelectArchetypeFromModal = (arch: PokemonArchetype) => {
    const customResult: PersonalityScoreResult = {
      archetype: arch,
      matchPercentage: 94,
      traitBreakdown: {
        extroversion: Math.round(((arch.idealTraits.extroversion + 10) / 20) * 100),
        chaos: Math.round(((arch.idealTraits.chaos + 10) / 20) * 100),
        warmth: Math.round(((arch.idealTraits.warmth + 10) / 20) * 100),
        imagination: Math.round(((arch.idealTraits.imagination + 10) / 20) * 100),
      },
    };
    setScoreResult(customResult);
    setCurrentStep('result');
    loadPokeApiData(arch.pokeApiName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0e12] text-[#f2f4f8] antialiased">
      {/* Top Bar following 3-Zone Contract */}
      <Header
        currentStep={currentStep}
        onStartQuiz={handleStartQuiz}
        onGoHome={() => setCurrentStep('home')}
        onOpenArchetypes={() => setIsArchetypesModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {currentStep === 'home' && (
          <HomeScreen
            onStartQuiz={handleStartQuiz}
            onExploreArchetypes={() => setIsArchetypesModalOpen(true)}
          />
        )}

        {currentStep === 'quiz' && (
          <QuizScreen
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onSelectAnswer={handleSelectAnswer}
            onPreviousQuestion={handlePreviousQuestion}
          />
        )}

        {currentStep === 'calculating' && (
          <CalculatingScreen onComplete={handleCalculationComplete} />
        )}

        {currentStep === 'result' && scoreResult && (
          <ResultScreen
            scoreResult={scoreResult}
            liveData={liveData}
            apiState={apiState}
            onRetryApi={() => loadPokeApiData(scoreResult.archetype.pokeApiName)}
            onRetakeQuiz={handleStartQuiz}
            onOpenArchetypes={() => setIsArchetypesModalOpen(true)}
            onSelectPokemonById={(id) => {
              const target = getArchetypeById(id);
              handleSelectArchetypeFromModal(target);
            }}
          />
        )}
      </main>

      {/* Roster Gallery Modal */}
      <RosterGalleryModal
        isOpen={isArchetypesModalOpen}
        onClose={() => setIsArchetypesModalOpen(false)}
        onSelectArchetype={handleSelectArchetypeFromModal}
      />

      {/* Curatorial & Privacy Statement Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Institutional Footer (displayed on quiz and result screens; start screen is self-contained no-scroll) */}
      {currentStep !== 'home' && <Footer />}
    </div>
  );
}
