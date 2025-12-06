// Backend configuration service for multi-platform integration
import { BackendConfig, ApiTier } from '../types/backend';
import { isInstagramConfig, isTwitterConfig, isTikTokConfig } from './typeGuards';

// Default backend configuration
// In production, these values should be loaded from environment variables
export const backendConfig: BackendConfig = {
  apiEndpoint: process.env.BACKEND_API_ENDPOINT || 'http://localhost:3001/api',
  
  socialMediaApis: {
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID || '',
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
      redirectUri: process.env.INSTAGRAM_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/auth/instagram/callback` : ''),
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    },
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    },
  },
  
  googleServices: {
    calendar: {
      enabled: process.env.GOOGLE_CALENDAR_ENABLED === 'true',
      calendarId: process.env.GOOGLE_CALENDAR_ID,
    },
    drive: {
      enabled: process.env.GOOGLE_DRIVE_ENABLED === 'true',
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
    },
    analytics: {
      enabled: process.env.GOOGLE_ANALYTICS_ENABLED === 'true',
      trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    },
  },
  
  monetization: {
    enabled: true,
    tiers: {
      FREE: {
        price: 0,
        limits: {
          requestsPerDay: 10,
          requestsPerMonth: 100,
          platforms: 3,
          scheduledPosts: 5,
        },
      },
      PRO: {
        price: 29.99,
        limits: {
          requestsPerDay: 100,
          requestsPerMonth: 2000,
          platforms: 8,
          scheduledPosts: 100,
        },
      },
      ENTERPRISE: {
        price: 299.99,
        limits: {
          requestsPerDay: -1, // Unlimited
          requestsPerMonth: -1,
          platforms: -1,
          scheduledPosts: -1,
        },
      },
    },
  },
};

// Helper function to get tier limits
export const getTierLimits = (tier: ApiTier) => {
  return backendConfig.monetization.tiers[tier].limits;
};

// Helper function to check if a service is enabled
export const isGoogleServiceEnabled = (service: 'calendar' | 'drive' | 'analytics'): boolean => {
  return backendConfig.googleServices[service]?.enabled || false;
};

// Helper function to validate API credentials
export const validateApiCredentials = (platform: 'instagram' | 'twitter' | 'tiktok'): boolean => {
  const config = backendConfig.socialMediaApis[platform];
  if (!config) return false;
  
  switch (platform) {
    case 'instagram':
      return isInstagramConfig(config) && !!(config.clientId && config.clientSecret);
    case 'twitter':
      return isTwitterConfig(config) && !!(config.apiKey && config.apiSecret);
    case 'tiktok':
      return isTikTokConfig(config) && !!(config.clientKey && config.clientSecret);
    default:
      return false;
  }
};
