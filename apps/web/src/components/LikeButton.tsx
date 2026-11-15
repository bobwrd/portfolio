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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
        liked
          ? "border-warm-accent bg-warm-accent-muted text-warm-accent cursor-default"
          : "border-border text-muted-foreground hover:border-warm-accent hover:text-warm-accent"
      }`}
      aria-label={liked ? "Liked" : "Like this post"}
    >
      <Heart
        className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
      />
      <span>{count === null ? "…" : count}</span>
    </button>
  );
}
