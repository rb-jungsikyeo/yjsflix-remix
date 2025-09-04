interface StarProps {
  rating: number;
}

export function Star({ rating }: StarProps) {
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