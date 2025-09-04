/**
 * Signals를 위한 React Context Provider
 */
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { loadFromLocalStorage } from '~/state/signals';
import * as signals from '~/state/signals';

// Context 타입 정의
interface SignalsContextType {
  // 사용자 설정
  darkMode: typeof signals.darkMode;
  language: typeof signals.language;
  
  // 검색
  searchQuery: typeof signals.searchQuery;
  searchResults: typeof signals.searchResults;
  searchFilter: typeof signals.searchFilter;
  isSearching: typeof signals.isSearching;
  searchError: typeof signals.searchError;
  
  // 즐겨찾기
  favoriteMovies: typeof signals.favoriteMovies;
  favoriteTvShows: typeof signals.favoriteTvShows;
  
  // UI 상태
  isSidebarOpen: typeof signals.isSidebarOpen;
  activeCategory: typeof signals.activeCategory;
  currentPage: typeof signals.currentPage;
  isLoading: typeof signals.isLoading;
  
  // 최근 본 콘텐츠
  recentlyViewed: typeof signals.recentlyViewed;
  
  // Computed
  hasFavorites: typeof signals.hasFavorites;
  totalFavorites: typeof signals.totalFavorites;
  filteredSearchResults: typeof signals.filteredSearchResults;
  recentItems: typeof signals.recentItems;
  
  // Actions
  toggleFavoriteMovie: typeof signals.toggleFavoriteMovie;
  toggleFavoriteTvShow: typeof signals.toggleFavoriteTvShow;
  isFavoriteMovie: typeof signals.isFavoriteMovie;
  isFavoriteTvShow: typeof signals.isFavoriteTvShow;
  addToRecentlyViewed: typeof signals.addToRecentlyViewed;
  clearSearch: typeof signals.clearSearch;
  resetPagination: typeof signals.resetPagination;
  toggleDarkMode: typeof signals.toggleDarkMode;
  changeLanguage: typeof signals.changeLanguage;
  clearAllFavorites: typeof signals.clearAllFavorites;
  clearRecentlyViewed: typeof signals.clearRecentlyViewed;
}

// Context 생성
const SignalsContext = createContext<SignalsContextType | null>(null);

// Provider Props
interface SignalsProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export function SignalsProvider({ children }: SignalsProviderProps) {
  // 클라이언트 사이드에서 localStorage 로드
  useEffect(() => {
    loadFromLocalStorage();
  }, []);
  
  // Context 값
  const contextValue: SignalsContextType = {
    // 사용자 설정
    darkMode: signals.darkMode,
    language: signals.language,
    
    // 검색
    searchQuery: signals.searchQuery,
    searchResults: signals.searchResults,
    searchFilter: signals.searchFilter,
    isSearching: signals.isSearching,
    searchError: signals.searchError,
    
    // 즐겨찾기
    favoriteMovies: signals.favoriteMovies,
    favoriteTvShows: signals.favoriteTvShows,
    
    // UI 상태
    isSidebarOpen: signals.isSidebarOpen,
    activeCategory: signals.activeCategory,
    currentPage: signals.currentPage,
    isLoading: signals.isLoading,
    
    // 최근 본 콘텐츠
    recentlyViewed: signals.recentlyViewed,
    
    // Computed
    hasFavorites: signals.hasFavorites,
    totalFavorites: signals.totalFavorites,
    filteredSearchResults: signals.filteredSearchResults,
    recentItems: signals.recentItems,
    
    // Actions
    toggleFavoriteMovie: signals.toggleFavoriteMovie,
    toggleFavoriteTvShow: signals.toggleFavoriteTvShow,
    isFavoriteMovie: signals.isFavoriteMovie,
    isFavoriteTvShow: signals.isFavoriteTvShow,
    addToRecentlyViewed: signals.addToRecentlyViewed,
    clearSearch: signals.clearSearch,
    resetPagination: signals.resetPagination,
    toggleDarkMode: signals.toggleDarkMode,
    changeLanguage: signals.changeLanguage,
    clearAllFavorites: signals.clearAllFavorites,
    clearRecentlyViewed: signals.clearRecentlyViewed,
  };
  
  return (
    <SignalsContext.Provider value={contextValue}>
      {children}
    </SignalsContext.Provider>
  );
}

// Context 사용 Hook
export function useSignalsContext() {
  const context = useContext(SignalsContext);
  
  if (!context) {
    throw new Error('useSignalsContext는 SignalsProvider 내에서 사용되어야 합니다.');
  }
  
  return context;
}

// 개별 Signals 사용 Hooks
export function useDarkModeSignal() {
  const { darkMode, toggleDarkMode } = useSignalsContext();
  return { darkMode, toggleDarkMode };
}

export function useLanguageSignal() {
  const { language, changeLanguage } = useSignalsContext();
  return { language, changeLanguage };
}

export function useSearchSignals() {
  const {
    searchQuery,
    searchResults,
    searchFilter,
    isSearching,
    searchError,
    filteredSearchResults,
    clearSearch
  } = useSignalsContext();
  
  return {
    searchQuery,
    searchResults,
    searchFilter,
    isSearching,
    searchError,
    filteredSearchResults,
    clearSearch
  };
}

export function useFavoritesSignals() {
  const {
    favoriteMovies,
    favoriteTvShows,
    hasFavorites,
    totalFavorites,
    toggleFavoriteMovie,
    toggleFavoriteTvShow,
    isFavoriteMovie,
    isFavoriteTvShow,
    clearAllFavorites
  } = useSignalsContext();
  
  return {
    favoriteMovies,
    favoriteTvShows,
    hasFavorites,
    totalFavorites,
    toggleFavoriteMovie,
    toggleFavoriteTvShow,
    isFavoriteMovie,
    isFavoriteTvShow,
    clearAllFavorites
  };
}

export function useUIStateSignals() {
  const {
    isSidebarOpen,
    activeCategory,
    currentPage,
    isLoading,
    resetPagination
  } = useSignalsContext();
  
  return {
    isSidebarOpen,
    activeCategory,
    currentPage,
    isLoading,
    resetPagination
  };
}

export function useRecentlyViewedSignals() {
  const {
    recentlyViewed,
    recentItems,
    addToRecentlyViewed,
    clearRecentlyViewed
  } = useSignalsContext();
  
  return {
    recentlyViewed,
    recentItems,
    addToRecentlyViewed,
    clearRecentlyViewed
  };
}