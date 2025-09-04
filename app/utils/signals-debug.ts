/**
 * Signals 디버깅 유틸리티
 * 개발 환경에서만 동작
 */
import { effect } from '@preact/signals-react';
import type { Signal } from '@preact/signals-react';
import * as signals from '~/state/signals';

// 개발 환경 체크
const isDevelopment = process.env.NODE_ENV === 'development';

// Signal 히스토리 타입
interface SignalHistory<T> {
  timestamp: number;
  previousValue: T;
  currentValue: T;
  source?: string;
}

// Signal 히스토리 저장소
const signalHistories = new Map<string, SignalHistory<any>[]>();

// ===========================
// 디버깅 유틸리티 함수
// ===========================

/**
 * Signal 변경 로깅
 */
export function logSignalChange<T>(
  signalName: string,
  signal: Signal<T>,
  options: {
    maxHistory?: number;
    logToConsole?: boolean;
    includeStackTrace?: boolean;
  } = {}
) {
  if (!isDevelopment) return;
  
  const {
    maxHistory = 50,
    logToConsole = true,
    includeStackTrace = false
  } = options;
  
  effect(() => {
    const value = signal.value;
    const history = signalHistories.get(signalName) || [];
    const previousValue = history[history.length - 1]?.currentValue;
    
    const entry: SignalHistory<T> = {
      timestamp: Date.now(),
      previousValue,
      currentValue: value,
      source: includeStackTrace ? new Error().stack : undefined
    };
    
    history.push(entry);
    
    // 최대 히스토리 개수 제한
    if (history.length > maxHistory) {
      history.shift();
    }
    
    signalHistories.set(signalName, history);
    
    if (logToConsole) {
      console.group(`📡 Signal Changed: ${signalName}`);
      console.log('Previous:', previousValue);
      console.log('Current:', value);
      console.log('Timestamp:', new Date(entry.timestamp).toISOString());
      if (includeStackTrace) {
        console.log('Stack:', entry.source);
      }
      console.groupEnd();
    }
  });
}

/**
 * Signal 히스토리 가져오기
 */
export function getSignalHistory(signalName: string): SignalHistory<any>[] {
  if (!isDevelopment) return [];
  return signalHistories.get(signalName) || [];
}

/**
 * 모든 Signal 히스토리 초기화
 */
export function clearSignalHistories() {
  if (!isDevelopment) return;
  signalHistories.clear();
  console.log('🧹 All signal histories cleared');
}

/**
 * 특정 Signal 히스토리 초기화
 */
export function clearSignalHistory(signalName: string) {
  if (!isDevelopment) return;
  signalHistories.delete(signalName);
  console.log(`🧹 Signal history cleared: ${signalName}`);
}

/**
 * 현재 모든 Signal 값 스냅샷
 */
export function getSignalsSnapshot() {
  if (!isDevelopment) return {};
  
  return {
    // 사용자 설정
    darkMode: signals.darkMode.value,
    language: signals.language.value,
    
    // 검색
    searchQuery: signals.searchQuery.value,
    searchResults: signals.searchResults.value.length,
    searchFilter: signals.searchFilter.value,
    isSearching: signals.isSearching.value,
    searchError: signals.searchError.value,
    
    // 즐겨찾기
    favoriteMoviesCount: signals.favoriteMovies.value.length,
    favoriteTvShowsCount: signals.favoriteTvShows.value.length,
    
    // UI 상태
    isSidebarOpen: signals.isSidebarOpen.value,
    activeCategory: signals.activeCategory.value,
    currentPage: signals.currentPage.value,
    isLoading: signals.isLoading.value,
    
    // 최근 본 콘텐츠
    recentlyViewedCount: signals.recentlyViewed.value.length,
    
    // Computed
    hasFavorites: signals.hasFavorites.value,
    totalFavorites: signals.totalFavorites.value,
  };
}

/**
 * Signal 값 모니터링
 */
export function monitorSignal<T>(
  signalName: string,
  signal: Signal<T>,
  condition?: (value: T) => boolean
) {
  if (!isDevelopment) return;
  
  effect(() => {
    const value = signal.value;
    
    if (condition && !condition(value)) {
      return;
    }
    
    console.warn(`🔍 Signal Monitor: ${signalName}`, value);
  });
}

/**
 * 성능 측정
 */
