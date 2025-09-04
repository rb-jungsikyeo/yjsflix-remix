declare module '@epic-web/cachified' {
  export interface CachifiedOptions<T> {
    key: string;
    cache: any;
    ttl?: number;
    staleWhileRevalidate?: number;
    swr?: number;
    checkValue?: (value: T) => boolean | Promise<boolean>;
    getFreshValue: () => Promise<T>;
    fallbackToCache?: T;
    forceFresh?: boolean;
  }

  export function cachified<T>(options: CachifiedOptions<T>): Promise<T>;
}