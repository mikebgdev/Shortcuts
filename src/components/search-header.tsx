import { Search, Moon, Sun, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchHeader({ searchTerm, onSearchChange }: SearchHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-keyboard text-2xl text-primary"></i>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shortcuts Hub</h1>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 h-4 w-4" />
              <Input
                id="searchInput"
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-3 bg-white dark:bg-gray-800 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/firebase-admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
              >
                <Database className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Firebase Admin</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500 dark:text-gray-400 hidden sm:block">Press</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded hidden sm:inline-block">
                Ctrl+K
              </kbd>
              <span className="text-sm text-slate-500 dark:text-gray-400 hidden sm:block">to search</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
