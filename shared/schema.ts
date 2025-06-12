import { pgTable, text, serial, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shortcuts = pgTable("shortcuts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  shortcut: text("shortcut").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  shortcutId: integer("shortcut_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  shortcutId: integer("shortcut_id").notNull(),
  userId: integer("user_id").notNull(),
  note: text("note").notNull(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull().default("#3B82F6"),
});

export const shortcutTags = pgTable("shortcut_tags", {
  id: serial("id").primaryKey(),
  shortcutId: integer("shortcut_id").notNull(),
  tagId: integer("tag_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const insertShortcutSchema = createInsertSchema(shortcuts).omit({
  id: true,
});

export type InsertShortcut = z.infer<typeof insertShortcutSchema>;
export type Shortcut = typeof shortcuts.$inferSelect;

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export const insertUserNoteSchema = createInsertSchema(userNotes).omit({
  id: true,
});

export type InsertUserNote = z.infer<typeof insertUserNoteSchema>;
export type UserNote = typeof userNotes.$inferSelect;

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const insertShortcutTagSchema = createInsertSchema(shortcutTags).omit({
  id: true,
});

export type InsertShortcutTag = z.infer<typeof insertShortcutTagSchema>;
export type ShortcutTag = typeof shortcutTags.$inferSelect;

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
});

export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
