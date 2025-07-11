import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || question.length < 10) {
      return NextResponse.json(
        { error: 'Question must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(question);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error generating AI preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}