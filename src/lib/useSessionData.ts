// src/content/session/useSessionData.ts
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

// Defining the hook with proper type annotations
export const useSessionData = () => {
  const [session, setSession] = useState<Session | null>(null);  // Explicitly type the useState
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();  // getSession fetches the session asynchronously
      setSession(sessionData);                // No type error here as sessionData is Session | null
      setLoading(false);
    };

    fetchSession();
  }, []);

  return { session, loading };
};
