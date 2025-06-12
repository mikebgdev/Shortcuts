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

  const httpServer = createServer(app);
  return httpServer;
}
