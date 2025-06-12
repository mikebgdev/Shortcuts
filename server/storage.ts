import { shortcuts, users, favorites, type Shortcut, type InsertShortcut, type User, type InsertUser, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllShortcuts(): Promise<Shortcut[]>;
  getShortcutsByPlatform(platform: string): Promise<Shortcut[]>;
  getShortcutsByCategory(category: string): Promise<Shortcut[]>;
  searchShortcuts(query: string): Promise<Shortcut[]>;
  createShortcut(shortcut: InsertShortcut): Promise<Shortcut>;
  
  getFavorites(userId: number): Promise<number[]>;
  addFavorite(userId: number, shortcutId: number): Promise<Favorite>;
  removeFavorite(userId: number, shortcutId: number): Promise<void>;
  isFavorite(userId: number, shortcutId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private shortcuts: Map<number, Shortcut>;
  private favorites: Map<string, Favorite>;
  private currentUserId: number;
  private currentShortcutId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.shortcuts = new Map();
    this.favorites = new Map();
    this.currentUserId = 1;
    this.currentShortcutId = 1;
    this.currentFavoriteId = 1;
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
      {
        title: "Run File",
        shortcut: "Ctrl+Shift+F10",
        description: "Run current file",
        category: "debugging",
        platform: "phpstorm"
      },
      {
        title: "Debug File",
        shortcut: "Ctrl+Shift+F9",
        description: "Debug current file",
        category: "debugging",
        platform: "phpstorm"
      },
      {
        title: "Select All",
        shortcut: "Ctrl+A",
        description: "Select all text in current file",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Cut Line",
        shortcut: "Ctrl+X",
        description: "Cut current line to clipboard",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Copy Line",
        shortcut: "Ctrl+C",
        description: "Copy current line to clipboard",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Paste",
        shortcut: "Ctrl+V",
        description: "Paste from clipboard",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Undo",
        shortcut: "Ctrl+Z",
        description: "Undo last action",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Redo",
        shortcut: "Ctrl+Shift+Z",
        description: "Redo last undone action",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Move Line Up",
        shortcut: "Ctrl+Shift+Up",
        description: "Move current line up",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Move Line Down",
        shortcut: "Ctrl+Shift+Down",
        description: "Move current line down",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Delete Line",
        shortcut: "Ctrl+Y",
        description: "Delete current line",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Expand Selection",
        shortcut: "Ctrl+W",
        description: "Expand selection to word/block",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Shrink Selection",
        shortcut: "Ctrl+Shift+W",
        description: "Shrink selection",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Surround With",
        shortcut: "Ctrl+Alt+T",
        description: "Surround selection with template",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Join Lines",
        shortcut: "Ctrl+Shift+J",
        description: "Join current line with next",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Quick Documentation",
        shortcut: "Ctrl+Q",
        description: "Show quick documentation",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Parameter Info",
        shortcut: "Ctrl+P",
        description: "Show function parameter info",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Show Error Description",
        shortcut: "Ctrl+F1",
        description: "Show error description at cursor",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Find Usage",
        shortcut: "Alt+F7",
        description: "Find usages of symbol",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Refactor Rename",
        shortcut: "Shift+F6",
        description: "Rename symbol across project",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Extract Method",
        shortcut: "Ctrl+Alt+M",
        description: "Extract selection into method",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Extract Variable",
        shortcut: "Ctrl+Alt+V",
        description: "Extract expression into variable",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Optimize Imports",
        shortcut: "Ctrl+Alt+O",
        description: "Optimize and clean up imports",
        category: "editing",
        platform: "phpstorm"
      },
      {
        title: "Go to Line",
        shortcut: "Ctrl+G",
        description: "Go to specific line number",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Structure View",
        shortcut: "Alt+7",
        description: "Open file structure view",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Project View",
        shortcut: "Alt+1",
        description: "Open project files view",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Find Replace",
        shortcut: "Ctrl+R",
        description: "Find and replace in file",
        category: "navigation",
        platform: "phpstorm"
      },
      {
        title: "Find Replace All",
        shortcut: "Ctrl+Shift+R",
        description: "Find and replace in project",
        category: "navigation",
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
        title: "Clean Package Cache",
        shortcut: "sudo pacman -Sc",
        description: "Clean unused package cache",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Package Info",
        shortcut: "pacman -Si [package]",
        description: "Show detailed package information",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "List Installed",
        shortcut: "pacman -Q",
        description: "List all installed packages",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "AUR Helper Install",
        shortcut: "yay -S [package]",
        description: "Install package from AUR with yay",
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
        title: "Close Window",
        shortcut: "Alt+F4",
        description: "Close the current window",
        category: "window",
        platform: "archlinux"
      },
      {
        title: "Tiling Windows",
        shortcut: "Super+Arrow",
        description: "Tile windows to screen edges",
        category: "window",
        platform: "archlinux"
      },
      {
        title: "Application Launcher",
        shortcut: "Super+Space",
        description: "Open application launcher",
        category: "window",
        platform: "archlinux"
      },
      {
        title: "Lock Screen",
        shortcut: "Super+L",
        description: "Lock the screen",
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
      {
        title: "Find Files",
        shortcut: "find / -name '[filename]'",
        description: "Search for files system-wide",
        category: "navigation",
        platform: "archlinux"
      },
      {
        title: "File Permissions",
        shortcut: "chmod 755 [file]",
        description: "Change file permissions",
        category: "navigation",
        platform: "archlinux"
      },
      {
        title: "Copy Files",
        shortcut: "cp -r [source] [destination]",
        description: "Copy files and directories recursively",
        category: "navigation",
        platform: "archlinux"
      },
      {
        title: "Move Files",
        shortcut: "mv [source] [destination]",
        description: "Move or rename files and directories",
        category: "navigation",
        platform: "archlinux"
      },
      {
        title: "Text Editor",
        shortcut: "nano [filename]",
        description: "Open text editor for file editing",
        category: "editing",
        platform: "archlinux"
      },
      {
        title: "Vim Editor",
        shortcut: "vim [filename]",
        description: "Open vim text editor",
        category: "editing",
        platform: "archlinux"
      },
      {
        title: "Archive Extract",
        shortcut: "tar -xzf [archive.tar.gz]",
        description: "Extract tar.gz archive",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "System Logs",
        shortcut: "journalctl -f",
        description: "Follow system logs in real-time",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Service Status",
        shortcut: "systemctl status [service]",
        description: "Check systemd service status",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Start Service",
        shortcut: "sudo systemctl start [service]",
        description: "Start a systemd service",
        category: "system",
        platform: "archlinux"
      },
      {
        title: "Process Monitor",
        shortcut: "htop",
        description: "Interactive process monitor",
        category: "system",
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
      },
      {
        title: "Open Terminal",
        shortcut: "Ctrl+Alt+T",
        description: "Open a new terminal window",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Close Window",
        shortcut: "Alt+F4",
        description: "Close the current window",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Minimize Window",
        shortcut: "Super+H",
        description: "Minimize the current window",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Maximize Window",
        shortcut: "Super+Up",
        description: "Maximize the current window",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Switch Workspaces",
        shortcut: "Super+Page Up/Down",
        description: "Switch between workspaces",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Show Desktop",
        shortcut: "Super+D",
        description: "Show desktop and hide all windows",
        category: "window",
        platform: "ubuntu"
      },
      {
        title: "Open File Manager",
        shortcut: "Super+E",
        description: "Open the file manager",
        category: "navigation",
        platform: "ubuntu"
      },
      {
        title: "Go Home Directory",
        shortcut: "cd ~",
        description: "Navigate to home directory",
        category: "navigation",
        platform: "ubuntu"
      },
      {
        title: "List Hidden Files",
        shortcut: "ls -la",
        description: "List all files including hidden ones",
        category: "navigation",
        platform: "ubuntu"
      },
      {
        title: "Find Files",
        shortcut: "find . -name '[filename]'",
        description: "Search for files by name",
        category: "navigation",
        platform: "ubuntu"
      },
      {
        title: "Check Disk Usage",
        shortcut: "df -h",
        description: "Show disk space usage",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Process List",
        shortcut: "ps aux",
        description: "Show running processes",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Kill Process",
        shortcut: "sudo kill -9 [PID]",
        description: "Force kill a process by PID",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "System Monitor",
        shortcut: "htop",
        description: "Interactive process monitor",
        category: "system",
        platform: "ubuntu"
      },
      {
        title: "Network Status",
        shortcut: "ip addr show",
        description: "Show network interface information",
        category: "system",
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

  async getFavorites(userId: number): Promise<number[]> {
    return Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId)
      .map(fav => fav.shortcutId);
  }

  async addFavorite(userId: number, shortcutId: number): Promise<Favorite> {
    const key = `${userId}-${shortcutId}`;
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { id, userId, shortcutId };
    this.favorites.set(key, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, shortcutId: number): Promise<void> {
    const key = `${userId}-${shortcutId}`;
    this.favorites.delete(key);
  }

  async isFavorite(userId: number, shortcutId: number): Promise<boolean> {
    const key = `${userId}-${shortcutId}`;
    return this.favorites.has(key);
  }
}

export const storage = new MemStorage();
