export interface Page {
  readonly id: number;
  readonly chapter_id: number;
  readonly page_number: number;
  readonly image_url: string;
}

export interface PageCreate {
  readonly chapter_id: number;
  readonly page_number: number;
  readonly image_url: string;
}

export interface PageUpdate {
  readonly page_number?: number;
  readonly image_url?: string;
}

export interface BulkPageCreate {
  readonly chapter_id: number;
  readonly pages: Array<{
    readonly page_number: number;
    readonly image_url: string;
  }>;
}
