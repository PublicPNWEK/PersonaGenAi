import axios from 'axios';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class PerplexityIntegrationService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
    }
    this.apiKey = apiKey;
  }

  /**
   * Query Perplexity AI for research and content generation
   */
  async query(prompt: string, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: options?.model || 'pplx-7b-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('Error querying Perplexity AI:', error);
      throw new AppError('Failed to query Perplexity AI', 500);
    }
  }

  /**
   * Research content for social media posts
   */
  async researchTopic(topic: string): Promise<{
    summary: string;
    sources: string[];
  }> {
    try {
      const prompt = `Research the following topic and provide a comprehensive summary with key points: ${topic}`;
      const result = await this.query(prompt);
      
      return {
        summary: result,
        sources: [] // Perplexity includes sources in its responses
      };
    } catch (error) {
      logger.error('Error researching topic:', error);
      throw new AppError('Failed to research topic', 500);
    }
  }

  /**
   * Generate content ideas based on trends
   */
  async generateContentIdeas(industry: string, count: number = 5): Promise<string[]> {
    try {
      const prompt = `Generate ${count} trending content ideas for ${industry} industry that would work well for social media posts.`;
      const result = await this.query(prompt);
      
      // Parse the result into an array of ideas
      const ideas = result.split('\n').filter(line => line.trim().length > 0);
      return ideas.slice(0, count);
    } catch (error) {
      logger.error('Error generating content ideas:', error);
      throw new AppError('Failed to generate content ideas', 500);
    }
  }
}
