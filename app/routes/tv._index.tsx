import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { 
  getTopRatedTvShows, 
  getPopularTvShows, 
  getAiringTodayTvShows,
  type TvShow 
} from "~/services/tmdb.server";
import { createCacheHeaders } from "~/utils/cache.server";
import { Loader } from "~/components/ui/Loader";
import { Message } from "~/components/ui/Message";
import { Poster } from "~/components/Poster";
import { Section } from "~/components/Section";

export const meta: MetaFunction = () => {
  return [
    { title: "TV Shows | yjsflix" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [topRatedData, popularData, airingTodayData] = await Promise.all([
      getTopRatedTvShows(),
      getPopularTvShows(),
      getAiringTodayTvShows()
    ]);

    return json(
      {
        topRated: topRatedData.results || [],
        popular: popularData.results || [],
        airingToday: airingTodayData.results || [],
      },
      {
        headers: createCacheHeaders(600) // 10분 브라우저 캐싱
      }
    );
  } catch (error) {
    console.error("Failed to load TV shows:", error);
    return json({
      topRated: [],
      popular: [],
      airingToday: [],
      error: error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."
    });
  }
}

export default function TV() {
  const data = useLoaderData<typeof loader>();
  const { topRated, popular, airingToday } = data;
  const error = (data as any).error;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {topRated && topRated.length > 0 && (
              <Section title="Top Rated Shows">
                {topRated.map((show: TvShow) => (
                  <Poster
                    key={show.id}
                    id={show.id}
                    imageUrl={show.poster_path}
                    title={show.original_name || show.name}
                    rating={show.vote_average}
                    year={show.first_air_date?.substring(0, 4)}
                    isMovie={false}
                  />
                ))}
              </Section>
            )}
            {popular && popular.length > 0 && (
              <Section title="Popular Shows">
                {popular.map((show: TvShow) => (
                  <Poster
                    key={show.id}
                    id={show.id}
                    imageUrl={show.poster_path}
                    title={show.original_name || show.name}
                    rating={show.vote_average}
                    year={show.first_air_date?.substring(0, 4)}
                    isMovie={false}
                  />
                ))}
              </Section>
            )}
            {airingToday && airingToday.length > 0 && (
              <Section title="Airing Today">
                {airingToday.map((show: TvShow) => (
                  <Poster
                    key={show.id}
                    id={show.id}
                    imageUrl={show.poster_path}
                    title={show.original_name || show.name}
                    rating={show.vote_average}
                    year={show.first_air_date?.substring(0, 4)}
                    isMovie={false}
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