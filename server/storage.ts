import { shortcuts, users, type Shortcut, type InsertShortcut, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllShortcuts(): Promise<Shortcut[]>;
  getShortcutsByPlatform(platform: string): Promise<Shortcut[]>;
  getShortcutsByCategory(category: string): Promise<Shortcut[]>;
  searchShortcuts(query: string): Promise<Shortcut[]>;
  createShortcut(shortcut: InsertShortcut): Promise<Shortcut>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shortcuts: Map<number, Shortcut>;
  private currentUserId: number;
  private currentShortcutId: number;

  constructor() {
    this.users = new Map();
    this.shortcuts = new Map();
    this.currentUserId = 1;
    this.currentShortcutId = 1;
    this.initializeShortcuts();
  }

  private initializeShortcuts() {
    const initialShortcuts: Omit<Shortcut, 'id'>[] = [
      // PHPStorm shortcuts
      {
        title: "Quick Open File",
        shortcut: "Ctrl+Shift+N",
        description: "Quickly open any file in your project",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Go to Declaration",
        shortcut: "Ctrl+B",
        description: "Navigate to the declaration of a symbol",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Find in Files",
        shortcut: "Ctrl+Shift+F",
        description: "Search for text across all project files",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Recent Files",
        shortcut: "Ctrl+E",
        description: "Show recently opened files",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Duplicate Line",
        shortcut: "Ctrl+D",
        description: "Duplicate the current line or selection",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Multiple Cursors",
        shortcut: "Alt+Click",
        description: "Add multiple cursors for simultaneous editing",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Comment Line",
        shortcut: "Ctrl+/",
        description: "Toggle line comment",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Reformat Code",
        shortcut: "Ctrl+Alt+L",
        description: "Automatically format code according to style settings",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Toggle Breakpoint",
        shortcut: "Ctrl+F8",
        description: "Toggle breakpoint at current line",
        category: "debugging",
        platform: "phpstorm"
      },
      {
        title: "Step Over",
        shortcut: "F8",
        description: "Step over to the next line in debugging",
        category: "debugging",
        platform: "phpstorm"
      },
      {
        title: "Step Into",
        shortcut: "F7",
        description: "Step into function calls during debugging",
        category: "debugging",
        platform: "phpstorm"
      },
      {
        title: "Resume Program",
        shortcut: "F9",
        description: "Continue program execution",
        category: "debugging",
        platform: "phpstorm"
      },

      // Arch Linux shortcuts
      {
        title: "Package Update",
        shortcut: "sudo pacman -Syu",
        description: "Update all installed packages",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Install Package",
        shortcut: "sudo pacman -S [package]",
        description: "Install a specific package",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Remove Package",
        shortcut: "sudo pacman -R [package]",
        description: "Remove a package",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Search Package",
        shortcut: "pacman -Ss [query]",
        description: "Search for packages in repositories",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Open Terminal",
        shortcut: "Ctrl+Alt+T",
        description: "Open a new terminal window",
        category: "window",
        platform: "archlinux"
      },
      {
        title: "Switch Desktop",
        shortcut: "Ctrl+Alt+Arrow",
        description: "Switch between virtual desktops",
        category: "window",
        platform: "archlinux"
      },
      {
        title: "Directory Navigation",
        shortcut: "cd ..",
        description: "Go up one directory level",
        category: "navigation",
        platform: "archlinux"
      },
      {
        title: "List Files",
        shortcut: "ls -la",
        description: "List all files with detailed information",
        category: "navigation",
        platform: "archlinux"
      },

      // Ubuntu shortcuts
      {
        title: "Update System",
        shortcut: "sudo apt update && sudo apt upgrade",
        description: "Update package list and upgrade all packages",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Install Package",
        shortcut: "sudo apt install [package]",
        description: "Install a specific package",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Remove Package",
        shortcut: "sudo apt remove [package]",
        description: "Remove a package",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Search Package",
        shortcut: "apt search [query]",
        description: "Search for packages in repositories",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Show Applications",
        shortcut: "Super",
        description: "Open activities overview and application launcher",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Switch Windows",
        shortcut: "Alt+Tab",
        description: "Switch between open applications",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Lock Screen",
        shortcut: "Super+L",
        description: "Lock the screen",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Take Screenshot",
        shortcut: "PrtScr",
        description: "Take a screenshot of the entire screen",
        category: "window",
        platform: "ubuntu"
      }
    ];

    initialShortcuts.forEach(shortcut => {
      const id = this.currentShortcutId++;
      this.shortcuts.set(id, { ...shortcut, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllShortcuts(): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values());
  }

  async getShortcutsByPlatform(platform: string): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values()).filter(
      shortcut => shortcut.platform === platform
    );
  }

  async getShortcutsByCategory(category: string): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values()).filter(
      shortcut => shortcut.category === category
    );
  }

  async searchShortcuts(query: string): Promise<Shortcut[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.shortcuts.values()).filter(
      shortcut => 
        shortcut.title.toLowerCase().includes(searchTerm) ||
        shortcut.description.toLowerCase().includes(searchTerm) ||
        shortcut.shortcut.toLowerCase().includes(searchTerm)
    );
  }

  async createShortcut(insertShortcut: InsertShortcut): Promise<Shortcut> {
    const id = this.currentShortcutId++;
    const shortcut: Shortcut = { ...insertShortcut, id };
    this.shortcuts.set(id, shortcut);
    return shortcut;
  }
}

export const storage = new MemStorage();
