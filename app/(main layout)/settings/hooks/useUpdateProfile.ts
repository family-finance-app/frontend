import { useUpdateProfile } from '@/api/profile/mutations';

import { ChangeProfileFormData } from '@/(main layout)/settings/profile/types';

export const useUpdateProfileForm = () => {
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = async (formData: ChangeProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        birthdate: formData.birthdate,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return {
    isLoading: updateProfileMutation.isPending,
    isError: updateProfileMutation.isError,
    error: updateProfileMutation.error,
    handleSubmit,
  };
};
