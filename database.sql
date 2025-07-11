-- Legal AI Assistant Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'lawyer', 'admin');
CREATE TYPE question_status AS ENUM ('open', 'answered', 'closed');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE blog_status AS ENUM ('draft', 'pending', 'published', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lawyer profiles table
CREATE TABLE public.lawyer_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    specialization TEXT[] NOT NULL,
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    license_number TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    office_address TEXT,
    phone TEXT,
    website TEXT,
    verified BOOLEAN DEFAULT false,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions table
CREATE TABLE public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    status question_status DEFAULT 'open',
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Answers table
CREATE TABLE public.answers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT false,
    is_best_answer BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ratings table
CREATE TABLE public.ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    lawyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lawyer_id)
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    lawyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status appointment_status DEFAULT 'pending',
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Follows table
CREATE TABLE public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- Blog posts table
CREATE TABLE public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status blog_status DEFAULT 'draft',
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    tags TEXT[],
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Question likes table
CREATE TABLE public.question_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, question_id)
);

-- Answer likes table
CREATE TABLE public.answer_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, answer_id)
);

-- Create indexes for better performance
CREATE INDEX idx_questions_user_id ON public.questions(user_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_user_id ON public.answers(user_id);
CREATE INDEX idx_lawyer_profiles_user_id ON public.lawyer_profiles(user_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_lawyer_id ON public.appointments(lawyer_id);
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_likes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Lawyer profiles policies
CREATE POLICY "Lawyer profiles are viewable by everyone" ON public.lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "Lawyers can create own profile" ON public.lawyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lawyers can update own profile" ON public.lawyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create questions" ON public.questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own questions" ON public.questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own questions" ON public.questions FOR DELETE USING (auth.uid() = user_id);

-- Answers policies
CREATE POLICY "Answers are viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create answers" ON public.answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own answers" ON public.answers FOR DELETE USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = client_id OR auth.uid() = lawyer_id);
CREATE POLICY "Clients can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update appointments" ON public.appointments FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can create follows" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Blog posts policies
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Authors can create blog posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own blog posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON public.question_likes FOR SELECT USING (true);
CREATE POLICY "Users can create question likes" ON public.question_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own question likes" ON public.question_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Answer likes are viewable by everyone" ON public.answer_likes FOR SELECT USING (true);
CREATE POLICY "Users can create answer likes" ON public.answer_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own answer likes" ON public.answer_likes FOR DELETE USING (auth.uid() = user_id);

-- Functions to update ratings
CREATE OR REPLACE FUNCTION update_lawyer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.lawyer_profiles 
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.ratings 
        WHERE lawyer_id = NEW.lawyer_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM public.ratings 
        WHERE lawyer_id = NEW.lawyer_id
    )
    WHERE user_id = NEW.lawyer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lawyer ratings
CREATE TRIGGER update_lawyer_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION update_lawyer_rating();

-- Function to update question likes count
CREATE OR REPLACE FUNCTION update_question_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.questions 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.questions 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.question_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for question likes
CREATE TRIGGER update_question_likes_count_trigger
    AFTER INSERT OR DELETE ON public.question_likes
    FOR EACH ROW EXECUTE FUNCTION update_question_likes_count();

-- Function to update answer likes count
CREATE OR REPLACE FUNCTION update_answer_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.answers 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.answer_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.answers 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.answer_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for answer likes
CREATE TRIGGER update_answer_likes_count_trigger
    AFTER INSERT OR DELETE ON public.answer_likes
    FOR EACH ROW EXECUTE FUNCTION update_answer_likes_count();