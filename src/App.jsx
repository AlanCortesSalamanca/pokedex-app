import Home from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonDetail from "./pages/PokemonDetail"

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;