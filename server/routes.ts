import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all shortcuts
  app.get("/api/shortcuts", async (req, res) => {
    try {
      const shortcuts = await storage.getAllShortcuts();
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shortcuts" });
    }
  });

  // Get shortcuts by platform
  app.get("/api/shortcuts/platform/:platform", async (req, res) => {
    try {
      const { platform } = req.params;
      const shortcuts = await storage.getShortcutsByPlatform(platform);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shortcuts by platform" });
    }
  });

  // Get shortcuts by category
  app.get("/api/shortcuts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const shortcuts = await storage.getShortcutsByCategory(category);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shortcuts by category" });
    }
  });

  // Search shortcuts
  app.get("/api/shortcuts/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      const shortcuts = await storage.searchShortcuts(q);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search shortcuts" });
    }
  });

  // Get user favorites
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add favorite
  app.post("/api/favorites", async (req, res) => {
    try {
      const { userId, shortcutId } = req.body;
      if (!userId || !shortcutId) {
        return res.status(400).json({ message: "User ID and shortcut ID are required" });
      }
      const favorite = await storage.addFavorite(userId, shortcutId);
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  // Remove favorite
  app.delete("/api/favorites/:userId/:shortcutId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      if (isNaN(userId) || isNaN(shortcutId)) {
        return res.status(400).json({ message: "Invalid user ID or shortcut ID" });
      }
      await storage.removeFavorite(userId, shortcutId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // User Notes Routes
  app.get("/api/notes/:userId/:shortcutId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      if (isNaN(userId) || isNaN(shortcutId)) {
        return res.status(400).json({ message: "Invalid user ID or shortcut ID" });
      }
      const note = await storage.getUserNote(userId, shortcutId);
      res.json(note || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const { userId, shortcutId, note } = req.body;
      if (!userId || !shortcutId || !note) {
        return res.status(400).json({ message: "User ID, shortcut ID, and note are required" });
      }
      const userNote = await storage.createUserNote({ userId, shortcutId, note });
      res.json(userNote);
    } catch (error) {
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:userId/:shortcutId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      const { note } = req.body;
      if (isNaN(userId) || isNaN(shortcutId) || !note) {
        return res.status(400).json({ message: "Invalid parameters or missing note" });
      }
      await storage.updateUserNote(userId, shortcutId, note);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:userId/:shortcutId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      if (isNaN(userId) || isNaN(shortcutId)) {
        return res.status(400).json({ message: "Invalid user ID or shortcut ID" });
      }
      await storage.deleteUserNote(userId, shortcutId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Tags Routes
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const { name, color } = req.body;
      if (!name || !color) {
        return res.status(400).json({ message: "Name and color are required" });
      }
      const tag = await storage.createTag({ name, color });
      res.json(tag);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  app.delete("/api/tags/:tagId", async (req, res) => {
    try {
      const tagId = parseInt(req.params.tagId);
      if (isNaN(tagId)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }
      await storage.deleteTag(tagId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  // Shortcut Tags Routes
  app.get("/api/shortcut-tags/:userId/:shortcutId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      if (isNaN(userId) || isNaN(shortcutId)) {
        return res.status(400).json({ message: "Invalid user ID or shortcut ID" });
      }
      const tags = await storage.getShortcutTags(userId, shortcutId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shortcut tags" });
    }
  });

  app.post("/api/shortcut-tags", async (req, res) => {
    try {
      const { userId, shortcutId, tagId } = req.body;
      if (!userId || !shortcutId || !tagId) {
        return res.status(400).json({ message: "User ID, shortcut ID, and tag ID are required" });
      }
      const shortcutTag = await storage.addShortcutTag(userId, shortcutId, tagId);
      res.json(shortcutTag);
    } catch (error) {
      res.status(500).json({ message: "Failed to add tag to shortcut" });
    }
  });

  app.delete("/api/shortcut-tags/:userId/:shortcutId/:tagId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const shortcutId = parseInt(req.params.shortcutId);
      const tagId = parseInt(req.params.tagId);
      if (isNaN(userId) || isNaN(shortcutId) || isNaN(tagId)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      await storage.removeShortcutTag(userId, shortcutId, tagId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove tag from shortcut" });
    }
  });

  // Quiz Routes
  app.post("/api/quiz-sessions", async (req, res) => {
    try {
      const { userId, platform, score, totalQuestions } = req.body;
      if (!userId || !platform || score === undefined || !totalQuestions) {
        return res.status(400).json({ message: "All quiz session fields are required" });
      }
      const session = await storage.createQuizSession({
        userId,
        platform,
        score,
        totalQuestions,
        completedAt: new Date().toISOString()
      });
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quiz session" });
    }
  });

  app.get("/api/quiz-history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const history = await storage.getQuizHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
