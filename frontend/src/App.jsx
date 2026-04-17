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