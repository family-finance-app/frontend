import { useUpdateUserPassword } from '@/api/security/mutations';
import { PasswordChangeFormData } from '@/types/security';

export const useUpdatePassword = () => {
  const updatePasswordMutation = useUpdateUserPassword();

  const handleSubmit = async (formData: PasswordChangeFormData) => {
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
