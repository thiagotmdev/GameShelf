import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from './pages/Home';
import { AddGame } from './pages/AddGame';
import { EditGame } from './pages/EditGame';
import { GamesProvider } from "./context/GamesContext";

export function App() {
  return (
    <GamesProvider>
      <div className="min-h-screen bg-zinc-200 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddGame />} />
            <Route path="/edit/:id" element={<EditGame />} />
          </Routes>
        </main>
      </div>
    </GamesProvider>
  );
}

export default App;