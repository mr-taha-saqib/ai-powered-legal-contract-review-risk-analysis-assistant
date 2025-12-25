// Risk Level Types
export type RiskLevel = 'low' | 'medium' | 'high';

// Clause Types
export type ClauseType = 'liability' | 'termination' | 'confidentiality' | 'payment';

// File Types
export type FileType = 'pdf' | 'docx' | 'txt';

// Clause interface for AI response
export interface ClauseAnalysis {
  type: ClauseType;
  originalText: string;
  riskLevel: RiskLevel;
  plainLanguageExplanation: string;
  riskReasons: string[];
  isOverride: boolean;
  overrideJustification: string | null;
}

// Full AI Analysis Response
export interface AnalysisResponse {
  clauses: ClauseAnalysis[];
  overallRiskLevel: RiskLevel;
  summary: string;
}

// Contract with analysis (from API)
export interface ContractWithAnalysis {
  id: string;
  originalName: string;
  fileType: FileType;
  fileSize: number;
  extractedText: string;
  createdAt: string;
  analysis: {
    id: string;
    overallRiskLevel: RiskLevel;
    summary: string;
    clauses: ClauseData[];
  } | null;
}

// Clause data from database
export interface ClauseData {
  id: string;
  type: ClauseType;
  originalText: string;
  riskLevel: RiskLevel;
  plainLanguageExplanation: string;
  riskReasons: string[];
  isOverride: boolean;
  overrideJustification: string | null;
}

// Chat message
export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  clauseContext?: string | null;
  createdAt: string;
}

// Contract list item (for sidebar)
export interface ContractListItem {
  id: string;
  originalName: string;
  createdAt: string;
  analysis: {
    overallRiskLevel: RiskLevel;
    clauseCount: number;
  } | null;
}

// Upload response
export interface UploadResponse {
  contract: {
    id: string;
    filename: string;
    originalName: string;
    createdAt: string;
  };
  analysis: {
    overallRiskLevel: RiskLevel;
    summary: string;
    clauses: ClauseData[];
  };
}

// Chat request
export interface ChatRequest {
  message: string;
  clauseContext?: string;
}

// Chat response
export interface ChatResponse {
  message: ChatMessageData;
}

// Error response
export interface ErrorResponse {
  error: string;
  details?: string;
}

// Contract detail response (full data with chat history)
export interface ContractDetailResponse {
  contract: ContractWithAnalysis;
  chatMessages: ChatMessageData[];
}

// Suggested questions for chat
export const SUGGESTED_QUESTIONS = [
  "What's the biggest risk in this contract?",
  "Can I negotiate the liability clause?",
  "What should I watch out for?",
  "Is this contract fair for both parties?",
] as const;

// Risk level colors for UI
export const RISK_COLORS = {
  high: {
    bg: '#dc3545',
    text: '#ffffff',
    border: '#dc3545',
    lightBg: '#f8d7da',
  },
  medium: {
    bg: '#ffc107',
    text: '#333333',
    border: '#ffc107',
    lightBg: '#fff3cd',
  },
  low: {
    bg: '#28a745',
    text: '#ffffff',
    border: '#28a745',
    lightBg: '#d4edda',
  },
} as const;

// Clause type display names
export const CLAUSE_TYPE_NAMES: Record<ClauseType, string> = {
  liability: 'Liability Clause',
  termination: 'Termination Clause',
  confidentiality: 'Confidentiality Clause',
  payment: 'Payment Terms Clause',
};

// File validation constants
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
