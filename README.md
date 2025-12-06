# PersonaGenAi

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

AI-powered social media profile generator with multi-platform automation and monetization.

AI Studio: https://ai.studio/apps/drive/1-8Gh0dorHEQEwZO88PwTDvhZJfsI4b-7

## Features

✨ **AI Profile Generation** - Generate unique social media profiles using Google Gemini AI
🚀 **Multi-Platform Support** - Instagram, Twitter/X, TikTok, LinkedIn, and more
📅 **Post Scheduling** - Schedule posts for automated publishing
🔗 **Google Services Integration** - Calendar, Drive, and Analytics
💰 **API Monetization** - Three-tier pricing model (FREE, PRO, ENTERPRISE)
🔐 **OAuth Authentication** - Secure social media account connection

## Run Locally

**Prerequisites:** Node.js 16+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your `API_KEY` (Google Gemini API key)

3. Run the app:
   ```bash
   npm run dev
   ```

### Backend Setup

For detailed backend setup instructions, see [BACKEND_SETUP.md](BACKEND_SETUP.md)

**Quick Start:**

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

## Backend Integrations

### Supported Platforms

- **Google Services**: Gemini AI, Google Calendar, Gmail
- **Notion**: Content management, databases, content calendar
- **GitHub**: Repository management, issues, webhooks
- **Perplexity AI**: Research, content ideas, trend analysis
- **Stripe**: Payments and subscriptions

### API Examples

#### Generate Content
```bash
POST /api/google/generate
{
  "prompt": "Write a motivational post",
  "temperature": 0.7
}
```

#### Schedule a Post
```bash
POST /api/scheduling/schedule
{
  "platform": "twitter",
  "content": "Hello World!",
  "scheduledTime": "2024-12-31T15:00:00Z",
  "userId": "user123"
}
```

#### Create Notion Entry
```bash
POST /api/notion/content
{
  "databaseId": "your_db_id",
  "title": "Blog Post",
  "date": "2024-01-01",
  "platform": "Twitter",
  "content": "Post content"
}
```

For complete API documentation, see [backend/README.md](backend/README.md)

## Cross-Platform Support

The backend is designed to work seamlessly across:

- ✅ Windows 10/11
- ✅ macOS (Intel & Apple Silicon)
- ✅ Linux (all major distributions)
- ✅ iOS (via API)
- ✅ Android (via API)
- ✅ Web Browsers

## Deployment

### Docker
```bash
cd backend
docker-compose up -d
```

### Cloud Platforms
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- DigitalOcean

See [backend/README.md](backend/README.md) for detailed deployment guides.

## Monetization

The backend includes built-in Stripe integration for:
- Subscription management
- One-time payments
- Usage-based billing
- Webhook handling

## Documentation

- [Backend Setup Guide](BACKEND_SETUP.md)
- [Backend API Documentation](backend/README.md)
- [Integration Examples](backend/INTEGRATION_EXAMPLES.js)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Backend Integration

PersonaGenAi includes comprehensive backend integration for multi-platform automation. See [Backend Integration Guide](docs/BACKEND_INTEGRATION.md) for detailed setup instructions.

### Quick Setup

1. **Social Media APIs**: Configure Instagram, Twitter/X, and TikTok API credentials
2. **Google Services**: Enable Calendar, Drive, and Analytics integration
3. **Monetization**: Three-tier API access model (FREE, PRO, ENTERPRISE)

### Key Services

- **API Key Management** - Track usage and enforce tier limits
- **OAuth Service** - Authenticate with social media platforms
- **Posting Service** - Post content to multiple platforms
- **Scheduling Service** - Schedule and automate posts
- **Google Services** - Integrate with Calendar, Drive, and Analytics

## Documentation

- [Backend Integration Guide](docs/BACKEND_INTEGRATION.md) - Complete setup and usage guide
- [API Reference](docs/BACKEND_INTEGRATION.md#api-reference) - Service documentation
- [Environment Variables](.env.example) - Configuration template

## Build

```bash
npm run build
```

The build output will be in the `dist` directory.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS (via inline styles)
- **State Management**: React Hooks
- **Storage**: LocalStorage (client-side)

## Contributing

Contributions are welcome! Please read the contribution guidelines before submitting PRs.

## License

This project is licensed under the MIT License.
