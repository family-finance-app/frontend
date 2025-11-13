import { useUpdateProfile } from '@/api/profile/mutations';
import { ProfileFormData } from '@/components/settings/profile';

export const useUpdateProfileForm = () => {
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = async (formData: ProfileFormData) => {
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
