import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import type {
  InsertPlatform
} from '@/lib/types';
import { firebaseConfig } from './env';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function addPlatform(
    data: Omit<InsertPlatform, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, 'platforms'), data);
  return ref.id;
}

