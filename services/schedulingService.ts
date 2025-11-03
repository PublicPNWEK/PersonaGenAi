// Scheduling Service for Automated Posting
import { ScheduledPost } from '../types/backend';
import { storageService } from './storageService';
import { postToSocialMedia } from './postingService';

const SCHEDULED_POSTS_KEY = 'personagen_scheduled_posts';

// Get all scheduled posts
export const getScheduledPosts = (): ScheduledPost[] => {
  return storageService.getItem<ScheduledPost[]>(SCHEDULED_POSTS_KEY) || [];
};

// Get scheduled posts for a specific platform
export const getScheduledPostsByPlatform = (platform: string): ScheduledPost[] => {
  const allPosts = getScheduledPosts();
  return allPosts.filter(post => post.platform === platform);
};

// Get pending scheduled posts
export const getPendingScheduledPosts = (): ScheduledPost[] => {
  const allPosts = getScheduledPosts();
  return allPosts.filter(post => post.status === 'pending');
};

// Create a new scheduled post
export const schedulePost = (
  platform: string,
  content: string,
  scheduledTime: Date,
  mediaUrls?: string[]
): ScheduledPost => {
  const newPost: ScheduledPost = {
    id: `scheduled_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    platform,
    content,
    mediaUrls,
    scheduledTime: new Date(scheduledTime),
    status: 'pending',
    createdAt: new Date(),
  };
  
  const allPosts = getScheduledPosts();
  allPosts.push(newPost);
  storageService.setItem(SCHEDULED_POSTS_KEY, allPosts);
  
  return newPost;
};

// Update a scheduled post
export const updateScheduledPost = (postId: string, updates: Partial<ScheduledPost>): ScheduledPost | null => {
  const allPosts = getScheduledPosts();
  const index = allPosts.findIndex(post => post.id === postId);
  
  if (index === -1) {
    return null;
  }
  
  allPosts[index] = { ...allPosts[index], ...updates };
  storageService.setItem(SCHEDULED_POSTS_KEY, allPosts);
  
  return allPosts[index];
};

// Cancel a scheduled post
export const cancelScheduledPost = (postId: string): boolean => {
  const allPosts = getScheduledPosts();
  const index = allPosts.findIndex(post => post.id === postId);
  
  if (index === -1) {
    return false;
  }
  
  allPosts[index].status = 'cancelled';
  storageService.setItem(SCHEDULED_POSTS_KEY, allPosts);
  
  return true;
};

// Delete a scheduled post
export const deleteScheduledPost = (postId: string): boolean => {
  const allPosts = getScheduledPosts();
  const filtered = allPosts.filter(post => post.id !== postId);
  
  if (filtered.length === allPosts.length) {
    return false; // Post not found
  }
  
  storageService.setItem(SCHEDULED_POSTS_KEY, filtered);
  return true;
};

// Check and execute due scheduled posts
export const processDueScheduledPosts = async (): Promise<void> => {
  const pendingPosts = getPendingScheduledPosts();
  const now = new Date();
  
  for (const post of pendingPosts) {
    const scheduledTime = new Date(post.scheduledTime);
    
    if (scheduledTime <= now) {
      try {
        const result = await postToSocialMedia({
          platform: post.platform,
          text: post.content,
          mediaUrls: post.mediaUrls,
        });
        
        if (result.success) {
          updateScheduledPost(post.id, {
            status: 'posted',
            postedAt: new Date(),
          });
        } else {
          updateScheduledPost(post.id, {
            status: 'failed',
            error: result.error,
          });
        }
      } catch (error) {
        updateScheduledPost(post.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
};

// Initialize scheduler (should be called when app starts)
let schedulerIntervalId: NodeJS.Timeout | null = null;

export const initializeScheduler = (): void => {
  // Clear existing interval if any to prevent multiple intervals
  if (schedulerIntervalId) {
    clearInterval(schedulerIntervalId);
  }
  
  // Check for due posts every minute
  const checkInterval = 60 * 1000; // 60 seconds
  
  schedulerIntervalId = setInterval(() => {
    processDueScheduledPosts().catch(error => {
      console.error('Error processing scheduled posts:', error);
    });
  }, checkInterval);
  
  // Process immediately on initialization
  processDueScheduledPosts().catch(error => {
    console.error('Error processing scheduled posts on init:', error);
  });
};

// Stop the scheduler (useful for cleanup)
export const stopScheduler = (): void => {
  if (schedulerIntervalId) {
    clearInterval(schedulerIntervalId);
    schedulerIntervalId = null;
  }
};

// Get scheduled posts summary
export const getScheduledPostsSummary = () => {
  const allPosts = getScheduledPosts();
  
  return {
    total: allPosts.length,
    pending: allPosts.filter(p => p.status === 'pending').length,
    posted: allPosts.filter(p => p.status === 'posted').length,
    failed: allPosts.filter(p => p.status === 'failed').length,
    cancelled: allPosts.filter(p => p.status === 'cancelled').length,
    upcoming: allPosts.filter(p => 
      p.status === 'pending' && 
      new Date(p.scheduledTime) > new Date()
    ).length,
  };
};

// Batch schedule multiple posts
export const batchSchedulePosts = (
  posts: Array<{
    platform: string;
    content: string;
    scheduledTime: Date;
    mediaUrls?: string[];
  }>
): ScheduledPost[] => {
  const scheduledPosts: ScheduledPost[] = [];
  
  for (const post of posts) {
    const scheduled = schedulePost(
      post.platform,
      post.content,
      post.scheduledTime,
      post.mediaUrls
    );
    scheduledPosts.push(scheduled);
  }
  
  return scheduledPosts;
};
