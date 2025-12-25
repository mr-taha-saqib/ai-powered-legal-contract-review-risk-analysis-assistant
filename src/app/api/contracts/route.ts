import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import prisma from '@/lib/prisma';
import anthropic, { AI_MODEL } from '@/lib/anthropic';
import { parseDocument, getFileTypeFromExtension, validateFileSize, detectNonEnglish, isVeryLongDocument } from '@/lib/documentParser';
import { buildAnalysisPrompt } from '@/lib/prompts/analysisPrompt';
import { AnalysisResponse, FileType } from '@/types';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);

/**
 * GET /api/contracts
 * List all contracts with analysis summaries
 */
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalName: true,
        createdAt: true,
        analysis: {
          select: {
            overallRiskLevel: true,
            clauses: {
              select: { id: true },
            },
          },
        },
      },
    });

    const formattedContracts = contracts.map((contract: typeof contracts[number]) => ({
      id: contract.id,
      originalName: contract.originalName,
      createdAt: contract.createdAt.toISOString(),
      analysis: contract.analysis
        ? {
            overallRiskLevel: contract.analysis.overallRiskLevel,
            clauseCount: contract.analysis.clauses.length,
          }
        : null,
    }));

    return NextResponse.json({ contracts: formattedContracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contracts
 * Upload and analyze a new contract
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE_MB)) {
      return NextResponse.json(
        { error: `File must be under ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = getFileTypeFromExtension(file.name);
    if (!fileType) {
      return NextResponse.json(
        { error: 'Only PDF, DOCX, and TXT files are supported' },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse document
    let extractedText: string;
    try {
      const parseResult = await parseDocument(buffer, fileType);
      extractedText = parseResult.text;
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : 'Unable to read file';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    // Check for empty content
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'File appears to be empty' },
        { status: 400 }
      );
    }

    // Warnings (non-blocking)
    const warnings: string[] = [];
    if (detectNonEnglish(extractedText)) {
      warnings.push('Best results with English documents');
    }
    if (isVeryLongDocument(extractedText)) {
      warnings.push('Large document - analysis may take longer');
    }

    // Generate unique filename and save file
    const ext = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filePath, buffer);

    // Create contract record
    const contract = await prisma.contract.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        fileType: fileType,
        fileSize: file.size,
        filePath: filePath,
        extractedText: extractedText,
      },
    });

    // Call AI for analysis
    let analysisResult: AnalysisResponse;
    try {
      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: buildAnalysisPrompt(extractedText),
          },
        ],
      });

      // Extract text from response
      const responseText = response.content
        .filter(block => block.type === 'text')
        .map(block => (block as { type: 'text'; text: string }).text)
        .join('');

      // Parse JSON response
      try {
        analysisResult = JSON.parse(responseText);
      } catch {
        // Retry once if JSON parsing fails
        const retryResponse = await anthropic.messages.create({
          model: AI_MODEL,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: buildAnalysisPrompt(extractedText) + '\n\nIMPORTANT: Respond with valid JSON only. No markdown, no explanation, just the JSON object.',
            },
          ],
        });

        const retryText = retryResponse.content
          .filter(block => block.type === 'text')
          .map(block => (block as { type: 'text'; text: string }).text)
          .join('');

        analysisResult = JSON.parse(retryText);
      }
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      // Clean up: delete the uploaded file and contract record
      await fs.unlink(filePath).catch(() => {});
      await prisma.contract.delete({ where: { id: contract.id } }).catch(() => {});

      return NextResponse.json(
        { error: 'Analysis service unavailable. Please try again.' },
        { status: 500 }
      );
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        contractId: contract.id,
        overallRiskLevel: analysisResult.overallRiskLevel,
        summary: analysisResult.summary,
        rawResponse: analysisResult as object,
        clauses: {
          create: analysisResult.clauses.map(clause => ({
            type: clause.type,
            originalText: clause.originalText,
            riskLevel: clause.riskLevel,
            plainLanguageExplanation: clause.plainLanguageExplanation,
            riskReasons: clause.riskReasons,
            isOverride: clause.isOverride || false,
            overrideJustification: clause.overrideJustification || null,
          })),
        },
      },
      include: {
        clauses: true,
      },
    });

    return NextResponse.json({
      contract: {
        id: contract.id,
        filename: contract.filename,
        originalName: contract.originalName,
        createdAt: contract.createdAt.toISOString(),
      },
      analysis: {
        overallRiskLevel: analysis.overallRiskLevel,
        summary: analysis.summary,
        clauses: analysis.clauses.map((clause: typeof analysis.clauses[number]) => ({
          id: clause.id,
          type: clause.type,
          originalText: clause.originalText,
          riskLevel: clause.riskLevel,
          plainLanguageExplanation: clause.plainLanguageExplanation,
          riskReasons: clause.riskReasons as string[],
          isOverride: clause.isOverride,
          overrideJustification: clause.overrideJustification,
        })),
      },
      warnings,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
