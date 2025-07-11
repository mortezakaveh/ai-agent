export type UserRole = 'client' | 'lawyer' | 'admin';
export type QuestionStatus = 'open' | 'answered' | 'closed';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LawyerProfile {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  education?: string;
  license_number?: string;
  bio?: string;
  hourly_rate?: number;
  office_address?: string;
  phone?: string;
  website?: string;
  verified: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Question {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  status: QuestionStatus;
  views_count: number;
  likes_count: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  answers?: Answer[];
  is_liked?: boolean;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id?: string;
  content: string;
  is_ai_generated: boolean;
  is_best_answer: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
  is_liked?: boolean;
}

export interface Rating {
  id: string;
  user_id: string;
  lawyer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface Appointment {
  id: string;
  client_id: string;
  lawyer_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes: number;
  status: AppointmentStatus;
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: User;
  lawyer?: User;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: User;
  following?: User;
}

export interface BlogPost {
  id: string;
  question_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  status: BlogStatus;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  question?: Question;
}

export interface QuestionLike {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface AnswerLike {
  id: string;
  user_id: string;
  answer_id: string;
  created_at: string;
}