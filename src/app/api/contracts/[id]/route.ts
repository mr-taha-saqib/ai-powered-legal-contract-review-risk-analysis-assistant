import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/contracts/[id]
 * Get full contract details with analysis and chat history
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        analysis: {
          include: {
            clauses: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        chatMessages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      contract: {
        id: contract.id,
        originalName: contract.originalName,
        fileType: contract.fileType,
        fileSize: contract.fileSize,
        extractedText: contract.extractedText,
        createdAt: contract.createdAt.toISOString(),
        analysis: contract.analysis
          ? {
              id: contract.analysis.id,
              overallRiskLevel: contract.analysis.overallRiskLevel,
              summary: contract.analysis.summary,
              clauses: contract.analysis.clauses.map((clause: typeof contract.analysis.clauses[number]) => ({
                id: clause.id,
                type: clause.type,
                originalText: clause.originalText,
                riskLevel: clause.riskLevel,
                plainLanguageExplanation: clause.plainLanguageExplanation,
                riskReasons: JSON.parse(clause.riskReasons),
                isOverride: clause.isOverride,
                overrideJustification: clause.overrideJustification,
              })),
            }
          : null,
      },
      chatMessages: contract.chatMessages.map((msg: typeof contract.chatMessages[number]) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        clauseContext: msg.clauseContext,
        createdAt: msg.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contracts/[id]
 * Delete a contract and all associated data
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      select: { filePath: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      await fs.unlink(contract.filePath);
    } catch {
      // File might already be deleted, continue
    }

    // Delete contract (cascades to analysis, clauses, and chat messages)
    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
}
