/**
 * Wrapper for pdf-parse to suppress initialization errors
 */

// Suppress console.error during pdf-parse initialization
const originalError = console.error;
let pdfParse: any;

try {
  // Temporarily suppress errors
  console.error = () => {};

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pdfParse = require('pdf-parse');
} catch (error) {
  // If require fails completely, try again with error reporting
  console.error = originalError;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pdfParse = require('pdf-parse');
} finally {
  // Restore console.error
  console.error = originalError;
}

export default pdfParse;
