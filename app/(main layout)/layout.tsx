import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';
import Navigation from '../components/Navigation';

export const metadata: Metadata = {
  title: 'Dashboard - FamilyFinance',
  description: 'Manage your family finances',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header - Fixed */}
      <Navigation />

      {/* Content Area - Push below fixed navigation */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
