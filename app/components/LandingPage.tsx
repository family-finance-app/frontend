'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import Hero from './Hero';
import Features from './Features';
import CTA from './CTA';
import Logo_dark from './ui/Logo_dark';
import Footer from './ui/Footer';
import Logo_light from './ui/Logo_light';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scrollBlur, setScrollBlur] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / maxScroll) * 100;
      // Max blur of 20px
      const blur = Math.min((scrollPercent / 100) * 20, 20);
      setScrollBlur(blur);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 opacity-90"
        style={{
          backgroundImage: "url('/background.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: `blur(${scrollBlur}px)`,
          transition: 'filter 0.1s ease-out',
        }}
      />
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo_light />

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-primary-300 hover:bg-primary-400 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-background-300 hover:text-primary-400 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Hero isAuthenticated={isAuthenticated} />

      <Features />

      <CTA isAuthenticated={isAuthenticated} />

      <Footer />
    </div>
  );
}
