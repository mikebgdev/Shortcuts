import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Heart, Check, StickyNote, Tag, Plus, X } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EnhancedShortcutCardProps {
  shortcut: Shortcut;
  categoryColor: string;
  searchTerm: string;
  viewMode?: 'compact' | 'expanded';
}

// Helper function for category colors
const getCategoryColorClass = (category: string) => {
  const colorMap = {
    'navigation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'editing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'debugging': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'system': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'window': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  };
  return colorMap[category as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
};

export default function EnhancedShortcutCard({ shortcut, categoryColor, searchTerm, viewMode = 'compact' }: EnhancedShortcutCardProps) {
  const [copied, setCopied] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const favorite = isFavorite(shortcut.id);
  const userId = 1; // Using demo user

  // Queries
  const { data: userNote } = useQuery({
    queryKey: ['/api/notes', userId, shortcut.id],
    queryFn: () => apiRequest(`/api/notes/${userId}/${shortcut.id}`),
  });

  const { data: shortcutTags = [] } = useQuery({
    queryKey: ['/api/shortcut-tags', userId, shortcut.id],
    queryFn: () => apiRequest(`/api/shortcut-tags/${userId}/${shortcut.id}`),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['/api/tags'],
    queryFn: () => apiRequest('/api/tags'),
  });

  // Mutations
  const createNoteMutation = useMutation({
    mutationFn: (note: string) => 
      apiRequest('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ userId, shortcutId: shortcut.id, note }),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', userId, shortcut.id] });
      setNoteDialogOpen(false);
      setNoteText("");
      toast({ title: "Nota guardada", description: "Tu nota personal ha sido guardada." });
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: (note: string) =>
      apiRequest(`/api/notes/${userId}/${shortcut.id}`, {
        method: 'PUT',
        body: JSON.stringify({ note }),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', userId, shortcut.id] });
      setNoteDialogOpen(false);
      setNoteText("");
      toast({ title: "Nota actualizada", description: "Tu nota personal ha sido actualizada." });
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: () => apiRequest(`/api/notes/${userId}/${shortcut.id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes', userId, shortcut.id] });
      setNoteDialogOpen(false);
      setNoteText("");
      toast({ title: "Nota eliminada", description: "Tu nota personal ha sido eliminada." });
    }
  });

  const addTagMutation = useMutation({
    mutationFn: (tagId: number) =>
      apiRequest('/api/shortcut-tags', {
        method: 'POST',
        body: JSON.stringify({ userId, shortcutId: shortcut.id, tagId }),
        headers: { 'Content-Type': 'application/json' }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shortcut-tags', userId, shortcut.id] });
      toast({ title: "Etiqueta añadida", description: "La etiqueta ha sido añadida al shortcut." });
    }
  });

  const removeTagMutation = useMutation({
    mutationFn: (tagId: number) =>
      apiRequest(`/api/shortcut-tags/${userId}/${shortcut.id}/${tagId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shortcut-tags', userId, shortcut.id] });
      toast({ title: "Etiqueta removida", description: "La etiqueta ha sido removida del shortcut." });
    }
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortcut.shortcut);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "El shortcut ha sido copiado al portapapeles.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el shortcut.",
        variant: "destructive",
      });
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(shortcut.id);
    toast({
      title: favorite ? "Removido de favoritos" : "Añadido a favoritos",
      description: favorite ? "El shortcut ya no está en tus favoritos." : "El shortcut ha sido añadido a tus favoritos.",
    });
  };

  const handleSaveNote = () => {
    if (userNote) {
      updateNoteMutation.mutate(noteText);
    } else {
      createNoteMutation.mutate(noteText);
    }
  };

  const handleDeleteNote = () => {
    deleteNoteMutation.mutate();
  };

  const handleNoteDialogOpen = () => {
    setNoteText(userNote?.note || "");
    setNoteDialogOpen(true);
  };

  const handleAddTag = (tagId: string) => {
    const tag = allTags.find((t: TagType) => t.id === parseInt(tagId));
    if (tag && !shortcutTags.some((st: TagType) => st.id === tag.id)) {
      addTagMutation.mutate(tag.id);
    }
    setTagDialogOpen(false);
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group border-l-4" 
          style={{ borderLeftColor: categoryColor }}>
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
                    userNote ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
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
                    <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveNote} disabled={!noteText.trim()}>
                      Guardar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 flex-shrink-0 text-gray-400 hover:text-green-500"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Etiqueta</DialogTitle>
                  <DialogDescription>
                    Selecciona una etiqueta para organizar este shortcut.
                  </DialogDescription>
                </DialogHeader>
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTags
                      .filter((tag: TagType) => !shortcutTags.some((st: TagType) => st.id === tag.id))
                      .map((tag: TagType) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

          {/* Tags */}
          {shortcutTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {shortcutTags.map((tag: TagType) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs px-2 py-1 flex items-center gap-1"
                  style={{ borderColor: tag.color, color: tag.color }}
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTagMutation.mutate(tag.id)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* User Note */}
          {userNote && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Mi Nota Personal</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">{userNote.note}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}