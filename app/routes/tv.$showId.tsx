import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTvShowDetails, type TvShowDetails } from "~/services/tmdb.server";
import { createCacheHeaders } from "~/utils/cache.server";
import { Star } from "~/components/ui/Star";
import { Message } from "~/components/ui/Message";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Loading | yjsflix" }];
  }
  return [
    { title: `${data.result.name || data.result.original_name} | yjsflix` },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const showId = params.showId;
  
  if (!showId || isNaN(Number(showId))) {
    throw new Response("Invalid TV show ID", { status: 400 });
  }
  
  try {
    const tvShowDetails = await getTvShowDetails(Number(showId));
    
    return json(
      { 
        result: tvShowDetails
      },
      {
        headers: createCacheHeaders(3600) // 1시간 브라우저 캐싱
      }
    );
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
    throw new Response("TV show not found", { status: 404 });
  }
};

// Seasons Tab 컴포넌트
function SeasonsTab({ seasons }: { seasons?: any[] }) {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="flex justify-center items-center p-5 bg-gray-500 bg-opacity-20">
        <Message color="#e74c3c" text="No data." />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5 p-5 bg-gray-500 bg-opacity-20">
      {seasons.map((season: any) => (
        <div key={season.id} className="w-full h-72 flex flex-col">
          <img
            src={
              season.poster_path
                ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E`
            }
            alt={season.name}
            className="w-full h-64 object-cover rounded"
          />
          <span className="mt-4 text-white">{season.name}</span>
        </div>
      ))}
    </div>
  );
}

// Tabs 컴포넌트 (TV용)
function TvTabs({ videos, seasons }: { videos?: { results: any[] }, seasons?: any[] }) {
  const hasVideos = videos?.results && videos.results.length > 0;
  const hasSeasons = seasons && seasons.length > 0;
  
  if (!hasVideos && !hasSeasons) {
    return (
      <div className="p-5 bg-gray-500 bg-opacity-20">
        <Message color="#e74c3c" text="No data." />
      </div>
    );
  }
  
  // 시즌이 있으면 시즌을 우선 표시
  if (hasSeasons) {
    return <SeasonsTab seasons={seasons} />;
  }
  
  // 비디오만 있으면 비디오 표시
  return (
    <div className="p-5 bg-gray-500 bg-opacity-20">
      <h3 className="text-lg font-semibold mb-4">Videos</h3>
      <div className="space-y-2">
        {videos?.results.slice(0, 3).map((video: any) => (
          <div key={video.id} className="text-sm">
            <span className="text-blue-400">{video.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TvShowDetail() {
  const { result } = useLoaderData<typeof loader>();

  return (
    <div className="w-full h-screen relative bg-black text-white">
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
              {result.name || result.original_name}
            </span>
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
              📅 {result.first_air_date?.substring(0, 4)}
            </span>
            <span className="mx-4">•</span>
            <span>
              ⏱ {result.episode_run_time && result.episode_run_time[0]} min
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
                ?.filter((crew: any) => crew.job === "Director" || crew.department === "Directing")
                .map((crew: any, index: number) => (
                  <span key={crew.id} className="text-blue-400">
                    {index > 0 ? " / " : ""} {crew.name}
                  </span>
                ))}
            </div>
            <div className="mb-5">
              <span>Stars: </span>
              {result.credits?.cast
                ?.slice(0, 5)
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
            <TvTabs videos={result.videos} seasons={result.seasons} />
          </div>
        </div>
      </div>
    </div>
  );
}