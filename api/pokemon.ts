/**
 * Pokémon serverless endpoint
 * GET /api/pokemon?endpoint={endpoint}
 * Proxies live data from https://pokeapi.co/api/v2/{endpoint}/
 */
export default async function handler(req: any, res?: any) {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    if (res?.status) {
      return res.status(200).end();
    }
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Read key strictly from process.env inside api/ only
  const apiKey =
    process.env.POKEMON_API_KEY ||
    process.env.POKEAPI_KEY ||
    process.env.API_KEY ||
    process.env.POKEMON_KEY;

  // Guardrail check: If key variable is empty, return 503 "key not configured" and do not call provider
  if (!apiKey || !apiKey.trim()) {
    const errorPayload = {
      error: 'key not configured',
      message: 'key not configured',
    };

    if (res?.status) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(503).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 503,
      headers: corsHeaders,
    });
  }

  // Parse query parameters
  let endpoint = '';
  if (req.query?.endpoint) {
    endpoint = String(req.query.endpoint);
  } else if (req.query?.name) {
    endpoint = `pokemon/${String(req.query.name)}`;
  } else if (req.query?.id) {
    endpoint = `pokemon/${String(req.query.id)}`;
  } else if (req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      endpoint =
        url.searchParams.get('endpoint') ||
        (url.searchParams.get('name') ? `pokemon/${url.searchParams.get('name')}` : '') ||
        (url.searchParams.get('id') ? `pokemon/${url.searchParams.get('id')}` : '') ||
        '';
    } catch {
      // Ignore URL parse error
    }
  }

  if (!endpoint || !endpoint.trim()) {
    const missingPayload = {
      error: 'Missing endpoint parameter. Example: /api/pokemon?endpoint=pokemon/pikachu',
    };

    if (res?.status) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json(missingPayload);
    }

    return new Response(JSON.stringify(missingPayload), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Normalize endpoint to remove leading/trailing slashes
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  const targetUrl = `https://pokeapi.co/api/v2/${cleanEndpoint}/`;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'PokeVibe-Serverless/1.0',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['X-Api-Key'] = apiKey;
    }

    const pokeApiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    if (!pokeApiResponse.ok) {
      // Never invent data. Return accurate provider response status & message.
      const errorText = await pokeApiResponse.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = {
          error: `PokéAPI request to "${targetUrl}" failed with status ${pokeApiResponse.status} (${pokeApiResponse.statusText}).`,
        };
      }

      if (res?.status) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        return res.status(pokeApiResponse.status).json(errorJson);
      }

      return new Response(JSON.stringify(errorJson), {
        status: pokeApiResponse.status,
        headers: corsHeaders,
      });
    }

    const data = await pokeApiResponse.json();

    if (res?.status) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: unknown) {
    const errorPayload = {
      error: `Network error contacting PokéAPI: ${(err as Error)?.message || 'Service unreachable'}`,
    };

    if (res?.status) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(502).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 502,
      headers: corsHeaders,
    });
  }
}
