'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
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
    if (isUserLoading) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setUserLoading(false);
      });
      return () => unsubscribe();
    }
  }, [auth, isUserLoading]);
  return { user, isUserLoading };
}
