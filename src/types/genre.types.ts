export interface Genre {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly description: string | undefined;
}

export interface GenreCreate {
  readonly name: string;
  readonly description?: string;
}

export interface GenreUpdate {
  readonly name?: string;
  readonly description?: string;
}
