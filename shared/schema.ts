import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
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

export const insertShortcutSchema = createInsertSchema(shortcuts).omit({
  id: true,
});

export type InsertShortcut = z.infer<typeof insertShortcutSchema>;
export type Shortcut = typeof shortcuts.$inferSelect;

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
