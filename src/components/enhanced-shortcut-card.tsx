import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, Copy, Heart, StickyNote, X } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import {
  createUserNote,
  deleteUserNote,
  getUserNote,
  updateUserNote,
} from '@/lib/firebase';
import { useToast } from '@/contexts/ToastContext';
import type { Shortcut, UserNote } from '@/lib/types';
import { demoUserId } from '@/lib/env';

interface EnhancedShortcutCardProps {
  shortcut: Shortcut;
  categoryColor: string;
  searchTerm: string;
  viewMode?: 'compact' | 'expanded';
}

// Helper function for category colors
const getCategoryColorClass = (category: string) => {
  const colorMap = {
    navigation:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    editing:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    debugging: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    system:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    window:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  };
  return (
    colorMap[category as keyof typeof colorMap] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  );
};

export default function EnhancedShortcutCard({
  shortcut,
  categoryColor,
  searchTerm,
}: EnhancedShortcutCardProps) {
  const [copied, setCopied] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const favorite = isFavorite(shortcut.id);
  const userId = demoUserId;
  const [userNote, setUserNote] = useState<UserNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user note
  useEffect(() => {
    const fetchUserNote = async () => {
      try {
        const note = await getUserNote(userId, shortcut.id);
        setUserNote(note);
      } catch (error) {
        console.error('Error fetching user note:', error);
      }
    };

    fetchUserNote();
  }, [userId, shortcut.id]);


  // Create note
  const handleCreateNote = async (note: string) => {
    setIsLoading(true);
    try {
      await createUserNote(userId, shortcut.id, note);
      const updatedNote = await getUserNote(userId, shortcut.id);
      setUserNote(updatedNote);
      setNoteDialogOpen(false);
      setNoteText('');
      toast({
        title: 'Nota guardada',
        description: 'Tu nota personal ha sido guardada.',
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la nota.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update note
  const handleUpdateNote = async (note: string) => {
    setIsLoading(true);
    try {
      await updateUserNote(userId, shortcut.id, note);
      const updatedNote = await getUserNote(userId, shortcut.id);
      setUserNote(updatedNote);
      setNoteDialogOpen(false);
      setNoteText('');
      toast({
        title: 'Nota actualizada',
        description: 'Tu nota personal ha sido actualizada.',
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la nota.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    setIsLoading(true);
    try {
      await deleteUserNote(userId, shortcut.id);
      setUserNote(null);
      setNoteDialogOpen(false);
      setNoteText('');
      toast({
        title: 'Nota eliminada',
        description: 'Tu nota personal ha sido eliminada.',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la nota.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortcut.shortcut);
      setCopied(true);
      toast({
        title: 'Copiado!',
        description: 'El shortcut ha sido copiado al portapapeles.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo copiar el shortcut.',
      });
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(shortcut.id);
    toast({
      title: favorite ? 'Removido de favoritos' : 'Añadido a favoritos',
      description: favorite
        ? 'El shortcut ya no está en tus favoritos.'
        : 'El shortcut ha sido añadido a tus favoritos.',
    });
  };

  const handleSaveNote = () => {
    if (userNote) {
      handleUpdateNote(noteText);
    } else {
      handleCreateNote(noteText);
    }
  };

  const handleNoteDialogOpen = () => {
    setNoteText(userNote?.note || '');
    setNoteDialogOpen(true);
  };


  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-200 group border-l-4"
      style={{ borderLeftColor: categoryColor }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">
                {highlightText(shortcut.title, searchTerm)}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              {highlightText(shortcut.description, searchTerm)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNoteDialogOpen}
                  className={`p-1 h-8 w-8 flex-shrink-0 ${
                    userNote
                      ? 'text-blue-500'
                      : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nota Personal</DialogTitle>
                  <DialogDescription>
                    Añade una nota personal para recordar este shortcut.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe tu nota aquí..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    {userNote && (
                      <Button variant="destructive" onClick={handleDeleteNote}>
                        Eliminar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setNoteDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveNote}
                      disabled={!noteText.trim()}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`p-1 h-8 w-8 flex-shrink-0 ${
                favorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={`text-xs px-2 py-1 font-medium ${getCategoryColorClass(shortcut.category)}`}
            >
              {shortcut.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {shortcut.platform}
            </Badge>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <code className="text-green-400 dark:text-green-300 font-mono text-base font-semibold tracking-wide">
                {highlightText(shortcut.shortcut, searchTerm)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white transition-all"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* User Note */}
          {userNote && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Mi Nota Personal
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {userNote.note}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
