# Geomanga.ge Frontend - Quick Reference

## 📦 Import Patterns

```tsx
// Auth
import { useLogin, useRegister, useLogout, useCurrentUser } from '@/features/auth';

// Manga
import { useMangaList, useMangaBySlug, useSearchManga, useTrendingManga } from '@/features/manga';

// Reader
import { useChaptersByManga, useChapterWithPages, useTrackReading } from '@/features/reader';

// Library
import { useBookmarks, useAddBookmark, useRemoveBookmark, useReadingHistory } from '@/features/library';

// Comments
import { useMangaComments, useCreateMangaComment, useDeleteComment, useLikeComment } from '@/features/comments';

// Ratings
import { useMangaRating, useUserRating, useSubmitRating } from '@/features/ratings';

// Upload
import { useUploadCover, useUploadChapterPages, useCreateChapter } from '@/features/upload';

// Genres
import { useGenres, useGenreBySlug } from '@/features/genres';

// Utils
import { getCoverUrl, getAvatarUrl, getImageUrl } from '@/utils/image-urls';
import { formatDate, formatRelativeTime, formatNumber, formatRating } from '@/utils/formatters';
import { canUpload, canModerate, isAdmin, hasRole } from '@/utils/permissions';

// Types
import type { Manga, User, Chapter, Comment, Rating } from '@/types';
```

## 🔐 Auth Examples

```tsx
// Login
const login = useLogin();
await login.mutateAsync({ login: 'user@example.com', password: 'password123' });

// Register
const register = useRegister();
await register.mutateAsync({ username: 'john', email: 'john@example.com', password: 'Pass123' });

// Get Current User
const { data: user, isLoading } = useCurrentUser();

// Logout
const logout = useLogout();
await logout.mutateAsync();

// Check if logged in
const { data: user } = useCurrentUser();
const isLoggedIn = !!user;
```

## 📚 Manga Examples

```tsx
// List with filters
const { data } = useMangaList({ 
  page: 1, 
  limit: 20, 
  status: 'ongoing',
  sort_by: 'rating',
  order_desc: true 
});

// Get by slug (for pages)
const { data: manga } = useMangaBySlug('one-piece');

// Search
const { data: results } = useSearchManga('naruto');

// Trending
const { data: trending } = useTrendingManga();

// Create manga (uploader+)
const createManga = useCreateManga();
await createManga.mutateAsync({ title: 'New Manga', status: 'ongoing' });
```

## 📖 Reader Examples

```tsx
// Get chapters
const { data: chapters } = useChaptersByManga(mangaId);

// Get chapter with pages
const { data: chapter } = useChapterWithPages(chapterId);

// Track reading
const trackReading = useTrackReading();
trackReading.mutate({ manga_id: 1, chapter_id: 5 });
```

## 🔖 Library Examples

```tsx
// Get bookmarks
const { data: bookmarks } = useBookmarks({ page: 1, limit: 20 });

// Add bookmark
const addBookmark = useAddBookmark();
addBookmark.mutate({ manga_id: 1 });

// Remove bookmark
const removeBookmark = useRemoveBookmark();
removeBookmark.mutate(mangaId);

// Reading history
const { data: history } = useReadingHistory();

// Get progress for manga
const { data: progress } = useMangaProgress(mangaId);
```

## ⭐ Rating Examples

```tsx
// Get manga rating stats
const { data: stats } = useMangaRating(mangaId);
// stats.average_rating, stats.total_ratings, stats.rating_distribution

// Get user's rating
const { data: userRating } = useUserRating(mangaId);

// Submit rating
const submitRating = useSubmitRating();
submitRating.mutate({ manga_id: 1, score: 5 });
```

## 💬 Comment Examples

```tsx
// Get comments
const { data: comments } = useMangaComments(mangaId);
const { data: comments } = useChapterComments(chapterId);

// Create comment
const createComment = useCreateMangaComment(mangaId);
createComment.mutate('Great manga!');

// Delete comment
const deleteComment = useDeleteComment();
deleteComment.mutate(commentId);

// Like comment
const likeComment = useLikeComment();
likeComment.mutate(commentId);
```

