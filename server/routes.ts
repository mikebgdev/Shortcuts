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

  const httpServer = createServer(app);
  return httpServer;
}
