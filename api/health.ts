/**
 * Health check serverless endpoint
 * GET /api/health
 */
export default async function handler(req: any, res?: any) {
  // Support CORS
  const corsHeaders = {
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

  const apiKey =
    process.env.POKEMON_API_KEY ||
    process.env.POKEAPI_KEY ||
    process.env.API_KEY ||
    process.env.POKEMON_KEY;

  const responsePayload = {
    status: 'ok',
    service: 'pokemon-serverless-api',
    provider: 'https://pokeapi.co/api/v2/',
    keyConfigured: Boolean(apiKey && apiKey.trim().length > 0),
    timestamp: new Date().toISOString(),
  };

  if (res?.status) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(responsePayload);
  }

  return new Response(JSON.stringify(responsePayload), {
    status: 200,
    headers: corsHeaders,
  });
}
