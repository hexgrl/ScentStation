import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import accordImages from "../components/accordImages";
import API from "../lib/api";

export default function Browse() {
  const [perfumes, setPerfumes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";
  const accord = searchParams.get("accord") ?? "";
  const note = searchParams.get("note") ?? "";

  useEffect(() => {
    const fetchPerfumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page });
        if (search) params.set("search", search);
        if (accord) params.set("accord", accord);
        if (note) params.set("note", note);
        const res = await fetch(`${API}/api/perfumes?${params}`);
        if (!res.ok) throw new Error("Failed to load perfumes.");
        const data = await res.json();
        setPerfumes(data.perfumes);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfumes();
  }, [search, accord, note, page]);

  const handleSearch = (e) => {
    setSearchParams({ search: e.target.value, page: 1 });
  };

  const handlePage = (newPage) => {
    const next = { page: newPage };
    if (search) next.search = search;
    if (accord) next.accord = accord;
    if (note) next.note = note;
    setSearchParams(next);
  };

  return (
    <div className="browse">
      <div className="browse-filters">
        <input
          type="text"
          placeholder="Search perfumes or brands..."
          value={search}
          onChange={handleSearch}
        />
        {accord && (
          <span className="active-filter">
            Accord: {accord}
            <button onClick={() => setSearchParams({ page: 1, ...(note && { note }) })}>
              ✕
            </button>
          </span>
        )}
        {note && (
          <span className="active-filter">
            Note: {note}
            <button onClick={() => setSearchParams({ page: 1, ...(accord && { accord }) })}>
              ✕
            </button>
          </span>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="grid">
        {perfumes.map((perfume) => (
          <div
            key={perfume.id}
            className="card"
            onClick={() => navigate(`/perfume/${perfume.id}`)}>
            <div
              className="card-image"
              style={{
                backgroundImage: `url(/accords/${accordImages[perfume.accords[0]?.accord.name.toLowerCase()] ?? accordImages.default})`,
              }}
            />
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
  <button onClick={() => handlePage(page - 1)} disabled={page === 1}>
    Prev
  </button>
  <span>
    {page} / {totalPages}
  </span>
  <button onClick={() => handlePage(page + 1)} disabled={page === totalPages}>
    Next
  </button>
  <input
    type="number"
    min={1}
    max={totalPages}
    value={jumpPage}
    onChange={(e) => setJumpPage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        const p = Number(jumpPage)
        if (p >= 1 && p <= totalPages) {
          handlePage(p)
          setJumpPage('')
        }
      }
    }}
    placeholder="Go to page..."
  />
</div>
    </div>
  );
}
