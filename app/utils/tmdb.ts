// TMDB 유틸리티 함수들 (클라이언트 & 서버 공용)

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// 이미지 URL 생성
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