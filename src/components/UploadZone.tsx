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
    <div className="w-full animate-fade-in">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging
            ? 'border-[#6366f1] bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02] shadow-xl shadow-indigo-200/50'
            : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50/30 shadow-md hover:shadow-lg'}
          ${isUploading ? 'pointer-events-none opacity-80' : 'cursor-pointer group'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {isUploading ? (
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <Loader2 className="relative w-16 h-16 text-[#6366f1] animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-800">
                {uploadProgress !== undefined
                  ? 'Uploading your contract...'
                  : 'Analyzing contract with AI...'}
              </div>
              <div className="text-sm text-gray-500">
                {uploadProgress !== undefined
                  ? `${uploadProgress}% complete`
                  : 'This may take a few moments'}
              </div>
            </div>
            {uploadProgress !== undefined && (
              <div className="w-full max-w-sm">
                <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/50"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className={`
                relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isDragging
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 scale-110 rotate-6'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:scale-105'}
              `}>
                {isDragging ? (
                  <FileText className="w-10 h-10 text-white animate-pulse" />
                ) : (
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#6366f1] transition-colors" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                {isDragging ? 'Drop your file here' : 'Drag & drop your contract'}
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOCX, or TXT • Max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <button
                type="button"
                onClick={handleBrowseClick}
                className="relative px-8 py-3.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Browse Files
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl shadow-md animate-slide-in">
          <p className="text-sm font-medium text-red-700">{error}</p>
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
