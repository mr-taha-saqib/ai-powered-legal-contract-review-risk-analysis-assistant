'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ContractListItem,
  ContractWithAnalysis,
  ChatMessageData,
  UploadResponse,
  ClauseData,
  RiskLevel,
} from '@/types';

interface UseContractsReturn {
  // State
  contracts: ContractListItem[];
  selectedContract: ContractWithAnalysis | null;
  chatMessages: ChatMessageData[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number | undefined;
  error: string | null;

  // Actions
  fetchContracts: () => Promise<void>;
  selectContract: (id: string) => Promise<void>;
  uploadContract: (file: File) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelection: () => void;
}

export function useContracts(): UseContractsReturn {
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractWithAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Fetch all contracts
  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contracts');
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      const data = await response.json();
      setContracts(data.contracts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select a contract and load its details
  const selectContract = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/contracts/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contract not found');
        }
        throw new Error('Failed to load contract');
      }

      const data = await response.json();
      setSelectedContract(data.contract);
      setChatMessages(data.chatMessages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contract');
      setSelectedContract(null);
      setChatMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload a new contract
  const uploadContract = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === undefined) return 10;
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/contracts', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: UploadResponse & { warnings?: string[] } = await response.json();

      // Add new contract to list
      const newContract: ContractListItem = {
        id: data.contract.id,
        originalName: data.contract.originalName,
        createdAt: data.contract.createdAt,
        analysis: {
          overallRiskLevel: data.analysis.overallRiskLevel,
          clauseCount: data.analysis.clauses.length,
        },
      };

      setContracts(prev => [newContract, ...prev]);

      // Set as selected contract
      setSelectedContract({
        id: data.contract.id,
        originalName: data.contract.originalName,
        fileType: 'pdf', // Will be overwritten when we fetch details
        fileSize: 0,
        extractedText: '',
        createdAt: data.contract.createdAt,
        analysis: {
          id: '',
          overallRiskLevel: data.analysis.overallRiskLevel,
          summary: data.analysis.summary,
          clauses: data.analysis.clauses,
        },
      });
      setChatMessages([]);

      // Fetch full contract details
      await selectContract(data.contract.id);

      // Show warnings if any
      if (data.warnings && data.warnings.length > 0) {
        console.log('Warnings:', data.warnings);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(undefined);
    }
  }, [selectContract]);

  // Delete a contract
  const deleteContract = useCallback(async (id: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract');
      }

      // Remove from list
      setContracts(prev => prev.filter(c => c.id !== id));

      // Clear selection if it was the selected contract
      if (selectedContract?.id === id) {
        setSelectedContract(null);
        setChatMessages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contract');
      throw err;
    }
  }, [selectedContract]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedContract(null);
    setChatMessages([]);
  }, []);

  // Load contracts on mount
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    selectedContract,
    chatMessages,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    fetchContracts,
    selectContract,
    uploadContract,
    deleteContract,
    clearError,
    clearSelection,
  };
}

export default useContracts;
