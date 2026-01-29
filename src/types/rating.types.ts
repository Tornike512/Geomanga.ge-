export interface Rating {
  readonly id: number;
  readonly user_id: number;
  readonly manga_id: number;
  readonly rating: number;
  readonly created_at: string;
}

export interface RatingCreate {
  readonly manga_id: number;
  readonly rating: number;
}

export interface MangaRatingStats {
  readonly manga_id: number;
  readonly average_rating: number;
  readonly total_ratings: number;
  readonly rating_distribution: {
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
  };
}
