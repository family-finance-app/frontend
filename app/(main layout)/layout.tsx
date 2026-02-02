import type { Metadata } from 'next';
import Sidebar from '../components/layout/Sidebar';
import Navigation from '../components/layout/Navigation';
import AuthGuard from '@/components/guards/AuthGuard';
import { MainDataProvider } from './data/MainDataProvider';
import { OnboardingProvider, TutorialOverlay } from '@/onboarding';

export const metadata: Metadata = {
  title: 'Dashboard - FamilyFinance',
  description: 'Professional family financial management',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MainDataProvider>
        <OnboardingProvider>
          <div className="min-h-screen bg-linear-to-br from-background-50 via-background-100 to-background-200 dark:from-background-300 dark:via-background-400 dark:to-background-500 overflow-x-hidden">
            <Navigation />

            <div className="flex pt-16">
              <Sidebar />

              <main className="flex-1 lg:ml-72 min-h-[calc(100vh-64px)] overflow-x-hidden">
                <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-10">
                  <div className="animate-fade-in">{children}</div>
                </div>
              </main>
            </div>
          </div>
          <TutorialOverlay />
        </OnboardingProvider>
      </MainDataProvider>
    </AuthGuard>
  );
}
