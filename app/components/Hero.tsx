import { useState, useEffect } from 'react';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';
import Link from 'next/link';
import AnimatedProductPreview from './AnimatedProductPreview';

interface HeroProps {
  isAuthenticated: boolean;
}

export default function Hero({ isAuthenticated }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h1
              className={`${roboto.className} text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background-300 mb-6 leading-tight`}
            >
              Your Personal and Family
              <span className="block text-primary-400">Financial Hub</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-background-300 mb-10 max-w-3xl mx-auto">
              Manage cash, cards, bank accounts, and savings in one place. Add
              transactions effortlessly, explore clear analytics, and
              collaborate through shared accounts and family groups
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto border-2 border-primary-600 text-background-300 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <AnimatedProductPreview />
        </div>
      </div>
    </section>
  );
}
