/**
 * Signals를 사용하는 커스텀 React Hooks
 */
import { useSignal, useComputed, useSignalEffect } from '@preact/signals-react';
import { useEffect, useCallback } from 'react';
import type { Movie, TvShow } from '~/services/tmdb.server';
import * as globalSignals from '~/state/signals';

// ===========================
// 로컬 검색 Hook
// ===========================
export function useLocalSearch<T extends { title?: string; name?: string }>(items: T[]) {
  const query = useSignal('');
  const results = useComputed(() => {
    if (!query.value) return items;
    
    const searchTerm = query.value.toLowerCase();
    return items.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      return title.includes(searchTerm);
    });
  });
  
  return {
    query,
    results,
    setQuery: (value: string) => { query.value = value; },
    clearQuery: () => { query.value = ''; }
  };
}

// ===========================
// localStorage 연동 Hook
// ===========================
export function useLocalStorage<T>(key: string, initialValue: T) {
  const stored = useSignal<T>(initialValue);
  
  // 초기 로드
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        stored.value = JSON.parse(item);
      }
    } catch (error) {
      console.error(`localStorage 로드 실패 (${key}):`, error);
    }
  }, [key]);
  
  // 값 변경 시 자동 저장
  useSignalEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored.value));
    } catch (error) {
      console.error(`localStorage 저장 실패 (${key}):`, error);
    }
  });
  
  return stored;
}

// ===========================
// 디바운스된 Signal Hook
// ===========================
export function useDebouncedSignal<T>(initialValue: T, delay: number = 500) {
  const value = useSignal(initialValue);
  const debouncedValue = useSignal(initialValue);
  
  useSignalEffect(() => {
    const timer = setTimeout(() => {
      debouncedValue.value = value.value;
    }, delay);
    
    return () => clearTimeout(timer);
  });
  
  return {
    value,
    debouncedValue,
    setValue: (newValue: T) => { value.value = newValue; }
  };
}

// ===========================
// 페이지네이션 Hook
// ===========================
export function usePagination(totalPages: number, initialPage: number = 1) {
  const currentPage = useSignal(initialPage);
  
  const hasPrev = useComputed(() => currentPage.value > 1);
  const hasNext = useComputed(() => currentPage.value < totalPages);
  
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      currentPage.value = page;
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (hasNext.value) {
      currentPage.value++;
    }
  }, []);
  
  const prevPage = useCallback(() => {
    if (hasPrev.value) {
      currentPage.value--;
    }
  }, []);
  
  return {
    currentPage,
    hasPrev,
    hasNext,
    goToPage,
    nextPage,
    prevPage,
    totalPages
  };
}

// ===========================
// 폼 상태 관리 Hook
// ===========================
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const values = useSignal(initialValues);
  const errors = useSignal<Partial<Record<keyof T, string>>>({});
  const touched = useSignal<Partial<Record<keyof T, boolean>>>({});
  const isSubmitting = useSignal(false);
  
  const setValue = useCallback((field: keyof T, value: any) => {
    values.value = { ...values.value, [field]: value };
    touched.value = { ...touched.value, [field]: true };
  }, []);
  
  const setError = useCallback((field: keyof T, error: string | undefined) => {
    if (error) {
      errors.value = { ...errors.value, [field]: error };
    } else {
      const newErrors = { ...errors.value };
      delete newErrors[field];
      errors.value = newErrors;
    }
  }, []);
  
  const reset = useCallback(() => {
    values.value = initialValues;
    errors.value = {};
    touched.value = {};
    isSubmitting.value = false;
  }, [initialValues]);
  
  const isValid = useComputed(() => Object.keys(errors.value).length === 0);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setError,
    reset
  };
}

// ===========================
// 무한 스크롤 Hook
// ===========================
export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  hasMore: boolean = true
) {
  const isLoading = useSignal(false);
  const error = useSignal<Error | null>(null);
  
  const handleScroll = useCallback(async (element: HTMLElement | null) => {
    if (!element || isLoading.value || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom) {
      isLoading.value = true;
      error.value = null;
      
      try {
        await loadMore();
      } catch (err) {
        error.value = err instanceof Error ? err : new Error('Unknown error');
      } finally {
        isLoading.value = false;
      }
    }
  }, [loadMore, hasMore]);
  
  return {
    isLoading,
    error,
    handleScroll
  };
}

// ===========================
// 즐겨찾기 Hook
// ===========================
export function useFavorites() {
  const favoriteMovies = globalSignals.favoriteMovies;
  const favoriteTvShows = globalSignals.favoriteTvShows;
  const hasFavorites = globalSignals.hasFavorites;
  const totalFavorites = globalSignals.totalFavorites;
  
  const toggleMovie = useCallback((movie: Movie) => {
    globalSignals.toggleFavoriteMovie(movie);
  }, []);
  
  const toggleTvShow = useCallback((tvShow: TvShow) => {
    globalSignals.toggleFavoriteTvShow(tvShow);
  }, []);
  
  const isMovieFavorite = useCallback((movieId: number) => {
    return globalSignals.isFavoriteMovie(movieId);
  }, []);
  
  const isTvShowFavorite = useCallback((tvShowId: number) => {
    return globalSignals.isFavoriteTvShow(tvShowId);
  }, []);
  
  const clearAll = useCallback(() => {
    globalSignals.clearAllFavorites();
  }, []);
  
  return {
    favoriteMovies,
    favoriteTvShows,
    hasFavorites,
    totalFavorites,
    toggleMovie,
    toggleTvShow,
    isMovieFavorite,
    isTvShowFavorite,
    clearAll
  };
}

// ===========================
// 다크모드 Hook
// ===========================
export function useDarkMode() {
  const darkMode = globalSignals.darkMode;
  
  const toggle = useCallback(() => {
    globalSignals.toggleDarkMode();
  }, []);
  
  const setDarkMode = useCallback((value: boolean) => {
    globalSignals.darkMode.value = value;
  }, []);
  
  return {
    darkMode,
    toggle,
    setDarkMode
  };
}

// ===========================
// 언어 설정 Hook
// ===========================
export function useLanguage() {
  const language = globalSignals.language;
  
  const changeLanguage = useCallback((lang: 'ko-KR' | 'en-US') => {
    globalSignals.changeLanguage(lang);
  }, []);
  
  return {
    language,
    changeLanguage
  };
}

// ===========================
// 미디어 쿼리 Hook
// ===========================
export function useMediaQuery(query: string) {
  const matches = useSignal(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;
    
    const handler = (event: MediaQueryListEvent) => {
      matches.value = event.matches;
    };
    
    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);
  
  return matches;
}

// ===========================
// 타이머 Hook
// ===========================
export function useTimer(initialTime: number = 0) {
  const time = useSignal(initialTime);
  const isRunning = useSignal(false);
  
  useSignalEffect(() => {
    if (!isRunning.value) return;
    
    const interval = setInterval(() => {
      time.value++;
    }, 1000);
    
    return () => clearInterval(interval);
  });
  
  const start = useCallback(() => {
    isRunning.value = true;
  }, []);
  
  const stop = useCallback(() => {
    isRunning.value = false;
  }, []);
  
  const reset = useCallback(() => {
    time.value = initialTime;
    isRunning.value = false;
  }, [initialTime]);
  
  return {
    time,
    isRunning,
    start,
    stop,
    reset
  };
}