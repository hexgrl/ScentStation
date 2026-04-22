import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Browse from "./pages/Browse.jsx";
import PerfumeDetail from "./pages/PerfumeDetail.jsx";
import Collection from "./pages/Collection.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="blob-cont">
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
        <svg style={{ display: "none" }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
          </filter>
        </svg>
        <NavBar />
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/perfume/:id" element={<PerfumeDetail />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}