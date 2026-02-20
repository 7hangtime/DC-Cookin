import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function Pantry() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUser(data.session.user);
    };
    fetchSession();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Pantry Page (Auth Test)</h2>
      {user ? <p>Logged in as: {user.email}</p> : <p>Not logged in</p>}
    </div>
  );
}
