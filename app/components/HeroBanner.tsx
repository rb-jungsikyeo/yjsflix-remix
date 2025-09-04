import { Link } from "@remix-run/react";
import type { Movie, TvShow } from "~/services/tmdb.server";
import { getBackdropUrl, formatRating } from "~/utils/tmdb";

interface HeroBannerProps {
  item: Movie | TvShow;
  type: 'movie' | 'tv';
}

export default function HeroBanner({ item, type }: HeroBannerProps) {
  const backdropUrl = getBackdropUrl(item.backdrop_path);
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-end">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>
      
      {/* 컨텐츠 */}
      <div className="relative z-10 container-custom pb-16">
        <div className="max-w-3xl">
          {/* 타입 배지 */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
            type === 'movie' ? 'bg-red-600' : 'bg-blue-600'
          } text-white`}>
            {type === 'movie' ? '영화' : 'TV 프로그램'}
          </span>
          
          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          
          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
            {/* 평점 */}
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{formatRating(item.vote_average)}</span>
              <span className="text-gray-400">({item.vote_count.toLocaleString()} 평가)</span>
            </div>
            
            {/* 연도 */}
            {releaseYear && (
              <span>{releaseYear}</span>
            )}
            
            {/* 인기도 */}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              인기도: {Math.round(item.popularity)}
            </span>
          </div>
          
          {/* 개요 */}
          <p className="text-gray-300 text-lg line-clamp-3 mb-8">
            {item.overview || "줄거리 정보가 없습니다."}
          </p>
          
          {/* 액션 버튼 */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={type === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              상세 정보
            </Link>
            
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                alert('준비 중인 기능입니다');
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              내 리스트에 추가
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}