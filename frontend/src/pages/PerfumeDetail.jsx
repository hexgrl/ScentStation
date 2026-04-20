import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PerfumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState(null);
  const [collectionLoading, setCollectionLoading] = useState(false);

  useEffect(() => {
    const fetchPerfume = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/perfumes/${id}`);
        const data = await res.json();
        setPerfume(data);
      } catch {
        setError("Failed to load perfume.");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfume();
  }, [id]);

  useEffect(() => {
    if (!user) return;
    const fetchCollection = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/collection", {
          credentials: "include",
        });
        const data = await res.json();
        const match = data.find((e) => e.perfumeId === Number(id));
        setCollectionStatus(match ? match.status : null);
      } catch {
        setCollectionStatus(null);
      }
    };
    fetchCollection();
  }, [user, id]);

  const handleCollection = async (status) => {
    if (collectionLoading) return;
    setCollectionLoading(true);
    try {
      if (collectionStatus === status) {
        await fetch(`http://localhost:3001/api/collection/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setCollectionStatus(null);
      } else {
        const res = await fetch("http://localhost:3001/api/collection", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ perfumeId: Number(id), status }),
        });
        const data = await res.json();
        setCollectionStatus(data.status);
      }
    } catch {
    } finally {
      setCollectionLoading(false);
    }
  };

  if (loading) return <div className="detail">Loading...</div>;
  if (error) return <div className="detail">{error}</div>;
  if (!perfume) return <div className="detail">Not found</div>;

  const topNotes = perfume.notes.filter((n) => n.layer === "top");
  const middleNotes = perfume.notes.filter((n) => n.layer === "middle");
  const baseNotes = perfume.notes.filter((n) => n.layer === "base");

  return (
    <div className="detail">
      <div className="detail-actions">
        <button onClick={() => navigate(-1)}>← Back</button>
        {user && (
          <>
            <button
              onClick={() => handleCollection("owned")}
              disabled={collectionLoading}
            >
              {collectionStatus === "owned" ? "✓ Owned" : "Add to Owned"}
            </button>
            <button
              onClick={() => handleCollection("wishlisted")}
              disabled={collectionLoading}
            >
              {collectionStatus === "wishlisted" ? "✓ Wishlisted" : "Wishlist"}
            </button>
          </>
        )}
      </div>

      <h1>{perfume.name}</h1>
      <h2>{perfume.brand}</h2>

      <div className="meta">
        {perfume.gender && <span>{perfume.gender}</span>}
        {perfume.year && <span>{perfume.year}</span>}
        {perfume.country && <span>{perfume.country}</span>}
        {perfume.ratingValue && (
          <span>
            ⭐ {perfume.ratingValue} ({perfume.ratingCount?.toLocaleString()} ratings)
          </span>
        )}
      </div>

      {perfume.accords.length > 0 && (
        <div className="section">
          <h3>Accords</h3>
          <div className="tags">
            {perfume.accords.map((a) => (
              <span key={a.accordId} className="tag">
                {a.accord.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {topNotes.length > 0 && (
        <div className="section">
          <h3>Top Notes</h3>
          <div className="tags">
            {topNotes.map((n) => (
              <span key={n.noteId} className="tag">
                {n.note.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {middleNotes.length > 0 && (
        <div className="section">
          <h3>Middle Notes</h3>
          <div className="tags">
            {middleNotes.map((n) => (
              <span key={n.noteId} className="tag">
                {n.note.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {baseNotes.length > 0 && (
        <div className="section">
          <h3>Base Notes</h3>
          <div className="tags">
            {baseNotes.map((n) => (
              <span key={n.noteId} className="tag">
                {n.note.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {(perfume.perfumer1 || perfume.perfumer2) && (
        <div className="section">
          <h3>Perfumers</h3>
          <p>
            {[perfume.perfumer1, perfume.perfumer2].filter(Boolean).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}