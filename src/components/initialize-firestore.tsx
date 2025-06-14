import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import {
  initializeFirestore,
  isFirestoreInitialized,
} from '@/lib/initFirestore';

export function InitializeFirestore() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const initialized = await isFirestoreInitialized();

      if (initialized) {
        setIsInitialized(true);
        setIsInitializing(false);
        return;
      }

      const success = await initializeFirestore();
      setIsInitialized(success);
    } catch (err) {
      console.error('Error initializing Firestore:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      setIsInitialized(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const checkInitialization = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const initialized = await isFirestoreInitialized();
      setIsInitialized(initialized);
    } catch (err) {
      console.error('Error checking Firestore initialization:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Initialize Firestore Database</CardTitle>
        <CardDescription>
          Create initial data in Firestore from the shortcuts data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isInitialized === true && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Firestore has been successfully initialized with data.
            </AlertDescription>
          </Alert>
        )}

        {isInitialized === false && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Failed to initialize Firestore. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-500 mb-4">
          This will create the following collections in Firestore:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-500 mb-4">
          <li>Platforms</li>
          <li>Categories</li>
          <li>Shortcuts</li>
        </ul>
        <p className="text-sm text-gray-500">
          If the collections already exist, no data will be added.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={checkInitialization}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Status'
          )}
        </Button>
        <Button
          onClick={handleInitialize}
          disabled={isInitializing || isInitialized === true}
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            'Initialize Firestore'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
