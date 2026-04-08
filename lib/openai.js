import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeText(text) {
  if (!text || text.trim().length === 0) {
    return 'No content to summarize.';
  }
  
  // If text is too short, return as is
  if (text.length < 100) {
    return text;
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes notes concisely. Keep summaries under 100 words and focus on key points.'
        },
        {
          role: 'user',
          content: `Summarize this note: ${text}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback summary for development
    return `Summary: ${text.substring(0, 150)}...`;
  }
}