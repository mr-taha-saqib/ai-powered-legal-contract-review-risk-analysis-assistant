import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import anthropic, { AI_MODEL } from '@/lib/anthropic';
import { CHAT_SYSTEM_PROMPT, buildChatContext, isSensitiveTopic, getSensitiveTopic } from '@/lib/prompts/chatPrompt';
import { DISCLAIMER_TEXT } from '@/lib/utils';
import { ClauseData } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const MAX_MESSAGE_LENGTH = 1000;

/**
 * POST /api/contracts/[id]/chat
 * Send a message to the Q&A chat
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message, clauseContext } = body;

    // Validate message
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Fetch contract with analysis and chat history
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        analysis: {
          include: {
            clauses: true,
          },
        },
        chatMessages: {
          orderBy: { createdAt: 'asc' },
          take: 50, // Limit chat history
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Build context for AI
    const analysisData = contract.analysis
      ? {
          overallRiskLevel: contract.analysis.overallRiskLevel,
          summary: contract.analysis.summary,
          clauses: contract.analysis.clauses.map((clause: typeof contract.analysis.clauses[number]) => ({
            id: clause.id,
            type: clause.type as ClauseData['type'],
            originalText: clause.originalText,
            riskLevel: clause.riskLevel as ClauseData['riskLevel'],
            plainLanguageExplanation: clause.plainLanguageExplanation,
            riskReasons: clause.riskReasons as string[],
            isOverride: clause.isOverride,
            overrideJustification: clause.overrideJustification,
          })),
        }
      : null;

    const chatContext = buildChatContext(
      contract.extractedText,
      analysisData,
      clauseContext
    );

    // Build messages for AI
    const previousMessages = contract.chatMessages.map((msg: typeof contract.chatMessages[number]) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Prepare conversation for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (previousMessages.length === 0) {
      // First message - include full context
      messages.push({
        role: 'user',
        content: `${chatContext}\n\n---\n\nUser Question: ${trimmedMessage}`,
      });
    } else {
      // Continuing conversation - context in first message, then history
      messages.push({
        role: 'user',
        content: `${chatContext}\n\n---\n\nUser Question: ${previousMessages[0].content}`,
      });

      // Add remaining history
      for (let i = 1; i < previousMessages.length; i++) {
        messages.push(previousMessages[i]);
      }

      // Add new message
      messages.push({
        role: 'user',
        content: trimmedMessage,
      });
    }

    // Check for sensitive topic
    const needsEnhancedDisclaimer = isSensitiveTopic(trimmedMessage);

    // Call Claude API
    let aiResponse: string;
    try {
      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 1024,
        system: CHAT_SYSTEM_PROMPT,
        messages: messages,
      });

      aiResponse = response.content
        .filter(block => block.type === 'text')
        .map(block => (block as { type: 'text'; text: string }).text)
        .join('');

      // Add enhanced disclaimer if needed
      if (needsEnhancedDisclaimer) {
        const topic = getSensitiveTopic(trimmedMessage);
        aiResponse += `\n\n---\n\n*${DISCLAIMER_TEXT.enhanced(topic)}*`;
      }
    } catch (aiError) {
      console.error('AI chat error:', aiError);
      return NextResponse.json(
        { error: 'Chat service unavailable. Please try again.' },
        { status: 500 }
      );
    }

    // Save both messages to database
    const userMessage = await prisma.chatMessage.create({
      data: {
        contractId: id,
        role: 'user',
        content: trimmedMessage,
        clauseContext: clauseContext || null,
      },
    });

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        contractId: id,
        role: 'assistant',
        content: aiResponse,
        clauseContext: clauseContext || null,
      },
    });

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        clauseContext: userMessage.clauseContext,
        createdAt: userMessage.createdAt.toISOString(),
      },
      message: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        clauseContext: assistantMessage.clauseContext,
        createdAt: assistantMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
