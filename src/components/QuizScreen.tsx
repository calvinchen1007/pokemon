import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquareShare,
  Binoculars,
  Compass,
  Flame,
  HeartHandshake,
  ShieldAlert,
  CloudRain,
  Sparkles,
  Orbit,
  Cpu,
  Sprout,
  Eye,
  Zap,
  TableProperties,
  Shield,
  Dice5,
  Heart,
  SunMedium,
  Moon,
  Leaf,
  Check,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { AnswerOption } from '../types';

interface QuizScreenProps {
  currentQuestionIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onSelectAnswer: (questionId: number, answerId: 'A' | 'B' | 'C' | 'D') => void;
  onPreviousQuestion: () => void;
}

// Icon mapper for question answers
const renderOptionIcon = (iconName: string, isSelected: boolean) => {
  const iconProps = {
    className: `w-5 h-5 transition-colors ${
      isSelected ? 'text-amber-600' : 'text-zinc-500 group-hover:text-amber-600'
    }`,
  };

  switch (iconName) {
    case 'MessageSquareShare':
      return <MessageSquareShare {...iconProps} />;
    case 'Binoculars':
      return <Binoculars {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'HeartHandshake':
      return <HeartHandshake {...iconProps} />;
    case 'ShieldAlert':
      return <ShieldAlert {...iconProps} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Orbit':
      return <Orbit {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'Sprout':
      return <Sprout {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'TableProperties':
      return <TableProperties {...iconProps} />;
    case 'Shield':
      return <Shield {...iconProps} />;
    case 'Dice5':
      return <Dice5 {...iconProps} />;
    case 'Heart':
      return <Heart {...iconProps} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'Leaf':
      return <Leaf {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  currentQuestionIndex,
  userAnswers,
  onSelectAnswer,
  onPreviousQuestion,
}) => {
  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentAnswer = userAnswers[question.id];

  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCardClick = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isTransitioning) return; // Prevent double submission / skipping
    setIsTransitioning(true);
    onSelectAnswer(question.id, optionId);

    // Brief timeout before allowing next question interactions
    setTimeout(() => {
      setIsTransitioning(false);
    }, 380);
  };

  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between py-6 px-4 sm:px-6 max-w-3xl mx-auto w-full">
      {/* Top Navigation & Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={onPreviousQuestion}
              disabled={isTransitioning}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer disabled:opacity-50 py-1.5 px-2.5 -ml-2 rounded-lg hover:bg-zinc-100 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="font-mono-code text-[11px] text-zinc-500 uppercase tracking-wider">
              TAIWAN EXPO SPECIMEN MATRIX
            </div>
          )}

          <div className="text-right">
            <span className="font-mono-code text-xs font-bold text-amber-600">
              {question.dimensionLabel}
            </span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Dimension Kicker */}
        <div className="pt-2">
          <span className="text-[11px] font-mono-code text-zinc-500 tracking-widest uppercase">
            {question.dimension}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 mt-1 leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      {/* 4 Illustrated Answer Cards */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {question.options.map((option: AnswerOption) => {
          const isSelected = currentAnswer === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              disabled={isTransitioning}
              className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer min-h-[104px] flex flex-col justify-between overflow-hidden active:scale-[0.98] ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-white border-zinc-200 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs'
              }`}
            >
              {/* Option Choice ID & Icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-mono-code text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'bg-zinc-100 text-zinc-700 group-hover:bg-amber-100'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-zinc-900 group-hover:text-amber-700 transition-colors">
                    {option.label}
                  </span>
                </div>

                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100">
                  {isSelected ? (
                    <Check className="w-4 h-4 text-amber-600 animate-in zoom-in-75 duration-200" />
                  ) : (
                    renderOptionIcon(option.iconName, false)
                  )}
                </div>
              </div>

              {/* Gen Z Witty Supporting Line */}
              <div className="pt-1.5 border-t border-zinc-100">
                <p className="text-xs text-zinc-500 group-hover:text-zinc-700 transition-colors italic">
                  “{option.supportingLine}”
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="pt-2 pb-4 text-center font-mono-code text-[11px] text-zinc-500">
        TAP ANY CARD TO ADVANCE · NO WRONG ANSWERS
      </div>
    </div>
  );
};
