import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class GitHubIntegrationService {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN is not configured');
    }
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Create an issue in a repository
   */
  async createIssue(owner: string, repo: string, data: {
    title: string;
    body: string;
    labels?: string[];
  }): Promise<any> {
    try {
      const response = await this.octokit.issues.create({
        owner,
        repo,
        title: data.title,
        body: data.body,
        labels: data.labels
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating GitHub issue:', error);
      throw new AppError('Failed to create GitHub issue', 500);
    }
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<any> {
    try {
      const response = await this.octokit.repos.get({ owner, repo });
      return response.data;
    } catch (error) {
      logger.error('Error fetching GitHub repository:', error);
      throw new AppError('Failed to fetch repository', 500);
    }
  }

  /**
   * Create or update a file in repository
   */
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<any> {
    try {
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating/updating GitHub file:', error);
      throw new AppError('Failed to create/update file', 500);
    }
  }

  /**
   * List repositories for authenticated user
   */
  async listRepositories(): Promise<any> {
    try {
      const response = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      });
      return response.data;
    } catch (error) {
      logger.error('Error listing GitHub repositories:', error);
      throw new AppError('Failed to list repositories', 500);
    }
  }

  /**
   * Create a webhook for repository events
   */
  async createWebhook(owner: string, repo: string, webhookUrl: string, events: string[]): Promise<any> {
    try {
      const response = await this.octokit.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: 'json'
        },
        events
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating GitHub webhook:', error);
      throw new AppError('Failed to create webhook', 500);
    }
  }
}
