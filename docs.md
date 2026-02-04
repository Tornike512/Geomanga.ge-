API Documentation for Enhanced User Profile Page                         
                                                                                                                                                                                 
  Overview                                                                                                                                                                       
                                                                                                                                                                                 
  The user profile API has been enhanced with the following new features:                                                                                                        
  - User bio and banner customization                                                                                                                                          
  - Privacy settings control                                                                                                                                                     
  - Uploaded manga list display                                                                                                                                                  
  - Recent comments display                                                                                                                                                      
                                                                                                                                                                                 
  ---                                                                                                                                                                            
  1. GET /api/v1/users/{user_id}/profile - Get Public User Profile                                                                                                               

  Enhanced Response Schema:

  {
    // Basic Info
    id: number
    username: string
    avatar_url: string | null
    bio: string | null                    // NEW: User's personal bio (max 500 chars)
    banner_url: string | null              // NEW: Profile banner image URL
    role: "USER" | "UPLOADER" | "MODERATOR" | "ADMIN"
    created_at: string                     // ISO datetime

    // Activity Counts
    comment_count: number
    rating_count: number
    manga_count: number

    // Privacy Settings (NEW)
    privacy_settings: {
      show_comments: boolean               // Controls comment visibility
      show_uploaded_manga: boolean         // Controls uploaded manga visibility
      show_reading_progress: boolean       // Controls reading progress visibility
      profile_visibility: "public" | "private"
    } | null

    // Uploaded Manga List (NEW - respects privacy_settings.show_uploaded_manga)
    uploaded_manga: Array<{
      id: number
      title: string
      cover_image: string | null
      status: "ongoing" | "completed" | "hiatus" | "cancelled"
    }>

    // Recent Comments (NEW - respects privacy_settings.show_comments)
    recent_comments: Array<{
      id: number
      content: string
      created_at: string                   // ISO datetime
      manga_id: number
      manga_title: string
    }>
  }

  Example Response:

  {
    "id": 2,
    "username": "manga_lover_123",
    "avatar_url": "https://example.com/avatars/user2.jpg",
    "bio": "Passionate manga reader and collector. Love fantasy and action genres!",
    "banner_url": "https://example.com/banners/user2-banner.jpg",
    "role": "UPLOADER",
    "created_at": "2025-01-15T10:30:00Z",
    "comment_count": 156,
    "rating_count": 89,
    "manga_count": 12,
    "privacy_settings": {
      "show_comments": true,
      "show_uploaded_manga": true,
      "show_reading_progress": true,
      "profile_visibility": "public"
    },
    "uploaded_manga": [
      {
        "id": 45,
        "title": "Dragon Quest Chronicles",
        "cover_image": "https://example.com/covers/manga45.jpg",
        "status": "ongoing"
      },
      {
        "id": 38,
        "title": "Mystic Warriors",
        "cover_image": "https://example.com/covers/manga38.jpg",
        "status": "completed"
      }
      // ... up to 20 manga
    ],
    "recent_comments": [
      {
        "id": 1234,
        "content": "Amazing chapter! Can't wait for the next one.",
        "created_at": "2025-02-03T14:22:00Z",
        "manga_id": 45,
        "manga_title": "Dragon Quest Chronicles"
      },
      {
        "id": 1198,
        "content": "The art style is absolutely stunning in this series.",
        "created_at": "2025-02-01T09:15:00Z",
        "manga_id": 52,
        "manga_title": "Celestial Guardians"
      }
      // ... up to 20 comments
    ]
  }

  Privacy Behavior:
  - If privacy_settings.show_uploaded_manga is false, the uploaded_manga array will be empty []
  - If privacy_settings.show_comments is false, the recent_comments array will be empty []
  - If user has no privacy settings configured, default values will be used (all true, public)

  ---
  2. PUT /api/v1/users/me - Update Current User Profile

  Request Body Schema:

  {
    username?: string                      // Optional: 3-50 chars, alphanumeric + underscores
    email?: string                         // Optional: valid email
    avatar_url?: string                    // Optional: URL to avatar image
    bio?: string                           // NEW: max 500 characters
    banner_url?: string                    // NEW: URL to banner image
    privacy_settings?: {                   // NEW: privacy preferences
      show_comments?: boolean
      show_uploaded_manga?: boolean
      show_reading_progress?: boolean
      profile_visibility?: "public" | "private"
    }
  }

  Example Request - Update Bio and Banner:

  {
    "bio": "Updated my bio! Now reading 15 different manga series.",
    "banner_url": "https://example.com/my-new-banner.jpg"
  }

  Example Request - Update Privacy Settings:

  {
    "privacy_settings": {
      "show_comments": false,
      "show_uploaded_manga": true,
      "show_reading_progress": true,
      "profile_visibility": "public"
    }
  }

  Example Request - Update Multiple Fields:

  {
    "username": "new_username",
    "bio": "Manga enthusiast | Fantasy lover",
    "banner_url": "https://example.com/banners/custom.jpg",
    "privacy_settings": {
      "show_comments": true,
      "show_uploaded_manga": true,
      "show_reading_progress": false,
      "profile_visibility": "public"
    }
  }

  Response Schema:

  {
    id: number
    username: string
    email: string
    avatar_url: string | null
    bio: string | null                     // NEW
    banner_url: string | null              // NEW
    privacy_settings: {                    // NEW
      show_comments: boolean
      show_uploaded_manga: boolean
      show_reading_progress: boolean
      profile_visibility: string
    } | null
    gender: "male" | "female"
    role: "USER" | "UPLOADER" | "MODERATOR" | "ADMIN"
    is_active: boolean
    created_at: string
    auth_provider: "local" | "google"
  }

  Error Responses:

  - 400 Bad Request - If username is already taken or email is already registered
  - 401 Unauthorized - If user is not authenticated
  - 422 Unprocessable Entity - If request body validation fails (e.g., bio too long)

  ---
  3. API Integration Notes for Frontend

  1. Displaying User Profile:
  // Fetch user profile
  const response = await fetch(`/api/v1/users/${userId}/profile`);
  const profile = await response.json();

  // Check privacy before displaying lists
  if (profile.uploaded_manga.length > 0) {
    // Display uploaded manga section
  }

  if (profile.recent_comments.length > 0) {
    // Display recent comments section
  }

  // Display bio and banner if present
  if (profile.bio) {
    // Render bio section
  }

  if (profile.banner_url) {
    // Display banner image
  }

  2. Updating User Profile:
  // Update bio and banner
  const updateResponse = await fetch('/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      bio: "My new bio text",
      banner_url: "https://example.com/banner.jpg"
    })
  });

  const updatedUser = await updateResponse.json();

  3. Privacy Settings Toggle:
  // Toggle specific privacy settings
  const currentSettings = user.privacy_settings || {
    show_comments: true,
    show_uploaded_manga: true,
    show_reading_progress: true,
    profile_visibility: "public"
  };

  // Update only one field
  const response = await fetch('/api/v1/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      privacy_settings: {
        ...currentSettings,
        show_comments: false  // Hide comments
      }
    })
  });

  4. Default Values:
  - If bio is null, don't display bio section
  - If banner_url is null, use default banner or solid color
  - If privacy_settings is null, assume all visibility is enabled (public defaults)
  - Lists (uploaded_manga, recent_comments) are limited to 20 items each

  ---
  4. Key Changes Summary

  New Fields in User Model:
  - bio (Text, nullable) - User's personal description
  - banner_url (String, nullable) - Profile banner image
  - privacy_settings (JSON, nullable) - Privacy preferences

  Enhanced Profile Endpoint:
  - Returns user's uploaded manga list (with privacy control)
  - Returns user's recent comments (with privacy control)
  - Includes bio and banner in response
  - Respects privacy settings

  Profile Update Endpoint:
  - Now accepts bio, banner_url, and privacy_settings
  - All fields are optional
  - Returns updated user data including new fields

  ---
  This documentation should give you everything you need to integrate the enhanced user profile features into your frontend! The backend is ready to handle all these new
  features with proper privacy controls.