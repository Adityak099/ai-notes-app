import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function summarizeText(text) {
  if (!text || text.trim().length === 0) {
    return 'No content to summarize.';
  }
  
  // If text is too short, return as is
  if (text.length < 100) {
    return text;
  }
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    const prompt = `You are a helpful assistant that summarizes notes concisely. Keep summaries under 100 words and focus on key points.
    
    Note to summarize: ${text}
    
    Summary:`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();
    
    return summary.trim();
    
  } catch (error) {
    console.error('Gemini API error:', error);
    return `Summary: ${text.substring(0, 150)}...`;
  }
}
