import mammoth from 'mammoth';
import { FileType } from '@/types';
import pdfParse from './pdfParser';

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
    console.log(`Parsing PDF (${buffer.length} bytes)...`);
    const data: PdfParseResult = await pdfParse(buffer);
    console.log(`PDF parsed: ${data.numpages} pages, ${data.text.length} characters`);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains only images. Scanned documents require OCR (not currently supported).');
    }

    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('PDF parsing error:', error.message);

      if (error.message.includes('password') || error.message.includes('encrypted')) {
        throw new Error('This PDF is password-protected. Please remove the password and try again.');
      }
      if (error.message.includes('empty') || error.message.includes('image') || error.message.includes('OCR')) {
        throw error;
      }
      if (error.message.includes('Invalid PDF') || error.message.includes('corrupted')) {
        throw new Error('This PDF appears to be corrupted or invalid. Please try re-exporting it.');
      }
      // Canvas/native dependency errors
      if (error.message.includes('canvas') || error.message.includes('node-gyp')) {
        throw new Error('PDF parsing dependency error. Please ensure all dependencies are installed correctly.');
      }
    }

    console.error('Unknown PDF error:', error);
    throw new Error('Unable to read PDF file. Please ensure it\'s a valid, text-based PDF document.');
  }
}

/**
 * Extract text from a DOCX buffer
 */
async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log(`Parsing DOCX (${buffer.length} bytes)...`);
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('Document appears to be empty');
    }

    console.log(`DOCX parsed: ${result.value.length} characters`);

    return {
      text: result.value,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('DOCX parsing error:', error.message);

      if (error.message.includes('empty')) {
        throw error;
      }
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        throw new Error('This DOCX file is password-protected. Please remove the password and try again.');
      }
      if (error.message.includes('not a valid') || error.message.includes('corrupted')) {
        throw new Error('This DOCX file appears to be corrupted or invalid. Please try re-saving it.');
      }
    }

    console.error('Unknown DOCX error:', error);
    throw new Error('Unable to read DOCX file. Please ensure it\'s a valid Word document (.docx format).');
  }
}

/**
 * Extract text from a TXT buffer
 */
async function parseTxt(buffer: Buffer): Promise<ParseResult> {
  try {
    console.log(`Parsing TXT (${buffer.length} bytes)...`);

    // Try UTF-8 first
    let text = buffer.toString('utf-8');

    // Check for invalid UTF-8 characters and try other encodings
    if (text.includes('�')) {
      console.log('Invalid UTF-8 detected, trying latin1...');
      text = buffer.toString('latin1');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('File appears to be empty');
    }

    console.log(`TXT parsed: ${text.length} characters`);

    return {
      text,
    };
  } catch (error) {
    console.error('TXT parsing error:', error);
    throw new Error('Unable to read text file. Please ensure it\'s a valid plain text file.');
  }
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
