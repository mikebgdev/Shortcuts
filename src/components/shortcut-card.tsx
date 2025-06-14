import { useState } from 'react';
import type { Shortcut } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Check, Copy, Heart } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ShortcutCardProps {
  shortcut: Shortcut;
  categoryColor: string;
  searchTerm: string;
}

export default function ShortcutCard({
  shortcut,
  categoryColor,
  searchTerm,
}: ShortcutCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortcut.shortcut);
      setCopied(true);
      toast({
        title: 'Success',
        description: 'Copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failure',
        description: 'Failed to copy to clipboard',
      });
    }
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const renderShortcut = (shortcutText: string) => {
    if (
      shortcutText.includes('sudo') ||
      shortcutText.includes('pacman') ||
      shortcutText.includes('apt')
    ) {
      return (
        <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-sm mb-2">
          {shortcutText}
        </div>
      );
    }

    const keys = shortcutText.split(/[\+\s]+/).filter(Boolean);

    return (
      <div className="flex items-center space-x-1 mb-2 flex-wrap">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-slate-400 mx-1">+</span>}
            <kbd className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {highlightText(shortcut.title, searchTerm)}
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(shortcut.id)}
            className={`p-1 h-auto ${
              isFavorite(shortcut.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-slate-400 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite(shortcut.id) ? 'fill-current' : ''}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 dark:text-gray-400 hover:text-primary p-1 h-auto"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {renderShortcut(shortcut.shortcut)}

      <p className="text-sm text-slate-600 dark:text-gray-300 mb-3">
        {highlightText(shortcut.description, searchTerm)}
      </p>

      <span
        className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${categoryColor}`}
      >
        {shortcut.category}
      </span>
    </div>
  );
}
