import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateAIResponse } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 10;

    let query = supabase
      .from('questions')
      .select(`
        *,
        user:users(*),
        answers(count),
        question_likes(count)
      `);

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        query = query.order('likes_count', { ascending: false });
        break;
      case 'mostAnswered':
        query = query.order('answers.count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data: questions, count, error } = await query
      .range(from, to)
      .limit(pageSize);

    if (error) throw error;

    return NextResponse.json({
      questions: questions || [],
      totalPages: count ? Math.ceil(count / pageSize) : 0,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, category, tags } = await request.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Create the question
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .insert([
        {
          user_id: session.user.id,
          title,
          content,
          category,
          tags: tags || []
        }
      ])
      .select()
      .single();

    if (questionError) throw questionError;

    // Generate AI response
    try {
      const aiResponse = await generateAIResponse(content);
      
      // Save AI answer
      await supabase
        .from('answers')
        .insert([
          {
            question_id: question.id,
            content: aiResponse,
            is_ai_generated: true
          }
        ]);
    } catch (aiError) {
      console.error('Error generating AI response:', aiError);
      // Continue without AI response - it's not critical
    }

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}