import { Router, Request, Response, NextFunction } from 'express';
import { SchedulingService } from '../services/schedulingService.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const schedulingService = new SchedulingService();

/**
 * POST /api/scheduling/schedule
 * Schedule a post
 */
router.post('/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { platform, content, scheduledTime, userId, mediaUrls } = req.body;

    if (!platform || !content || !scheduledTime || !userId) {
      return res.status(400).json({ 
        error: 'platform, content, scheduledTime, and userId are required' 
      });
    }

    const postId = uuidv4();
    const scheduledPost = {
      id: postId,
      platform,
      content,
      scheduledTime: new Date(scheduledTime),
      status: 'pending' as const,
      userId,
      mediaUrls
    };

    const id = schedulingService.schedulePost(scheduledPost);
    res.json({ id, message: 'Post scheduled successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scheduling/:postId
 * Cancel a scheduled post
 */
router.delete('/:postId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const cancelled = schedulingService.cancelScheduledPost(postId);

    if (cancelled) {
      res.json({ message: 'Post cancelled successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scheduling/user/:userId
 * Get all scheduled posts for a user
 */
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const posts = schedulingService.getScheduledPosts(userId);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scheduling/recurring
 * Schedule a recurring post
 */
router.post('/recurring', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { platform, content, cronExpression, userId, mediaUrls } = req.body;

    if (!platform || !content || !cronExpression || !userId) {
      return res.status(400).json({ 
        error: 'platform, content, cronExpression, and userId are required' 
      });
    }

    const id = schedulingService.scheduleRecurringPost(
      {
        platform,
        content,
        status: 'pending',
        userId,
        mediaUrls
      },
      cronExpression
    );

    res.json({ id, message: 'Recurring post scheduled successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
