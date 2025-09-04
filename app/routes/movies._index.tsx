import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { 
  getPopularMovies, 
  getNowPlayingMovies, 
  getUpcomingMovies,
  type Movie 
} from "~/services/tmdb.server";
import { createCacheHeaders } from "~/utils/cache.server";
import { Loader } from "~/components/ui/Loader";
import { Message } from "~/components/ui/Message";
import { Poster } from "~/components/Poster";
import { Section } from "~/components/Section";

export const meta: MetaFunction = () => {
  return [
    { title: "Movies | yjsflix" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [nowPlayingData, upcomingData, popularData] = await Promise.all([
      getNowPlayingMovies(),
      getUpcomingMovies(),
      getPopularMovies()
    ]);

    return json(
      {
        nowPlaying: nowPlayingData.results || [],
        upcoming: upcomingData.results || [],
        popular: popularData.results || [],
      },
      {
        headers: createCacheHeaders(600) // 10분 브라우저 캐싱
      }
    );
  } catch (error) {
    console.error("Failed to load movies:", error);
    return json({
      nowPlaying: [],
      upcoming: [],
      popular: [],
      error: error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."
    });
  }
}

export default function Movies() {
  const data = useLoaderData<typeof loader>();
  const { nowPlaying, upcoming, popular } = data;
  const error = (data as any).error;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {nowPlaying && nowPlaying.length > 0 && (
            <Section title="Now Playing">
              {nowPlaying.map((movie: Movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  imageUrl={movie.poster_path}
                  title={movie.original_title || movie.title}
                  rating={movie.vote_average}
                  year={movie.release_date?.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {upcoming && upcoming.length > 0 && (
            <Section title="Upcoming Movies">
              {upcoming.map((movie: Movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  imageUrl={movie.poster_path}
                  title={movie.original_title || movie.title}
                  rating={movie.vote_average}
                  year={movie.release_date?.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {popular && popular.length > 0 && (
            <Section title="Popular Movies">
              {popular.map((movie: Movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  imageUrl={movie.poster_path}
                  title={movie.original_title || movie.title}
                  rating={movie.vote_average}
                  year={movie.release_date?.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {error && <Message text={error} />}
        </div>
      )}
    </>
  );
}