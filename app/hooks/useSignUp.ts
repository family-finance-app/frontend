import { useSignUp } from '@/api/auth/mutations';
import { SignUpFormData, AuthResponse } from '@/types/auth';

export const useSignup = () => {
  const signUpMutation = useSignUp();

  const handleSubmit = async (
    formData: Partial<SignUpFormData>
  ): Promise<AuthResponse> => {
    try {
      const response = await signUpMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        terms: formData.terms,
      });
      return response;
    } catch (error) {
      console.error('Sign up failed', error);
      throw error;
    }
  };

  return {
    isLoading: signUpMutation.isPending,
    isError: signUpMutation.isError,
    isSuccess: signUpMutation.isSuccess,
    error: signUpMutation.error,
    errorMessage: signUpMutation.error?.message,
    handleSubmit,
  };
};
