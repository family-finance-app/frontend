import { roboto } from '@/assets/fonts/fonts';
import {
  RiGitRepositoryPrivateLine,
  RiLineChartLine,
  RiLoopRightLine,
  RiMenuSearchLine,
  RiParentLine,
  RiWalletLine,
} from '@remixicon/react';

export default function Features() {
  const features = [
    {
      icon: <RiLineChartLine size={32} />,
      title: 'Smart Analytics',
      description:
        'Get detailed insights into your personal and family spending patterns with clear charts and comprehensive reports.',
    },
    {
      icon: <RiParentLine size={32} />,
      title: 'Family Sharing',
      description:
        'Collaborate with family members to track shared expenses and maintain full visibility of mutual savings.',
    },
    {
      icon: <RiGitRepositoryPrivateLine size={32} />,
      title: 'Secure & Private',
      description:
        'Your financial data is protected with enterprise-grade security and encryption.',
    },
    {
      icon: <RiLoopRightLine size={32} />,
      title: 'Real-time Sync',
      description:
        'Instant synchronization across all devices ensures your data is always up to date.',
    },
    {
      icon: <RiWalletLine size={32} />,
      title: 'Multiple Accounts',
      description:
        'Manage multiple bank accounts, cash, cards, digital wallets, deposits, and other sources in one centralized dashboard.',
    },
    {
      icon: <RiMenuSearchLine size={32} />,
      title: 'Smart Categories',
      description:
        'Automatically categorize transactions and add descriptions to records for better organization.',
    },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className={`${roboto.className} text-4xl md:text-5xl font-bold text-background-900 mb-6`}
          >
            Your finances together
            <span className="block text-primary-600">
              Everything you need to manage
            </span>
          </h2>
          <p className="text-xl text-background-600 max-w-3xl mx-auto">
            With quick transaction entry, intuitive analytics, and transparent
            family savings management, everything stays organised and easy to
            control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white border border-background-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-primary-300 transform hover:-translate-y-1`}
            >
              <div className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3
                className={`${roboto.className} text-xl font-bold text-background-900 mb-4`}
              >
                {feature.title}
              </h3>
              <p className="text-background-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
