import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth, authHeaders } from "../context/AuthContext";
import API from "../lib/api";

export default function PerfumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState(null);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionError, setCollectionError] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    const fetchPerfume = async () => {
      try {
        const res = await fetch(`${API}/api/perfumes/${id}`);
        if (!res.ok) throw new Error("Failed to load perfume.");
        const data = await res.json();
        setPerfume(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfume();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      setSimilarLoading(true);
      try {
        const res = await fetch(`${API}/api/perfumes/${id}/similar`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSimilar(Array.isArray(data) ? data : []);
      } catch {
        setSimilar([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [id]);

  useEffect(() => {
    if (!user) return;
    const fetchCollection = async () => {
      try {
        const res = await fetch(`${API}/api/collection`, {
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error();
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
    setCollectionError(null);
    try {
      if (collectionStatus === status) {
        const res = await fetch(`${API}/api/collection/${id}`, {
          method: "DELETE",
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error("Failed to update collection.");
        setCollectionStatus(null);
      } else {
        const res = await fetch(`${API}/api/collection`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ perfumeId: Number(id), status }),
        });
        if (!res.ok) throw new Error("Failed to update collection.");
        const data = await res.json();
        setCollectionStatus(data.status);
      }
    } catch (err) {
      setCollectionError(err.message);
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
            <button onClick={() => handleCollection("owned")} disabled={collectionLoading}>
              {collectionStatus === "owned" ? "✓ Owned" : "Add to Owned"}
            </button>
            <button onClick={() => handleCollection("wishlisted")} disabled={collectionLoading}>
              {collectionStatus === "wishlisted" ? "✓ Wishlisted" : "Wishlist"}
            </button>
          </>
        )}
      </div>

      {collectionError && <p className="error">{collectionError}</p>}

      <h1>{perfume.name}</h1>
      <h2>{perfume.brand}</h2>

      <div className="meta">
        {perfume.gender && <span>{perfume.gender}</span>}
        {perfume.year && <span>{perfume.year}</span>}
        {perfume.country && <span>{perfume.country}</span>}
        {perfume.ratingValue && (
          <span>⭐ {perfume.ratingValue} ({perfume.ratingCount?.toLocaleString()} ratings)</span>
        )}
      </div>

      {perfume.accords.length > 0 && (
        <div className="section">
          <h3>Accords</h3>
          <div className="tags">
            {perfume.accords.map((a) => (
              <Link key={a.accordId} className="tag" to={`/?accord=${encodeURIComponent(a.accord.name)}`}>
                {a.accord.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {topNotes.length > 0 && (
        <div className="section">
          <h3>Top Notes</h3>
          <div className="tags">
            {topNotes.map((n) => (
              <Link key={n.noteId} className="tag" to={`/?note=${encodeURIComponent(n.note.name)}`}>
                {n.note.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {middleNotes.length > 0 && (
        <div className="section">
          <h3>Middle Notes</h3>
          <div className="tags">
            {middleNotes.map((n) => (
              <Link key={n.noteId} className="tag" to={`/?note=${encodeURIComponent(n.note.name)}`}>
                {n.note.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {baseNotes.length > 0 && (
        <div className="section">
          <h3>Base Notes</h3>
          <div className="tags">
            {baseNotes.map((n) => (
              <Link key={n.noteId} className="tag" to={`/?note=${encodeURIComponent(n.note.name)}`}>
                {n.note.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(perfume.perfumer1 || perfume.perfumer2) && (
        <div className="section">
          <h3>Perfumers</h3>
          <p>{[perfume.perfumer1, perfume.perfumer2].filter(Boolean).join(", ")}</p>
        </div>
      )}

      <div className="section similar">
        <h3>Similar Perfumes</h3>
        {similarLoading ? (
          <p className="muted">Loading...</p>
        ) : similar.length > 0 ? (
          <div className="similar-grid">
            {similar.map((p) => (
              <div key={p.id} className="card" onClick={() => navigate(`/perfume/${p.id}`)}>
                <div className="card-info">
                  <span className="card-name">{p.name}</span>
                  <span className="card-brand">{p.brand}</span>
                  {p.accords[0] && <span className="accord">{p.accords[0].accord.name}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No similar perfumes found.</p>
        )}
      </div>
    </div>
  );
}