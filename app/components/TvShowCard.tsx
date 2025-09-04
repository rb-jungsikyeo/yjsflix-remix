import { Link } from "@remix-run/react";
import type { TvShow } from "~/services/tmdb.server";
import { getPosterUrl, formatRating } from "~/utils/tmdb";

interface TvShowCardProps {
  show: TvShow;
}

export default function TvShowCard({ show }: TvShowCardProps) {
  const posterUrl = getPosterUrl(show.poster_path);
  const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  
  return (
    <Link 
      to={`/tv/${show.id}`}
      className="group block hover-scale transition-transform duration-300"
    >
      <div className="bg-gray-800 rounded-lg overflow-hidden card-shadow hover:ring-2 hover:ring-blue-600 transition-all duration-300">
        {/* 포스터 이미지 */}
        <div className="aspect-[2/3] relative overflow-hidden bg-gray-700">
          {posterUrl ? (
            <>
              <img
                src={posterUrl}
                alt={show.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* 호버 시 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-gray-300 line-clamp-3">
                    {show.overview || "설명이 없습니다."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* TV 쇼 배지 */}
          <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-xs font-medium text-white">TV</span>
          </div>
          
          {/* 평점 배지 */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-white">
              {formatRating(show.vote_average)}
            </span>
          </div>
        </div>
        
        {/* TV 쇼 정보 */}
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {show.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {firstAirYear}
          </p>
        </div>
      </div>
    </Link>
  );
}