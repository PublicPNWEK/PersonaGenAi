// Backend service types for multi-platform automation and monetization

export type ApiTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface ApiCredentials {
  apiKey: string;
  tier: ApiTier;
  userId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UsageMetrics {
  totalRequests: number;
  requestsThisMonth: number;
  requestsToday: number;
  lastRequestDate: Date;
  lastDailyReset: Date;
  platforms: Record<string, number>;
}

export interface ApiKeyConfig {
  key: string;
  tier: ApiTier;
  limits: {
    requestsPerDay: number;
    requestsPerMonth: number;
    platforms: number;
    scheduledPosts: number;
  };
  usage: UsageMetrics;
}

export interface SocialMediaCredentials {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId?: string;
  username?: string;
}

export interface ScheduledPost {
  id: string;
  platform: string;
  content: string;
  mediaUrls?: string[];
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed' | 'cancelled';
  createdAt: Date;
  postedAt?: Date;
  error?: string;
}

export interface GoogleServiceConfig {
  calendar?: {
    enabled: boolean;
    calendarId?: string;
  };
  drive?: {
    enabled: boolean;
    folderId?: string;
  };
  analytics?: {
    enabled: boolean;
    trackingId?: string;
  };
}

export interface BackendConfig {
  apiEndpoint: string;
  socialMediaApis: {
    instagram?: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    };
    twitter?: {
      apiKey: string;
      apiSecret: string;
      bearerToken: string;
    };
    tiktok?: {
      clientKey: string;
      clientSecret: string;
    };
  };
  googleServices: GoogleServiceConfig;
  monetization: {
    enabled: boolean;
    tiers: Record<ApiTier, {
      price: number;
      limits: {
        requestsPerDay: number;
        requestsPerMonth: number;
        platforms: number;
        scheduledPosts: number;
      };
    }>;
  };
}

export interface PostingResult {
  platform: string;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  timestamp: Date;
}
