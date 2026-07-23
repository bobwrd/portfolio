import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getLikes, addLike } from "@/lib/api";

interface LikeButtonProps {
  contentType: string;
  slug: string;
}

export default function LikeButton({ contentType, slug }: LikeButtonProps) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLikes(contentType, slug).then(setCount);
    const key = `liked:${contentType}:${slug}`;
    setLiked(localStorage.getItem(key) === "1");
  }, [contentType, slug]);

  async function handleLike() {
    if (liked || loading) return;
    setLoading(true);
    const newCount = await addLike(contentType, slug);
    setCount(newCount);
    setLiked(true);
    localStorage.setItem(`liked:${contentType}:${slug}`, "1");
    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
        liked
          ? "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400 cursor-default"
          : "border-border text-muted-foreground hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
      }`}
      aria-label={liked ? "Liked" : "Like this post"}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${liked ? "fill-rose-500 text-rose-500 scale-110" : ""}`}
      />
      <span>{count === null ? "·" : count}</span>
    </button>
  );
}
