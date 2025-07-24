import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear guest session if user signs in
        if (session?.user) {
          localStorage.removeItem('guestSessionId');
          setGuestSessionId(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If no user session, check for guest session
      if (!session?.user) {
        const storedGuestId = localStorage.getItem('guestSessionId');
        if (storedGuestId) {
          setGuestSessionId(storedGuestId);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Also clear guest session on explicit sign out
    localStorage.removeItem('guestSessionId');
    setGuestSessionId(null);
  };

  const getSessionId = () => {
    if (user?.id) {
      return user.id; // Use user ID for authenticated users
    }
    return guestSessionId; // Use guest session ID for anonymous users
  };

  const isAuthenticated = !!user;
  const hasSession = !!(user || guestSessionId);

  return { 
    user, 
    session, 
    guestSessionId,
    loading, 
    signOut, 
    getSessionId,
    isAuthenticated,
    hasSession
  };
};