import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StoreInventoryPage() {
  const { id } = useParams();
  const [inventory, setInventory] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    async function load() {
      // get inventory
      const res = await fetch(
        `http://localhost:3001/api/stores/${id}/inventory`
      );
      const data = await res.json();
      setInventory(data);

    
      const storeRes = await fetch(`http://localhost:3001/api/stores`);
      const stores = await storeRes.json();
      setStore(stores.find((s) => s.id === id));
    }

    load();
  }, [id]);

  return (
    <div style={{ padding: 40 }}>
      <h2>{store?.name || "Store"} Inventory</h2>

      {inventory.length === 0 ? (
        <p>This store has no inventory.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {inventory.map((item) => (
            <div
              key={item.id}
              style={{
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <strong>{item.ingredient?.ingredient_name}</strong>
              <div>Quantity: {item.quantity}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
