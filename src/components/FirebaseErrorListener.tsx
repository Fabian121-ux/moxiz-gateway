
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In development, we want to surface this clearly.
      // In production, you might want to log this to an error reporting service.
      console.error('Firebase Permission Error:', error.message, error.context);
      
      toast({
        variant: "destructive",
        title: "Security Rule Denied",
        description: `Operation ${error.context.operation} at ${error.context.path} was blocked.`,
      });

      // Re-throw so it hits the Next.js error boundary if applicable
      // throw error; 
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
