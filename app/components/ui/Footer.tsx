import Link from 'next/link';
import Logo_dark from './Logo_dark';
import Logo_light from './Logo_light';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-50 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="mb-4 text-2xl">
              <span className="text-background-300">Family</span>
              <span className="text-background-100">Finance</span>
            </div>
            <p className="text-primary-200 text-sm max-w-xs">
              Manage your family finances together.
            </p>
          </div>

          <div className="flex gap-16">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#about"
                    className="text-primary-200 hover:text-primary-100 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-primary-200 hover:text-primary-100 transition-colors"
                  >
                    Contact
                  </Link>
                </li>

                <li></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#privacy"
                    className="text-primary-200 hover:text-primary-100 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#terms"
                    className="text-primary-200 hover:text-primary-100 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li></li>
                <li>
                  <Link
                    href="#cookies"
                    className="text-primary-200 hover:text-primary-100 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-sm">
            © 2025 FamilyFinance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
