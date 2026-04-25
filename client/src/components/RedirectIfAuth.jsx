import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabase";

// This function redirects the user to the pantry page if they are already logged in. It is used on the login and register pages.
export default function RedirectIfAuth({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
// This function listens for changes in the user's authentication state and updates the session state accordingly. It is used to ensure that the user is redirected to the pantry page if they are already logged in.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });
// This function unsubscribes from the authentication state change listener when the component is unmounted. It is used to prevent memory leaks.
    return () => subscription.unsubscribe();
  }, []);

// This function returns null if the session state is undefined. It is used to prevent the component from rendering before the session state is set.
  if (session === undefined) return null;

  if (session !== null) return <Navigate to="/pantry" replace />;
  return children;
}
// End of Program.