import { Link } from "@remix-run/react";
import noPosterSmall from "~/assets/noPosterSmall.png";
import { Star } from "~/components/ui/Star";

interface PosterProps {
  id: number;
  imageUrl: string | null;
  title: string;
  rating?: number;
  year?: string;
  isMovie?: boolean;
}

export function Poster({
  id,
  imageUrl,
  title,
  rating,
  year,
  isMovie = false,
}: PosterProps) {
  return (
    <Link to={isMovie ? `/movies/${id}` : `/tv/${id}`}>
      <div className="text-sm">
        <div className="mb-1 relative group overflow-hidden rounded-lg">
          <img
            className="h-48 transition-transform duration-300 group-hover:scale-110"
            src={
              imageUrl
                ? `https://image.tmdb.org/t/p/w300${imageUrl}`
                : noPosterSmall
            }
            alt={title}
          />
          {rating && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">
                <span role="img" aria-label="rating">
                  <Star rating={rating} />
                </span>{" "}
                {rating.toFixed(1)}/10
              </span>
            </div>
          )}
        </div>
        <span className="block mb-0.5 overflow-hidden whitespace-nowrap text-ellipsis">
          {title}
        </span>
        <span className="text-xs text-gray-500">{year}</span>
      </div>
    </Link>
  );
}