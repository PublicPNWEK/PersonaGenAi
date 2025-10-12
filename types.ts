// Fix: Create types for the application.
export type Platform =
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'threads'
  | 'tiktok'
  | 'pinterest'
  | 'youtube'
  | 'reddit';

export interface UserInput {
  name: string;
  bioDescription: string;
  vibe: string;
  audience: string;
  platforms: Platform[];
  affiliateLink?: string;
  email?: string;
  phone?: string;
}

export interface ProfileSuggestion {
  platform: Platform;
  username: string;
  bio: string;
}

export type ProfileSuggestions = ProfileSuggestion[];