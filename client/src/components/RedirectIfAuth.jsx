// What this does is it redirects the user to the pantry page if they are already logged in.
import { useEffect, useState } from "react"; // eslint-disable-line
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabase"; // eslint-disable-line

// Redirects the user to the pantry page if they are already logged in.
export default function RedirectIfAuth({ children }) {
  const [session, setSession] = useState(undefined);
// eslint-disable-next-line
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
// This code will run when the user logs in or out. It will update the session state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });
// This code will run when the component unmounts. It will unsubscribe from the auth state change event.
    return () => subscription.unsubscribe();
  }, []);

// This code will run when the session state changes. It will redirect the user to the pantry page if they are logged in.
  if (session === undefined) return null; 
  if (session !== null) return <Navigate to="/pantry" replace />; 
  return children;
}
// End of Code