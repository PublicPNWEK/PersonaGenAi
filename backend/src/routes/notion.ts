import { Router, Request, Response, NextFunction } from 'express';
import { NotionIntegrationService } from '../services/notionIntegration.js';

const router = Router();
const notionService = new NotionIntegrationService();

/**
 * POST /api/notion/pages
 * Create a new page in Notion
 */
router.post('/pages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { databaseId, properties } = req.body;

    if (!databaseId || !properties) {
      return res.status(400).json({ error: 'databaseId and properties are required' });
    }

    const page = await notionService.createPage(databaseId, properties);
    res.json({ page });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notion/databases/:databaseId/query
 * Query a Notion database
 */
router.post('/databases/:databaseId/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { databaseId } = req.params;
    const { filter } = req.body;

    const results = await notionService.queryDatabase(databaseId, filter);
    res.json({ results });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/notion/pages/:pageId
 * Update a Notion page
 */
router.patch('/pages/:pageId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageId } = req.params;
    const { properties } = req.body;

    if (!properties) {
      return res.status(400).json({ error: 'properties are required' });
    }

    const page = await notionService.updatePage(pageId, properties);
    res.json({ page });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/notion/content
 * Create a content calendar entry
 */
router.post('/content', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { databaseId, title, date, platform, content, status } = req.body;

    if (!databaseId || !title || !date || !platform || !content) {
      return res.status(400).json({ 
        error: 'databaseId, title, date, platform, and content are required' 
      });
    }

    const entry = await notionService.createContentEntry(databaseId, {
      title,
      date,
      platform,
      content,
      status
    });

    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

export default router;
