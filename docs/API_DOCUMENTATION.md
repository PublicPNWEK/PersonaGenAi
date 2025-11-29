# API Integration Documentation

## Overview

This document provides detailed API documentation for developers integrating with PersonaGenAi's backend services.

## Authentication

All API requests require authentication using an API key. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

### Getting an API Key

```typescript
import { getApiKeyConfig } from './services/apiKeyService';

const config = getApiKeyConfig('FREE'); // or 'PRO', 'ENTERPRISE'
const apiKey = config.key;
```

## API Tiers

### FREE Tier
- **Cost**: $0/month
- **Limits**:
  - 10 requests per day
  - 100 requests per month
  - 3 social media platforms
  - 5 scheduled posts

### PRO Tier
- **Cost**: $29.99/month
- **Limits**:
  - 100 requests per day
  - 2,000 requests per month
  - 8 social media platforms
  - 100 scheduled posts

### ENTERPRISE Tier
- **Cost**: $299.99/month
- **Limits**: Unlimited

## Endpoints

### 1. Profile Generation

Generate AI-powered social media profiles.

**Endpoint**: `POST /api/generate`

**Request Body**:
```json
{
  "name": "Tech Startup",
  "bioDescription": "Innovative AI solutions for businesses",
  "vibe": "Professional",
  "audience": "Business Professionals",
  "platforms": ["instagram", "twitter", "linkedin"],
  "affiliateLink": "https://example.com",
  "detailedPrompt": "Focus on B2B SaaS market"
}
```

**Response**:
```json
[
  {
    "platform": "instagram",
    "username": "techstartup_ai",
    "bio": "🚀 AI-powered solutions for modern businesses | B2B SaaS | DM for demos"
  },
  {
    "platform": "twitter",
    "username": "TechStartupAI",
    "bio": "Building the future of business automation with AI 🤖 | B2B SaaS Platform"
  }
]
```

### 2. Social Media Posting

Post content to connected social media platforms.

**Endpoint**: `POST /api/post`

**Request Body**:
```json
{
  "platform": "instagram",
  "text": "Check out our latest AI features! #AI #Tech",
  "mediaUrls": ["https://example.com/image.jpg"],
  "hashtags": ["AI", "Tech", "Innovation"]
}
```

**Response**:
```json
{
  "platform": "instagram",
  "success": true,
  "postId": "ig_1234567890",
  "url": "https://www.instagram.com/p/ABC123/",
  "timestamp": "2024-11-03T10:30:00Z"
}
```

### 3. Schedule Post

Schedule a post for future publication.

**Endpoint**: `POST /api/schedule`

**Request Body**:
```json
{
  "platform": "twitter",
  "content": "Exciting news coming tomorrow! #StayTuned",
  "scheduledTime": "2024-11-04T10:00:00Z",
  "mediaUrls": []
}
```

**Response**:
```json
{
  "id": "scheduled_abc123",
  "platform": "twitter",
  "content": "Exciting news coming tomorrow! #StayTuned",
  "scheduledTime": "2024-11-04T10:00:00Z",
  "status": "pending",
  "createdAt": "2024-11-03T10:30:00Z"
}
```

### 4. OAuth Authentication

Initiate OAuth flow for social media platform.

**Endpoint**: `POST /api/oauth/initiate`

**Request Body**:
```json
{
  "platform": "instagram"
}
```

**Response**:
```json
{
  "authUrl": "https://api.instagram.com/oauth/authorize?client_id=...",
  "state": "random_state_string"
}
```

### 5. Usage Statistics

Get API usage statistics for the current month.

**Endpoint**: `GET /api/usage`

**Response**:
```json
{
  "tier": "PRO",
  "usage": {
    "totalRequests": 250,
    "requestsThisMonth": 45,
    "lastRequestDate": "2024-11-03T10:30:00Z",
    "platforms": {
      "instagram": 20,
      "twitter": 15,
      "linkedin": 10
    }
  },
  "limits": {
    "requestsPerDay": 100,
    "requestsPerMonth": 2000,
    "platforms": 8,
    "scheduledPosts": 100
  },
  "percentUsed": {
    "monthly": 2.25
  }
}
```

## Client Libraries

### TypeScript/JavaScript

```typescript
import { 
  postToSocialMedia, 
  schedulePost, 
  getUsageStats 
} from './services/postingService';

// Post to social media
const result = await postToSocialMedia({
  platform: 'instagram',
  text: 'My post content',
  mediaUrls: ['https://example.com/image.jpg']
});

// Schedule a post
const scheduled = schedulePost(
  'twitter',
  'Tweet content',
  new Date('2024-11-04T10:00:00Z')
);

// Get usage stats
const stats = getUsageStats();
```

