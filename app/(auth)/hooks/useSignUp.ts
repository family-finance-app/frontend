import { useSignUp } from '@/api/auth/mutations';
import { NewUser, SignUpFormData } from '@/(auth)/types';
import { ApiSuccess } from '@/api/types';

export const useSignup = () => {
  const signUpMutation = useSignUp();

  const handleSubmit = async (
    formData: SignUpFormData,
  ): Promise<ApiSuccess<NewUser>> => {
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
