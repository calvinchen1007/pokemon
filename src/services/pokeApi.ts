import { LivePokemonData, PokemonCharacteristic } from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map<string, LivePokemonData>();

export interface FetchResult {
  data: LivePokemonData | null;
  status: 'success' | 'slow' | 'error';
  message: string;
}

/**
 * Clean Pokédex flavor text formatting (newlines and form-feeds)
 */
function cleanFlavorText(raw: string): string {
  return raw
    .replace(/[\n\f\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch live official Pokémon data strictly through https://pokeapi.co/api/v2/
 */
export async function fetchLivePokemonData(
  nameOrId: string | number,
  onSlow?: () => void
): Promise<FetchResult> {
  const cacheKey = String(nameOrId).toLowerCase();
  if (cache.has(cacheKey)) {
    return {
      data: cache.get(cacheKey)!,
      status: 'success',
      message: 'Loaded live data from PokéAPI (cached).',
    };
  }

  // Timer to signal slow response in plain words if PokéAPI takes > 2.5s
  let isSlow = false;
  const slowTimer = setTimeout(() => {
    isSlow = true;
    if (onSlow) onSlow();
  }, 2500);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const pokemonRes = await fetch(`${POKEAPI_BASE_URL}/pokemon/${cacheKey}`, {
      signal: controller.signal,
    });

    if (!pokemonRes.ok) {
      clearTimeout(slowTimer);
      clearTimeout(timeoutId);
      if (pokemonRes.status === 404) {
        return {
          data: null,
          status: 'error',
          message: `PokéAPI returned 404: No entry found for Pokémon "${cacheKey}".`,
        };
      }
      return {
        data: null,
        status: 'error',
        message: `PokéAPI refused or failed the request with HTTP status ${pokemonRes.status}.`,
      };
    }

    const pokemonJson = await pokemonRes.json();
    if (!pokemonJson || !pokemonJson.id) {
      clearTimeout(slowTimer);
      clearTimeout(timeoutId);
      return {
        data: null,
        status: 'error',
        message: 'PokéAPI returned an empty response with no data fields.',
      };
    }

    // Try fetching species metadata for authentic genus and Pokédex lore
    let genus = '';
    let flavorText = '';
    try {
      const speciesRes = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${cacheKey}`, {
        signal: controller.signal,
      });
      if (speciesRes.ok) {
        const speciesJson = await speciesRes.json();
        const enGenus = speciesJson.genera?.find(
          (g: { language: { name: string }; genus: string }) => g.language.name === 'en'
        );
        if (enGenus) genus = enGenus.genus;

        const enFlavor = speciesJson.flavor_text_entries?.find(
          (f: { language: { name: string }; flavor_text: string }) => f.language.name === 'en'
        );
        if (enFlavor) flavorText = cleanFlavorText(enFlavor.flavor_text);
      }
    } catch {
      // Non-fatal if species is slow; primary pokemon data is already secured
    }

    clearTimeout(slowTimer);
    clearTimeout(timeoutId);

    // Extract stats
    const statsObj = {
      hp: 50,
      attack: 50,
      defense: 50,
      specialAttack: 50,
      specialDefense: 50,
      speed: 50,
    };

    if (Array.isArray(pokemonJson.stats)) {
      for (const st of pokemonJson.stats) {
        const statName = st.stat?.name;
        const val = st.base_stat;
        if (statName === 'hp') statsObj.hp = val;
        else if (statName === 'attack') statsObj.attack = val;
        else if (statName === 'defense') statsObj.defense = val;
        else if (statName === 'special-attack') statsObj.specialAttack = val;
        else if (statName === 'special-defense') statsObj.specialDefense = val;
        else if (statName === 'speed') statsObj.speed = val;
      }
    }

    // Determine highest stat to query corresponding characteristic from serverless api.js
    const statEntries: [string, number][] = [
      ['hp', statsObj.hp],
      ['attack', statsObj.attack],
      ['defense', statsObj.defense],
      ['special-attack', statsObj.specialAttack],
      ['special-defense', statsObj.specialDefense],
      ['speed', statsObj.speed],
    ];
    statEntries.sort((a, b) => b[1] - a[1]);
    const highestStatName = statEntries[0][0];

    // Fetch authentic characteristic trait via serverless function (api.js -> https://pokeapi.co/api/v2/characteristic/)
    let characteristic: PokemonCharacteristic | undefined = undefined;
    try {
      const charResult = await fetchCharacteristicFromApi({ stat: highestStatName });
      if (charResult) {
        characteristic = charResult;
      }
    } catch {
      // Non-fatal fallback
    }

    const officialArtwork =
      pokemonJson.sprites?.other?.['official-artwork']?.front_default ||
      pokemonJson.sprites?.other?.home?.front_default ||
      pokemonJson.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonJson.id}.png`;

    const liveData: LivePokemonData = {
      id: pokemonJson.id,
      name: pokemonJson.name,
      height: pokemonJson.height, // decimeters
      weight: pokemonJson.weight, // hectograms
      types: Array.isArray(pokemonJson.types)
        ? pokemonJson.types.map((t: { type: { name: string } }) => t.type.name)
        : [],
      artworkUrl: officialArtwork,
      cryUrl: pokemonJson.cries?.latest,
      genus: genus || undefined,
      flavorText: flavorText || undefined,
      characteristic,
      stats: statsObj,
    };

    cache.set(cacheKey, liveData);

    return {
      data: liveData,
      status: isSlow ? 'slow' : 'success',
      message: isSlow
        ? 'Data loaded from PokéAPI, though the server was slow to respond.'
        : 'Live official data successfully synchronized from PokéAPI.',
    };
  } catch (err: unknown) {
    clearTimeout(slowTimer);
    clearTimeout(timeoutId);

    const isAbort = (err as Error)?.name === 'AbortError';
    const message = isAbort
      ? 'PokéAPI took longer than 9 seconds to respond and the request timed out. Please tap retry.'
      : 'Network error: Unable to contact https://pokeapi.co/api/v2/. Please check your internet connection.';

    return {
      data: null,
      status: 'error',
      message,
    };
  }
}

/**
 * Play authentic audio cry from PokéAPI
 */
export function playPokemonCry(audioUrl?: string): void {
  if (!audioUrl) return;
  try {
    const audio = new Audio(audioUrl);
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Autoplay or audio focus error handled silently
    });
  } catch {
    // Ignore audio initialization errors
  }
}

/**
 * Fetch characteristic trait from local serverless function (api.js)
 * Source: https://pokeapi.co/api/v2/characteristic/ (No key required)
 */
export async function fetchCharacteristicFromApi(options?: {
  id?: number;
  stat?: string;
}): Promise<PokemonCharacteristic | null> {
  try {
    let endpoint = '/api/characteristic';
    if (options?.id) {
      endpoint = `/api/characteristic?id=${options.id}`;
    } else if (options?.stat) {
      endpoint = `/api/characteristic?stat=${encodeURIComponent(options.stat)}`;
    }

    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.characteristic) {
      return data.characteristic;
    }
    if (Array.isArray(data.characteristics) && data.characteristics.length > 0) {
      // Return a random one from the stat's matching characteristics or the first
      const randomIndex = Math.floor(Math.random() * data.characteristics.length);
      return data.characteristics[randomIndex];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch all 30 characteristics from serverless function (api.js)
 * Source: https://pokeapi.co/api/v2/characteristic/
 */
export async function fetchAllCharacteristicsFromApi(): Promise<PokemonCharacteristic[]> {
  try {
    const res = await fetch('/api/characteristic?all=true');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.characteristics) ? data.characteristics : [];
  } catch {
    return [];
  }
}
