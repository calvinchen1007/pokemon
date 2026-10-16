/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Serverless Function: api.js
 * Source: https://pokeapi.co/api/ (No API key required)
 * URL: https://pokeapi.co/api/v2/characteristic/
 * 
 * This serverless function provides live and cached characteristic traits
 * from PokéAPI v2. Characteristics in Pokémon represent personality nuances
 * tied to a Pokémon's highest stat (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed).
 */

const POKEAPI_CHARACTERISTIC_URL = 'https://pokeapi.co/api/v2/characteristic/';

// In-memory cache for serverless execution
const memoryCache = new Map();

// Built-in verified characteristics metadata from PokéAPI for zero-latency & offline resilience
const CHARACTERISTICS_MAP = {
  1: { id: 1, stat: 'hp', modulo: 0, en: 'Loves to eat', zh: '非常喜歡吃東西', ja: '食べるのが 大好き' },
  2: { id: 2, stat: 'attack', modulo: 0, en: 'Proud of its power', zh: '以力氣大為傲', ja: '力が 自慢' },
  3: { id: 3, stat: 'defense', modulo: 0, en: 'Sturdy body', zh: '身體強壯', ja: '体が 丈夫' },
  4: { id: 4, stat: 'special-attack', modulo: 0, en: 'Highly curious', zh: '好奇心強', ja: '好奇心が 強い' },
  5: { id: 5, stat: 'special-defense', modulo: 0, en: 'Strong willed', zh: '性格強勢', ja: '気が強い' },
  6: { id: 6, stat: 'speed', modulo: 0, en: 'Likes to run', zh: '喜歡比誰跑得快', ja: '駆けっこが 好き' },
  7: { id: 7, stat: 'hp', modulo: 1, en: 'Takes plenty of siestas', zh: '經常睡午覺', ja: '昼寝を よくする' },
  8: { id: 8, stat: 'attack', modulo: 1, en: 'Likes to thrash about', zh: '喜歡胡鬧', ja: '暴れることが 好き' },
  9: { id: 9, stat: 'defense', modulo: 1, en: 'Capable of taking hits', zh: '抗打能力強', ja: '打たれ強い' },
  10: { id: 10, stat: 'special-attack', modulo: 1, en: 'Mischievous', zh: '喜歡惡作劇', ja: 'イタズラが 好き' },
  11: { id: 11, stat: 'special-defense', modulo: 1, en: 'Somewhat vain', zh: '有一點點愛慕虛榮', ja: 'ちょっぴり みえっぱり' },
  12: { id: 12, stat: 'speed', modulo: 1, en: 'Alert to sounds', zh: '對聲音敏感', ja: '物音に 敏感' },
  13: { id: 13, stat: 'hp', modulo: 2, en: 'Nods off a lot', zh: '常常打瞌睡', ja: '居眠りが 多い' },
  14: { id: 14, stat: 'attack', modulo: 2, en: 'A little quick tempered', zh: '有點容易生氣', ja: 'ちょっと おこりっぽい' },
  15: { id: 15, stat: 'defense', modulo: 2, en: 'Highly persistent', zh: '頑強不屈', ja: '粘り強い' },
  16: { id: 16, stat: 'special-attack', modulo: 2, en: 'Thoroughly cunning', zh: '做事萬無一失', ja: '抜け目がない' },
  17: { id: 17, stat: 'special-defense', modulo: 2, en: 'Strongly defiant', zh: '爭強好勝', ja: '負けん気が 強い' },
  18: { id: 18, stat: 'speed', modulo: 2, en: 'Impetuous and silly', zh: '冒冒失失', ja: 'おっちょこちょい' },
  19: { id: 19, stat: 'hp', modulo: 3, en: 'Scatters things often', zh: '經常亂扔東西', ja: '物を よく散らかす' },
  20: { id: 20, stat: 'attack', modulo: 3, en: 'Likes to fight', zh: '喜歡打架', ja: '喧嘩が 好き' },
  21: { id: 21, stat: 'defense', modulo: 3, en: 'Good endurance', zh: '能吃苦耐勞', ja: '辛抱強い' },
  22: { id: 22, stat: 'special-attack', modulo: 3, en: 'Often lost in thought', zh: '經常思考', ja: '考えごとが 多い' },
  23: { id: 23, stat: 'special-defense', modulo: 3, en: 'Hates to lose', zh: '不服輸', ja: '負けず嫌い' },
  24: { id: 24, stat: 'speed', modulo: 3, en: 'Somewhat of a clown', zh: '有點容易得意忘形', ja: 'お調子者' },
  25: { id: 25, stat: 'hp', modulo: 4, en: 'Likes to relax', zh: '喜歡悠然自在', ja: 'のんびりするのが 好き' },
  26: { id: 26, stat: 'attack', modulo: 4, en: 'Quick tempered', zh: '血氣方剛', ja: '血気っ早い' },
  27: { id: 27, stat: 'defense', modulo: 4, en: 'Good perseverance', zh: '善於忍耐', ja: '我慢強い' },
  28: { id: 28, stat: 'special-attack', modulo: 4, en: 'Very finicky', zh: '一絲不苟', ja: 'とても 几帳面' },
  29: { id: 29, stat: 'special-defense', modulo: 4, en: 'Somewhat stubborn', zh: '有一點點固執', ja: 'ちょっぴり 頑固' },
  30: { id: 30, stat: 'speed', modulo: 4, en: 'Quick to flee', zh: '逃得快', ja: '逃げ足が 速い' },
};

