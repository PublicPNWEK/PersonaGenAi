// Backend Services Index
// Central export for all backend integration services

// Configuration
export { backendConfig, getTierLimits, isGoogleServiceEnabled, validateApiCredentials } from './backendConfig';

// API Key Management
export {
  generateApiKey,
  getApiKeyConfig,
  updateApiKeyTier,
  trackApiUsage,
  checkUsageLimits,
  getUsageStats,
  resetApiKey,
} from './apiKeyService';

// OAuth Service
export {
  storeSocialCredentials,
  getCredentials,
  getAllCredentials,
  removeCredentials,
  areCredentialsValid,
  initiateOAuth,
  handleOAuthCallback,
  refreshAccessToken,
} from './oauthService';

// Posting Service
export {
  postToSocialMedia,
  batchPostToSocialMedia,
} from './postingService';

// Scheduling Service
export {
  getScheduledPosts,
  getScheduledPostsByPlatform,
  getPendingScheduledPosts,
  schedulePost,
  updateScheduledPost,
  cancelScheduledPost,
  deleteScheduledPost,
  processDueScheduledPosts,
  initializeScheduler,
  getScheduledPostsSummary,
  batchSchedulePosts,
} from './schedulingService';

// Google Services
export {
  googleServices,
  googleCalendar,
  googleDrive,
  googleAnalytics,
} from './googleServices';

// Original Services (keep existing exports)
export { storageService } from './storageService';
export { generateProfiles } from './geminiService';
