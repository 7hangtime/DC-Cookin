import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStores() {
      const res = await fetch("http://localhost:3001/api/stores/");
      const data = await res.json();
      setStores(data);
    }

    loadStores();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Stores</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => navigate(`/stores/${store.id}`)}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <h3>{store.name}</h3>
            <p>{store.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
