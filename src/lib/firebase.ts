import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type {Category, InsertPlatform, Platform, QuizSession, Shortcut, UserNote} from '@/lib/types';
import { firebaseConfig } from './env';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getPlatforms(): Promise<Platform[]> {
  const platformsCollection = collection(db, 'platforms');
  const snapshot = await getDocs(platformsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Platform, 'id'>),
  }));
}

export async function getCategories(): Promise<Category[]> {
  const categoriesCollection = collection(db, 'categories');
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, 'id'>),
  }));
}

export async function getShortcuts(): Promise<Shortcut[]> {
  const shortcutsCollection = collection(db, 'shortcuts');
  const snapshot = await getDocs(shortcutsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Shortcut, 'id'>),
  }));
}


export async function getFavorites(userId: number) {
  const favoritesCollection = collection(db, 'favorites');
  const q = query(favoritesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().shortcutId);
}

export async function addFavorite(userId: number, shortcutId: string) {
  const favoritesCollection = collection(db, 'favorites');

  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  const docRef = await addDoc(favoritesCollection, {
    userId,
    shortcutId,
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id, userId, shortcutId };
}

export async function removeFavorite(userId: number, shortcutId: string) {
  const favoritesCollection = collection(db, 'favorites');
  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: true };
  }

  await deleteDoc(doc(db, 'favorites', snapshot.docs[0].id));
  return { success: true };
}

export async function getUserNote(userId: number, shortcutId: string): Promise<UserNote|null> {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...(snapshot.docs[0].data() as Omit<UserNote, 'id'>),
  };
}

export async function createUserNote(
  userId: number,
  shortcutId: string,
  note: string,
) {
  const notesCollection = collection(db, 'notes');

  const q = query(
    notesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const noteDoc = snapshot.docs[0];
    await updateDoc(doc(db, 'notes', noteDoc.id), { note });
    return { id: noteDoc.id, ...noteDoc.data(), note };
  }

  const docRef = await addDoc(notesCollection, {
    userId,
    shortcutId,
    note,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return { id: docRef.id, userId, shortcutId, note };
}

export async function updateUserNote(
  userId: number,
  shortcutId: string,
  note: string,
) {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Note not found');
  }

  await updateDoc(doc(db, 'notes', snapshot.docs[0].id), {
    note,
    updatedAt: Timestamp.now(),
  });

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data(), note };
}

export async function deleteUserNote(userId: number, shortcutId: string) {
  const notesCollection = collection(db, 'notes');
  const q = query(
    notesCollection,
    where('userId', '==', userId),
    where('shortcutId', '==', shortcutId),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: true };
  }

  await deleteDoc(doc(db, 'notes', snapshot.docs[0].id));
  return { success: true };
}

export async function getQuizHistory(userId: number): Promise<QuizSession[]> {
  const quizSessionsCollection = collection(db, 'quizSessions');

  const q = query(
    quizSessionsCollection,
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(10),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<QuizSession, 'id'>),
  }));
}

export async function createQuizSession(
  userId: number,
  platform: string,
  score: number,
  totalQuestions: number,
  completedAt: string,
) {
  const quizSessionsCollection = collection(db, 'quizSessions');

  const docRef = await addDoc(quizSessionsCollection, {
    userId,
    platform,
    score,
    totalQuestions,
    completedAt,
    createdAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    userId,
    platform,
    score,
    totalQuestions,
    completedAt,
  };
}
