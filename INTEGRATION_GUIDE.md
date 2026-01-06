# Geomanga.ge Frontend - Backend Integration

This document outlines the complete backend API integration for the Geomanga.ge platform.

## 📁 Project Structure

The integration follows a feature-first architecture:

```
src/
├── features/
│   ├── auth/          # Authentication (login, register, logout)
│   ├── manga/         # Manga browsing, search, CRUD
│   ├── reader/        # Chapter reading and page navigation
│   ├── library/       # Bookmarks and reading history
│   ├── comments/      # Comments on manga and chapters
│   ├── ratings/       # Manga ratings
│   ├── upload/        # File uploads (covers, pages, avatars)
│   └── genres/        # Genre management
├── types/             # Shared TypeScript types
├── lib/               # API client with JWT auth
├── utils/             # Helper functions
└── middleware.ts      # Route protection
```

## 🚀 Quick Start

### 1. Environment Configuration

Copy [.env.example](.env.example) to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STATIC_URL=http://localhost:8000/uploads
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Backend API

Make sure your FastAPI backend is running on `http://localhost:8000`

### 4. Start Development Server

```bash
pnpm dev
```

## 🔐 Authentication

### Using Auth Hooks

```tsx
import { useLogin, useRegister, useLogout, useCurrentUser } from '@/features/auth';

function LoginForm() {
  const login = useLogin();
  
  const handleSubmit = async (data) => {
    await login.mutateAsync({
      login: data.email,
      password: data.password,
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

function UserProfile() {
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Welcome, {user.username}!</div>;
}
```

### Token Management

Tokens are automatically managed by the API client:
- Access token stored in `localStorage`
- Automatic refresh on 401 errors
- Automatic retry after token refresh

## 📚 Fetching Manga

### List Manga with Filters

```tsx
import { useMangaList } from '@/features/manga';

function MangaList() {
  const { data, isLoading } = useMangaList({
    page: 1,
    limit: 20,
    status: 'ongoing',
    sort_by: 'rating',
    order_desc: true,
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.items.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
      <Pagination total={data?.pages} />
    </div>
  );
}
```

### Trending and Recent Manga

```tsx
import { useTrendingManga, useRecentManga } from '@/features/manga';

function HomePage() {
  const { data: trending } = useTrendingManga();
  const { data: recent } = useRecentManga();
  
  return (
    <>
      <TrendingSection manga={trending} />
      <RecentUpdates manga={recent} />
    </>
  );
}
```

### Search Manga

```tsx
import { useSearchManga } from '@/features/manga';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { data: results } = useSearchManga(query);
  
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results?.map((manga) => <SearchResult key={manga.id} manga={manga} />)}
    </>
  );
}
```

### Manga Details

```tsx
import { useMangaBySlug } from '@/features/manga';

function MangaDetailPage({ slug }: { slug: string }) {
  const { data: manga, isLoading } = useMangaBySlug(slug);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{manga.title}</h1>
      <p>{manga.description}</p>
      <div>Rating: {manga.rating}/5</div>
      <div>Status: {manga.status}</div>
      <div>Genres: {manga.genres.map(g => g.name).join(', ')}</div>
    </div>
  );
}
```

## 📖 Reading Chapters

### Display Chapters

```tsx
import { useChaptersByManga } from '@/features/reader';

function ChapterList({ mangaId }: { mangaId: number }) {
  const { data: chapters } = useChaptersByManga(mangaId);
  
  return (
    <div>
      {chapters?.map((chapter) => (
        <Link key={chapter.id} href={`/read/${chapter.id}`}>
          Chapter {chapter.chapter_number}: {chapter.title}
        </Link>
      ))}
    </div>
  );
}
```

### Manga Reader

```tsx
import { useChapterWithPages, useTrackReading } from '@/features/reader';

function MangaReader({ chapterId }: { chapterId: number }) {
  const { data: chapter } = useChapterWithPages(chapterId);
  const trackReading = useTrackReading();
  
  useEffect(() => {
    if (chapter) {
      trackReading.mutate({
        manga_id: chapter.manga_id,
        chapter_id: chapter.id,
      });
    }
  }, [chapter]);
  
  return (
    <div>
      {chapter?.pages.map((page) => (
        <img
          key={page.id}
          src={getImageUrl(page.image_url)}
          alt={`Page ${page.page_number}`}
        />
      ))}
    </div>
  );
}
```

## 🔖 Library Features

### Bookmarks

```tsx
import { useBookmarks, useAddBookmark, useRemoveBookmark } from '@/features/library';

function BookmarkButton({ mangaId }: { mangaId: number }) {
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const { data: bookmarks } = useBookmarks();
  
  const isBookmarked = bookmarks?.items.some(b => b.manga_id === mangaId);
  
  const handleToggle = () => {
    if (isBookmarked) {
      removeBookmark.mutate(mangaId);
    } else {
      addBookmark.mutate({ manga_id: mangaId });
    }
  };
  
  return (
    <button onClick={handleToggle}>
      {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
    </button>
  );
}
```

### Reading History

```tsx
import { useReadingHistory } from '@/features/library';

function ReadingHistory() {
  const { data: history } = useReadingHistory({ page: 1, limit: 20 });
  
  return (
    <div>
      {history?.items.map((item) => (
        <div key={item.id}>
          <Link href={`/manga/${item.manga.slug}`}>
            {item.manga.title}
          </Link>
          <p>Last read: {formatRelativeTime(item.last_read_at)}</p>
          <Link href={`/read/${item.chapter_id}`}>
            Continue Reading
          </Link>
        </div>
      ))}
    </div>
  );
}
```

