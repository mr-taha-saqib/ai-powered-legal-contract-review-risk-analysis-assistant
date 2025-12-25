'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS } from '@/types';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress?: number;
}

export default function UploadZone({ onUpload, isUploading, uploadProgress }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File must be under ${MAX_FILE_SIZE_MB}MB`;
    }

    // Check file extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Only PDF, DOCX, and TXT files are supported';
    }

    return null;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }, [onUpload, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFile]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'}
          ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {uploadProgress !== undefined
                  ? 'Uploading...'
                  : 'Analyzing contract...'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {uploadProgress !== undefined
                  ? `${uploadProgress}% complete`
                  : 'This may take a moment'}
              </div>
            </div>
            {uploadProgress !== undefined && (
              <div className="w-full max-w-xs">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`
              w-16 h-16 rounded-lg flex items-center justify-center transition-colors
              ${isDragging ? 'bg-blue-100 dark:bg-blue-950' : 'bg-gray-100 dark:bg-gray-700'}
            `}>
              {isDragging ? (
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {isDragging ? 'Drop file here' : 'Drop your contract here'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOCX, or TXT • Max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
