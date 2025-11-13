'use client';

import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { useCurrentUser } from '@/api/auth/queries';
import { useUpdateProfileForm } from '@/hooks/useUpdateProfile';
import {
  ProfileEditForm,
  LinkedResources,
  type ProfileFormData,
} from '@/components/settings/profile';

export default function ProfileSettings() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { handleSubmit, isLoading: isSaving } = useUpdateProfileForm();

  // TODO: Replace with actual family groups query
  const familyGroups = [{ id: 1, name: 'My Family', membersCount: 3 }];

  const handleProfileSubmit = async (data: ProfileFormData) => {
    await handleSubmit(data);
  };

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-background-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-background-900 mb-2`}
          >
            Profile Settings
          </h1>
          <p className="text-background-600">
            Manage your personal information
          </p>
        </div>

        <div className="mt-4 lg:mt-0">
          <Button
            text="← Back to Settings"
            type="button"
            variant="outline"
            size="md"
            onClick={() => (window.location.href = '/settings')}
          />
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-2xl">
        <ProfileEditForm
          user={user}
          onSubmit={handleProfileSubmit}
          isLoading={isSaving}
        />
      </div>

      {/* Family Groups */}
      {familyGroups && familyGroups.length > 0 && (
        <LinkedResources familyGroups={familyGroups} accounts={[]} />
      )}
    </div>
  );
}