## ⭐ Ratings

```tsx
import { useMangaRating, useUserRating, useSubmitRating } from '@/features/ratings';

function RatingSection({ mangaId }: { mangaId: number }) {
  const { data: stats } = useMangaRating(mangaId);
  const { data: userRating } = useUserRating(mangaId);
  const submitRating = useSubmitRating();
  
  const handleRate = (score: number) => {
    submitRating.mutate({
      manga_id: mangaId,
      score,
    });
  };
  
  return (
    <div>
      <div>Average: {stats?.average_rating.toFixed(1)}/5</div>
      <div>Total Ratings: {stats?.total_ratings}</div>
      <RatingStars 
        value={userRating?.score} 
        onChange={handleRate}
      />
    </div>
  );
}
```

## 💬 Comments

```tsx
import { useMangaComments, useCreateMangaComment, useDeleteComment } from '@/features/comments';

function CommentSection({ mangaId }: { mangaId: number }) {
  const { data: comments } = useMangaComments(mangaId);
  const createComment = useCreateMangaComment(mangaId);
  const deleteComment = useDeleteComment();
  
  const handleSubmit = (content: string) => {
    createComment.mutate(content);
  };
  
  return (
    <div>
      <CommentForm onSubmit={handleSubmit} />
      {comments?.items.map((comment) => (
        <Comment 
          key={comment.id}
          comment={comment}
          onDelete={() => deleteComment.mutate(comment.id)}
        />
      ))}
    </div>
  );
}
```

## 📤 Uploading Content

### Upload Manga (Uploader+ Role)

```tsx
import { useCreateManga, useUploadCover } from '@/features';
import { canUpload } from '@/utils/permissions';

function UploadMangaForm() {
  const { data: user } = useCurrentUser();
  const createManga = useCreateManga();
  const uploadCover = useUploadCover();
  
  if (!canUpload(user)) {
    return <div>You don't have permission to upload manga</div>;
  }
  
  const handleSubmit = async (data) => {
    let coverUrl;
    
    if (data.coverFile) {
      const { url } = await uploadCover.mutateAsync(data.coverFile);
      coverUrl = url;
    }
    
    await createManga.mutateAsync({
      title: data.title,
      description: data.description,
      cover_image_url: coverUrl,
      status: data.status,
      genre_ids: data.genres,
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Upload Chapter

```tsx
import { useCreateChapter, useUploadChapterPages } from '@/features/upload';

function UploadChapterForm({ mangaId }: { mangaId: number }) {
  const createChapter = useCreateChapter(mangaId);
  const uploadPages = useUploadChapterPages();
  
  const handleSubmit = async (data) => {
    // Create chapter
    const chapter = await createChapter.mutateAsync({
      chapter_number: data.chapterNumber,
      title: data.title,
    });
    
    // Upload pages
    const { urls } = await uploadPages.mutateAsync(data.pageFiles);
    
    // Create page entries
    await createPages({
      chapter_id: chapter.id,
      pages: urls.map((url, index) => ({
        page_number: index + 1,
        image_url: url,
      })),
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🔒 Role-Based Access Control

### Check User Permissions

```tsx
import { useCurrentUser } from '@/features/auth';
import { canUpload, canModerate, isAdmin } from '@/utils/permissions';

function ProtectedActions() {
  const { data: user } = useCurrentUser();
  
  return (
    <>
      {canUpload(user) && <UploadButton />}
      {canModerate(user) && <ModerateButton />}
      {isAdmin(user) && <AdminPanel />}
    </>
  );
}
```

## 🛠️ Utilities

### Image URLs

```tsx
import { getCoverUrl, getAvatarUrl, getImageUrl } from '@/utils/image-urls';

<img src={getCoverUrl(manga.cover_image_url)} alt={manga.title} />
<img src={getAvatarUrl(user.avatar_url)} alt={user.username} />
<img src={getImageUrl(page.image_url)} alt="Page" />
```

### Formatters

```tsx
import { formatDate, formatRelativeTime, formatNumber, formatRating } from '@/utils/formatters';

{formatDate(manga.created_at)}           // "Jan 15, 2024"
{formatRelativeTime(comment.created_at)} // "2 hours ago"
{formatNumber(manga.total_views)}        // "1.2K"
{formatRating(manga.rating)}             // "4.5"
```

## 🎯 TypeScript Types

All API types are available in [src/types](./src/types):

```tsx
import type { 
  Manga, 
  MangaDetail, 
  MangaStatus,
  Chapter,
  User,
  UserRole,
  Comment,
  Rating 
} from '@/types';
```

## 🔄 API Error Handling

```tsx
import { ApiError } from '@/types/api.types';

try {
  await login.mutateAsync(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Details:', error.response?.detail);
  }
}
```

## 📝 Next Steps

1. Create UI components for each feature module
2. Add form validation with React Hook Form
3. Implement infinite scroll for manga lists
4. Add image optimization with Next.js Image
5. Create skeleton loaders for better UX
6. Add error boundaries and toast notifications
7. Implement pagination components
8. Add analytics tracking

## 🔗 Resources

- Backend API Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- OpenAPI Spec: http://localhost:8000/api/v1/openapi.json

---

**Note**: All hooks use TanStack Query for caching, automatic refetching, and optimistic updates. Refer to the [TanStack Query docs](https://tanstack.com/query/latest) for advanced usage.
