import Link from 'next/link';
import { roboto, jetbrainsMono } from '@/assets/fonts/fonts';

interface CTAProps {
  isAuthenticated: boolean;
}

export default function CTA({ isAuthenticated }: CTAProps) {
  return (
    <section className="py-24 bg-linear-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className={`${roboto.className} text-4xl md:text-5xl font-bold text-white mb-6`}
        >
          <span className="block">Join Family Finance</span>
        </h2>
        <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
          Make everyday finance management easier and keep everything in one
          place
        </p>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="bg-white text-primary-600 hover:bg-background-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started - It's free
            </Link>
            <Link
              href="/sign-in"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              Already Have Account?
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
