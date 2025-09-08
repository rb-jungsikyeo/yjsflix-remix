import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { useState } from "react";
import { searchMovies, searchTvShows } from "~/services/tmdb.server";
import type { Movie, TvShow } from "~/services/tmdb.server";
import { Loader } from "~/components/ui/Loader";
import { Message } from "~/components/ui/Message";
import { Section } from "~/components/Section";
import { Poster } from "~/components/Poster";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  
  if (!query) {
    return json({ 
      movieResults: [] as Movie[], 
      tvResults: [] as TvShow[],
      query: "",
      error: null 
    });
  }
  
  try {
    // 영화와 TV 프로그램 검색을 병렬로 실행
    const [movieData, tvData] = await Promise.all([
      searchMovies(query),
      searchTvShows(query)
    ]);
    
    return json({
      movieResults: movieData.results,
      tvResults: tvData.results,
      query,
      error: null,
    });
  } catch (error) {
    console.error("Search error:", error);
    return json({ 
      movieResults: [] as Movie[],
      tvResults: [] as TvShow[],
      query,
      error: "검색 중 오류가 발생했습니다."
    });
  }
};

export default function Search() {
  const { movieResults, tvResults, query, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState(query);
  
  const isSearching = navigation.state === "loading" || navigation.state === "submitting";
  const searching = query !== "";
  const totalResults = movieResults.length + tvResults.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const value = formData.get("query") as string;
    
    if (!value || value.trim() === "") {
      event.preventDefault();
      return;
    }
  };

  const updateTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="p-10">
        <Form 
          method="get" 
          onSubmit={handleSubmit}
          className="w-full mt-14 mb-10 flex justify-center"
        >
          <input
            type="text"
            name="query"
            placeholder="Search Movies or TV Shows..."
            value={searchTerm}
            onChange={updateTerm}
            className="w-1/2 ml-4 text-4xl text-gray-100 border-0 outline-none bg-transparent text-center"
          />
        </Form>

        {searching ? (
          isSearching ? (
            <Loader />
          ) : (
            <>
              {totalResults > 0 && (
                <div className="mb-10">
                  <Message 
                    color="#000000" 
                    text={`Result Count : ${totalResults}`} 
                  />
                </div>
              )}

              {movieResults && movieResults.length > 0 && (
                <Section title="Movie Results">
                  {movieResults.map((movie) => (
                    <Poster
                      key={movie.id}
                      id={movie.id}
                      imageUrl={movie.poster_path}
                      title={movie.title || movie.original_title}
                      rating={movie.vote_average}
                      year={movie.release_date?.substring(0, 4)}
                      isMovie={true}
                    />
                  ))}
                </Section>
              )}

              {tvResults && tvResults.length > 0 && (
                <Section title="TV Show Results">
                  {tvResults.map((show) => (
                    <Poster
                      key={show.id}
                      id={show.id}
                      imageUrl={show.poster_path}
                      title={show.name || show.original_name}
                      rating={show.vote_average}
                      year={show.first_air_date?.substring(0, 4)}
                      isMovie={false}
                    />
                  ))}
                </Section>
              )}

              {error && <Message color="#e74c3c" text={error} />}
              
              {tvResults.length === 0 && movieResults.length === 0 && !error && (
                <Message color="#95a5a6" text="Nothing found" />
              )}
            </>
          )
        ) : null}
      </div>
    </>
  );
}