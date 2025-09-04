import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { getMovieDetails, type MovieDetails } from "~/services/tmdb.server";
import { createCacheHeaders } from "~/utils/cache.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Loading | yjsflix" }];
  }
  return [
    { title: `${data.result.title || data.result.original_title} | yjsflix` },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const movieId = params.movieId;
  
  if (!movieId || isNaN(Number(movieId))) {
    throw new Response("Invalid movie ID", { status: 400 });
  }
  
  try {
    const movieDetails = await getMovieDetails(Number(movieId));
    
    return json(
      { 
        result: movieDetails
      },
      {
        headers: createCacheHeaders(3600) // 1시간 브라우저 캐싱
      }
    );
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    throw new Response("Movie not found", { status: 404 });
  }
};

// Header 컴포넌트
function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-12 bg-black/50 backdrop-blur z-10 flex items-center justify-between px-6">
      <ul className="flex items-center gap-6">
        <li>
          <Link to="/" className="flex items-center">
            <img 
              src="https://fontmeme.com/permalink/240824/d959bb0c11a6fa9f5a0f8e8e92e1c880.png" 
              alt="yjsflix"
              className="h-6"
            />
          </Link>
        </li>
        <li>
          <Link to="/" className="text-white hover:text-gray-300 text-sm">
            Home
          </Link>
        </li>
        <li>
          <Link to="/movies" className="text-white hover:text-gray-300 text-sm">
            Movies
          </Link>
        </li>
        <li>
          <Link to="/tv" className="text-white hover:text-gray-300 text-sm">
            TV
          </Link>
        </li>
      </ul>
      <ul className="flex items-center">
        <li>
          <Link to="/search">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0z" />
            </svg>
          </Link>
        </li>
      </ul>
    </header>
  );
}

// Star 컴포넌트
function Star({ rating }: { rating: number }) {
  let ratingStar = "";
  const star = "★";
  const halfRating = rating / 2;
  
  for (let i = 1; i <= halfRating; i++) {
    ratingStar += star;
  }
  if (`${halfRating}`.split(".").length > 1) {
    ratingStar += "☆";
  }

  return <span className="text-sm text-yellow-200">{ratingStar}</span>;
}

// Message 컴포넌트
function Message({ text, color }: { text: string; color: string }) {
  return (
    <div 
      className="text-center py-3 px-5 rounded"
      style={{ backgroundColor: color }}
    >
      <span className="text-white">{text}</span>
    </div>
  );
}

// IMDb 버튼 컴포넌트
function ImdbButton({ imdbId }: { imdbId: string | null }) {
  if (!imdbId) return null;
  
  return (
    <button
      onClick={() => window.open(`https://www.imdb.com/title/${imdbId}`, "_blank")}
      className="text-yellow-400 hover:text-yellow-300 text-lg font-bold"
    >
      IMDb
    </button>
  );
}

// Tabs 컴포넌트 (단순화)
function SimpleTabs({ videos }: { videos?: { results: any[] } }) {
  if (!videos?.results || videos.results.length === 0) {
    return (
      <div className="p-5 bg-gray-500 bg-opacity-20">
        <Message color="#e74c3c" text="No data." />
      </div>
    );
  }
  
  return (
    <div className="p-5 bg-gray-500 bg-opacity-20">
      <h3 className="text-lg font-semibold mb-4">Videos</h3>
      <div className="space-y-2">
        {videos.results.slice(0, 3).map((video: any) => (
          <div key={video.id} className="text-sm">
            <span className="text-blue-400">{video.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieDetail() {
  const { result } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="w-full h-screen relative pt-12 bg-black text-white">
        {/* 배경 이미지 */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-center bg-cover filter blur-sm opacity-50 z-0"
          style={{
            backgroundImage: result.backdrop_path 
              ? `url(https://image.tmdb.org/t/p/original${result.backdrop_path})`
              : 'none',
          }}
        />
        
        {/* 콘텐츠 */}
        <div className="relative w-full h-full flex p-10 z-10">
          {/* 포스터 */}
          <div
            className="w-4/12 h-full bg-center bg-cover rounded-lg hidden md:block"
            style={{
              backgroundImage: result.poster_path
                ? `url(https://image.tmdb.org/t/p/original${result.poster_path})`
                : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E")`,
            }}
          />
          
          {/* 정보 */}
          <div className="mt-5 w-full md:w-8/12 md:ml-10">
            <div className="flex justify-between items-start">
              <span className="text-4xl font-black uppercase">
                {result.title || result.original_title}
              </span>
              <ImdbButton imdbId={result.imdb_id || null} />
            </div>
            
            {/* 메타 정보 */}
            <div className="my-4 text-base">
              <span>
                {result.genres &&
                  result.genres.map((genre: any, index: number) =>
                    index === result.genres!.length - 1
                      ? genre.name
                      : `${genre.name} / `
                  )}
              </span>
              <span className="mx-4">•</span>
              <span>
                📅 {result.release_date?.substring(0, 4)}
              </span>
              <span className="mx-4">•</span>
              <span>
                ⏱ {result.runtime} min
              </span>
              <span className="mx-4">•</span>
              <span>
                {result.vote_average && <Star rating={result.vote_average / 2} />}{" "}
                ({result.vote_average})
              </span>
            </div>
            
            {/* 감독과 출연진 */}
            <div>
              <div>
                <span>Director: </span>
                {result.credits?.crew
                  .filter((crew: any) => crew.job === "Director")
                  .map((crew: any, index: number) => (
                    <span key={crew.id} className="text-blue-400">
                      {index > 0 ? " / " : ""} {crew.name}
                    </span>
                  ))}
              </div>
              <div className="mb-5">
                <span>Stars: </span>
                {result.credits?.cast
                  .slice(0, 5)
                  .map((cast: any, index: number) => (
                    <span key={cast.id} className="text-blue-400">
                      {index > 0 ? " / " : ""} {cast.name}
                    </span>
                  ))}
              </div>
            </div>
            
            {/* 줄거리 */}
            <p className="w-full opacity-70 font-thin">{result.overview}</p>
            
            {/* 탭 */}
            <div className="w-full h-full mt-10">
              <SimpleTabs videos={result.videos} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}