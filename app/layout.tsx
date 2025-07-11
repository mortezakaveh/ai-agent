import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { createServerClient } from '@/lib/supabase';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Legal AI Assistant - Get Expert Legal Help',
  description: 'Connect with lawyers and get AI-powered legal assistance for your questions.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialSession={session}>
          <ToastProvider />
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}