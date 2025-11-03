import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

interface ScheduledPost {
  id: string;
  platform: string;
  content: string;
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed';
  userId: string;
  mediaUrls?: string[];
}

export class SchedulingService {
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();
  private posts: Map<string, ScheduledPost> = new Map();

  /**
   * Schedule a post for later publishing
   */
  schedulePost(post: ScheduledPost): string {
    try {
      const cronTime = this.convertToCronTime(post.scheduledTime);
      
      const task = cron.schedule(cronTime, async () => {
        await this.executeScheduledPost(post.id);
      });

      this.scheduledJobs.set(post.id, task);
      this.posts.set(post.id, post);
      
      logger.info(`Post scheduled: ${post.id} for ${post.scheduledTime}`);
      return post.id;
    } catch (error) {
      logger.error('Error scheduling post:', error);
      throw new AppError('Failed to schedule post', 500);
    }
  }

  /**
   * Cancel a scheduled post
   */
  cancelScheduledPost(postId: string): boolean {
    const task = this.scheduledJobs.get(postId);
    if (task) {
      task.stop();
      this.scheduledJobs.delete(postId);
      this.posts.delete(postId);
      logger.info(`Cancelled scheduled post: ${postId}`);
      return true;
    }
    return false;
  }

  /**
   * Get all scheduled posts for a user
   */
  getScheduledPosts(userId: string): ScheduledPost[] {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  /**
   * Execute a scheduled post
   */
  private async executeScheduledPost(postId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) {
      logger.error(`Post not found: ${postId}`);
      return;
    }

    try {
      logger.info(`Executing scheduled post: ${postId} on ${post.platform}`);
      
      // Platform-specific posting logic would go here
      // For now, we'll just update the status
      post.status = 'posted';
      this.posts.set(postId, post);
      
      // Remove from scheduled jobs
      const task = this.scheduledJobs.get(postId);
      if (task) {
        task.stop();
        this.scheduledJobs.delete(postId);
      }
      
      logger.info(`Successfully posted: ${postId}`);
    } catch (error) {
      logger.error(`Error executing scheduled post ${postId}:`, error);
      post.status = 'failed';
      this.posts.set(postId, post);
    }
  }

  /**
   * Convert Date to cron time format
   */
  private convertToCronTime(date: Date): string {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    
    return `${minute} ${hour} ${dayOfMonth} ${month} *`;
  }

  /**
   * Setup recurring posts (e.g., daily, weekly)
   */
  scheduleRecurringPost(
    post: Omit<ScheduledPost, 'id' | 'scheduledTime'>,
    cronExpression: string
  ): string {
    try {
      const postId = `recurring-${Date.now()}`;
      
      const task = cron.schedule(cronExpression, async () => {
        await this.executeScheduledPost(postId);
      });

      this.scheduledJobs.set(postId, task);
      
      logger.info(`Recurring post scheduled: ${postId} with cron: ${cronExpression}`);
      return postId;
    } catch (error) {
      logger.error('Error scheduling recurring post:', error);
      throw new AppError('Failed to schedule recurring post', 500);
    }
  }
}
