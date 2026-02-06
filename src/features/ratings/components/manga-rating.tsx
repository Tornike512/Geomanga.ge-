"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { useCurrentUser } from "@/features/auth";
import {
  useDeleteRating,
  useMangaRating,
  useSubmitRating,
  useUserRating,
} from "../hooks";

interface MangaRatingProps {
  mangaId: number;
}

export function MangaRating({ mangaId }: MangaRatingProps) {
  const { data: user } = useCurrentUser();
  const { data: mangaRating } = useMangaRating(mangaId);
  const { data: userRating } = useUserRating(mangaId);
  const submitRating = useSubmitRating();
  const deleteRating = useDeleteRating();

  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  const currentScore = userRating?.rating || 0;
  const displayScore = hoveredScore ?? currentScore;

  const handleRate = (score: number) => {
    if (!user) return;
    submitRating.mutate({ manga_id: mangaId, rating: score });
  };

  const handleRemoveRating = () => {
    if (!user || !userRating) return;
    deleteRating.mutate(mangaId);
  };

  return (
    <Card className="p-3 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">შეაფასე მანგა</h3>
          {mangaRating && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-[var(--accent)]">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">
                  {mangaRating.average_rating.toFixed(1)}
                </span>
                <span className="text-[var(--muted-foreground)] text-sm">
                  / 10
                </span>
              </div>
              <div className="text-[var(--muted-foreground)] text-xs">
                {mangaRating.total_ratings} შეფასება
              </div>
            </div>
          )}
        </div>

        {user ? (
          <>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <Button
                  key={score}
                  variant="unstyled"
                  className="cursor-pointer p-0 transition-transform hover:scale-110 sm:p-0.5"
                  onMouseEnter={() => setHoveredScore(score)}
                  onMouseLeave={() => setHoveredScore(null)}
                  onClick={() => handleRate(score)}
                  disabled={submitRating.isPending || deleteRating.isPending}
                  aria-label={`შეაფასე ${score} ვარსკვლავით`}
                >
                  <Star
                    className={`h-5 w-5 transition-colors sm:h-6 sm:w-6 ${
                      score <= displayScore
                        ? "fill-[var(--accent)] text-[var(--accent)]"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  />
                </Button>
              ))}
              <span className="ml-2 min-w-[2.5rem] text-[var(--muted-foreground)] text-sm">
                {displayScore > 0 ? `${displayScore}/10` : ""}
              </span>
            </div>

            {userRating && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-foreground)] text-sm">
                  შენი შეფასება: {userRating.rating}/10
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveRating}
                  disabled={deleteRating.isPending}
                >
                  წაშლა
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-[var(--muted-foreground)] text-sm">
            შეფასებისთვის გაიარეთ ავტორიზაცია
          </p>
        )}
      </div>
    </Card>
  );
}
