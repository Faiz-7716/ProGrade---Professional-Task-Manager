'use client';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { useEffect, useState }from 'react';
import { useAuth } from '@/firebase/provider';

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
}

export function useUser(): UserHookResult {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setUserLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    // This flag helps prevent race conditions
    let isMounted = true; 

    const handleAuth = async () => {
      // First, check if a redirect just happened.
      try {
        const result = await getRedirectResult(auth);
        if (result && isMounted) {
          // A redirect sign-in was successful.
          // onAuthStateChanged will handle setting the user, but we can stop the loading indicator sooner.
           setUser(result.user);
           setUserLoading(false);
        }
      } catch (error) {
        // Handle redirect errors if necessary
        console.error("Redirect sign-in error:", error);
      }
      
      // Set up the primary listener for auth state changes.
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (isMounted) {
          setUser(user);
          setUserLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    }

    handleAuth();

  }, [auth]);

  return { user, isUserLoading };
}
