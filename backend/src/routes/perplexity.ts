import { Router, Request, Response, NextFunction } from 'express';
import { PerplexityIntegrationService } from '../services/perplexityIntegration.js';

const router = Router();
const perplexityService = new PerplexityIntegrationService();

/**
 * POST /api/perplexity/query
 * Query Perplexity AI
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, model, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const result = await perplexityService.query(prompt, {
      model,
      temperature,
      maxTokens
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/perplexity/research
 * Research a topic
 */
router.post('/research', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'topic is required' });
    }

    const research = await perplexityService.researchTopic(topic);
    res.json({ research });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/perplexity/content-ideas
 * Generate content ideas
 */
router.post('/content-ideas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { industry, count } = req.body;

    if (!industry) {
      return res.status(400).json({ error: 'industry is required' });
    }

    const ideas = await perplexityService.generateContentIdeas(industry, count);
    res.json({ ideas });
  } catch (error) {
    next(error);
  }
});

export default router;
