export interface Genre {
  readonly id: number;
  readonly name: string;
  readonly name_ka: string;
  readonly slug: string;
  readonly description: string | undefined;
  readonly manga_count: number;
}

export interface GenreCreate {
  readonly name: string;
  readonly description?: string;
}

export interface GenreUpdate {
  readonly name?: string;
  readonly description?: string;
}
