import { ClauseData, AnalysisResponse } from '@/types';

export const CHAT_SYSTEM_PROMPT = `You are a helpful legal contract assistant. Your role is to answer questions about contracts and legal terms in an accessible, informative way.

IMPORTANT GUIDELINES:

1. INFORMATION ONLY: You provide general information, NOT legal advice. Always be clear about this distinction.

2. REFERENCE THE CONTRACT: When answering questions, reference specific sections or clauses from the analyzed contract when relevant.

3. BE ACCESSIBLE: Explain legal concepts in plain language that non-lawyers can understand.

4. BE BALANCED: Present information objectively without recommending specific actions.

5. STAY FOCUSED: While you can answer general legal questions, gently redirect very off-topic questions back to the contract.

6. SAFETY REMINDERS: For questions involving:
   - Signing/not signing decisions
   - Specific dollar amounts or damages
   - Litigation or legal action
   - Regulatory compliance
   - Employment decisions
   - Personal liability

   Include a reminder that they should consult a licensed attorney for their specific situation.

7. NEVER:
   - Recommend signing or not signing a contract
   - Guarantee outcomes or make predictions
   - Provide jurisdiction-specific legal interpretations
   - Claim your analysis is complete or definitive

8. ALWAYS:
   - Acknowledge the limitations of automated analysis
   - Encourage professional legal review for important contracts
   - Be helpful and thorough within appropriate boundaries`;

export function buildChatContext(
  contractText: string,
  analysis: { overallRiskLevel: string; summary: string; clauses: ClauseData[] } | null,
  clauseContext?: string
): string {
  let context = `## Contract Being Analyzed

<contract>
${contractText}
</contract>

`;

  if (analysis) {
    context += `## Analysis Summary

Overall Risk Level: ${analysis.overallRiskLevel.toUpperCase()}

Summary: ${analysis.summary}

## Detected Clauses

`;

    for (const clause of analysis.clauses) {
      context += `### ${clause.type.charAt(0).toUpperCase() + clause.type.slice(1)} Clause
Risk Level: ${clause.riskLevel.toUpperCase()}
Original Text: "${clause.originalText}"
Explanation: ${clause.plainLanguageExplanation}
Risk Reasons:
${clause.riskReasons.map(r => `- ${r}`).join('\n')}

`;
    }
  }

  if (clauseContext) {
    context += `## Current Focus

The user is specifically asking about the ${clauseContext} clause. Prioritize information about this clause in your response, while still considering the broader contract context if relevant.
`;
  }

  return context;
}

export function buildChatMessages(
  chatHistory: { role: 'user' | 'assistant'; content: string }[],
  contractContext: string,
  newMessage: string
): { role: 'user' | 'assistant'; content: string }[] {
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];

  // Add context as first user message if this is a fresh conversation
  if (chatHistory.length === 0) {
    messages.push({
      role: 'user',
      content: `${contractContext}\n\nMy question: ${newMessage}`,
    });
  } else {
    // Include relevant history (limit to last 20 messages to avoid context overflow)
    const relevantHistory = chatHistory.slice(-20);

    // First message includes context
    if (relevantHistory.length > 0) {
      messages.push({
        role: 'user',
        content: `${contractContext}\n\nMy question: ${relevantHistory[0].content}`,
      });

      // Add rest of history
      for (let i = 1; i < relevantHistory.length; i++) {
        messages.push(relevantHistory[i]);
      }
    }

    // Add new message
    messages.push({
      role: 'user',
      content: newMessage,
    });
  }

  return messages;
}

/**
 * Check if a question involves sensitive topics that need enhanced disclaimers
 */
export function isSensitiveTopic(message: string): boolean {
  const sensitivePatterns = [
    /should i sign/i,
    /sign this/i,
    /not sign/i,
    /sue|lawsuit|litigation|court/i,
    /how much.*damages/i,
    /\$\d+/,
    /liable for/i,
    /comply|compliance|regulatory/i,
    /fire|terminate.*employee/i,
    /personal.*liability/i,
    /criminal/i,
    /penalty|penalt(y|ies)/i,
  ];

  return sensitivePatterns.some(pattern => pattern.test(message));
}

/**
 * Get topic description for sensitive disclaimer
 */
export function getSensitiveTopic(message: string): string {
  if (/sign|signing/i.test(message)) return 'contract execution decisions';
  if (/sue|lawsuit|litigation|court/i.test(message)) return 'legal action';
  if (/damages|\$\d+|liability/i.test(message)) return 'financial liability';
  if (/comply|compliance|regulatory/i.test(message)) return 'regulatory compliance';
  if (/fire|terminate.*employee|employment/i.test(message)) return 'employment decisions';
  return 'this legal matter';
}
