import { Client } from '@notionhq/client';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class NotionIntegrationService {
  private notion: Client;

  constructor() {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error('NOTION_API_KEY is not configured');
    }
    this.notion = new Client({ auth: apiKey });
  }

  /**
   * Create a new page in Notion database
   */
  async createPage(databaseId: string, properties: any): Promise<any> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: databaseId },
        properties
      });
      return response;
    } catch (error) {
      logger.error('Error creating Notion page:', error);
      throw new AppError('Failed to create Notion page', 500);
    }
  }

  /**
   * Query database
   */
  async queryDatabase(databaseId: string, filter?: any): Promise<any> {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
        filter
      });
      return response.results;
    } catch (error) {
      logger.error('Error querying Notion database:', error);
      throw new AppError('Failed to query Notion database', 500);
    }
  }

  /**
   * Update a page
   */
  async updatePage(pageId: string, properties: any): Promise<any> {
    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties
      });
      return response;
    } catch (error) {
      logger.error('Error updating Notion page:', error);
      throw new AppError('Failed to update Notion page', 500);
    }
  }

  /**
   * Create content calendar entry
   */
  async createContentEntry(databaseId: string, data: {
    title: string;
    date: string;
    platform: string;
    content: string;
    status?: string;
  }): Promise<any> {
    const properties = {
      Title: {
        title: [{ text: { content: data.title } }]
      },
      Date: {
        date: { start: data.date }
      },
      Platform: {
        select: { name: data.platform }
      },
      Content: {
        rich_text: [{ text: { content: data.content } }]
      },
      Status: {
        select: { name: data.status || 'Scheduled' }
      }
    };

    return this.createPage(databaseId, properties);
  }
}
