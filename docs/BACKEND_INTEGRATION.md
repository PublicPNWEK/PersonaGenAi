# Backend Integration Guide

## Overview

PersonaGenAi now includes comprehensive backend integration for multi-platform automation and monetization. This guide explains how to set up and use these features.

## Features

### 1. Multi-Platform Social Media Integration
- **Instagram**: Post content with images and hashtags
- **Twitter/X**: Tweet with media and hashtags (280 character limit)
- **TikTok**: Upload video content with descriptions
- **LinkedIn**: Share professional content with images

### 2. Automated Scheduling
- Schedule posts for future publication
- Batch schedule multiple posts across platforms
- Automatic posting at scheduled times
- Track posting status (pending, posted, failed, cancelled)

### 3. Google Services Integration
- **Google Calendar**: Sync scheduled posts to your calendar
- **Google Drive**: Upload and store media files
- **Google Analytics**: Track usage and engagement metrics

### 4. API Monetization
Three-tier pricing model:
- **FREE**: 10 requests/day, 100/month, 3 platforms, 5 scheduled posts
- **PRO**: 100 requests/day, 2000/month, 8 platforms, 100 scheduled posts ($29.99)
- **ENTERPRISE**: Unlimited usage across all platforms ($299.99)

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your API credentials:

#### Required:
- `API_KEY`: Your Google Gemini API key (get it from [Google AI Studio](https://ai.google.dev/))

#### Optional (for full functionality):
- Social Media APIs:
  - Instagram: Get credentials from [Facebook Developers](https://developers.facebook.com/)
  - Twitter/X: Get credentials from [Twitter Developer Portal](https://developer.twitter.com/)
  - TikTok: Get credentials from [TikTok Developers](https://developers.tiktok.com/)

- Google Services:
  - Enable services in `.env.local` and provide the required IDs
  - Set up OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/)

### 2. Social Media API Setup

#### Instagram Setup
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com/)
2. Add Instagram Basic Display product
3. Configure OAuth redirect URI: `http://localhost:5173/auth/instagram/callback`
4. Add your credentials to `.env.local`

#### Twitter/X Setup
1. Apply for a developer account at [developer.twitter.com](https://developer.twitter.com/)
2. Create a new app
3. Enable OAuth 2.0 with PKCE
4. Add read/write permissions
5. Add your credentials to `.env.local`

#### TikTok Setup
1. Register at [developers.tiktok.com](https://developers.tiktok.com/)
2. Create a new app
3. Enable "Login Kit" and "Content Posting API"
4. Add your credentials to `.env.local`

### 3. Google Services Setup

#### Google Calendar Integration
1. Enable the Calendar API in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set `GOOGLE_CALENDAR_ENABLED=true` in `.env.local`
4. Add your calendar ID

#### Google Drive Integration
1. Enable the Drive API in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set `GOOGLE_DRIVE_ENABLED=true` in `.env.local`
4. Create a folder for media storage and add the folder ID

#### Google Analytics Integration
1. Create a GA4 property
2. Get your Measurement ID
3. Set `GOOGLE_ANALYTICS_ENABLED=true` in `.env.local`
4. Add your tracking ID

## Usage

### Using the API Key System

```typescript
import { getApiKeyConfig, updateApiKeyTier, getUsageStats } from './services/apiKeyService';

// Get current API key configuration
const config = getApiKeyConfig();
console.log('Current tier:', config.tier);
console.log('API Key:', config.key);

// Upgrade to PRO tier
const newConfig = updateApiKeyTier('PRO');

// Check usage statistics
const stats = getUsageStats();
console.log('Usage:', stats);
```

### OAuth Authentication

```typescript
import { initiateOAuth, getCredentials } from './services/oauthService';

// Initiate OAuth flow for Instagram
await initiateOAuth('instagram');

// Check if authenticated
const credentials = getCredentials('instagram');
if (credentials) {
  console.log('Authenticated as:', credentials.username);
}
```

### Posting to Social Media

```typescript
import { postToSocialMedia, batchPostToSocialMedia } from './services/postingService';

// Post to a single platform
const result = await postToSocialMedia({
  platform: 'instagram',
  text: 'Check out my new post! #ai #automation',
  mediaUrls: ['https://example.com/image.jpg'],
  hashtags: ['ai', 'automation', 'tech'],
});

// Batch post to multiple platforms
const results = await batchPostToSocialMedia([
  { platform: 'instagram', text: 'Post 1', mediaUrls: ['url1'] },
  { platform: 'twitter', text: 'Post 2', hashtags: ['tech'] },
]);
```

### Scheduling Posts

```typescript
import { schedulePost, getScheduledPosts, initializeScheduler } from './services/schedulingService';

// Initialize the scheduler (call once when app starts)
initializeScheduler();

// Schedule a post for tomorrow at 10 AM
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const scheduledPost = schedulePost(
  'instagram',
  'My scheduled post content',
  tomorrow,
  ['https://example.com/image.jpg']
);

// View all scheduled posts
const allPosts = getScheduledPosts();
```

### Using Google Services

```typescript
import { googleServices } from './services/googleServices';

// Initialize all Google services
await googleServices.initialize();

// Upload to Google Drive
const fileUrl = await googleServices.drive.uploadMedia(file);

// Add to Google Calendar
await googleServices.calendar.addToCalendar(scheduledPost);

// Track analytics
googleServices.analytics.trackSocialPost('instagram', true);
googleServices.analytics.trackUpgrade('FREE', 'PRO');
```

## API Reference

### Services

- **backendConfig.ts**: Configuration for backend services and APIs
- **apiKeyService.ts**: API key management and usage tracking
- **oauthService.ts**: OAuth authentication for social platforms
- **postingService.ts**: Social media posting functionality
- **schedulingService.ts**: Post scheduling and automation
- **googleServices.ts**: Google services integration (Calendar, Drive, Analytics)

### Types

See `types/backend.ts` for complete type definitions:
- `ApiKeyConfig`: API key and tier configuration
- `SocialMediaCredentials`: OAuth credentials for platforms
- `ScheduledPost`: Scheduled post data structure
- `PostingResult`: Result of a posting operation
- `BackendConfig`: Complete backend configuration

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive credentials
3. **Implement proper OAuth flows** in production (use PKCE for SPAs)
4. **Rotate API keys** regularly
5. **Monitor usage** to detect anomalies
6. **Use HTTPS** in production
7. **Validate all user inputs** before posting

## Deployment

### Production Checklist

1. Set up a proper backend server for OAuth token exchange
2. Configure environment variables in your hosting platform
3. Enable HTTPS and configure CORS properly
4. Set up proper error logging and monitoring
5. Implement rate limiting on the server side
6. Configure webhook handlers for platform callbacks
7. Set up automated backups of user data

### Recommended Backend Stack

- **Node.js/Express**: For API endpoints and OAuth handling
- **PostgreSQL**: For storing user data and credentials
- **Redis**: For caching and rate limiting
- **AWS S3/Google Cloud Storage**: For media file storage
- **Vercel/Netlify**: For frontend hosting
- **Heroku/Railway**: For backend API hosting

## Troubleshooting

### Common Issues

1. **OAuth popup blocked**: Ensure popups are allowed for your domain
2. **API key invalid**: Check that your `.env.local` has the correct key
3. **Usage limit exceeded**: Upgrade your tier or wait for the limit to reset
4. **Post failed**: Check platform-specific requirements (character limits, media formats)
5. **Scheduled posts not executing**: Ensure `initializeScheduler()` is called

### Getting Help

- Check the console for detailed error messages
- Review the API documentation for each platform
- Ensure all environment variables are set correctly
- Verify OAuth redirect URIs match your configuration

## Future Enhancements

- [ ] Real OAuth implementation with backend token exchange
- [ ] Webhook support for real-time platform updates
- [ ] Advanced analytics and reporting
- [ ] A/B testing for post content
- [ ] AI-powered optimal posting time suggestions
- [ ] Multi-account management
- [ ] Team collaboration features
- [ ] Custom webhook integrations (Zapier, IFTTT)
- [ ] Mobile app (React Native)

## License

This integration is part of PersonaGenAi and follows the same license terms.
