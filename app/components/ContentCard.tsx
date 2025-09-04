import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import type { Movie, TvShow } from "~/services/tmdb.server";
import { getPosterUrl, formatRating } from "~/utils/tmdb";
import { Badge, RatingBadge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";

interface ContentCardProps {
  item: Movie | TvShow;
  type?: "movie" | "tv";
}

export function ContentCard({ item, type = "movie" }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const posterUrl = getPosterUrl(item.poster_path);
  const title = "title" in item ? item.title : item.name;
  const releaseDate = "release_date" in item ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "";

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden cursor-pointer group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.05, 
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
    >
      <Link to={`/${type}/${item.id}`}>
        <div className="aspect-[2/3] relative overflow-hidden bg-gray-800">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Hover Overlay */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {/* Content Info */}
        {isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
              {title}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <RatingBadge rating={item.vote_average} />
              <span className="text-gray-400 text-sm">{releaseYear}</span>
              {type === "tv" && (
                <Badge variant="info" size="sm">
                  TV
                </Badge>
              )}
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {item.overview || "설명이 없습니다."}
            </p>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                재생
              </Button>
              <Button size="sm" variant="ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
              <Button size="sm" variant="ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
            </div>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}