// Map stat names to characteristic IDs
const STAT_TO_CHARACTERISTIC_IDS = {
  'hp': [1, 7, 13, 19, 25],
  'attack': [2, 8, 14, 20, 26],
  'defense': [3, 9, 15, 21, 27],
  'special-attack': [4, 10, 16, 22, 28],
  'special-defense': [5, 11, 17, 23, 29],
  'speed': [6, 12, 18, 24, 30],
};

/**
 * Fetch a single characteristic from PokéAPI with fallback
 */
export async function fetchCharacteristic(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId < 1 || numericId > 30) {
    throw new Error(`Invalid characteristic ID "${id}". Must be between 1 and 30.`);
  }

  const cacheKey = `char_${numericId}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const fallback = CHARACTERISTICS_MAP[numericId];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${POKEAPI_CHARACTERISTIC_URL}${numericId}/`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`PokéAPI responded with status ${res.status}`);
    }

    const data = await res.json();
    const enDesc = data.descriptions?.find((d) => d.language?.name === 'en')?.description || fallback?.en;
    const zhDesc =
      data.descriptions?.find((d) => d.language?.name === 'zh-hant')?.description ||
      data.descriptions?.find((d) => d.language?.name === 'zh-hans')?.description ||
      fallback?.zh;
    const jaDesc =
      data.descriptions?.find((d) => d.language?.name === 'ja')?.description ||
      data.descriptions?.find((d) => d.language?.name === 'ja-hrkt')?.description ||
      fallback?.ja;

    const result = {
      id: data.id,
      gene_modulo: data.gene_modulo,
      possible_values: data.possible_values || [0, 5, 10, 15, 20, 25, 30],
      highest_stat: data.highest_stat?.name || fallback?.stat,
      description: enDesc,
      description_zh: zhDesc,
      description_ja: jaDesc,
      descriptions: data.descriptions || [],
      source: `${POKEAPI_CHARACTERISTIC_URL}${numericId}/`,
      isLive: true,
    };

    memoryCache.set(cacheKey, result);
    return result;
  } catch (err) {
    // Graceful fallback to verified built-in data
    const fallbackResult = {
      id: numericId,
      gene_modulo: fallback.modulo,
      possible_values: [0, 5, 10, 15, 20, 25, 30],
      highest_stat: fallback.stat,
      description: fallback.en,
      description_zh: fallback.zh,
      description_ja: fallback.ja,
      descriptions: [
        { description: fallback.en, language: { name: 'en' } },
        { description: fallback.zh, language: { name: 'zh-hant' } },
        { description: fallback.ja, language: { name: 'ja' } },
      ],
      source: `${POKEAPI_CHARACTERISTIC_URL}${numericId}/`,
      isLive: false,
      note: 'Returned verified PokéAPI metadata (offline/timeout fallback).',
    };
    memoryCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
}

