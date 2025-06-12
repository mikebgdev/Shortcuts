export interface ShortcutData {
  id: string;
  title: string;
  shortcut: string;
  description: string;
  category: string;
  platform: string;
}

export const PLATFORMS = [
  { 
    id: "phpstorm", 
    name: "PHPStorm", 
    icon: "fab fa-php",
    description: "Essential keyboard shortcuts for efficient PHPStorm development"
  },
  { 
    id: "archlinux", 
    name: "Arch Linux", 
    icon: "fab fa-linux",
    description: "Essential terminal and system shortcuts for Arch Linux"
  },
  { 
    id: "ubuntu", 
    name: "Ubuntu", 
    icon: "fab fa-ubuntu",
    description: "Essential keyboard shortcuts and commands for Ubuntu"
  }
];

export const CATEGORIES = [
  { id: "navigation", name: "Navigation", color: "bg-blue-100 text-blue-800" },
  { id: "editing", name: "Editing", color: "bg-green-100 text-green-800" },
  { id: "debugging", name: "Debugging", color: "bg-red-100 text-red-800" },
  { id: "system", name: "System", color: "bg-purple-100 text-purple-800" },
  { id: "window", name: "Window Management", color: "bg-yellow-100 text-yellow-800" }
];

export const SHORTCUTS_DATA: ShortcutData[] = [
  // PHPStorm shortcuts
  {
    id: "phpstorm-quick-open",
    title: "Quick Open File",
    shortcut: "Ctrl+Shift+N",
    description: "Quickly open any file in your project",
    category: "navigation",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-go-declaration",
    title: "Go to Declaration",
    shortcut: "Ctrl+B",
    description: "Navigate to the declaration of a symbol",
    category: "navigation",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-find-files",
    title: "Find in Files",
    shortcut: "Ctrl+Shift+F",
    description: "Search for text across all project files",
    category: "navigation",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-recent-files",
    title: "Recent Files",
    shortcut: "Ctrl+E",
    description: "Show recently opened files",
    category: "navigation",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-duplicate-line",
    title: "Duplicate Line",
    shortcut: "Ctrl+D",
    description: "Duplicate the current line or selection",
    category: "editing",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-multiple-cursors",
    title: "Multiple Cursors",
    shortcut: "Alt+Click",
    description: "Add multiple cursors for simultaneous editing",
    category: "editing",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-comment-line",
    title: "Comment Line",
    shortcut: "Ctrl+/",
    description: "Toggle line comment",
    category: "editing",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-reformat-code",
    title: "Reformat Code",
    shortcut: "Ctrl+Alt+L",
    description: "Automatically format code according to style settings",
    category: "editing",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-toggle-breakpoint",
    title: "Toggle Breakpoint",
    shortcut: "Ctrl+F8",
    description: "Toggle breakpoint at current line",
    category: "debugging",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-step-over",
    title: "Step Over",
    shortcut: "F8",
    description: "Step over to the next line in debugging",
    category: "debugging",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-step-into",
    title: "Step Into",
    shortcut: "F7",
    description: "Step into function calls during debugging",
    category: "debugging",
    platform: "phpstorm"
  },
  {
    id: "phpstorm-resume-program",
    title: "Resume Program",
    shortcut: "F9",
    description: "Continue program execution",
    category: "debugging",
    platform: "phpstorm"
  },

  // Arch Linux shortcuts
  {
    id: "arch-package-update",
    title: "Package Update",
    shortcut: "sudo pacman -Syu",
    description: "Update all installed packages",
    category: "system",
    platform: "archlinux"
  },
  {
    id: "arch-install-package",
    title: "Install Package",
    shortcut: "sudo pacman -S [package]",
    description: "Install a specific package",
    category: "system",
    platform: "archlinux"
  },
  {
    id: "arch-remove-package",
    title: "Remove Package",
    shortcut: "sudo pacman -R [package]",
    description: "Remove a package",
    category: "system",
    platform: "archlinux"
  },
  {
    id: "arch-search-package",
    title: "Search Package",
    shortcut: "pacman -Ss [query]",
    description: "Search for packages in repositories",
    category: "system",
    platform: "archlinux"
  },
  {
    id: "arch-open-terminal",
    title: "Open Terminal",
    shortcut: "Ctrl+Alt+T",
    description: "Open a new terminal window",
    category: "window",
    platform: "archlinux"
  },
  {
    id: "arch-switch-desktop",
    title: "Switch Desktop",
    shortcut: "Ctrl+Alt+Arrow",
    description: "Switch between virtual desktops",
    category: "window",
    platform: "archlinux"
  },
  {
    id: "arch-directory-nav",
    title: "Directory Navigation",
    shortcut: "cd ..",
    description: "Go up one directory level",
    category: "navigation",
    platform: "archlinux"
  },
  {
    id: "arch-list-files",
    title: "List Files",
    shortcut: "ls -la",
    description: "List all files with detailed information",
    category: "navigation",
    platform: "archlinux"
  },

  // Ubuntu shortcuts
  {
    id: "ubuntu-update-system",
    title: "Update System",
    shortcut: "sudo apt update && sudo apt upgrade",
    description: "Update package list and upgrade all packages",
    category: "system",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-install-package",
    title: "Install Package",
    shortcut: "sudo apt install [package]",
    description: "Install a specific package",
    category: "system",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-remove-package",
    title: "Remove Package",
    shortcut: "sudo apt remove [package]",
    description: "Remove a package",
    category: "system",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-search-package",
    title: "Search Package",
    shortcut: "apt search [query]",
    description: "Search for packages in repositories",
    category: "system",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-show-applications",
    title: "Show Applications",
    shortcut: "Super",
    description: "Open activities overview and application launcher",
    category: "window",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-switch-windows",
    title: "Switch Windows",
    shortcut: "Alt+Tab",
    description: "Switch between open applications",
    category: "window",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-lock-screen",
    title: "Lock Screen",
    shortcut: "Super+L",
    description: "Lock the screen",
    category: "window",
    platform: "ubuntu"
  },
  {
    id: "ubuntu-take-screenshot",
    title: "Take Screenshot",
    shortcut: "PrtScr",
    description: "Take a screenshot of the entire screen",
    category: "window",
    platform: "ubuntu"
  }
];

export const getCategoryColor = (category: string): string => {
  const categoryData = CATEGORIES.find(cat => cat.id === category);
  return categoryData?.color || "bg-gray-100 text-gray-800";
};

export const getPlatformData = (platformId: string) => {
  return PLATFORMS.find(platform => platform.id === platformId);
};

export const getShortcutsByPlatform = (platform: string): ShortcutData[] => {
  return SHORTCUTS_DATA.filter(shortcut => shortcut.platform === platform);
};

export const getShortcutsByCategory = (category: string): ShortcutData[] => {
  return SHORTCUTS_DATA.filter(shortcut => shortcut.category === category);
};

export const searchShortcuts = (query: string): ShortcutData[] => {
  const searchTerm = query.toLowerCase();
  return SHORTCUTS_DATA.filter(shortcut => 
    shortcut.title.toLowerCase().includes(searchTerm) ||
    shortcut.description.toLowerCase().includes(searchTerm) ||
    shortcut.shortcut.toLowerCase().includes(searchTerm)
  );
};
