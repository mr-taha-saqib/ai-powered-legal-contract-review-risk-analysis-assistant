import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI features will not work.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const AI_MODEL = 'gpt-4o'; // Using GPT-4o for best results

export default openai;
