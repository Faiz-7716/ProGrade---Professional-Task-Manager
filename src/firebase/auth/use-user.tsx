'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
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
    // The onAuthStateChanged listener is the single source of truth for auth state.
    // It correctly handles all cases, including the result of a redirect.
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setUserLoading(false);
    });

    // Unsubscribe on unmount to prevent memory leaks
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading };
}
