'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useAuth } from '@/components/guards/AuthContext';

import { Hero, Features, CTA } from './index';

import { Footer, Logo_light } from '@/components';
import { RiCloseLine, RiMenuLine } from '@remixicon/react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [scrollBlur, setScrollBlur] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / maxScroll) * 100;

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
      <nav className="relative z-50 border-b border-white/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="shrink-0">
              <Logo_light />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center space-x-3">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="text-background-600 hover:text-primary-500 px-4 py-2 rounded-lg font-medium transition-colors"
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

              <button
                className="sm:hidden inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-primary-500"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                aria-controls="landing-mobile-nav"
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? (
                  <RiCloseLine className="text-background-100" />
                ) : (
                  <RiMenuLine />
                )}
              </button>
            </div>
          </div>

          <div
            id="landing-mobile-nav"
            className={`sm:hidden transition-all duration-200 ease-out ${
              isMobileNavOpen
                ? 'max-h-96 opacity-100 mt-4'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col gap-3 rounded-2xl bg-white/90 p-4 text-center shadow-xl backdrop-blur">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-white font-semibold shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="w-full rounded-xl border border-primary-600 px-4 py-3 font-semibold text-primary-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="w-full rounded-xl bg-primary-600 px-4 py-3 text-white font-semibold shadow-lg"
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
