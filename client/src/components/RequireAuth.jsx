// The code below is a React component that checks if a user is authenticated using Supabase. If the user is not authenticated, it redirects them to the login page. If the user is authenticated, it renders the children components.
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabase";

// This component is used to protect routes that require authentication.
export default function RequireAuth({ children }) {
  const [session, setSession] = useState(undefined); // undefined means we don't know yet

// Here we check if the user is authenticated using Supabase. If the user is not authenticated, we redirect them to the login page. If the user is authenticated, we render the children components.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
// Here we listen for changes in the authentication state. If the user logs in or out, we update the session state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });
// This will be called when the component is unmounted. It unsubscribes from the authentication state changes.
    return () => subscription.unsubscribe();
  }, []);
// If the session is undefined, we return null. This means we don't know yet if the user is authenticated or not. If the session is null, we redirect the user to the login page. If the session is not null, we render the
  if (session === undefined) return null;
  if (session === null) return <Navigate to="/login" replace />;
  return children;
}
// End of Code.
