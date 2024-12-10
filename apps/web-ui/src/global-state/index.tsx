import { useToast } from '@clean-stack/react-hooks/use-toast';
import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';
import { account, ID } from './appwriteClient';
import { IAuthStaCallbacks, IUseAuthStateReturn, useGlobalState } from './state';

export default function useAuthState(): IUseAuthStateReturn {
  const { setUserData, clearUserData, user } = useGlobalState();
  const [isAuthLoading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (authError)
      toast({
        title: 'Error',
        description: authError,
        nonce: 'error',
        variant: 'destructive',
      });
  }, [authError, toast]);

  useEffect(() => {
    checkUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserStatus = async (): Promise<void> => {
    try {
      const user = await account.get();
      const jwt = await account.createJWT();
      setUserData({
        email: user.email,
        id: user.$id,
        name: user.name,
        iseVerified: user.emailVerification,
        token: jwt.jwt,
      });
    } catch {
      clearUserData();
    }
    setLoading(false);
  };

  const loginWithEmail = async (email: string, password: string, { onSuccess, onError }: IAuthStaCallbacks = {}) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUserStatus();
      onSuccess?.();
    } catch (error) {
      if (error instanceof AppwriteException) {
        onError?.(error);
        setAuthError(error.message);
      } else console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string, { onSuccess, onError }: IAuthStaCallbacks = {}) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), email, password, name);
      await checkUserStatus();
      onSuccess?.();
    } catch (error) {
      if (error instanceof AppwriteException) {
        onError?.(error);
        setAuthError(error.message);
      } else console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async ({ onSuccess, onError }: IAuthStaCallbacks = {}) => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      clearUserData();
      onSuccess?.();
    } catch (error) {
      if (error instanceof AppwriteException) {
        onError?.(error);
        setAuthError(error.message);
      } else console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    checkIfAuthenticated: () => !!user.token,
    loginWithEmail,
    logout,
    registerWithEmail,
    isAuthLoading,
    authError,
  };
}

export type { IUseAuthStateReturn };
