import mammoth from 'mammoth';
import { FileType } from '@/types';

// pdf-parse types for v1.x
interface PdfParseResult {
  numpages: number;
  numrender: number;
  info: Record<string, unknown>;
  metadata: Record<string, unknown>;
  text: string;
}

interface ParseResult {
  text: string;
  pageCount?: number;
}

/**
 * Extract text from a PDF buffer
 */
async function parsePdf(buffer: Buffer): Promise<ParseResult> {
  try {
    // Dynamic import to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const data: PdfParseResult = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains only images (scanned documents not supported)');
    }

    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('password')) {
        throw new Error('Password-protected files are not supported');
      }
      if (error.message.includes('empty') || error.message.includes('image')) {
        throw error;
      }
    }
    throw new Error('Unable to read PDF file. Please check if it\'s valid.');
  }
}

/**
 * Extract text from a DOCX buffer
 */
async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('Document appears to be empty');
    }

    return {
      text: result.value,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('empty')) {
      throw error;
    }
    throw new Error('Unable to read DOCX file. Please check if it\'s valid.');
  }
}

/**
 * Extract text from a TXT buffer
 */
async function parseTxt(buffer: Buffer): Promise<ParseResult> {
  const text = buffer.toString('utf-8');

  if (!text || text.trim().length === 0) {
    throw new Error('File appears to be empty');
  }

  return {
    text,
  };
}

/**
 * Parse a document buffer based on file type
 */
export async function parseDocument(
  buffer: Buffer,
  fileType: FileType
): Promise<ParseResult> {
  switch (fileType) {
    case 'pdf':
      return parsePdf(buffer);
    case 'docx':
      return parseDocx(buffer);
    case 'txt':
      return parseTxt(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Get file type from MIME type
 */
export function getFileTypeFromMime(mimeType: string): FileType | null {
  const mimeMap: Record<string, FileType> = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt',
  };

  return mimeMap[mimeType] || null;
}

/**
 * Get file type from extension
 */
export function getFileTypeFromExtension(filename: string): FileType | null {
  const ext = filename.toLowerCase().split('.').pop();

  const extMap: Record<string, FileType> = {
    'pdf': 'pdf',
    'docx': 'docx',
    'txt': 'txt',
  };

  return ext ? extMap[ext] || null : null;
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSizeMB: number = 10): boolean {
  return size <= maxSizeMB * 1024 * 1024;
}

/**
 * Check if contract text is likely non-English
 */
export function detectNonEnglish(text: string): boolean {
  // Simple heuristic: check for common English words
  const englishWords = ['the', 'and', 'or', 'shall', 'will', 'party', 'agreement', 'contract'];
  const lowerText = text.toLowerCase();
  const matches = englishWords.filter(word => lowerText.includes(word));

  // If less than 3 common words found, might be non-English
  return matches.length < 3;
}

/**
 * Estimate if document is very long (>100 pages equivalent)
 */
export function isVeryLongDocument(text: string): boolean {
  // Rough estimate: ~3000 characters per page
  const estimatedPages = text.length / 3000;
  return estimatedPages > 100;
}