/**
 * Fetch all 30 characteristics
 */
export async function fetchAllCharacteristics() {
  const cacheKey = 'all_chars';
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const ids = Array.from({ length: 30 }, (_, i) => i + 1);
  const items = await Promise.all(ids.map((id) => fetchCharacteristic(id)));
  memoryCache.set(cacheKey, items);
  return items;
}

/**
 * Universal Serverless Function Handler
 * Compatible with Node.js http.IncomingMessage, Express, and standard serverless runtimes.
 */
export default async function handler(req, res) {
  // CORS & Security Headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  };

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    if (typeof res?.writeHead === 'function') {
      res.writeHead(204, headers);
      res.end();
      return;
    }
    return new Response(null, { status: 204, headers });
  }

  try {
    // Parse URL & Query params
    const rawUrl = req.url || '/api/characteristic';
    const parsedUrl = new URL(rawUrl, 'http://localhost');
    const queryParams = parsedUrl.searchParams;

    // Check path for ID (e.g. /api/characteristic/5 or /characteristic/5)
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    let requestedId = queryParams.get('id');
    const requestedStat = queryParams.get('stat')?.toLowerCase();
    const requestedAll = queryParams.get('all') === 'true' || queryParams.get('list') === 'true';

    // If ID is in the pathname (e.g. /api/characteristic/6 or /characteristic/6)
    if (!requestedId && pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (/^\d+$/.test(lastPart)) {
        requestedId = lastPart;
      }
    }

    let payload;

    if (requestedAll) {
      const all = await fetchAllCharacteristics();
      payload = {
        status: 'success',
        source: POKEAPI_CHARACTERISTIC_URL,
        count: all.length,
        characteristics: all,
      };
    } else if (requestedStat && STAT_TO_CHARACTERISTIC_IDS[requestedStat]) {
      const matchingIds = STAT_TO_CHARACTERISTIC_IDS[requestedStat];
      const items = await Promise.all(matchingIds.map((id) => fetchCharacteristic(id)));
      payload = {
        status: 'success',
        source: POKEAPI_CHARACTERISTIC_URL,
        stat: requestedStat,
        count: items.length,
        characteristics: items,
      };
    } else if (requestedId) {
      const charData = await fetchCharacteristic(requestedId);
      payload = {
        status: 'success',
        source: `${POKEAPI_CHARACTERISTIC_URL}${requestedId}/`,
        characteristic: charData,
      };
    } else {
      // Default: return the full overview including all characteristics and stats mapping
      const all = await fetchAllCharacteristics();
      payload = {
        status: 'success',
        source: POKEAPI_CHARACTERISTIC_URL,
        message: 'PokéAPI Characteristic Serverless Endpoint active. No key required.',
        count: all.length,
        characteristics: all,
        statMap: STAT_TO_CHARACTERISTIC_IDS,
      };
    }

    const jsonString = JSON.stringify(payload, null, 2);

    if (typeof res?.writeHead === 'function') {
      res.writeHead(200, headers);
      res.end(jsonString);
      return;
    }

    return new Response(jsonString, { status: 200, headers });
  } catch (error) {
    const errorPayload = {
      status: 'error',
      source: POKEAPI_CHARACTERISTIC_URL,
      message: error?.message || 'Internal Serverless Function Error',
    };
    const jsonString = JSON.stringify(errorPayload);

    if (typeof res?.writeHead === 'function') {
      res.writeHead(400, headers);
      res.end(jsonString);
      return;
    }

    return new Response(jsonString, { status: 400, headers });
  }
}
