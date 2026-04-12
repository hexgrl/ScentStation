import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Browse() {
  const [perfumes, setPerfumes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page });
        if (search) params.set("search", search);
        const res = await fetch(`http://localhost:3001/api/perfumes?${params}`);
        const data = await res.json();
        setPerfumes(data.perfumes);
        setTotalPages(data.pages);
      } catch {
        setError("Failed to load perfumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfumes();
  }, [search, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="browse">
      <h1>ScentStation</h1>
      <input
        type="text"
        placeholder="Search perfumes or brands..."
        value={search}
        onChange={handleSearch}
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="grid">
        {perfumes.map((perfume) => (
          <div
            key={perfume.id}
            className="card"
            onClick={() => navigate(`/perfume/${perfume.id}`)}>
            <div className="card-image-placeholder" />
            <div className="card-info">
              <h2>{perfume.name}</h2>
              <p>{perfume.brand}</p>
              {perfume.accords.length > 0 && (
                <span className="accord">{perfume.accords[0].accord.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
