import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LayoutState = {
  sidebarCollapsed: boolean;
};

type LayoutActions = {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

export const useLayoutStore = create<LayoutState & LayoutActions>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: 'ecosystem.layout' },
  ),
);
