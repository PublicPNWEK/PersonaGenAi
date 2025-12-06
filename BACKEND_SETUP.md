# Backend Integration Setup Guide

This guide will help you set up the PersonaGenAI backend for multi-platform integration and monetization.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **npm** or **yarn** package manager
3. **Git** for version control

## Step 1: Platform Account Setup

You'll need to create accounts and obtain API keys from the following platforms:

### Google Services
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new project
3. Enable Gemini API
4. Generate an API key
5. For Google Calendar/Gmail integration:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Enable Calendar API and Gmail API

### Notion
1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Internal Integration Token
4. Share your database with the integration

### GitHub
1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/tokens)
2. Generate a new Personal Access Token
3. Grant necessary permissions (repo, issues, etc.)

### Perplexity AI
1. Visit [Perplexity API](https://www.perplexity.ai/)
2. Sign up for API access
3. Generate an API key

### Stripe (for Monetization)
1. Create account at [Stripe](https://stripe.com/)
2. Get your API keys from the Dashboard
3. Create products and pricing plans
4. Set up webhook endpoint

## Step 2: Backend Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 3: Configure Environment Variables

Edit the `.env` file and add your API keys:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database (optional for now)
# MONGODB_URI=mongodb://localhost:27017/personagenai

# Google Services
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Notion
NOTION_API_KEY=your_notion_api_key_here

# GitHub
GITHUB_TOKEN=your_github_token_here

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# JWT for Authentication
JWT_SECRET=your_random_secret_key_here_minimum_32_characters

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 4: Start the Backend

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend will start on `http://localhost:3001`

## Step 5: Verify Installation

Test the health check endpoint:

```bash
curl http://localhost:3001/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "PersonaGenAI Backend"
}
```

## Step 6: Test API Endpoints

### Test Content Generation

```bash
curl -X POST http://localhost:3001/api/google/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a motivational social media post",
    "temperature": 0.7
  }'
```

### Test Scheduling

```bash
curl -X POST http://localhost:3001/api/scheduling/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "twitter",
    "content": "Hello World!",
    "scheduledTime": "2024-12-31T15:00:00Z",
    "userId": "test-user"
  }'
```

## Step 7: Integrate with Frontend

Update your frontend to connect to the backend:

```javascript
// In your frontend code
const API_URL = 'http://localhost:3001/api';

async function generateContent(prompt) {
  const response = await fetch(`${API_URL}/google/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt })
  });
  
  return await response.json();
}
```

## Platform-Specific Setup

### Windows 10/11

1. Install Node.js from the official website
2. Use PowerShell or Command Prompt
3. Follow the installation steps above

### macOS (Including Apple Silicon)

```bash
# Install via Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Arch
sudo pacman -S nodejs npm
```

## Docker Deployment

For containerized deployment:

```bash
# Build and run with Docker Compose
cd backend
docker-compose up -d

# Or build manually
docker build -t personagenai-backend .
docker run -p 3001:3001 --env-file .env personagenai-backend
```

## Production Deployment

### Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key
# Set all other environment variables
git push heroku main
```

### AWS/Azure/GCP

See the backend README.md for detailed cloud deployment instructions.

## Monetization Setup

### Setting Up Stripe

1. **Create Products in Stripe Dashboard**
   - Go to Products → Add Product
   - Create pricing tiers (e.g., Free, Pro, Enterprise)
   - Copy the Price IDs

2. **Configure Webhook**
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/monetization/webhooks`
   - Select events to listen to
   - Copy webhook signing secret

3. **Update Environment**
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Testing Subscriptions

Use Stripe test mode with test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

**CORS Errors**
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the backend server

**API Key Errors**
- Verify all API keys are correctly set in `.env`
- Check for extra spaces or quotes
- Ensure keys have proper permissions

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment variables** for all secrets
3. **Enable rate limiting** in production
4. **Use HTTPS** in production
5. **Regularly update dependencies**
   ```bash
   npm audit
   npm update
   ```

## Next Steps

1. Set up MongoDB for persistent data storage
2. Implement OAuth2 authentication flow
3. Configure CI/CD pipelines
4. Set up monitoring and logging
5. Create analytics dashboard
6. Add automated backups

## Support

- Backend Documentation: `/backend/README.md`
- Integration Examples: `/backend/INTEGRATION_EXAMPLES.js`
- API Documentation: See backend README for full API reference

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Notion API Reference](https://developers.notion.com/)
- [GitHub REST API](https://docs.github.com/en/rest)
