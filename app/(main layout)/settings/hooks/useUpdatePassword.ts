import { useUpdateUserPassword } from '@/api/security/mutations';

import { ChangePasswordFormData } from '@/(main layout)/settings/security/types';

export const useUpdatePassword = () => {
  const updatePasswordMutation = useUpdateUserPassword();

  const handleSubmit = async (formData: ChangePasswordFormData) => {
    try {
      await updatePasswordMutation.mutateAsync({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
    } catch (error) {
      console.error('Failed to update password', error);
      throw error;
    }
  };

  return {
    isLoading: updatePasswordMutation.isPending,
    isError: updatePasswordMutation.isError,
    error: updatePasswordMutation.error,
    handleSubmit,
  };
};
