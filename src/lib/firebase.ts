import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  Timestamp,
  getFirestore,
} from 'firebase/firestore';
import type {
  InsertPlatform
} from '@/lib/types';
import { firebaseConfig } from './env';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Platform functions
export async function addPlatform(
    data: Omit<InsertPlatform, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, 'platforms'), data);
  return ref.id;
}

export async function getPlatforms() {
  const platformsCollection = collection(db, 'platforms');
  const snapshot = await getDocs(platformsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getPlatform(id: string) {
  const docRef = doc(db, 'platforms', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
}

// Shortcut functions
export async function getShortcuts() {
  const shortcutsCollection = collection(db, 'shortcuts');
  const snapshot = await getDocs(shortcutsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getShortcutsByPlatform(platform: string) {
  const shortcutsCollection = collection(db, 'shortcuts');
  const q = query(shortcutsCollection, where('platform', '==', platform));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getShortcutsByCategory(category: string) {
  const shortcutsCollection = collection(db, 'shortcuts');
  const q = query(shortcutsCollection, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function searchShortcuts(query: string) {
  const shortcutsCollection = collection(db, 'shortcuts');
  const snapshot = await getDocs(shortcutsCollection);
  const shortcuts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const searchTerm = query.toLowerCase();
  return shortcuts.filter((shortcut: any) => 
    shortcut.title.toLowerCase().includes(searchTerm) ||
    shortcut.description.toLowerCase().includes(searchTerm) ||
    shortcut.shortcut.toLowerCase().includes(searchTerm)
  );
}

// Favorites functions
export async function getFavorites(userId: number) {
  const favoritesCollection = collection(db, 'favorites');
  const q = query(favoritesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().shortcutId);
}

export async function addFavorite(userId: number, shortcutId: string) {
  const favoritesCollection = collection(db, 'favorites');

  // Check if the favorite already exists
  const q = query(
    favoritesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  // Add new favorite
  const docRef = await addDoc(favoritesCollection, { 
    userId, 
    shortcutId,
    createdAt: Timestamp.now()
  });

  return { id: docRef.id, userId, shortcutId };
}

export async function removeFavorite(userId: number, shortcutId: string) {
  const favoritesCollection = collection(db, 'favorites');
  const q = query(
    favoritesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: true };
  }

  // Delete the favorite
  await deleteDoc(doc(db, 'favorites', snapshot.docs[0].id));
  return { success: true };
}

// Notes functions
export async function getUserNote(userId: number, shortcutId: string) {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export async function createUserNote(userId: number, shortcutId: string, note: string) {
  const notesCollection = collection(db, 'notes');

  // Check if the note already exists
  const q = query(
    notesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    // Update existing note
    const noteDoc = snapshot.docs[0];
    await updateDoc(doc(db, 'notes', noteDoc.id), { note });
    return { id: noteDoc.id, ...noteDoc.data(), note };
  }

  // Add new note
  const docRef = await addDoc(notesCollection, { 
    userId, 
    shortcutId,
    note,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  return { id: docRef.id, userId, shortcutId, note };
}

export async function updateUserNote(userId: number, shortcutId: string, note: string) {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Note not found');
  }

  // Update the note
  await updateDoc(doc(db, 'notes', snapshot.docs[0].id), { 
    note,
    updatedAt: Timestamp.now()
  });

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data(), note };
}

export async function deleteUserNote(userId: number, shortcutId: string) {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: true };
  }

  // Delete the note
  await deleteDoc(doc(db, 'notes', snapshot.docs[0].id));
  return { success: true };
}

// Tags functions
export async function getTags() {
  const tagsCollection = collection(db, 'tags');
  const snapshot = await getDocs(tagsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Shortcut Tags functions
export async function getShortcutTags(userId: number, shortcutId: string) {
  const shortcutTagsCollection = collection(db, 'shortcutTags');
  const tagsCollection = collection(db, 'tags');

  const q = query(
    shortcutTagsCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId)
  );
  const snapshot = await getDocs(q);

  // Get the tag IDs
  const tagIds = snapshot.docs.map(doc => doc.data().tagId);

  // If there are no tags, return an empty array
  if (tagIds.length === 0) {
    return [];
  }

  // Get the tag details
  const tagsSnapshot = await getDocs(tagsCollection);
  const allTags = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Filter tags by ID
  return allTags.filter((tag: any) => tagIds.includes(tag.id));
}

export async function addShortcutTag(userId: number, shortcutId: string, tagId: string) {
  const shortcutTagsCollection = collection(db, 'shortcutTags');

  // Check if the shortcut-tag already exists
  const q = query(
    shortcutTagsCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId),
    where('tagId', '==', tagId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  // Add new shortcut-tag
  const docRef = await addDoc(shortcutTagsCollection, { 
    userId, 
    shortcutId,
    tagId,
    createdAt: Timestamp.now()
  });

  return { id: docRef.id, userId, shortcutId, tagId };
}

export async function removeShortcutTag(userId: number, shortcutId: string, tagId: string) {
  const shortcutTagsCollection = collection(db, 'shortcutTags');

  const q = query(
    shortcutTagsCollection, 
    where('userId', '==', userId), 
    where('shortcutId', '==', shortcutId),
    where('tagId', '==', tagId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: true };
  }

  // Delete the shortcut-tag
  await deleteDoc(doc(db, 'shortcutTags', snapshot.docs[0].id));
  return { success: true };
}

// Quiz Sessions functions
export async function getQuizHistory(userId: number) {
  const quizSessionsCollection = collection(db, 'quizSessions');

  const q = query(
    quizSessionsCollection, 
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(10)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createQuizSession(userId: number, platform: string, score: number, totalQuestions: number, completedAt: string) {
  const quizSessionsCollection = collection(db, 'quizSessions');

  // Add new quiz session
  const docRef = await addDoc(quizSessionsCollection, { 
    userId, 
    platform,
    score,
    totalQuestions,
    completedAt,
    createdAt: Timestamp.now()
  });

  return { id: docRef.id, userId, platform, score, totalQuestions, completedAt };
}
