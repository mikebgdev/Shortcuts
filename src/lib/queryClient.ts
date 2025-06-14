import {
  getShortcuts,
  getShortcutsByPlatform,
  getShortcutsByCategory,
  searchShortcuts,
  getFavorites,
  addFavorite,
  removeFavorite,
  getUserNote,
  createUserNote,
  updateUserNote,
  deleteUserNote,
  getTags,
  getShortcutTags,
  addShortcutTag,
  removeShortcutTag,
  getQuizHistory,
  createQuizSession
} from './firebase';

// Generic API request function that uses Firebase Firestore
export async function apiRequest(endpoint: string, options?: RequestInit) {
  // Parse the endpoint to determine the collection and document
  const parts = endpoint.split('/').filter(part => part !== '');

  if (parts[0] !== 'api') {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

  const resource = parts[1];

  try {
    // Handle different resources
    switch (resource) {
      case 'shortcuts':
        return handleShortcutsRequest(parts.slice(2), options);
      case 'favorites':
        return handleFavoritesRequest(parts.slice(2), options);
      case 'notes':
        return handleNotesRequest(parts.slice(2), options);
      case 'tags':
        return handleTagsRequest(parts.slice(2), options);
      case 'shortcut-tags':
        return handleShortcutTagsRequest(parts.slice(2), options);
      case 'quiz-history':
        return handleQuizHistoryRequest(parts.slice(2), options);
      case 'quiz-sessions':
        return handleQuizSessionsRequest(parts.slice(2), options);
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Handle shortcuts requests
async function handleShortcutsRequest(parts: string[], options?: RequestInit) {
  // GET /api/shortcuts
  if (parts.length === 0) {
    return await getShortcuts();
  }

  // GET /api/shortcuts/platform/:platform
  if (parts[0] === 'platform' && parts.length === 2) {
    const platform = parts[1];
    return await getShortcutsByPlatform(platform);
  }

  // GET /api/shortcuts/category/:category
  if (parts[0] === 'category' && parts.length === 2) {
    const category = parts[1];
    return await getShortcutsByCategory(category);
  }

  // GET /api/shortcuts/search?q=:query
  if (parts[0] === 'search') {
    // Parse the query parameter
    const url = new URL(`http://example.com${options?.url || ''}`);
    const searchQuery = url.searchParams.get('q') || '';

    if (!searchQuery) {
      return await getShortcuts();
    }

    return await searchShortcuts(searchQuery);
  }

  throw new Error(`Unknown shortcuts endpoint: ${parts.join('/')}`);
}

// Handle favorites requests
async function handleFavoritesRequest(parts: string[], options?: RequestInit) {
  // POST /api/favorites
  if (parts.length === 0 && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { userId, shortcutId } = body;
    return await addFavorite(userId, shortcutId);
  }

  // GET /api/favorites/:userId
  if (parts.length === 1 && !options?.method) {
    const userId = parseInt(parts[0]);
    return await getFavorites(userId);
  }

  // DELETE /api/favorites/:userId/:shortcutId
  if (parts.length === 2 && options?.method === 'DELETE') {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    return await removeFavorite(userId, shortcutId);
  }

  throw new Error(`Unknown favorites endpoint: ${parts.join('/')}`);
}

// Handle notes requests
async function handleNotesRequest(parts: string[], options?: RequestInit) {
  // POST /api/notes
  if (parts.length === 0 && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { userId, shortcutId, note } = body;
    return await createUserNote(userId, shortcutId, note);
  }

  // GET /api/notes/:userId/:shortcutId
  if (parts.length === 2 && !options?.method) {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    return await getUserNote(userId, shortcutId);
  }

  // PUT /api/notes/:userId/:shortcutId
  if (parts.length === 2 && options?.method === 'PUT') {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    const body = JSON.parse(options.body as string);
    const { note } = body;
    return await updateUserNote(userId, shortcutId, note);
  }

  // DELETE /api/notes/:userId/:shortcutId
  if (parts.length === 2 && options?.method === 'DELETE') {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    return await deleteUserNote(userId, shortcutId);
  }

  throw new Error(`Unknown notes endpoint: ${parts.join('/')}`);
}

// Handle tags requests
async function handleTagsRequest(parts: string[], options?: RequestInit) {
  // GET /api/tags
  if (parts.length === 0 && !options?.method) {
    return await getTags();
  }

  throw new Error(`Unknown tags endpoint: ${parts.join('/')}`);
}

// Handle shortcut-tags requests
async function handleShortcutTagsRequest(parts: string[], options?: RequestInit) {
  // POST /api/shortcut-tags
  if (parts.length === 0 && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { userId, shortcutId, tagId } = body;
    return await addShortcutTag(userId, shortcutId, tagId);
  }

  // GET /api/shortcut-tags/:userId/:shortcutId
  if (parts.length === 2 && !options?.method) {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    return await getShortcutTags(userId, shortcutId);
  }

  // DELETE /api/shortcut-tags/:userId/:shortcutId/:tagId
  if (parts.length === 3 && options?.method === 'DELETE') {
    const userId = parseInt(parts[0]);
    const shortcutId = parts[1];
    const tagId = parts[2];
    return await removeShortcutTag(userId, shortcutId, tagId);
  }

  throw new Error(`Unknown shortcut-tags endpoint: ${parts.join('/')}`);
}

// Handle quiz-history requests
async function handleQuizHistoryRequest(parts: string[], options?: RequestInit) {
  // GET /api/quiz-history/:userId
  if (parts.length === 1 && !options?.method) {
    const userId = parseInt(parts[0]);
    return await getQuizHistory(userId);
  }

  throw new Error(`Unknown quiz-history endpoint: ${parts.join('/')}`);
}

// Handle quiz-sessions requests
async function handleQuizSessionsRequest(parts: string[], options?: RequestInit) {
  // POST /api/quiz-sessions
  if (parts.length === 0 && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { userId, platform, score, totalQuestions, completedAt } = body;
    return await createQuizSession(userId, platform, score, totalQuestions, completedAt);
  }

  throw new Error(`Unknown quiz-sessions endpoint: ${parts.join('/')}`);
}
