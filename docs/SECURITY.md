# Security Considerations

## Overview

This document outlines important security considerations for PersonaGenAi's backend integration, particularly for production deployments.

## Current Implementation Status

⚠️ **IMPORTANT**: The current implementation includes simulation code for demonstration purposes. This is NOT suitable for production use without significant security enhancements.

### What's Simulated (Demo Only)

1. **OAuth Token Exchange**: Client-side simulation instead of secure server-side exchange
2. **API Key Generation**: Client-side generation instead of server-side secure generation
3. **Credential Storage**: Browser localStorage instead of secure server-side storage
4. **Token Management**: Simulated tokens instead of real platform tokens

## Security Issues in Current Implementation

### 1. Clear Text Storage

**Issue**: Sensitive data (API keys, OAuth tokens) are stored in browser localStorage in clear text.

**Risk**:
- Accessible to any JavaScript running on the page
- Vulnerable to XSS attacks
- Not encrypted at rest
- Persists across sessions

**Production Solution**:
```typescript
// Instead of localStorage, use:
// 1. Server-side session storage with httpOnly cookies
// 2. Encrypted storage with platform-specific secure storage APIs
// 3. Short-lived tokens with automatic refresh

// Example: Use httpOnly cookies for sensitive tokens
app.post('/api/oauth/callback', async (req, res) => {
  const { code } = req.body;
  const tokens = await exchangeCodeForTokens(code);
  
  // Store tokens server-side
  await storeTokensSecurely(req.session.userId, tokens);
  
  // Send only session ID to client in httpOnly cookie
  res.cookie('session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
  
  res.json({ success: true });
});
```

### 2. OAuth Security

**Issue**: OAuth code exchange happens client-side with simulated tokens.

**Risk**:
- Client secret exposed to browser
- No PKCE (Proof Key for Code Exchange) implementation
- Tokens can be intercepted
- No server-side validation

**Production Solution**:
```typescript
// Client-side: Only handle the authorization redirect
export const initiateOAuth = async (platform: string) => {
  const state = generateSecureState();
  const codeVerifier = generateCodeVerifier(); // For PKCE
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store PKCE verifier securely
  sessionStorage.setItem('pkce_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);
  
  const authUrl = buildAuthUrl(platform, state, codeChallenge);
  window.location.href = authUrl;
};

// Server-side: Handle the callback
app.get('/api/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Validate state to prevent CSRF
  if (state !== req.session.oauthState) {
    return res.status(403).json({ error: 'Invalid state' });
  }
  
  // Exchange code for tokens (server-side only)
  const tokens = await platform.exchangeCode({
    code,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET, // Never sent to client
    codeVerifier: req.session.pkceVerifier,
  });
  
  // Store tokens securely server-side
  await db.storeTokens(req.user.id, tokens);
  
  res.redirect('/dashboard?auth=success');
});
```

### 3. API Key Management

**Issue**: API keys are generated client-side and stored in browser.

**Risk**:
- Predictable key generation
- No server-side validation
- Usage limits can be bypassed
- Keys can be shared or stolen

**Production Solution**:
```typescript
// Server-side API key generation
import crypto from 'crypto';

const generateSecureApiKey = async (userId: string, tier: string) => {
  // Use cryptographically secure random generation
  const key = crypto.randomBytes(32).toString('base64url');
  const hashedKey = await bcrypt.hash(key, 10);
  
  // Store hashed key in database
  await db.apiKeys.create({
    userId,
    keyHash: hashedKey,
    tier,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  });
  
  // Return plain key only once
  return { key: `pk_${tier.toLowerCase()}_${key}` };
};

// Validate API key on each request
const validateApiKey = async (key: string) => {
  const keyHash = await bcrypt.hash(key, 10);
  const apiKey = await db.apiKeys.findByHash(keyHash);
  
  if (!apiKey || apiKey.expiresAt < new Date()) {
    throw new Error('Invalid or expired API key');
  }
  
  // Check usage limits
  const usage = await db.usage.getForKey(apiKey.id);
  if (usage.requestsToday >= apiKey.tier.dailyLimit) {
    throw new Error('Daily limit exceeded');
  }
  
  return apiKey;
};
```

### 4. Rate Limiting

**Issue**: Client-side rate limiting can be bypassed.

