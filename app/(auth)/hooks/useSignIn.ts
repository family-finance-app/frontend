import { useSignIn } from '@/api/auth/mutations';
import { Login, SignInFormData } from '@/(auth)/types';
import { ApiSuccess } from '@/api/types';
import { useAuth } from '@/components/guards/AuthContext';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const signInMutation = useSignIn();
  const { setToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (
    formData: SignInFormData,
  ): Promise<ApiSuccess<Login>> => {
    try {
      console.log('🔐 Starting login...');
      const response = await signInMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      const token = response?.data?.accessToken;

      if (!token) {
        console.error('❌ No token in response');
        return response;
      }

      console.log('🔐 Login successful, setting token');
      setToken(token); // ИСПОЛЬЗУЕМ setToken из контекста

      // Небольшая задержка для гарантии
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
