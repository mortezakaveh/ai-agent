# Legal AI Assistant Platform

A full-stack legal assistant web application built with Next.js, Supabase, and Google Gemini AI. This platform serves as a social network where users (clients) can post legal questions and receive answers from both AI and qualified lawyers.

## 🌟 Features

### Core Features
- **User Authentication** - Email-based authentication with role-based access (Client, Lawyer, Admin)
- **AI-Powered Responses** - Instant legal assistance using Google Gemini AI
- **Question & Answer System** - Twitter-like feed for legal questions
- **Lawyer Profiles** - Comprehensive profiles with specializations, ratings, and reviews
- **Appointment Scheduling** - Book consultations with lawyers
- **Rating & Review System** - Rate and review lawyers
- **Follow System** - Follow lawyers and other users
- **Blog Generation** - Auto-generate SEO-friendly blog posts from Q&A
- **Content Moderation** - Admin panel for content approval

### User Roles
- **Clients** - Ask questions, follow lawyers, book appointments
- **Lawyers** - Answer questions, manage profiles, handle appointments
- **Admins** - Moderate content, approve blog posts, manage users

### Pages & Features
- **Home (/)** - Hero section with featured questions and lawyers
- **Feed (/feed)** - Timeline of legal questions with filtering
- **Ask Question (/ask)** - Form to post questions with AI preview
- **Lawyers (/lawyers)** - Directory of verified lawyers
- **Appointments (/appointments)** - Calendar and booking system
- **Blog (/blog)** - SEO-friendly legal articles
- **Dashboard (/dashboard)** - Role-based user dashboard
- **Authentication (/auth)** - Login and registration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Gemini AI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

You'll also need accounts for:
- [Supabase](https://supabase.com) (for database and authentication)
- [Google AI Studio](https://makersuite.google.com) (for Gemini API)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd legal-ai-assistant
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the database schema from `database.sql`

### 4. Set Up Google Gemini AI

1. Visit [Google AI Studio](https://makersuite.google.com)
2. Create an API key for Gemini
3. Note down your API key

### 5. Environment Variables

Copy the example environment file and fill in your credentials:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` with your actual values:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 6. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
legal-ai-assistant/
├── app/                          # Next.js 13+ app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── questions/            # Question CRUD operations
│   │   └── ai/                   # AI integration endpoints
│   ├── auth/                     # Authentication pages
│   ├── feed/                     # Question feed page
│   ├── ask/                      # Ask question page
│   ├── lawyers/                  # Lawyer directory
│   ├── appointments/             # Appointment system
│   ├── blog/                     # Blog pages
│   ├── dashboard/                # User dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   ├── home/                     # Home page components
│   ├── questions/                # Question-related components
│   ├── lawyers/                  # Lawyer-related components
│   ├── layout/                   # Layout components
│   └── providers/                # Context providers
├── lib/                          # Utility libraries
│   ├── types.ts                  # TypeScript type definitions
│   ├── utils.ts                  # Utility functions
│   ├── supabase.ts               # Supabase client configuration
│   └── gemini.ts                 # Google Gemini AI integration
├── database.sql                  # Database schema and setup
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.js                # Next.js configuration
\`\`\`

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User profiles and authentication data
- **lawyer_profiles** - Extended profiles for lawyers
- **questions** - Legal questions posted by users
- **answers** - Responses to questions (from AI and lawyers)
- **ratings** - Lawyer ratings and reviews
- **appointments** - Scheduled consultations
- **follows** - User follow relationships
- **blog_posts** - Generated blog content
- **question_likes** & **answer_likes** - User interactions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- Supabase handles login/logout automatically

### Questions
- `GET /api/questions` - Fetch questions with filters
- `POST /api/questions` - Create new question (with AI response)

### AI Integration
- `POST /api/ai/preview` - Generate AI response preview

## 🎨 Styling

The application uses Tailwind CSS with a custom color scheme:

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Role-based access control
- Input validation and sanitization
- CSRF protection via Next.js
- Secure authentication with Supabase

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Development

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Type Checking

\`\`\`bash
npm run type-check
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/legal-ai-assistant/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Real-time chat between lawyers and clients
- [ ] Video consultation integration
- [ ] Document upload and management
- [ ] Payment processing for consultations
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced search with Elasticsearch
- [ ] Email notifications
- [ ] SMS notifications

## 📊 Analytics & Monitoring

Consider integrating:
- Google Analytics for user tracking
- Sentry for error monitoring
- Uptime monitoring services
- Performance monitoring tools

---

**Happy coding! 🎉**

For questions or support, please reach out through the repository's issue tracker.
