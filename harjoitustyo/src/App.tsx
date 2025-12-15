import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Kirjaudu from "./sivut/Kirjaudu";
import Etusivu from "./sivut/Etusivu";
import Tapahtumat from "./sivut/Tapahtumat";
import OmatTapahtumat from "./sivut/OmatTapahtumat";
import Koirat from "./sivut/Koirat";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/kirjaudu" element={<Kirjaudu />} />
          <Route path="/etusivu" element={<Etusivu />} />
          <Route path="/tapahtumat" element={<Tapahtumat />} />
          <Route path="/omat-tapahtumat" element={<OmatTapahtumat />} />
          <Route path="/koirat" element={<Koirat />} />
          <Route path="/" element={<Navigate to="/kirjaudu" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;