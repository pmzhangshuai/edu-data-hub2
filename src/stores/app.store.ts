import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type CollapseState = boolean;

interface AppState {
  theme: Theme;
  collapsed: CollapseState;
  sidebarWidth: number;
  showHeader: boolean;
  showFooter: boolean;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCollapsed: (collapsed: CollapseState) => void;
  toggleCollapsed: () => void;
  setSidebarWidth: (width: number) => void;
  setShowHeader: (show: boolean) => void;
  setShowFooter: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        collapsed: state.collapsed,
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);
