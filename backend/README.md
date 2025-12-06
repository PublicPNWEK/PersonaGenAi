# PersonaGenAI Backend

A powerful, cross-platform backend API for PersonaGenAI that integrates with Google services, Notion, GitHub, Perplexity AI, and provides automated posting, scheduling, and monetization features.

## Features

### Multi-Platform Integrations
- **Google Services**: Gemini AI content generation, Google Calendar scheduling, Gmail integration
- **Notion**: Content management, database operations, content calendar
- **GitHub**: Repository management, issue tracking, webhooks, automated workflows
- **Perplexity AI**: Research assistance, content idea generation, trend analysis

### Core Capabilities
- **Automated Posting**: Schedule and automatically publish content across platforms
- **Content Scheduling**: Flexible scheduling with support for one-time and recurring posts
- **Monetization**: Stripe integration for subscriptions and one-time payments
- **Rate Limiting**: Protect your API from abuse
- **Cross-Platform Access**: RESTful API accessible from any device (Windows, macOS, Linux, mobile)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (optional, for production use)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NOTION_API_KEY`: Your Notion integration token
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `PERPLEXITY_API_KEY`: Your Perplexity API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - And other required keys...

## Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3001` by default.

## Building for Production

Compile TypeScript to JavaScript:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
```
GET /health
```

### Google Integration

#### Generate Content with Gemini AI
```
POST /api/google/generate
Content-Type: application/json

{
  "prompt": "Write a social media post about AI",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

#### Schedule Google Calendar Event
```
POST /api/google/calendar/schedule
Content-Type: application/json

{
  "summary": "Team Meeting",
  "description": "Weekly sync",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T11:00:00Z",
  "accessToken": "your_google_access_token"
}
```

#### Send Email via Gmail
```
POST /api/google/gmail/send
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "Email content",
  "accessToken": "your_google_access_token"
}
```

### Notion Integration

#### Create Notion Page
```
POST /api/notion/pages
Content-Type: application/json

{
  "databaseId": "your_database_id",
  "properties": {
    "Title": {
      "title": [{"text": {"content": "New Page"}}]
    }
  }
}
```

#### Create Content Calendar Entry
```
POST /api/notion/content
Content-Type: application/json

{
  "databaseId": "your_database_id",
  "title": "Blog Post Title",
  "date": "2024-01-01",
  "platform": "Twitter",
  "content": "Post content here",
  "status": "Scheduled"
}
```

### GitHub Integration

#### Create GitHub Issue
```
POST /api/github/issues
Content-Type: application/json

{
  "owner": "username",
  "repo": "repository",
  "title": "Bug Report",
  "body": "Description of the issue",
  "labels": ["bug", "priority-high"]
}
```

#### Get Repository Info
```
GET /api/github/repos/:owner/:repo
```

#### List Repositories
```
GET /api/github/repos
```

### Perplexity AI Integration

#### Query Perplexity AI
```
POST /api/perplexity/query
Content-Type: application/json

{
  "prompt": "What are the latest trends in AI?",
  "model": "pplx-7b-online",
  "temperature": 0.7
}
```

#### Research a Topic
```
POST /api/perplexity/research
Content-Type: application/json

{
  "topic": "Sustainable Technology"
}
```

#### Generate Content Ideas
```
POST /api/perplexity/content-ideas
Content-Type: application/json

{
  "industry": "Technology",
  "count": 5
}
```

### Scheduling

#### Schedule a Post
```
POST /api/scheduling/schedule
Content-Type: application/json

{
  "platform": "twitter",
  "content": "Check out our new feature!",
  "scheduledTime": "2024-01-01T15:00:00Z",
  "userId": "user123",
  "mediaUrls": ["https://example.com/image.jpg"]
}
```

#### Schedule Recurring Post
```
POST /api/scheduling/recurring
Content-Type: application/json

{
  "platform": "twitter",
  "content": "Daily tip: Stay productive!",
  "cronExpression": "0 9 * * *",
  "userId": "user123"
}
```

Cron expression examples:
- `0 9 * * *` - Every day at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM
- `0 */2 * * *` - Every 2 hours

#### Get User's Scheduled Posts
```
GET /api/scheduling/user/:userId
```

#### Cancel Scheduled Post
```
DELETE /api/scheduling/:postId
```

### Monetization

#### Create Customer
```
POST /api/monetization/customers
Content-Type: application/json

{
  "email": "customer@example.com",
  "metadata": {
    "userId": "user123"
  }
}
```

#### Create Subscription
```
POST /api/monetization/subscriptions
Content-Type: application/json

{
  "customerId": "cus_xxxxx",
  "priceId": "price_xxxxx"
}
```

#### Create Payment Intent
```
POST /api/monetization/payment-intents
Content-Type: application/json

{
  "amount": 1000,
  "currency": "usd"
}
```

#### Get Subscription
```
GET /api/monetization/subscriptions/:subscriptionId
```

#### Cancel Subscription
```
DELETE /api/monetization/subscriptions/:subscriptionId
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 3001) |
| `MONGODB_URI` | MongoDB connection string | No |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NOTION_API_KEY` | Notion integration token | Yes |
| `GITHUB_TOKEN` | GitHub personal access token | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `PERPLEXITY_API_KEY` | Perplexity AI API key | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No (default: 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No (default: 100) |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request validation
- **Error Handling**: Centralized error management
- **Logging**: Winston-based logging system

## Cross-Platform Compatibility

The backend is designed to work seamlessly across:
- **Windows 10/11**: Full support
- **macOS**: Full support (including Apple Silicon)
- **Linux**: All major distributions
- **Mobile**: iOS and Android (via API calls)
- **Web**: Any modern browser

The RESTful API design ensures that any HTTP client can interact with the backend, regardless of the platform.

## Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t personagenai-backend .

# Run container
docker run -p 3001:3001 --env-file .env personagenai-backend
```

### Cloud Deployment

The backend can be deployed to:
- **Heroku**: `git push heroku main`
- **AWS Elastic Beanstalk**: Use EB CLI
- **Google Cloud Run**: Deploy as container
- **Azure App Service**: Use Azure CLI
- **DigitalOcean App Platform**: Connect GitHub repo

## Monetization Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Create products and prices in Stripe
4. Configure webhook endpoints for subscription events
5. Set environment variables for Stripe keys

### Subscription Tiers Example

```javascript
// Example pricing tiers
const PRICING = {
  FREE: {
    posts: 10,
    platforms: 2,
    scheduling: false
  },
  PRO: {
    price: 'price_xxxxx', // Stripe price ID
    posts: 100,
    platforms: 'unlimited',
    scheduling: true
  },
  ENTERPRISE: {
    price: 'price_xxxxx',
    posts: 'unlimited',
    platforms: 'unlimited',
    scheduling: true,
    analytics: true,
    priority: true
  }
};
```

## Error Handling

All API errors follow this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

HTTP Status Codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact support@personagenai.com

## Roadmap

- [ ] OAuth2 authentication flow
- [ ] Database integration with MongoDB
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Webhook management UI
- [ ] Real-time notifications via WebSockets
- [ ] Advanced content AI features
- [ ] Social media platform direct integrations (Twitter API, Instagram Graph API)
- [ ] Content performance analytics
- [ ] Team collaboration features
