import { LRUCache } from 'lru-cache';

// 캐시 인스턴스를 싱글톤으로 관리
let cache: LRUCache<string, any>;

declare global {
  var __cache__: LRUCache<string, any>;
}

export function getCache(): LRUCache<string, any> {
  // 개발 환경에서는 HMR 시 캐시가 유지되도록 global에 저장
  if (!cache) {
    if (process.env.NODE_ENV === 'production') {
      cache = new LRUCache<string, any>({
        max: 100, // 최대 100개 항목
        ttl: 1000 * 60 * 5, // 기본 5분 TTL
        allowStale: false,
        updateAgeOnGet: false,
        updateAgeOnHas: false,
      });
    } else {
      // 개발 환경에서는 global 변수 사용
      if (!global.__cache__) {
        global.__cache__ = new LRUCache<string, any>({
          max: 100,
          ttl: 1000 * 60 * 5,
          allowStale: false,
          updateAgeOnGet: false,
          updateAgeOnHas: false,
        });
      }
      cache = global.__cache__;
    }
  }
  return cache;
}

// 캐시 키 생성 헬퍼
export function createCacheKey(...parts: (string | number | undefined)[]) {
  return parts.filter(Boolean).join(':');
}

// 캐시 헤더 생성 헬퍼
export function createCacheHeaders(maxAge: number = 3600) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  };
}