// Fix: Create constants for the application.
import React from 'react';
import {
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  TikTokIcon,
  PinterestIcon,
  YouTubeIcon,
  RedditIcon,
} from './components/icons/SocialIcons';
import { Platform } from './types';

export const VIBES = [
  'Professional',
  'Casual',
  'Humorous',
  'Inspirational',
  'Edgy',
  'Minimalist',
  'Techy',
  'Artistic',
];

export const AUDIENCES = [
  'General Public',
  'Tech Enthusiasts',
  'Business Professionals',
  'Artists & Creatives',
  'Students',
  'Gamers',
  'Fitness Community',
  'Developers',
];

type PlatformInfo = {
  name: string;
  Icon: React.FC<{ className?: string }>;
  color: string;
  signupUrl: string;
};

export const PLATFORMS: Record<Platform, PlatformInfo> = {
  twitter: {
    name: 'Twitter / X',
    Icon: TwitterIcon,
    color: 'text-sky-500',
    signupUrl: 'https://x.com/signup',
  },
  instagram: {
    name: 'Instagram',
    Icon: InstagramIcon,
    color: 'text-pink-500',
    signupUrl: 'https://www.instagram.com/accounts/emailsignup/',
  },
  linkedin: {
    name: 'LinkedIn',
    Icon: LinkedInIcon,
    color: 'text-blue-600',
    signupUrl: 'https://www.linkedin.com/signup/',
  },
  threads: {
    name: 'Threads',
    Icon: ThreadsIcon,
    color: 'text-slate-300',
    signupUrl: 'https://www.threads.net/',
  },
  tiktok: {
    name: 'TikTok',
    Icon: TikTokIcon,
    color: 'text-cyan-400',
    signupUrl: 'https://www.tiktok.com/signup',
  },
  pinterest: {
    name: 'Pinterest',
    Icon: PinterestIcon,
    color: 'text-red-600',
    signupUrl: 'https://www.pinterest.com/signup/',
  },
  youtube: {
    name: 'YouTube',
    Icon: YouTubeIcon,
    color: 'text-red-500',
    signupUrl: 'https://www.youtube.com/account',
  },
  reddit: {
    name: 'Reddit',
    Icon: RedditIcon,
    color: 'text-orange-500',
    signupUrl: 'https://www.reddit.com/register/',
  },
};
