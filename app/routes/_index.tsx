import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation, Link } from "@remix-run/react";
import { getTrending, type Movie, type TvShow } from "~/services/tmdb.server";
import { createCacheHeaders } from "~/utils/cache.server";
import { useState, useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "YJSFLIX" }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const trendingData = await getTrending('movie', 'week');
    return json(
      {
        trendingData: trendingData.results || []
      },
      {
        headers: createCacheHeaders(300) // 5분 브라우저 캐싱
      }
    );
  } catch (error) {
    console.error('Failed to load homepage data:', error);
    return json({
      trendingData: [],
      error: error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."
    });
  }
}

// Loader 컴포넌트
function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-200"></div>
    </div>
  );
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


// Carousel 컴포넌트
function Carousel({ trendingData }: { trendingData: Movie[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const sortedData = trendingData
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sortedData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sortedData.length]);

  if (!sortedData.length) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {sortedData.map((data, index) => (
        <div
          key={data.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-screen bg-center bg-cover opacity-60"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
            }}
          />
          <div className="absolute w-full left-20 bottom-32 text-white">
            <h1 className="text-5xl font-bold mb-4">
              {index + 1}. {data.title || data.original_title}
            </h1>
            <div className="w-2/5 mt-5 text-gray-400 text-lg">
              {data.overview && data.overview.length > 120
                ? `${data.overview.substring(0, 120)}...`
                : data.overview}
            </div>
            <div className="mt-7">
              <Link
                to={`/movies/${data.id}`}
                className="inline-block px-6 py-3 rounded-md bg-gray-500 bg-opacity-60 hover:bg-opacity-40 transition-all"
              >
                View Detail
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sortedData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const trendingData = data.trendingData as Movie[];
  const error = (data as any).error;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-black text-white">
          <Carousel trendingData={trendingData as Movie[]} />
          {error && <Message text={error} color="#e50914" />}
        </div>
      )}
    </>
  );
}