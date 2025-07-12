'use client';

import useSWR from 'swr';
import { getAuthSession } from '@/lib/auth/session';
import { useEffect, useState } from 'react';
import { getSignInUrl } from '@/lib/auth/auth-app-url';

export function useSession() {
  const { data: session, error } = useSWR('session', () => getAuthSession(), {
    revalidateOnFocus: true,
    revalidateOnMount: false,
    errorRetryCount: 0,
    dedupingInterval: 0,
  });

  // Force page reload if userId changes. This ensures that the jwt is updated
  const [prevUserId, setPrevUserId] = useState(session?.session?.userId);

  useEffect(() => {
    if (session?.session?.userId !== prevUserId) {
      setPrevUserId(session?.session?.userId);
      window.location.reload();
    }
  }, [session?.session?.userId, prevUserId]);

  if (error || !session) {
    const signInUrl = getSignInUrl();
    window.location.replace(signInUrl);
    return null;
  }

  return session;
}