## 📤 Upload Examples

```tsx
// Upload cover
const uploadCover = useUploadCover();
const { url } = await uploadCover.mutateAsync(file);

// Upload pages
const uploadPages = useUploadChapterPages();
const { urls } = await uploadPages.mutateAsync([file1, file2, file3]);

// Create chapter
const createChapter = useCreateChapter(mangaId);
const chapter = await createChapter.mutateAsync({
  chapter_number: 1,
  title: 'Chapter 1'
});
```

## 🎨 Image URL Examples

```tsx
<img src={getCoverUrl(manga.cover_image_url)} alt={manga.title} />
<img src={getAvatarUrl(user.avatar_url)} alt={user.username} />
<img src={getImageUrl(page.image_url)} alt="Page" />
```

## 📅 Formatter Examples

```tsx
{formatDate(manga.created_at)}              // "Jan 15, 2024"
{formatRelativeTime(comment.created_at)}    // "2 hours ago"
{formatNumber(manga.total_views)}           // "1.2K"
{formatRating(manga.rating)}                // "4.5"
```

## 🔒 Permission Examples

```tsx
const { data: user } = useCurrentUser();

// Check permissions
{canUpload(user) && <UploadButton />}
{canModerate(user) && <DeleteButton />}
{isAdmin(user) && <AdminPanel />}

// Check specific role
{hasRole(user, UserRole.UPLOADER) && <div>Uploader content</div>}
```

## 🔄 Query States

All hooks return these states:

```tsx
const { 
  data,           // The fetched data
  isLoading,      // Initial loading
  isFetching,     // Any fetch (including refetch)
  isError,        // Error occurred
  error,          // Error object
  refetch,        // Manual refetch function
} = useQuery(...);

const {
  mutate,         // Trigger mutation
  mutateAsync,    // Async mutation
  isPending,      // Mutation in progress
  isError,        // Mutation error
  error,          // Error object
  reset,          // Reset mutation state
} = useMutation(...);
```

## 🎯 Common Patterns

### Protected Component
```tsx
function ProtectedComponent() {
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <div>Protected content</div>;
}
```

### Form with Mutation
```tsx
function CommentForm({ mangaId }) {
  const createComment = useCreateMangaComment(mangaId);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createComment.mutate(e.target.content.value, {
      onSuccess: () => {
        e.target.reset();
        toast.success('Comment posted!');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pagination
```tsx
function MangaList() {
  const [page, setPage] = useState(1);
  const { data } = useMangaList({ page, limit: 20 });
  
  return (
    <>
      {data?.items.map(...)}
      <Pagination 
        currentPage={page}
        totalPages={data?.pages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Optimistic Update
```tsx
const addBookmark = useAddBookmark();

addBookmark.mutate({ manga_id: 1 }, {
  onMutate: async (newBookmark) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['bookmarks']);
    
    // Optimistically update
    queryClient.setQueryData(['bookmarks'], (old) => ({
      ...old,
      items: [...old.items, newBookmark]
    }));
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['bookmarks'], context.previous);
  },
});
```

## 🐛 Error Handling

```tsx
import { ApiError } from '@/types/api.types';

try {
  await login.mutateAsync(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        toast.error('Invalid credentials');
        break;
      case 403:
        toast.error('Access denied');
        break;
      default:
        toast.error(error.message);
    }
  }
}
```

## 📊 Status Indicators

```tsx
{isLoading && <Spinner />}
{isError && <Error message={error.message} />}
{data && <Content data={data} />}

{/* Or with combined states */}
{isLoading ? (
  <Skeleton />
) : isError ? (
  <ErrorMessage error={error} />
) : (
  <DataDisplay data={data} />
)}
```

---

**Pro Tip**: Use TypeScript's auto-complete to explore available options and properties! 🚀
