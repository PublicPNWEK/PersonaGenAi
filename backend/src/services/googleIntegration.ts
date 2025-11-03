import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class GoogleIntegrationService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate content using Gemini AI
   */
  async generateContent(prompt: string, _options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error('Error generating content with Gemini:', error);
      throw new AppError('Failed to generate content', 500);
    }
  }

  /**
   * Integration with Google Calendar API for scheduling
   */
  async scheduleEvent(eventData: {
    summary: string;
    description?: string;
    startTime: string;
    endTime: string;
    accessToken: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          summary: eventData.summary,
          description: eventData.description,
          start: {
            dateTime: eventData.startTime,
            timeZone: 'UTC'
          },
          end: {
            dateTime: eventData.endTime,
            timeZone: 'UTC'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${eventData.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error scheduling Google Calendar event:', error);
      throw new AppError('Failed to schedule event', 500);
    }
  }

  /**
   * Integration with Gmail API for sending emails
   */
  async sendEmail(emailData: {
    to: string;
    subject: string;
    body: string;
    accessToken: string;
  }): Promise<any> {
    try {
      const message = [
        `To: ${emailData.to}`,
        `Subject: ${emailData.subject}`,
        '',
        emailData.body
      ].join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await axios.post(
        'https://www.googleapis.com/gmail/v1/users/me/messages/send',
        { raw: encodedMessage },
        {
          headers: {
            Authorization: `Bearer ${emailData.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error sending email via Gmail:', error);
      throw new AppError('Failed to send email', 500);
    }
  }
}
