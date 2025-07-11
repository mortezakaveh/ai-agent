import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { email, password, fullName, role = 'client' } = await request.json();

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            role
          }
        ]);

      if (profileError) throw profileError;

      // If user is a lawyer, create lawyer profile
      if (role === 'lawyer') {
        const { error: lawyerError } = await supabase
          .from('lawyer_profiles')
          .insert([
            {
              user_id: authData.user.id,
              specialization: [],
              experience_years: 0
            }
          ]);

        if (lawyerError) throw lawyerError;
      }
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: authData.user
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}