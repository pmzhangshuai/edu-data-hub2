import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useUserStore = create()(persist((set, get) => ({
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
}), {
    name: 'user-storage',
    partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        permissions: state.permissions,
    }),
}));
