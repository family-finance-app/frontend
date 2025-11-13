import { useUpdateUserEmail } from '@/api/security/mutations';
import { EmailChangeFormData } from '@/types/security';

export const useUpdateEmail = () => {
  const updateEmailMutation = useUpdateUserEmail();

  const handleSubmitEmail = async (formData: EmailChangeFormData) => {
    try {
      await updateEmailMutation.mutateAsync({
        newEmail: formData.newEmail,
      });
    } catch (error) {
      console.error('Failed to update email', error);
      throw error;
    }
  };

  return {
    isLoading: updateEmailMutation.isPending,
    isError: updateEmailMutation.isError,
    error: updateEmailMutation.error,
    handleSubmitEmail,
  };
};
