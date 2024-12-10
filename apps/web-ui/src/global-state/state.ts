import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type User = {
  email: string;
  id: string;
  name: string;
  iseVerified: boolean;
  token: string;
};
type IGlobalState = {
  user: User;
  setUserData: (user: User) => void;
  setToken: (token: string) => void;
  clearUserData: () => void;
  isAuthenticated: () => boolean;
};

const defaultUser: User = {
  email: '',
  id: '',
  name: '',
  iseVerified: false,
  token: '',
};

export const useGlobalState = create(
  persist<IGlobalState>(
    (set, get) => ({
      user: defaultUser,
      setUserData: user => set({ user }),
      setToken: token => set({ user: { ...get().user, token } }),
      clearUserData: () => set({ user: defaultUser }),
      isAuthenticated: () => !!get().user.token,
    }),
    {
      name: 'global-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type IAuthStaCallbacks = {
  onSuccess?: () => void;
  onError?: (error: { code: number; message: string; type: string }) => void;
};

// interface for a react hook that performs authentication
export type IUseAuthStateReturn = {
  checkIfAuthenticated: () => boolean;
  loginWithEmail: (email: string, password: string, callbacks?: IAuthStaCallbacks) => Promise<void>;
  logout: (callbacks?: IAuthStaCallbacks) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, callbacks?: IAuthStaCallbacks) => Promise<void>;
  isAuthLoading: boolean;
  authError: string | null;
};
