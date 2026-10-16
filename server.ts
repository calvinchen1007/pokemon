import express from 'express';
import { createServer as createViteServer } from 'vite';
import healthHandler from './api/health.ts';
import pokemonHandler from './api/pokemon.ts';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount serverless function handlers
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/pokemon', (req, res) => pokemonHandler(req, res));

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
