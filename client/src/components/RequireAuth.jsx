import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabase";

// We use this component to protect routes that require authentication. If the user is not authenticated, they will be redirected to the login page.
export default function RequireAuth({ children }) {
  const [session, setSession] = useState(undefined);
  const [expired, setExpired] = useState(false);
  const location = useLocation();

  const hadSession = useRef(false);

  useEffect(() => {
// This function is used to check if the user is authenticated. If the user is authenticated, the user will be redirected to the home page. If the user is not authenticated, the user will be redirected to the login page.
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session ?? null;
      if (s) hadSession.current = true;
      setSession(s);
    });

// This function is used to check if the user is authenticated. If the user is authenticated, the user will be redirected to the home page. If the user is not authenticated, the user will be redirected to the login page.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" && !newSession
      ) {

        if (hadSession.current) setExpired(true);
        setSession(null);
      } else if (newSession) {
        hadSession.current = true;
        setSession(newSession);
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  if (session === undefined) return null;


  if (session === null) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          sessionExpired: expired || hadSession.current,
        }}
      />
    );
  }


  return children;
}

// End of Program