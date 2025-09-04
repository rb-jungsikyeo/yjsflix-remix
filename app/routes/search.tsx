import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { useState } from "react";
import { searchMulti } from "~/services/tmdb.server";
import type { Movie, TvShow } from "~/services/tmdb.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Search | yjsflix" },
    { name: "description", content: "Search for movies and TV shows" },
  ];
};

interface SearchResultMovie extends Movie {
  media_type: 'movie';
}

interface SearchResultTV extends TvShow {
  media_type: 'tv';
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";
  
  if (!query) {
    return json({ 
      movieResults: [] as SearchResultMovie[], 
      tvResults: [] as SearchResultTV[],
      query: "",
      error: null 
    });
  }
  
  try {
    const searchData = await searchMulti(query);
    
    // 영화와 TV로 분리
    const movieResults = searchData.results
      .filter(item => item.media_type === 'movie')
      .map(item => ({
        ...item,
        media_type: 'movie' as const
      })) as SearchResultMovie[];
    
    const tvResults = searchData.results
      .filter(item => item.media_type === 'tv')
      .map(item => ({
        ...item,
        media_type: 'tv' as const
      })) as SearchResultTV[];
    
    return json({
      movieResults,
      tvResults,
      query,
      error: null,
    });
  } catch (error) {
    console.error("Search error:", error);
    return json({ 
      movieResults: [] as SearchResultMovie[],
      tvResults: [] as SearchResultTV[],
      query,
      error: "검색 중 오류가 발생했습니다."
    });
  }
};

// 별점을 별 아이콘으로 변환하는 컴포넌트
function Star({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2);
  const emptyStars = 5 - stars;
  const starString = '★'.repeat(stars) + '☆'.repeat(emptyStars);
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-500">{starString}</span>
      <span className="text-gray-400">{rating.toFixed(1)}/10</span>
    </div>
  );
}

// 포스터 컴포넌트
function Poster({ 
  id, 
  imageUrl, 
  title, 
  rating, 
  year, 
  isMovie = false 
}: {
  id: number;
  imageUrl: string | null;
  title: string;
  rating: number;
  year?: string;
  isMovie?: boolean;
}) {
  const linkPath = isMovie ? `/movies/${id}` : `/tv/${id}`;
  
  return (
    <Link to={linkPath} className="block text-center group">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[2/3] mb-2">
        {imageUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w342${imageUrl}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-500 text-4xl">{isMovie ? '🎬' : '📺'}</span>
          </div>
        )}
      </div>
      <div className="text-left">
        {rating > 0 && <Star rating={rating} />}
        <h3 className="text-sm font-medium text-gray-100 truncate mt-1">
          {title}
        </h3>
        {year && (
          <p className="text-xs text-gray-500 mt-1">{year}</p>
        )}
      </div>
    </Link>
  );
}

// Section 컴포넌트
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-5 text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {children}
      </div>
    </div>
  );
}

// Message 컴포넌트  
function Message({ color, text }: { color: string; text: string }) {
  return (
    <div 
      className="text-center py-3 px-5 rounded"
      style={{ backgroundColor: color === "#000000" ? "#ffc107" : color }}
    >
      <span className={color === "#000000" ? "text-black" : "text-white"}>
        {text}
      </span>
    </div>
  );
}

// Loader 컴포넌트
function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-200"></div>
    </div>
  );
}

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </li>
      </ul>
    </header>
  );
}

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
      <Header />
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
            style={{ borderBottom: "2px solid transparent" }}
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