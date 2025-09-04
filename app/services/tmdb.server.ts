/**
 * TMDb API 서비스 레이어
 * 서버 사이드에서만 실행되는 API 호출 로직
 */

import { cachified } from '@epic-web/cachified';
import { getCache, createCacheKey } from '~/utils/cache.server';

// 타입 정의
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface TvShow {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  videos?: VideoResponse;
  credits?: CreditsResponse;
}

export interface TvShowDetails extends TvShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string | null;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  type: string;
  videos?: VideoResponse;
  credits?: CreditsResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface Cast {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Cast[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string; // 영화
  name?: string; // TV, 사람
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  release_date?: string; // 영화
  first_air_date?: string; // TV
  profile_path?: string | null; // 사람
  known_for?: (Movie | TvShow)[];
}

// API 설정
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'ko-KR';

// 커스텀 에러 클래스
export class TMDbAPIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'TMDbAPIError';
  }
}

// 기본 fetch 함수 with 재시도 로직
async function fetchFromTMDb(
  endpoint: string,
  params: Record<string, string> = {},
  retries = 3
): Promise<any> {
  if (!API_KEY) {
    throw new TMDbAPIError(500, 'TMDb API 키가 설정되지 않았습니다.');
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: DEFAULT_LANGUAGE,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new TMDbAPIError(
          response.status,
          `TMDb API 오류: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // 재시도 전 대기 (exponential backoff)
      await new Promise((resolve) => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

// 트렌딩 콘텐츠 가져오기 (캐싱 적용)
export async function getTrending(
  mediaType: 'movie' | 'tv' | 'all' = 'all',
  timeWindow: 'day' | 'week' = 'day'
): Promise<ApiResponse<Movie | TvShow>> {
  return cachified({
    key: createCacheKey('trending', mediaType, timeWindow),
    cache: getCache(),
    ttl: 1000 * 60 * 10, // 10분 캐싱
    staleWhileRevalidate: 1000 * 60 * 60, // 1시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb(`/trending/${mediaType}/${timeWindow}`);
    },
  });
}

// 영화 관련 API (캐싱 적용)
export async function getPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
  return cachified({
    key: createCacheKey('movies', 'popular', page),
    cache: getCache(),
    ttl: 1000 * 60 * 30, // 30분 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 2, // 2시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/movie/popular', { page: String(page) });
    },
  });
}

export async function getNowPlayingMovies(page = 1): Promise<ApiResponse<Movie>> {
  return cachified({
    key: createCacheKey('movies', 'now_playing', page),
    cache: getCache(),
    ttl: 1000 * 60 * 15, // 15분 캐싱 (자주 업데이트될 수 있음)
    staleWhileRevalidate: 1000 * 60 * 60, // 1시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/movie/now_playing', { page: String(page) });
    },
  });
}

export async function getUpcomingMovies(page = 1): Promise<ApiResponse<Movie>> {
  return cachified({
    key: createCacheKey('movies', 'upcoming', page),
    cache: getCache(),
    ttl: 1000 * 60 * 60, // 1시간 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 4, // 4시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/movie/upcoming', { page: String(page) });
    },
  });
}

export async function getTopRatedMovies(page = 1): Promise<ApiResponse<Movie>> {
  return cachified({
    key: createCacheKey('movies', 'top_rated', page),
    cache: getCache(),
    ttl: 1000 * 60 * 60 * 2, // 2시간 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 6, // 6시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/movie/top_rated', { page: String(page) });
    },
  });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return cachified({
    key: createCacheKey('movie', 'details', id),
    cache: getCache(),
    ttl: 1000 * 60 * 60 * 24, // 24시간 캐싱 (상세 정보는 잘 변하지 않음)
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7, // 7일 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb(`/movie/${id}`, {
        append_to_response: 'videos,credits',
      });
    },
  });
}

export async function getMovieCredits(id: number): Promise<CreditsResponse> {
  return fetchFromTMDb(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: number): Promise<VideoResponse> {
  return fetchFromTMDb(`/movie/${id}/videos`);
}

export async function getSimilarMovies(
  id: number,
  page = 1
): Promise<ApiResponse<Movie>> {
  return fetchFromTMDb(`/movie/${id}/similar`, { page: String(page) });
}

// TV 프로그램 관련 API (캐싱 적용)
export async function getPopularTvShows(page = 1): Promise<ApiResponse<TvShow>> {
  return cachified({
    key: createCacheKey('tv', 'popular', page),
    cache: getCache(),
    ttl: 1000 * 60 * 30, // 30분 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 2, // 2시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/tv/popular', { page: String(page) });
    },
  });
}

export async function getAiringTodayTvShows(page = 1): Promise<ApiResponse<TvShow>> {
  return cachified({
    key: createCacheKey('tv', 'airing_today', page),
    cache: getCache(),
    ttl: 1000 * 60 * 10, // 10분 캐싱 (오늘 방영 목록은 자주 업데이트)
    staleWhileRevalidate: 1000 * 60 * 30, // 30분 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/tv/airing_today', { page: String(page) });
    },
  });
}

export async function getOnTheAirTvShows(page = 1): Promise<ApiResponse<TvShow>> {
  return cachified({
    key: createCacheKey('tv', 'on_the_air', page),
    cache: getCache(),
    ttl: 1000 * 60 * 15, // 15분 캐싱
    staleWhileRevalidate: 1000 * 60 * 60, // 1시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/tv/on_the_air', { page: String(page) });
    },
  });
}

export async function getTopRatedTvShows(page = 1): Promise<ApiResponse<TvShow>> {
  return cachified({
    key: createCacheKey('tv', 'top_rated', page),
    cache: getCache(),
    ttl: 1000 * 60 * 60 * 2, // 2시간 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 6, // 6시간 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/tv/top_rated', { page: String(page) });
    },
  });
}

export async function getTvShowDetails(id: number): Promise<TvShowDetails> {
  return cachified({
    key: createCacheKey('tv', 'details', id),
    cache: getCache(),
    ttl: 1000 * 60 * 60 * 24, // 24시간 캐싱
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7, // 7일 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb(`/tv/${id}`, {
        append_to_response: 'videos,credits',
      });
    },
  });
}

export async function getTvCredits(id: number): Promise<CreditsResponse> {
  return fetchFromTMDb(`/tv/${id}/credits`);
}

export async function getTvVideos(id: number): Promise<VideoResponse> {
  return fetchFromTMDb(`/tv/${id}/videos`);
}

export async function getSimilarTvShows(
  id: number,
  page = 1
): Promise<ApiResponse<TvShow>> {
  return fetchFromTMDb(`/tv/${id}/similar`, { page: String(page) });
}

// 검색 관련 API (캐싱 적용)
export async function searchMulti(
  query: string,
  page = 1
): Promise<ApiResponse<SearchResult>> {
  return cachified({
    key: createCacheKey('search', 'multi', query, page),
    cache: getCache(),
    ttl: 1000 * 60 * 5, // 5분 캐싱 (검색 결과는 짧게 캐싱)
    staleWhileRevalidate: 1000 * 60 * 15, // 15분 동안 stale 데이터 허용
    async getFreshValue() {
      return fetchFromTMDb('/search/multi', {
        query: encodeURIComponent(query),
        page: String(page),
      });
    },
  });
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<ApiResponse<Movie>> {
  return fetchFromTMDb('/search/movie', {
    query: encodeURIComponent(query),
    page: String(page),
  });
}

export async function searchTvShows(
  query: string,
  page = 1
): Promise<ApiResponse<TvShow>> {
  return fetchFromTMDb('/search/tv', {
    query: encodeURIComponent(query),
    page: String(page),
  });
}

// 장르 관련 API
export async function getMovieGenres(): Promise<GenreResponse> {
  return fetchFromTMDb('/genre/movie/list');
}

export async function getTvGenres(): Promise<GenreResponse> {
  return fetchFromTMDb('/genre/tv/list');
}

// 장르별 영화 가져오기
export async function getMoviesByGenre(
  genreIds: number[],
  page = 1,
  sortBy = 'popularity.desc'
): Promise<ApiResponse<Movie>> {
  return fetchFromTMDb('/discover/movie', {
    page: String(page),
    sort_by: sortBy,
    with_genres: genreIds.join(','),
  });
}

// 장르별 TV 프로그램 가져오기
export async function getTvShowsByGenre(
  genreIds: number[],
  page = 1,
  sortBy = 'popularity.desc'
): Promise<ApiResponse<TvShow>> {
  return fetchFromTMDb('/discover/tv', {
    page: String(page),  
    sort_by: sortBy,
    with_genres: genreIds.join(','),
  });
}

// 유틸리티 함수
export function getImageUrl(
  path: string | null,
  size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getPosterUrl(path: string | null): string | null {
  return getImageUrl(path, 'w500');
}

export function getBackdropUrl(path: string | null): string | null {
  return getImageUrl(path, 'w1280');
}

export function getProfileUrl(path: string | null): string | null {
  return getImageUrl(path, 'w200');
}

// 날짜 포맷팅
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// 평점 포맷팅
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// 런타임 포맷팅 (분 -> 시간)
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
}

// 캐싱 헬퍼 (Remix의 Response.json 활용)
export function getCachedResponse<T>(
  data: T,
  cacheControl = 'public, max-age=3600, s-maxage=3600'
) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheControl,
    },
  });
}