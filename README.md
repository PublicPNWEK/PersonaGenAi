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

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your `API_KEY` (Google Gemini API key)

3. Run the app:
   ```bash
   npm run dev
   ```

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
