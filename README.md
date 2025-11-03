    <div align="center">
    src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PersonaGenAI

AI-powered social media profile generator with multi-platform automation and backend integrations.

## Features

- 🤖 **AI-Powered Profile Generation**: Create personalized social media profiles using Google's Gemini AI
- 📅 **Automated Scheduling**: Schedule posts across multiple platforms
- 🔗 **Multi-Platform Integration**: Google, Notion, GitHub, Perplexity AI
- 💰 **Monetization Ready**: Built-in Stripe integration for subscriptions
- 🌐 **Cross-Platform**: Works on Windows, macOS, Linux, and mobile devices
- 🔒 **Secure**: Rate limiting, authentication, and security best practices

## Project Structure

```
PersonaGenAI/
├── frontend/          # React + TypeScript frontend
│   ├── components/    # UI components
│   ├── services/      # Frontend services
│   └── types.ts       # TypeScript types
└── backend/           # Node.js + Express backend
    ├── src/
    │   ├── services/  # Platform integrations
    │   ├── routes/    # API endpoints
    │   └── middleware/# Authentication, validation
    └── README.md      # Backend documentation
```

## Quick Start

### Frontend Setup

AI Studio: https://ai.studio/apps/drive/1-8Gh0dorHEQEwZO88PwTDvhZJfsI4b-7

**Prerequisites:**  Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

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
