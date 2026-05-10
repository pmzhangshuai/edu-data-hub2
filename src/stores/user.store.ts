import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface UserState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  permissions: string[];

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setPermissions: (permissions: string[]) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      permissions: [],

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      setPermissions: (permissions) => set({ permissions }),

      login: (user, token) => {
        set({
          user,
          token,
          isLoggedIn: true,
          permissions: user.permissions || [],
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          permissions: [],
        });
        localStorage.removeItem('token');
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        permissions: state.permissions,
      }),
    }
  )
);
