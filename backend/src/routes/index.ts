import { Router } from 'express';
import googleRoutes from './google.js';
import notionRoutes from './notion.js';
import githubRoutes from './github.js';
import perplexityRoutes from './perplexity.js';
import schedulingRoutes from './scheduling.js';
import monetizationRoutes from './monetization.js';

const router = Router();

router.use('/google', googleRoutes);
router.use('/notion', notionRoutes);
router.use('/github', githubRoutes);
router.use('/perplexity', perplexityRoutes);
router.use('/scheduling', schedulingRoutes);
router.use('/monetization', monetizationRoutes);

export default router;
