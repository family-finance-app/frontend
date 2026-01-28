import { useSignIn } from '@/api/auth/mutations';
import { Login, SignInFormData } from '@/(auth)/types';
import { ApiSuccess } from '@/api/types';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const signInMutation = useSignIn();
  const router = useRouter();

  const handleSubmit = async (
    formData: SignInFormData,
  ): Promise<ApiSuccess<Login>> => {
    try {
      const response = await signInMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      if (!response?.data?.accessToken) {
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push('/dashboard');
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
