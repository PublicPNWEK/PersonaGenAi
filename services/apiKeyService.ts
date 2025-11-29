// API Key Management Service for Monetization
// SECURITY NOTE: This is a client-side implementation for demonstration purposes.
// In production, API key generation and validation should be handled server-side,
// and keys should be stored securely in a database with proper encryption.
import { ApiKeyConfig, ApiTier, UsageMetrics } from '../types/backend';
import { storageService } from './storageService';
import { getTierLimits } from './backendConfig';

const API_KEY_STORAGE_KEY = 'personagen_api_key';
const USAGE_STORAGE_KEY = 'personagen_api_usage';

// Generate a simple API key (in production, this should be done server-side)
export const generateApiKey = (tier: ApiTier): string => {
  const prefix = tier === 'FREE' ? 'pk_test_' : tier === 'PRO' ? 'pk_live_' : 'pk_ent_';
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `${prefix}${random}`;
};

// Initialize default usage metrics
const createDefaultUsage = (): UsageMetrics => ({
  totalRequests: 0,
  requestsThisMonth: 0,
  requestsToday: 0,
  lastRequestDate: new Date(),
  lastDailyReset: new Date(),
  platforms: {},
});

// Get or create API key configuration
export const getApiKeyConfig = (tier: ApiTier = 'FREE'): ApiKeyConfig => {
  let config = storageService.getItem<ApiKeyConfig>(API_KEY_STORAGE_KEY);
  
  if (!config) {
    const limits = getTierLimits(tier);
    config = {
      key: generateApiKey(tier),
      tier,
      limits,
      usage: createDefaultUsage(),
    };
    storageService.setItem(API_KEY_STORAGE_KEY, config);
  }
  
  return config;
};

// Update API key tier (upgrade/downgrade)
export const updateApiKeyTier = (newTier: ApiTier): ApiKeyConfig => {
  const config = getApiKeyConfig();
  const limits = getTierLimits(newTier);
  
  const updatedConfig: ApiKeyConfig = {
    ...config,
    key: generateApiKey(newTier),
    tier: newTier,
    limits,
  };
  
  storageService.setItem(API_KEY_STORAGE_KEY, updatedConfig);
  return updatedConfig;
};

// Track API usage
export const trackApiUsage = (platform: string): boolean => {
  const config = getApiKeyConfig();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const lastRequestMonth = new Date(config.usage.lastRequestDate).getMonth();
  const lastDailyResetDay = new Date(config.usage.lastDailyReset || now).getDate();
  
  // Reset monthly counter if it's a new month
  if (currentMonth !== lastRequestMonth) {
    config.usage.requestsThisMonth = 0;
  }
  
  // Reset daily counter if it's a new day
  if (currentDay !== lastDailyResetDay) {
    config.usage.requestsToday = 0;
    config.usage.lastDailyReset = now;
  }
  
  // Check daily limit
  if (config.limits.requestsPerDay !== -1 && config.usage.requestsToday >= config.limits.requestsPerDay) {
    return false; // Daily limit exceeded
  }
  
  // Check monthly limit
  if (config.limits.requestsPerMonth !== -1 && config.usage.requestsThisMonth >= config.limits.requestsPerMonth) {
    return false; // Monthly limit exceeded
  }
  
  // Update usage
  config.usage.totalRequests++;
  config.usage.requestsThisMonth++;
  config.usage.requestsToday++;
  config.usage.lastRequestDate = now;
  config.usage.platforms[platform] = (config.usage.platforms[platform] || 0) + 1;
  
  storageService.setItem(API_KEY_STORAGE_KEY, config);
  return true;
};

// Check if usage is within limits
export const checkUsageLimits = (): { allowed: boolean; reason?: string } => {
  const config = getApiKeyConfig();
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastRequestMonth = new Date(config.usage.lastRequestDate).getMonth();
  
  // Reset monthly counter if it's a new month
  let monthlyRequests = config.usage.requestsThisMonth;
  if (currentMonth !== lastRequestMonth) {
    monthlyRequests = 0;
  }
  
  // Check monthly limit
  if (config.limits.requestsPerMonth !== -1 && monthlyRequests >= config.limits.requestsPerMonth) {
    return { 
      allowed: false, 
      reason: `Monthly limit of ${config.limits.requestsPerMonth} requests exceeded. Upgrade to PRO for higher limits.` 
    };
  }
  
  return { allowed: true };
};

// Get usage statistics
export const getUsageStats = () => {
  const config = getApiKeyConfig();
  const limits = config.limits;
  
  return {
    tier: config.tier,
    usage: config.usage,
    limits,
    percentUsed: {
      monthly: limits.requestsPerMonth === -1 
        ? 0 
        : (config.usage.requestsThisMonth / limits.requestsPerMonth) * 100,
    },
  };
};

// Reset API key (for testing)
export const resetApiKey = (): void => {
  storageService.removeItem(API_KEY_STORAGE_KEY);
  storageService.removeItem(USAGE_STORAGE_KEY);
};
