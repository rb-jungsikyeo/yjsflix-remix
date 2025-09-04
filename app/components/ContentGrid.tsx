import { Link } from "@remix-run/react";
import { ContentCard } from "./ContentCard";
import { StaggerChildren, StaggerItem } from "./animations/StaggerChildren";
import type { Movie, TvShow } from "~/services/tmdb.server";

interface ContentGridProps {
  items: (Movie | TvShow)[];
  type?: "movie" | "tv" | "mixed";
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  enablePrefetch?: boolean;
}

export function ContentGrid({
  items,
  type = "mixed",
  columns = {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },
  enablePrefetch = true
}: ContentGridProps) {
  const getGridClasses = () => {
    const { xs = 2, sm = 2, md = 3, lg = 4, xl = 5 } = columns;
    return `grid grid-cols-${xs} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-4`;
  };

  const getItemType = (item: Movie | TvShow): "movie" | "tv" => {
    if (type !== "mixed") return type;
    return "title" in item ? "movie" : "tv";
  };

  const getItemUrl = (item: Movie | TvShow, itemType: "movie" | "tv") => {
    return itemType === "movie" ? `/movie/${item.id}` : `/show/${item.id}`;
  };

  return (
    <StaggerChildren className={getGridClasses()}>
      {items.map((item) => {
        const itemType = getItemType(item);
        const itemUrl = getItemUrl(item, itemType);

        return (
          <StaggerItem key={`${itemType}-${item.id}`}>
            {enablePrefetch ? (
              <Link to={itemUrl} prefetch="intent">
                <ContentCard item={item} type={itemType} />
              </Link>
            ) : (
              <ContentCard item={item} type={itemType} />
            )}
          </StaggerItem>
        );
      })}
    </StaggerChildren>
  );
}

// 동적으로 로딩하기 위한 비동기 버전
export function ContentGridWithLoading({
  items,
  isLoading,
  loadingCount = 20,
  ...props
}: ContentGridProps & {
  isLoading?: boolean;
  loadingCount?: number;
}) {
  if (isLoading) {
    return <SkeletonContentGrid count={loadingCount} columns={props.columns} />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return <ContentGrid items={items} {...props} />;
}

// 스켈레톤 그리드 컴포넌트
function SkeletonContentGrid({
  count = 20,
  columns = {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  }
}: {
  count?: number;
  columns?: ContentGridProps["columns"];
}) {
  const { xs = 2, sm = 2, md = 3, lg = 4, xl = 5 } = columns;
  const gridClasses = `grid grid-cols-${xs} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-4`;

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden bg-gray-900 animate-pulse">
          <div className="aspect-[2/3] w-full bg-gray-800" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-800 rounded" />
            <div className="h-3 w-1/2 bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}