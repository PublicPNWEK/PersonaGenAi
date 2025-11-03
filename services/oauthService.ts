// OAuth Service for Social Media Platform Authentication
import { SocialMediaCredentials } from '../types/backend';
import { storageService } from './storageService';
import { backendConfig } from './backendConfig';

const CREDENTIALS_STORAGE_KEY = 'personagen_social_credentials';

// Store credentials for a platform
export const storeSocialCredentials = (credentials: SocialMediaCredentials): void => {
  const allCredentials = getAllCredentials();
  const existingIndex = allCredentials.findIndex(c => c.platform === credentials.platform);
  
  if (existingIndex >= 0) {
    allCredentials[existingIndex] = credentials;
  } else {
    allCredentials.push(credentials);
  }
  
  storageService.setItem(CREDENTIALS_STORAGE_KEY, allCredentials);
};

// Get credentials for a specific platform
export const getCredentials = (platform: string): SocialMediaCredentials | null => {
  const allCredentials = getAllCredentials();
  return allCredentials.find(c => c.platform === platform) || null;
};

// Get all stored credentials
export const getAllCredentials = (): SocialMediaCredentials[] => {
  return storageService.getItem<SocialMediaCredentials[]>(CREDENTIALS_STORAGE_KEY) || [];
};

// Remove credentials for a platform
export const removeCredentials = (platform: string): void => {
  const allCredentials = getAllCredentials();
  const filtered = allCredentials.filter(c => c.platform !== platform);
  storageService.setItem(CREDENTIALS_STORAGE_KEY, filtered);
};

// Check if credentials are valid (not expired)
export const areCredentialsValid = (platform: string): boolean => {
  const credentials = getCredentials(platform);
  if (!credentials) return false;
  
  if (credentials.expiresAt) {
    return new Date(credentials.expiresAt) > new Date();
  }
  
  return true;
};

// Initialize OAuth flow for a platform
export const initiateOAuth = async (platform: 'instagram' | 'twitter' | 'tiktok'): Promise<void> => {
  const config = backendConfig.socialMediaApis[platform];
  
  if (!config) {
    throw new Error(`OAuth configuration not found for ${platform}`);
  }
  
  let authUrl = '';
  
  switch (platform) {
    case 'instagram':
      // Instagram Basic Display API OAuth URL
      authUrl = `https://api.instagram.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=user_profile,user_media&response_type=code`;
      break;
      
    case 'twitter':
      // Twitter OAuth 2.0 URL (requires PKCE in production)
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${config.apiKey}&redirect_uri=${window.location.origin}/auth/twitter/callback&scope=tweet.read%20tweet.write%20users.read&state=${generateState()}`;
      break;
      
    case 'tiktok':
      // TikTok OAuth URL
      authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${config.clientKey}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${window.location.origin}/auth/tiktok/callback&state=${generateState()}`;
      break;
      
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
  
  // Open OAuth window
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  const popup = window.open(
    authUrl,
    `${platform}_oauth`,
    `width=${width},height=${height},left=${left},top=${top}`
  );
  
  if (!popup) {
    throw new Error('Failed to open OAuth popup. Please allow popups for this site.');
  }
};

// Handle OAuth callback (simplified - in production, this should be done server-side)
export const handleOAuthCallback = async (
  platform: string,
  code: string
): Promise<SocialMediaCredentials> => {
  // In a real implementation, this would exchange the code for tokens via the backend
  // For now, we'll simulate the response
  
  const credentials: SocialMediaCredentials = {
    platform,
    accessToken: `simulated_token_${code}`,
    refreshToken: `simulated_refresh_${code}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    userId: `user_${Math.random().toString(36).substring(7)}`,
    username: `@user_${Math.random().toString(36).substring(7)}`,
  };
  
  storeSocialCredentials(credentials);
  return credentials;
};

// Generate a random state for OAuth security
const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Refresh access token (for platforms that support it)
export const refreshAccessToken = async (platform: string): Promise<SocialMediaCredentials | null> => {
  const credentials = getCredentials(platform);
  
  if (!credentials || !credentials.refreshToken) {
    return null;
  }
  
  // In a real implementation, this would call the platform's token refresh endpoint
  // For now, we'll simulate the response
  const newCredentials: SocialMediaCredentials = {
    ...credentials,
    accessToken: `refreshed_token_${Date.now()}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  };
  
  storeSocialCredentials(newCredentials);
  return newCredentials;
};