### Python (Example)

```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.personagenai.com"

def post_to_social_media(platform, text, media_urls=None):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "platform": platform,
        "text": text,
        "mediaUrls": media_urls or []
    }
    
    response = requests.post(
        f"{BASE_URL}/api/post",
        headers=headers,
        json=data
    )
    
    return response.json()

# Usage
result = post_to_social_media(
    "instagram",
    "Check out my new post!",
    ["https://example.com/image.jpg"]
)
```

## Rate Limiting

API requests are rate-limited based on your tier:

- **FREE**: 10 requests/day
- **PRO**: 100 requests/day
- **ENTERPRISE**: No limits

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1699027200
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Monthly limit of 100 requests exceeded. Upgrade to PRO for higher limits.",
    "details": {
      "currentUsage": 100,
      "limit": 100,
      "tier": "FREE"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is missing or invalid |
| `RATE_LIMIT_EXCEEDED` | Daily or monthly rate limit exceeded |
| `AUTHENTICATION_REQUIRED` | OAuth authentication required for platform |
| `INVALID_PLATFORM` | Unsupported social media platform |
| `CONTENT_TOO_LONG` | Content exceeds platform character limit |
| `MEDIA_REQUIRED` | Platform requires media (e.g., TikTok) |
| `INVALID_MEDIA_FORMAT` | Media format not supported |
| `SCHEDULED_TIME_PAST` | Cannot schedule post in the past |
| `MAX_SCHEDULED_POSTS` | Tier limit for scheduled posts reached |

## Webhooks

Configure webhooks to receive notifications about events.

### Webhook Events

- `post.created` - Post successfully published
- `post.failed` - Post failed to publish
- `post.scheduled` - Post scheduled successfully
- `usage.limit_reached` - Usage limit reached
- `oauth.connected` - OAuth connection established
- `oauth.disconnected` - OAuth connection removed

### Webhook Payload Example

```json
{
  "event": "post.created",
  "timestamp": "2024-11-03T10:30:00Z",
  "data": {
    "platform": "instagram",
    "postId": "ig_1234567890",
    "url": "https://www.instagram.com/p/ABC123/",
    "success": true
  }
}
```

## Google Services Integration

### Calendar Sync

Automatically sync scheduled posts to Google Calendar.

```typescript
import { googleServices } from './services/googleServices';

// Initialize Google Calendar
await googleServices.initialize();

// Add post to calendar
await googleServices.calendar.addToCalendar(scheduledPost);
```

### Drive Upload

Upload media files to Google Drive for storage.

```typescript
// Upload file
const fileUrl = await googleServices.drive.uploadMedia(file);

// Use in post
await postToSocialMedia({
  platform: 'instagram',
  text: 'Check this out!',
  mediaUrls: [fileUrl]
});
```

### Analytics Tracking

Track API usage and social media engagement.

```typescript
// Track post event
googleServices.analytics.trackSocialPost('instagram', true);

// Track upgrade
googleServices.analytics.trackUpgrade('FREE', 'PRO');
```

## Best Practices

1. **Cache API Keys**: Store API keys securely and cache them to avoid repeated lookups
2. **Handle Rate Limits**: Implement exponential backoff when rate limits are hit
3. **Validate Content**: Check character limits and media requirements before posting
4. **Monitor Usage**: Track API usage to avoid unexpected limit violations
5. **Error Recovery**: Implement retry logic for transient failures
6. **Security**: Never expose API keys in client-side code
7. **OAuth Refresh**: Refresh OAuth tokens before they expire

## Code Examples

### Complete Integration Example

```typescript
import { 
  getApiKeyConfig, 
  checkUsageLimits,
  trackApiUsage 
} from './services/apiKeyService';
import { 
  initiateOAuth, 
  getCredentials 
} from './services/oauthService';
import { 
  postToSocialMedia 
} from './services/postingService';

async function publishPost(platform: string, content: string) {
  // Check usage limits
  const usageCheck = checkUsageLimits();
  if (!usageCheck.allowed) {
    throw new Error(usageCheck.reason);
  }
  
  // Check authentication
  const credentials = getCredentials(platform);
  if (!credentials) {
    await initiateOAuth(platform);
    throw new Error('Authentication required');
  }
  
  // Post content
  const result = await postToSocialMedia({
    platform,
    text: content
  });
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result;
}
```

## Support

For API support:
- Email: api-support@personagenai.com
- Documentation: https://docs.personagenai.com
- Status Page: https://status.personagenai.com

## Changelog

### v1.0.0 (2024-11-03)
- Initial API release
- Multi-platform posting support
- Scheduling functionality
- Google services integration
- Three-tier monetization model
