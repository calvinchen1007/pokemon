export interface AnswerOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  supportingLine: string;
  iconName: string;
  traits: {
    extroversion: number; // -10 (introvert) to +10 (extrovert)
    chaos: number;        // -10 (methodical) to +10 (chaotic)
    warmth: number;       // -10 (detached) to +10 (empathetic)
    imagination: number;  // -10 (pragmatic) to +10 (visionary)
  };
}

export interface QuizQuestion {
  id: number;
  dimension: string;
  dimensionLabel: string;
  question: string;
  options: AnswerOption[];
}

export interface PokemonArchetype {
  id: string;
  pokeApiName: string;
  pokeApiId: number;
  displayName: string;
  japaneseName: string;
  catalogNumber: string;
  archetypeTitle: string;
  tagline: string;
  description: string;
  coreEnergy: string;
  secretTalent: string;
  redFlag: string;
  vibeKeywords: string[];
  soulmateId: string;
  soulmateReason: string;
  clashId: string;
  clashReason: string;
  typePrimary: string;
  typeSecondary?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    bgGlow: string;
    border: string;
    textAccent: string;
  };
  idealTraits: {
    extroversion: number;
    chaos: number;
    warmth: number;
    imagination: number;
  };
}

export interface LivePokemonData {
  id: number;
  name: string;
  height: number; // decimeters
  weight: number; // hectograms
  types: string[];
  artworkUrl: string;
  cryUrl?: string;
  genus?: string;
  flavorText?: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export interface ApiFetchState {
  status: 'idle' | 'loading' | 'slow' | 'success' | 'error';
  errorMessage?: string;
  isFallback: boolean;
}

export interface PersonalityScoreResult {
  archetype: PokemonArchetype;
  matchPercentage: number;
  secondaryMatch?: PokemonArchetype;
  traitBreakdown: {
    extroversion: number;
    chaos: number;
    warmth: number;
    imagination: number;
  };
}
