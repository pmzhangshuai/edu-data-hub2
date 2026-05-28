import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAppStore = create()(persist((set, get) => ({
    theme: 'light',
    collapsed: false,
    sidebarWidth: 240,
    showHeader: true,
    showFooter: true,
    setTheme: (theme) => set({ theme }),
    toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === 'light' ? 'dark' : 'light' });
    },
    setCollapsed: (collapsed) => set({ collapsed }),
    toggleCollapsed: () => {
        const { collapsed } = get();
        set({ collapsed: !collapsed });
    },
    setSidebarWidth: (width) => set({ sidebarWidth: width }),
    setShowHeader: (show) => set({ showHeader: show }),
    setShowFooter: (show) => set({ showFooter: show }),
}), {
    name: 'app-storage',
    partialize: (state) => ({
        theme: state.theme,
        collapsed: state.collapsed,
        sidebarWidth: state.sidebarWidth,
    }),
}));
