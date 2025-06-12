import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Shortcut } from "@shared/schema";
import SearchHeader from "@/components/search-header";
import PlatformSidebar from "@/components/platform-sidebar";
import ShortcutCard from "@/components/shortcut-card";

const PLATFORMS = [
  { id: "phpstorm", name: "PHPStorm", icon: "fab fa-php" },
  { id: "archlinux", name: "Arch Linux", icon: "fab fa-linux" },
  { id: "ubuntu", name: "Ubuntu", icon: "fab fa-ubuntu" }
];

const CATEGORIES = [
  { id: "navigation", name: "Navigation" },
  { id: "editing", name: "Editing" },
  { id: "debugging", name: "Debugging" },
  { id: "system", name: "System" },
  { id: "window", name: "Window Management" }
];

export default function ShortcutsPage() {
  const [activePlatform, setActivePlatform] = useState("phpstorm");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategories, setActiveCategories] = useState(
    CATEGORIES.map(cat => cat.id)
  );

  const { data: shortcuts = [], isLoading } = useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts"],
  });

  // Filter shortcuts based on current filters
  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesPlatform = shortcut.platform === activePlatform;
    const matchesCategory = activeCategories.includes(shortcut.category);
    const matchesSearch = searchTerm === "" || 
      shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.shortcut.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPlatform && matchesCategory && matchesSearch;
  });

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setActiveCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      navigation: "bg-blue-100 text-blue-800",
      editing: "bg-green-100 text-green-800",
      debugging: "bg-red-100 text-red-800",
      system: "bg-purple-100 text-purple-800",
      window: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const currentPlatform = PLATFORMS.find(p => p.id === activePlatform);

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <PlatformSidebar
            platforms={PLATFORMS}
            categories={CATEGORIES}
            activePlatform={activePlatform}
            activeCategories={activeCategories}
            onPlatformChange={setActivePlatform}
            onCategoryToggle={handleCategoryToggle}
          />
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {currentPlatform?.name} Shortcuts
              </h2>
              <p className="text-slate-600">
                Essential keyboard shortcuts for efficient {currentPlatform?.name.toLowerCase()} usage
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredShortcuts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShortcuts.map(shortcut => (
                  <ShortcutCard
                    key={shortcut.id}
                    shortcut={shortcut}
                    categoryColor={getCategoryColor(shortcut.category)}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-slate-300 mb-4"></i>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No shortcuts found</h3>
                <p className="text-slate-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
