import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Collection() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("owned");

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:3001/api/collection", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch collection");
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  function handleRemove(perfumeId) {
    fetch(`http://localhost:3001/api/collection/${perfumeId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.perfumeId !== perfumeId));
      }
    });
  }

  if (!user) return <p>Please log in to view your collection.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filtered = entries.filter((e) => e.status === activeTab);

  return (
    <div className="collection-page">
      <h1>My Collection</h1>
      <div className="collection-tabs">
        <button
          className={activeTab === "owned" ? "active" : ""}
          onClick={() => setActiveTab("owned")}>
          Owned
        </button>
        <button
          className={activeTab === "wishlisted" ? "active" : ""}
          onClick={() => setActiveTab("wishlisted")}>
          Wishlist
        </button>
      </div>
      {filtered.length === 0 ? (
        <p>Nothing here yet.</p>
      ) : (
        <ul className="collection-list">
          {filtered.map((entry) => (
            <li key={entry.perfumeId} className="collection-item">
              <Link to={`/perfume/${entry.perfumeId}`}>
                <strong>{entry.perfume.name}</strong>
                <span>{entry.perfume.brand}</span>
              </Link>
              <button onClick={() => handleRemove(entry.perfumeId)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