**Risk**:
- Users can clear localStorage to reset limits
- No centralized enforcement
- Unfair usage across users

**Production Solution**:
```typescript
// Server-side rate limiting with Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient(),
    prefix: 'rl:',
  }),
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: async (req) => {
    // Get user's tier from database
    const user = await db.users.findById(req.user.id);
    return user.tier === 'PRO' ? 2000 : 100;
  },
  message: 'Rate limit exceeded',
});

app.use('/api/', limiter);
```

## Production Deployment Checklist

### Environment Variables

- [ ] Store all secrets in environment variables
- [ ] Use a secrets management service (AWS Secrets Manager, HashiCorp Vault)
- [ ] Never commit `.env` files to version control
- [ ] Rotate secrets regularly
- [ ] Use different secrets for each environment (dev, staging, production)

### Authentication & Authorization

- [ ] Implement proper OAuth 2.0 flows with PKCE
- [ ] Use server-side session management
- [ ] Implement JWT tokens with short expiration
- [ ] Add refresh token rotation
- [ ] Implement multi-factor authentication for sensitive operations
- [ ] Use httpOnly, secure, sameSite cookies

### Data Protection

- [ ] Encrypt sensitive data at rest
- [ ] Use TLS/SSL for all communications
- [ ] Implement proper key management
- [ ] Hash passwords with bcrypt or Argon2
- [ ] Sanitize all user inputs
- [ ] Implement Content Security Policy (CSP)

### API Security

- [ ] Implement server-side rate limiting
- [ ] Add API request signing
- [ ] Validate all inputs server-side
- [ ] Use API gateways for additional security layers
- [ ] Implement proper CORS policies
- [ ] Add request logging and monitoring

### Infrastructure

- [ ] Use Web Application Firewall (WAF)
- [ ] Implement DDoS protection
- [ ] Regular security audits and penetration testing
- [ ] Set up intrusion detection systems
- [ ] Implement proper backup and disaster recovery
- [ ] Use container security scanning

### Monitoring & Logging

- [ ] Log all authentication attempts
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for security events
- [ ] Implement audit trails
- [ ] Regular security log reviews
- [ ] GDPR/privacy compliance for logs

## Code Security Best Practices

### Input Validation

```typescript
// Always validate and sanitize inputs
import { z } from 'zod';

const PostSchema = z.object({
  platform: z.enum(['instagram', 'twitter', 'tiktok']),
  text: z.string().max(500),
  mediaUrls: z.array(z.string().url()).max(10).optional(),
});

app.post('/api/post', async (req, res) => {
  try {
    const validated = PostSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### SQL Injection Prevention

```typescript
// Use parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Or use an ORM
const user = await User.findByPk(userId);
```

### XSS Prevention

```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);

// Use React's built-in XSS protection
return <div>{userContent}</div>; // Automatically escaped
```

### CSRF Protection

```typescript
// Use CSRF tokens
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

## Incident Response Plan

1. **Detection**: Monitor logs and alerts for security incidents
2. **Containment**: Isolate affected systems immediately
3. **Investigation**: Analyze the incident to understand the scope
4. **Remediation**: Fix vulnerabilities and restore services
5. **Communication**: Notify affected users if data was compromised
6. **Post-Mortem**: Document lessons learned and improve processes

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 Best Practices](https://oauth.net/2/oauth-best-practice/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [React Security Best Practices](https://snyk.io/learn/react-security/)

## Reporting Security Issues

If you discover a security vulnerability, please email security@personagenai.com. Do not open a public issue.

## Regular Security Tasks

- **Weekly**: Review access logs and security alerts
- **Monthly**: Update dependencies and patch vulnerabilities
- **Quarterly**: Security audit and penetration testing
- **Annually**: Comprehensive security review and policy update

## Compliance Considerations

- **GDPR**: User data protection and right to deletion
- **CCPA**: California Consumer Privacy Act compliance
- **SOC 2**: Security, availability, and confidentiality controls
- **PCI DSS**: If handling payment information

## Conclusion

The current implementation is suitable for development and demonstration purposes only. Before deploying to production:

1. Implement all server-side security measures
2. Complete the production deployment checklist
3. Conduct security audits
4. Set up monitoring and logging
5. Train team on security best practices

Remember: **Security is not a feature, it's a process.**
