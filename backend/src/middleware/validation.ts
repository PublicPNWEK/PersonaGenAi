import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Middleware to validate request body
 */
export const validateRequest = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      logger.warn(`Missing required fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to sanitize inputs
 * 
 * SECURITY NOTE: This provides basic input sanitization for demonstration purposes.
 * For production environments, it is STRONGLY RECOMMENDED to use a dedicated
 * sanitization library such as:
 * - DOMPurify (for HTML sanitization)
 * - xss (for XSS prevention)
 * - validator.js (for input validation)
 * 
 * Additionally, implement Content Security Policy (CSP) headers and use
 * parameterized queries for database operations.
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic sanitization - encode special characters
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic encoding of potentially dangerous characters
      // This is NOT comprehensive - use a proper library in production
      return obj
        .trim()
        .slice(0, 10000); // Limit string length to prevent DoS
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};