export function measureSignalPerformance<T>(
  signalName: string,
  signal: Signal<T>
) {
  if (!isDevelopment) return;
  
  let updateCount = 0;
  let totalUpdateTime = 0;
  
  effect(() => {
    const startTime = performance.now();
    const value = signal.value; // Signal 값 접근
    const endTime = performance.now();
    
    updateCount++;
    totalUpdateTime += endTime - startTime;
    
    if (updateCount % 100 === 0) {
      console.log(`⚡ Signal Performance: ${signalName}`);
      console.log(`  Updates: ${updateCount}`);
      console.log(`  Avg Time: ${(totalUpdateTime / updateCount).toFixed(3)}ms`);
    }
  });
}

// ===========================
// 브라우저 콘솔 명령어 등록
// ===========================

if (isDevelopment && typeof window !== 'undefined') {
  // 글로벌 객체에 디버깅 도구 등록
  (window as any).signalsDebug = {
    // Signals 접근
    signals,
    
    // 디버깅 함수
    getSnapshot: getSignalsSnapshot,
    getHistory: getSignalHistory,
    clearHistory: clearSignalHistory,
    clearAllHistories: clearSignalHistories,
    
    // Signal 값 직접 변경
    setDarkMode: (value: boolean) => {
      signals.darkMode.value = value;
    },
    setLanguage: (lang: 'ko-KR' | 'en-US') => {
      signals.language.value = lang;
    },
    setSearchQuery: (query: string) => {
      signals.searchQuery.value = query;
    },
    setCurrentPage: (page: number) => {
      signals.currentPage.value = page;
    },
    
    // 액션 실행
    clearSearch: signals.clearSearch,
    clearAllFavorites: signals.clearAllFavorites,
    clearRecentlyViewed: signals.clearRecentlyViewed,
    resetPagination: signals.resetPagination,
    toggleDarkMode: signals.toggleDarkMode,
    
    // 상태 정보 출력
    printState: () => {
      const snapshot = getSignalsSnapshot();
      console.table(snapshot);
    },
    
    // 도움말
    help: () => {
      console.log(`
🛠️ Signals Debug Tools
======================

사용 가능한 명령어:
  signalsDebug.getSnapshot()        - 모든 Signal 값 스냅샷
  signalsDebug.printState()         - Signal 상태 테이블로 출력
  signalsDebug.getHistory(name)     - 특정 Signal 히스토리 조회
  signalsDebug.clearHistory(name)   - 특정 Signal 히스토리 초기화
  signalsDebug.clearAllHistories()  - 모든 히스토리 초기화

Signal 값 변경:
  signalsDebug.setDarkMode(boolean)
  signalsDebug.setLanguage('ko-KR' | 'en-US')
  signalsDebug.setSearchQuery(string)
  signalsDebug.setCurrentPage(number)

액션 실행:
  signalsDebug.clearSearch()
  signalsDebug.clearAllFavorites()
  signalsDebug.clearRecentlyViewed()
  signalsDebug.resetPagination()
  signalsDebug.toggleDarkMode()

직접 Signal 접근:
  signalsDebug.signals.<signalName>.value
      `);
    }
  };
  
  console.log('💡 Signals 디버깅 도구가 활성화되었습니다. "signalsDebug.help()"를 입력하여 사용법을 확인하세요.');
}

// ===========================
// 자동 로깅 설정 (개발 환경)
// ===========================

if (isDevelopment) {
  // 주요 Signal 자동 로깅
  logSignalChange('darkMode', signals.darkMode, { logToConsole: false });
  logSignalChange('language', signals.language, { logToConsole: false });
  logSignalChange('searchQuery', signals.searchQuery, { logToConsole: false });
  logSignalChange('currentPage', signals.currentPage, { logToConsole: false });
  logSignalChange('favoriteMovies', signals.favoriteMovies, { logToConsole: false });
  logSignalChange('favoriteTvShows', signals.favoriteTvShows, { logToConsole: false });
  
  // 성능 문제가 있을 수 있는 Signal 모니터링
  monitorSignal('searchResults', signals.searchResults, (value) => value.length > 100);
  monitorSignal('recentlyViewed', signals.recentlyViewed, (value) => value.length > 15);
}

export default {
  logSignalChange,
  getSignalHistory,
  clearSignalHistory,
  clearSignalHistories,
  getSignalsSnapshot,
  monitorSignal,
  measureSignalPerformance
};