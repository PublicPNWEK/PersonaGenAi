
// Fix: Provide implementation for a localStorage utility service.
// SECURITY NOTE: localStorage stores data in clear text and is accessible to JavaScript
// in the browser. Do NOT use this for storing highly sensitive data like real OAuth tokens
// or passwords. In production, use secure, httpOnly cookies or server-side session storage
// for sensitive credentials.
export const storageService = {
  getItem: <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },
  setItem: <T>(key: string, value: T): void => {
    try {
      const jsonValue = JSON.stringify(value);
      window.localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },
};
