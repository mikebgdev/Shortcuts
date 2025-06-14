import { Timestamp } from 'firebase/firestore';

export interface InsertPlatform {
  name: string;
  icon?: string;
  description: string;
}

export interface Platform {
  id: string;
  name: string;
  icon?: string;
  description: string;
  originalId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  originalId?: string;
}

export interface Shortcut {
  id: string;
  title: string;
  shortcut: string;
  description: string;
  category: string;
  platform: string;
  originalId?: string;
}

export interface TagType {
  id: number;
  name: string;
  color: string;
}

export interface UserNote {
  id: string;
  userId: number;
  shortcutId: string;
  note: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface QuizSession {
  id: string;
  userId: number;
  platform: string;
  score: number;
  totalQuestions: number;
  completedAt: Timestamp;
  createdAt: Timestamp;
}
