import { Router, Request, Response, NextFunction } from 'express';
import { GoogleIntegrationService } from '../services/googleIntegration.js';
import { logger } from '../utils/logger.js';

const router = Router();
const googleService = new GoogleIntegrationService();

/**
 * POST /api/google/generate
 * Generate content using Gemini AI
 */
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const content = await googleService.generateContent(prompt, {
      temperature,
      maxTokens
    });

    res.json({ content });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/google/calendar/schedule
 * Schedule an event in Google Calendar
 */
router.post('/calendar/schedule', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { summary, description, startTime, endTime, accessToken } = req.body;

    if (!summary || !startTime || !endTime || !accessToken) {
      return res.status(400).json({ 
        error: 'Summary, startTime, endTime, and accessToken are required' 
      });
    }

    const event = await googleService.scheduleEvent({
      summary,
      description,
      startTime,
      endTime,
      accessToken
    });

    res.json({ event });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/google/gmail/send
 * Send an email via Gmail
 */
router.post('/gmail/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, subject, body, accessToken } = req.body;

    if (!to || !subject || !body || !accessToken) {
      return res.status(400).json({ 
        error: 'to, subject, body, and accessToken are required' 
      });
    }

    const result = await googleService.sendEmail({
      to,
      subject,
      body,
      accessToken
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
});

export default router;
