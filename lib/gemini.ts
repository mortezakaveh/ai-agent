import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(prompt: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease provide a helpful legal response as an AI assistant. Note that this is general information and not specific legal advice.`
      : `Legal Question: ${prompt}\n\nPlease provide a helpful legal response as an AI assistant. Note that this is general information and not specific legal advice.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function generateBlogPost(question: string, answers: string[]): Promise<{ title: string; content: string; excerpt: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Based on this legal question and answers, create a comprehensive blog post:

Question: ${question}

Answers: ${answers.join('\n\n')}

Please create:
1. An SEO-friendly title
2. A comprehensive blog post with proper structure (introduction, main content with headings, conclusion)
3. A brief excerpt (2-3 sentences)

Format the response as JSON with keys: title, content, excerpt
`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const parsed = JSON.parse(text);
    return {
      title: parsed.title,
      content: parsed.content,
      excerpt: parsed.excerpt
    };
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
}