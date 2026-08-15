import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { login as loginApi, logout as logoutApi, LoginParams } from '../lib/api/auth';
import { authStorage } from '../lib/storage';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const accessToken = useAppStore((state) => state.accessToken);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const resetAppStore = useAppStore((state) => state.reset);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (params: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginApi(params);
      authStorage.setAccessToken(result.accessToken);
      authStorage.setRefreshToken(result.refreshToken);
      setAccessToken(result.accessToken);
      
      if (result.user.userType === 'Admin') {
        router.push('/admin/dashboard');
      } else if (result.user.userType === 'Doctor') {
        router.push('/doctor/patients');
      } else {
         router.push('/home'); 
      }
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout failed on backend:', err);
    } finally {
      authStorage.clearTokens();
      resetAppStore();
      router.push('/login');
    }
  };

  return {
    isAuthenticated: !!accessToken,
    loading,
    error,
    login,
    logout,
  };
}
