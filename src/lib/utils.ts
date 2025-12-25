import { RiskLevel } from '@/types';

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get the highest risk level from an array of risk levels
 */
export function getHighestRisk(riskLevels: RiskLevel[]): RiskLevel {
  if (riskLevels.includes('high')) return 'high';
  if (riskLevels.includes('medium')) return 'medium';
  return 'low';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID (for client-side use)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Check if we're running on the server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Local storage helpers with fallback
 */
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (isServer()) return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (isServer()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or disabled
    }
  },

  remove: (key: string): void => {
    if (isServer()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage disabled
    }
  },
};

/**
 * Disclaimer text constants
 */
export const DISCLAIMER_TEXT = {
  standard: 'This analysis is for informational purposes only and does not constitute legal advice. Consult a licensed attorney for legal guidance.',
  enhanced: (topic: string) =>
    `I can provide general information, but this should not be considered legal advice. For decisions about ${topic}, please consult with a licensed attorney who can review your specific situation.`,
  modal: {
    title: 'Important Notice',
    content: 'This tool provides informational analysis of legal contracts. It is not a substitute for professional legal counsel. The analysis and explanations provided are meant to help you understand contract terms, but should not be relied upon for making legal decisions.',
    checkbox: 'I understand this is not legal advice',
    button: 'Continue',
  },
};

/**
 * Storage key for disclaimer acknowledgment
 */
export const DISCLAIMER_ACKNOWLEDGED_KEY = 'contract_analyzer_disclaimer_acknowledged';
