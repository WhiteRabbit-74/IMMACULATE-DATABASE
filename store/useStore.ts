import { create } from 'zustand';

interface Agency {
  id: string;
  name: string;
  slug: string;
  colorPrimary: string;
  colorSecondary: string;
  logoPath?: string;
}

interface AppState {
  activeAgency: Agency | null;
  searchQuery: string;
  yearFilter: number | null;
  isTerminalVisible: boolean;
  
  setActiveAgency: (agency: Agency | null) => void;
  setSearchQuery: (query: string) => void;
  setYearFilter: (year: number | null) => void;
  toggleTerminal: (visible: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  activeAgency: null,
  searchQuery: '',
  yearFilter: null,
  isTerminalVisible: true,

  setActiveAgency: (agency) => {
    if (agency) {
      document.documentElement.style.setProperty('--accent', agency.colorPrimary);
      document.documentElement.style.setProperty('--accent-glow', `${agency.colorPrimary}4D`);
      document.documentElement.style.setProperty('--bg-tint', `${agency.colorPrimary}05`);
    } else {
      document.documentElement.style.setProperty('--accent', '#00ff00');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(0, 255, 0, 0.3)');
      document.documentElement.style.setProperty('--bg-tint', 'rgba(0, 255, 0, 0.02)');
    }
    set({ activeAgency: agency });
  },
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setYearFilter: (yearFilter) => set({ yearFilter }),
  toggleTerminal: (isTerminalVisible) => set({ isTerminalVisible }),
}));
