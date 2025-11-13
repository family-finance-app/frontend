import { useSignIn } from '@/api/auth/mutations';
import { SignInFormData, AuthResponse } from '@/types/auth';

export const useLogin = () => {
  const signInMutation = useSignIn();

  const handleSubmit = async (
    formData: SignInFormData
  ): Promise<AuthResponse> => {
    try {
      const response = await signInMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      return response;
    } catch (error) {
      console.error('Sign in failed', error);
      throw error;
    }
  };

  return {
    isLoading: signInMutation.isPending,
    isError: signInMutation.isError,
    isSuccess: signInMutation.isSuccess,
    error: signInMutation.error,
    errorMessage: signInMutation.error?.message,
    handleSubmit,
  };
};
