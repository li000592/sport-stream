import { create } from 'zustand';
import { API, fetchJSON, Match, Source } from '../utils/api';

interface SportState {
  liveMatches: Match[];
  todayMatches: Match[];
  isLoading: boolean;
  currentSport: string;
  
  // Modal State
  isModalOpen: boolean;
  modalMatch: Match | null;
  activeStreamUrl: string | null;
  availableStreams: Source[];
  isLoadingStreams: boolean;

  fetchMatches: () => Promise<void>;
  setSportFilter: (sport: string) => void;
  openMatch: (match: Match) => Promise<void>;
  closeModal: () => void;
  setStreamUrl: (url: string | null) => void;
}

const useStore = create<SportState>((set) => ({
  liveMatches: [],
  todayMatches: [],
  isLoading: true,
  currentSport: 'all',
  
  // Modal State
  isModalOpen: false,
  modalMatch: null,
  activeStreamUrl: null,
  availableStreams: [],
  isLoadingStreams: false,

  fetchMatches: async () => {
    set({ isLoading: true });
    const live = await fetchJSON<Match[]>(`${API}/matches/live`);
    const today = await fetchJSON<Match[]>(`${API}/matches/all-today`);

    const liveList = live || [];
    const todayList = (today || []).filter(m => !liveList.find(l => l.id === m.id));

    set({ 
      liveMatches: liveList, 
      todayMatches: todayList,
      isLoading: false 
    });
  },

  setSportFilter: (sport) => set({ currentSport: sport }),

  openMatch: async (match) => {
    set({ 
      isModalOpen: true, 
      modalMatch: match, 
      activeStreamUrl: null, 
      availableStreams: [],
      isLoadingStreams: true 
    });

    const sources = match.sources || [];
    if (sources.length === 0) {
      set({ isLoadingStreams: false });
      return;
    }

    // Parallel fetching of top 5 sources
    const streamPromises = sources.slice(0, 5).map(s => 
      fetchJSON<Source[]>(`${API}/stream/${s.source}/${s.id}`).then(data => 
        Array.isArray(data) ? data.map(st => ({...st, sourceName: s.source})) : []
      )
    );

    const results = await Promise.all(streamPromises);
    const allStreams = results.flat();

    set({ 
      availableStreams: allStreams,
      isLoadingStreams: false,
      activeStreamUrl: allStreams[0]?.embedUrl || null
    });
  },

  closeModal: () => set({ 
    isModalOpen: false, 
    modalMatch: null, 
    activeStreamUrl: null,
    availableStreams: [] 
  }),

  setStreamUrl: (url) => set({ activeStreamUrl: url })
}));

export default useStore;
