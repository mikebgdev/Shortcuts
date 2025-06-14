import { useEffect, useState } from 'react';
import SearchHeader from '@/components/search-header';
import PlatformSidebar from '@/components/platform-sidebar';
import { getCategories, getPlatforms, getShortcuts } from '@/lib/firebase';
import type { Category, Platform, Shortcut } from '@/lib/types';

import EnhancedShortcutCard from '@/components/enhanced-shortcut-card';
import { Button } from '@/components/ui/button';
import { Brain, Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Link } from 'wouter';

export default function ShortcutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [activePlatform, setActivePlatform] = useState<Platform|undefined>();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const data = await getPlatforms();
        setPlatforms(data);
        if (!activePlatform && data.length > 0) {
          setActivePlatform(data[0]);
        }
      } catch (error) {
        console.error('Error fetching platforms:', error);
      }
    };

    fetchPlatforms();
  }, [activePlatform]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (activeCategories.length === 0) {
          setActiveCategories(data.map((cat) => cat));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [activeCategories.length]);

  useEffect(() => {
    const fetchShortcuts = async () => {
      setIsLoading(true);
      try {
        const data = await getShortcuts();
        setShortcuts(data);
      } catch (error) {
        console.error('Error fetching shortcuts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortcuts();
  }, []);

  const { favorites } = useFavorites();

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesPlatform = activePlatform
      ? shortcut.platform === activePlatform.originalId
      : true;
    const matchesCategory =
      activeCategories.length > 0
        ? activeCategories.some(
            (category) => category.originalId === shortcut.category,
          )
        : true;
    const matchesSearch =
      searchTerm === '' ||
      shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.shortcut.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites =
      !showFavoritesOnly || favorites.includes(shortcut.id);

    return (
      matchesPlatform && matchesCategory && matchesSearch && matchesFavorites
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById(
          'searchInput',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoryToggle = (category: Category) => {
    setActiveCategories((prev) =>
      prev.some((c) => c.id === category.id)
        ? prev.filter((cat) => cat.id !== category.id)
        : [...prev, category],
    );
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = categories.find((cat) => cat.id === category);
    if (categoryObj && categoryObj.color) {
      return categoryObj.color;
    }

    const colors = {
      navigation: 'bg-blue-100 text-blue-800',
      editing: 'bg-green-100 text-green-800',
      debugging: 'bg-red-100 text-red-800',
      system: 'bg-purple-100 text-purple-800',
      window: 'bg-yellow-100 text-yellow-800',
    };
    return (
      colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    );
  };

  const currentPlatform = platforms.find(
      (p) => p.originalId === activePlatform?.originalId,
  );


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <SearchHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <PlatformSidebar
            platforms={platforms}
            categories={categories}
            activePlatform={activePlatform}
            activeCategories={activeCategories}
            onPlatformChange={setActivePlatform}
            onCategoryToggle={handleCategoryToggle}
          />

          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {currentPlatform?.name} Shortcuts
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300">
                    Essential keyboard shortcuts for efficient{' '}
                    {currentPlatform?.name.toLowerCase()} usage
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/quiz">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      Modo Práctica
                    </Button>
                  </Link>
                  <Button
                    variant={showFavoritesOnly ? 'default' : 'outline'}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="flex items-center space-x-2"
                  >
                    <Heart
                      className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`}
                    />
                    <span>
                      {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm text-gray-500">
                  {filteredShortcuts.length} shortcuts
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredShortcuts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShortcuts.map((shortcut) => (
                  <EnhancedShortcutCard
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
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No shortcuts found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
