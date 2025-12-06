// Social Media Posting Service
import { PostingResult } from '../types/backend';
import { getCredentials, areCredentialsValid, refreshAccessToken } from './oauthService';
import { trackApiUsage, checkUsageLimits } from './apiKeyService';
import { backendConfig } from './backendConfig';

export interface PostContent {
  platform: string;
  text: string;
  mediaUrls?: string[];
  hashtags?: string[];
}

// Post to a social media platform
export const postToSocialMedia = async (content: PostContent): Promise<PostingResult> => {
  const { platform, text, mediaUrls, hashtags } = content;
  
  // Check API usage limits
  const usageCheck = checkUsageLimits();
  if (!usageCheck.allowed) {
    return {
      platform,
      success: false,
      error: usageCheck.reason || 'Usage limit exceeded',
      timestamp: new Date(),
    };
  }
  
  // Check if credentials are available and valid
  if (!areCredentialsValid(platform)) {
    const credentials = getCredentials(platform);
    if (credentials && credentials.refreshToken) {
      await refreshAccessToken(platform);
    } else {
      return {
        platform,
        success: false,
        error: 'Authentication required. Please connect your account.',
        timestamp: new Date(),
      };
    }
  }
  
  const credentials = getCredentials(platform);
  if (!credentials) {
    return {
      platform,
      success: false,
      error: 'No credentials found. Please authenticate.',
      timestamp: new Date(),
    };
  }
  
  try {
    // Track API usage
    if (!trackApiUsage(platform)) {
      return {
        platform,
        success: false,
        error: 'API usage limit exceeded',
        timestamp: new Date(),
      };
    }
    
    // Platform-specific posting logic
    let result: PostingResult;
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        result = await postToInstagram(credentials.accessToken, text, mediaUrls, hashtags);
        break;
      case 'twitter':
      case 'x':
        result = await postToTwitter(credentials.accessToken, text, mediaUrls, hashtags);
        break;
      case 'tiktok':
        result = await postToTikTok(credentials.accessToken, text, mediaUrls);
        break;
      case 'linkedin':
        result = await postToLinkedIn(credentials.accessToken, text, mediaUrls);
        break;
      default:
        result = {
          platform,
          success: false,
          error: `Posting to ${platform} is not yet implemented`,
          timestamp: new Date(),
        };
    }
    
    return result;
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    return {
      platform,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date(),
    };
  }
};

// Instagram posting implementation
const postToInstagram = async (
  accessToken: string,
  text: string,
  mediaUrls?: string[],
  hashtags?: string[]
): Promise<PostingResult> => {
  // In a real implementation, this would call the Instagram API
  // For now, we'll simulate a successful post
  
  const caption = hashtags ? `${text}\n\n${hashtags.join(' ')}` : text;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return {
    platform: 'instagram',
    success: true,
    postId: `ig_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    url: `https://www.instagram.com/p/simulated_post_id/`,
    timestamp: new Date(),
  };
};

// Twitter/X posting implementation
const postToTwitter = async (
  accessToken: string,
  text: string,
  mediaUrls?: string[],
  hashtags?: string[]
): Promise<PostingResult> => {
  // In a real implementation, this would call the Twitter API v2
  // For now, we'll simulate a successful post
  
  const tweetText = hashtags ? `${text} ${hashtags.join(' ')}` : text;
  
  // Check character limit (280 for Twitter)
  if (tweetText.length > 280) {
    return {
      platform: 'twitter',
      success: false,
      error: 'Tweet exceeds 280 character limit',
      timestamp: new Date(),
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return {
    platform: 'twitter',
    success: true,
    postId: `tweet_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    url: `https://twitter.com/user/status/simulated_tweet_id`,
    timestamp: new Date(),
  };
};

// TikTok posting implementation
const postToTikTok = async (
  accessToken: string,
  text: string,
  mediaUrls?: string[]
): Promise<PostingResult> => {
  // In a real implementation, this would call the TikTok API
  // Note: TikTok requires video content
  
  if (!mediaUrls || mediaUrls.length === 0) {
    return {
      platform: 'tiktok',
      success: false,
      error: 'TikTok requires video content',
      timestamp: new Date(),
    };
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  return {
    platform: 'tiktok',
    success: true,
    postId: `tiktok_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    url: `https://www.tiktok.com/@user/video/simulated_video_id`,
    timestamp: new Date(),
  };
};

// LinkedIn posting implementation
const postToLinkedIn = async (
  accessToken: string,
  text: string,
  mediaUrls?: string[]
): Promise<PostingResult> => {
  // In a real implementation, this would call the LinkedIn API
  // For now, we'll simulate a successful post
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return {
    platform: 'linkedin',
    success: true,
    postId: `li_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    url: `https://www.linkedin.com/feed/update/urn:li:share:simulated_post_id`,
    timestamp: new Date(),
  };
};

// Batch posting to multiple platforms
export const batchPostToSocialMedia = async (
  contents: PostContent[]
): Promise<PostingResult[]> => {
  const results: PostingResult[] = [];
  
  for (const content of contents) {
    const result = await postToSocialMedia(content);
    results.push(result);
    
    // Add a small delay between posts to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};
