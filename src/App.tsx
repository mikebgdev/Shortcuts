import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import ShortcutsPage from '@/pages/Home';
import QuizPage from '@/pages/Quiz';
import FirebaseAdminPage from '@/pages/FirebaseAdmin';
import { ToastProvider } from '@/contexts/ToastContext';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    const handleErrorEvent = (event: ErrorEvent) => {
      const umami = (window as any).umami;
      if (umami) {
        umami.track('Unhandled Error', {
          message: event.message,
          stack: event.error?.stack,
        });
      }
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      const umami = (window as any).umami;
      if (umami) {
        umami.track('Unhandled Rejection', { reason: event.reason });
      }
    };
    window.addEventListener('error', handleErrorEvent);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleErrorEvent);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Switch>
              <Route path="/" component={ShortcutsPage} />
              <Route path="/shortcuts" component={ShortcutsPage} />
              <Route path="/quiz" component={QuizPage} />
              <Route path="/firebase-admin" component={FirebaseAdminPage} />
            </Switch>
          </TooltipProvider>
        </FavoritesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
