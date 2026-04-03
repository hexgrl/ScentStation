import { BrowserRouter, Routes, Route } from "react-router-dom";
import Browse from "./pages/Browse.jsx";
import PerfumeDetail from "./pages/PerfumeDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/perfume/:id" element={<PerfumeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
