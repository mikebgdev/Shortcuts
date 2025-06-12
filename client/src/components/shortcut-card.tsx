import { useState } from "react";
import type { Shortcut } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortcutCardProps {
  shortcut: Shortcut;
  categoryColor: string;
  searchTerm: string;
}

export default function ShortcutCard({ shortcut, categoryColor, searchTerm }: ShortcutCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortcut.shortcut);
      setCopied(true);
      toast({
        description: "Copied to clipboard!",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        description: "Failed to copy to clipboard",
        variant: "destructive",
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
      )
    );
  };

  const renderShortcut = (shortcutText: string) => {
    if (shortcutText.includes('sudo') || shortcutText.includes('pacman') || shortcutText.includes('apt')) {
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
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-900">
          {highlightText(shortcut.title, searchTerm)}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-400 hover:text-primary p-1 h-auto"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {renderShortcut(shortcut.shortcut)}

      <p className="text-sm text-slate-600 mb-3">
        {highlightText(shortcut.description, searchTerm)}
      </p>

      <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${categoryColor}`}>
        {shortcut.category}
      </span>
    </div>
  );
}
