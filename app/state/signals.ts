/**
 * Signals 기반 글로벌 상태 관리
 */
import { signal, computed, effect } from '@preact/signals-react';
import type { Movie, TvShow, SearchResult } from '~/services/tmdb.server';

// ===========================
// 사용자 설정 Signals
// ===========================
export const darkMode = signal(true);
export const language = signal<'ko-KR' | 'en-US'>('ko-KR');

// ===========================
// 검색 관련 Signals
// ===========================
export const searchQuery = signal('');
export const searchResults = signal<SearchResult[]>([]);
export const searchFilter = signal<'all' | 'movie' | 'tv' | 'person'>('all');
export const isSearching = signal(false);
export const searchError = signal<string | null>(null);

// ===========================
// 즐겨찾기 Signals
// ===========================
export const favoriteMovies = signal<Movie[]>([]);
export const favoriteTvShows = signal<TvShow[]>([]);

// ===========================
// UI 상태 Signals
// ===========================
export const isSidebarOpen = signal(false);
export const activeCategory = signal<'popular' | 'now_playing' | 'upcoming' | 'top_rated'>('popular');
export const currentPage = signal(1);
export const isLoading = signal(false);

// ===========================
// 최근 본 콘텐츠 Signals
// ===========================
export const recentlyViewed = signal<Array<{ id: number; type: 'movie' | 'tv'; timestamp: number }>>([]);

// ===========================
// Computed Values
// ===========================

// 즐겨찾기 여부 확인
export const hasFavorites = computed(() => {
  return favoriteMovies.value.length > 0 || favoriteTvShows.value.length > 0;
});

// 전체 즐겨찾기 개수
export const totalFavorites = computed(() => {
  return favoriteMovies.value.length + favoriteTvShows.value.length;
});

// 필터링된 검색 결과
export const filteredSearchResults = computed(() => {
  const filter = searchFilter.value;
  if (filter === 'all') return searchResults.value;
  
  return searchResults.value.filter(result => result.media_type === filter);
});

// 최근 본 콘텐츠 (최대 10개)
export const recentItems = computed(() => {
  return recentlyViewed.value
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
});

// ===========================
// Actions
// ===========================

// 영화 즐겨찾기 토글
export function toggleFavoriteMovie(movie: Movie) {
  const exists = favoriteMovies.value.some(m => m.id === movie.id);
  if (exists) {
    favoriteMovies.value = favoriteMovies.value.filter(m => m.id !== movie.id);
  } else {
    favoriteMovies.value = [...favoriteMovies.value, movie];
  }
}

// TV 프로그램 즐겨찾기 토글
export function toggleFavoriteTvShow(tvShow: TvShow) {
  const exists = favoriteTvShows.value.some(t => t.id === tvShow.id);
  if (exists) {
    favoriteTvShows.value = favoriteTvShows.value.filter(t => t.id !== tvShow.id);
  } else {
    favoriteTvShows.value = [...favoriteTvShows.value, tvShow];
  }
}

// 영화가 즐겨찾기에 있는지 확인
export function isFavoriteMovie(movieId: number): boolean {
  return favoriteMovies.value.some(m => m.id === movieId);
}

// TV 프로그램이 즐겨찾기에 있는지 확인
export function isFavoriteTvShow(tvShowId: number): boolean {
  return favoriteTvShows.value.some(t => t.id === tvShowId);
}

// 최근 본 콘텐츠 추가
export function addToRecentlyViewed(id: number, type: 'movie' | 'tv') {
  const newItem = { id, type, timestamp: Date.now() };
  
  // 이미 있는 항목은 제거하고 새로 추가
  const filtered = recentlyViewed.value.filter(
    item => !(item.id === id && item.type === type)
  );
  
  recentlyViewed.value = [newItem, ...filtered].slice(0, 20); // 최대 20개 저장
}

// 검색 초기화
export function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  searchError.value = null;
  isSearching.value = false;
}

// 페이지 초기화
export function resetPagination() {
  currentPage.value = 1;
}

// 다크모드 토글
export function toggleDarkMode() {
  darkMode.value = !darkMode.value;
}

// 언어 변경
export function changeLanguage(lang: 'ko-KR' | 'en-US') {
  language.value = lang;
}

// 즐겨찾기 전체 삭제
export function clearAllFavorites() {
  favoriteMovies.value = [];
  favoriteTvShows.value = [];
}

// 최근 본 콘텐츠 삭제
export function clearRecentlyViewed() {
  recentlyViewed.value = [];
}

// ===========================
// localStorage 연동
// ===========================

// localStorage 키
const STORAGE_KEYS = {
  FAVORITE_MOVIES: 'yjsflix_favorite_movies',
  FAVORITE_TV_SHOWS: 'yjsflix_favorite_tv_shows',
  RECENTLY_VIEWED: 'yjsflix_recently_viewed',
  DARK_MODE: 'yjsflix_dark_mode',
  LANGUAGE: 'yjsflix_language',
};

// localStorage에서 데이터 로드
export function loadFromLocalStorage() {
  if (typeof window === 'undefined') return; // SSR 환경에서는 실행하지 않음
  
  try {
    // 즐겨찾기 영화 로드
    const savedMovies = localStorage.getItem(STORAGE_KEYS.FAVORITE_MOVIES);
    if (savedMovies) {
      favoriteMovies.value = JSON.parse(savedMovies);
    }
    
    // 즐겨찾기 TV 프로그램 로드
    const savedTvShows = localStorage.getItem(STORAGE_KEYS.FAVORITE_TV_SHOWS);
    if (savedTvShows) {
      favoriteTvShows.value = JSON.parse(savedTvShows);
    }
    
    // 최근 본 콘텐츠 로드
    const savedRecent = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    if (savedRecent) {
      recentlyViewed.value = JSON.parse(savedRecent);
    }
    
    // 다크모드 설정 로드
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode !== null) {
      darkMode.value = JSON.parse(savedDarkMode);
    }
    
    // 언어 설정 로드
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage) {
      language.value = savedLanguage as 'ko-KR' | 'en-US';
    }
  } catch (error) {
    console.error('localStorage에서 데이터를 로드하는 중 오류 발생:', error);
  }
}

// localStorage에 자동 저장 설정
if (typeof window !== 'undefined') {
  // 즐겨찾기 영화 저장
  effect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITE_MOVIES, JSON.stringify(favoriteMovies.value));
    } catch (error) {
      console.error('영화 즐겨찾기 저장 실패:', error);
    }
  });
  
  // 즐겨찾기 TV 프로그램 저장
  effect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITE_TV_SHOWS, JSON.stringify(favoriteTvShows.value));
    } catch (error) {
      console.error('TV 프로그램 즐겨찾기 저장 실패:', error);
    }
  });
  
  // 최근 본 콘텐츠 저장
  effect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed.value));
    } catch (error) {
      console.error('최근 본 콘텐츠 저장 실패:', error);
    }
  });
  
  // 다크모드 설정 저장
  effect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode.value));
      // DOM에 다크모드 클래스 적용
      if (darkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('다크모드 설정 저장 실패:', error);
    }
  });
  
  // 언어 설정 저장
  effect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language.value);
    } catch (error) {
      console.error('언어 설정 저장 실패:', error);
    }
  });
}