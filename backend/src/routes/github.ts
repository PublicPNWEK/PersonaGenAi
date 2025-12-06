import { Router, Request, Response, NextFunction } from 'express';
import { GitHubIntegrationService } from '../services/githubIntegration.js';

const router = Router();
const githubService = new GitHubIntegrationService();

/**
 * POST /api/github/issues
 * Create an issue in a repository
 */
router.post('/issues', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, repo, title, body, labels } = req.body;

    if (!owner || !repo || !title || !body) {
      return res.status(400).json({ error: 'owner, repo, title, and body are required' });
    }

    const issue = await githubService.createIssue(owner, repo, {
      title,
      body,
      labels
    });

    res.json({ issue });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/github/repos/:owner/:repo
 * Get repository information
 */
router.get('/repos/:owner/:repo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, repo } = req.params;
    const repository = await githubService.getRepository(owner, repo);
    res.json({ repository });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/github/repos/:owner/:repo/contents/:path
 * Create or update a file in repository
 */
router.put('/repos/:owner/:repo/contents/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, repo } = req.params;
    const path = req.params[0]; // Everything after /contents/
    const { content, message, sha } = req.body;

    if (!content || !message) {
      return res.status(400).json({ error: 'content and message are required' });
    }

    const result = await githubService.createOrUpdateFile(owner, repo, path, content, message, sha);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/github/repos
 * List repositories for authenticated user
 */
router.get('/repos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repositories = await githubService.listRepositories();
    res.json({ repositories });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/github/repos/:owner/:repo/hooks
 * Create a webhook for repository
 */
router.post('/repos/:owner/:repo/hooks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, repo } = req.params;
    const { webhookUrl, events } = req.body;

    if (!webhookUrl || !events) {
      return res.status(400).json({ error: 'webhookUrl and events are required' });
    }

    const webhook = await githubService.createWebhook(owner, repo, webhookUrl, events);
    res.json({ webhook });
  } catch (error) {
    next(error);
  }
});

export default router;
