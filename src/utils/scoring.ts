import { POKEMON_ARCHETYPES } from '../data/archetypes';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { PersonalityScoreResult, PokemonArchetype } from '../types';

export function calculatePersonalityResult(
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
): PersonalityScoreResult {
  // Aggregate user traits across all 5 answers
  let totalExtroversion = 0;
  let totalChaos = 0;
  let totalWarmth = 0;
  let totalImagination = 0;

  let answeredCount = 0;

  for (const q of QUIZ_QUESTIONS) {
    const selectedChoice = userAnswers[q.id];
    if (selectedChoice) {
      const option = q.options.find((o) => o.id === selectedChoice);
      if (option) {
        totalExtroversion += option.traits.extroversion;
        totalChaos += option.traits.chaos;
        totalWarmth += option.traits.warmth;
        totalImagination += option.traits.imagination;
        answeredCount += 1;
      }
    }
  }

  // Safety fallback if empty
  if (answeredCount === 0) {
    return {
      archetype: POKEMON_ARCHETYPES[0],
      matchPercentage: 92,
      secondaryMatch: POKEMON_ARCHETYPES[1],
      traitBreakdown: {
        extroversion: 50,
        chaos: 50,
        warmth: 50,
        imagination: 50,
      },
    };
  }

  // Normalize user traits to average per dimension (-10 to +10 scale)
  const avgExtro = totalExtroversion / answeredCount;
  const avgChaos = totalChaos / answeredCount;
  const avgWarmth = totalWarmth / answeredCount;
  const avgImag = totalImagination / answeredCount;

  // Q5 Signature Aura affinity bonus
  const q5Choice = userAnswers[5];

  // Calculate affinity distances for all archetypes
  const scoredArchetypes = POKEMON_ARCHETYPES.map((arch) => {
    const target = arch.idealTraits;

    // Euclidean distance in 4D personality space
    const dExtro = avgExtro - target.extroversion;
    const dChaos = avgChaos - target.chaos;
    const dWarmth = avgWarmth - target.warmth;
    const dImag = avgImag - target.imagination;

    let distance = Math.sqrt(
      dExtro * dExtro + dChaos * dChaos + dWarmth * dWarmth + dImag * dImag
    );

    // Apply thematic signature aura synergy
    if (q5Choice === 'A' && (arch.id === 'sylveon' || arch.id === 'dragonite')) {
      distance *= 0.82;
    } else if (q5Choice === 'B' && (arch.id === 'pikachu' || arch.id === 'lucario')) {
      distance *= 0.82;
    } else if (q5Choice === 'C' && (arch.id === 'gengar' || arch.id === 'umbreon')) {
      distance *= 0.82;
    } else if (
      q5Choice === 'D' &&
      (arch.id === 'bulbasaur' || arch.id === 'snorlax' || arch.id === 'eevee')
    ) {
      distance *= 0.82;
    }

    return {
      archetype: arch,
      distance,
    };
  });

  // Sort with explicit deterministic tie-breaking logic
  scoredArchetypes.sort((a, b) => {
    const diff = a.distance - b.distance;
    if (Math.abs(diff) > 0.0001) {
      return diff;
    }
    // Tie-breaker 1: Check Q1 Energy alignment
    const q1Choice = userAnswers[1];
    if (q1Choice === 'A') {
      return b.archetype.idealTraits.extroversion - a.archetype.idealTraits.extroversion;
    }
    if (q1Choice === 'B' || q1Choice === 'C') {
      return a.archetype.idealTraits.extroversion - b.archetype.idealTraits.extroversion;
    }
    if (q1Choice === 'D') {
      return b.archetype.idealTraits.chaos - a.archetype.idealTraits.chaos;
    }

    // Tie-breaker 2: Stable catalog number comparison
    return a.archetype.catalogNumber.localeCompare(b.archetype.catalogNumber);
  });

  const best = scoredArchetypes[0];
  const runnerUp = scoredArchetypes[1];

  // Maximum theoretical distance on -10..+10 4D space is ~40
  const normalizedMatch = Math.round(
    Math.max(78, Math.min(99, 100 - best.distance * 1.8))
  );

  // Convert trait scale (-10..+10) to readable percentage (0..100)
  const toPercent = (val: number) =>
    Math.round(Math.max(10, Math.min(95, ((val + 10) / 20) * 100)));

  return {
    archetype: best.archetype,
    matchPercentage: normalizedMatch,
    secondaryMatch: runnerUp ? runnerUp.archetype : undefined,
    traitBreakdown: {
      extroversion: toPercent(avgExtro),
      chaos: toPercent(avgChaos),
      warmth: toPercent(avgWarmth),
      imagination: toPercent(avgImag),
    },
  };
}

export function getArchetypeById(id: string): PokemonArchetype {
  const match = POKEMON_ARCHETYPES.find(
    (a) => a.id.toLowerCase() === id.toLowerCase() || a.pokeApiName.toLowerCase() === id.toLowerCase()
  );
  return match || POKEMON_ARCHETYPES[0];
}
