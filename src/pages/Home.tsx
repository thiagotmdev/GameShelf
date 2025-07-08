import { useGames } from "../context/GamesContext";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Home() {
  const { games, deleteGame } = useGames();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState("");
  const [producerFilter, setProducerFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => [...new Set(games.map((g) => g.category))], [games]);
  const producers = useMemo(() => [...new Set(games.map((g) => g.producer))], [games]);

  const filteredGames = games.filter((g) => {
    const matchCategory = categoryFilter ? g.category === categoryFilter : true;
    const matchProducer = producerFilter ? g.producer === producerFilter : true;
    const matchSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchProducer && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="Buscar jogos pelo nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-zinc-800 text-white p-3 rounded-lg w-full max-w-md mx-auto"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <select
            className="bg-zinc-800 text-white p-2 rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="bg-zinc-800 text-white p-2 rounded"
            value={producerFilter}
            onChange={(e) => setProducerFilter(e.target.value)}
          >
            <option value="">Todas as Produtoras</option>
            {producers.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        {(categoryFilter || producerFilter || searchTerm) && (
          <button
            onClick={() => {
              setCategoryFilter("");
              setProducerFilter("");
              setSearchTerm("");
            }}
            className="text-sm text-zinc-300 hover:text-red-400 transition"
          >
            Limpar Filtros ✖
          </button>
        )}
      </div>

      <AnimatePresence>
        {filteredGames.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center w-full col-span-full text-lg text-zinc-400"
          >
            Nenhum jogo encontrado com os filtros aplicados.
          </motion.p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-800 rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{game.name}</h2>
                    <p className="text-sm text-zinc-400">
                      {game.category} • {game.year}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">{game.producer}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/edit/${game.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteGame(game.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
