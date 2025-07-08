/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import { v4 as uuidv4 } from "uuid";

export interface Game {
  id: string;
  name: string;
  category: string;
  year: string;
  producer: string;
  image: string;
}

interface GamesContextType {
  games: Game[];
  addGame: (game: Omit<Game, "id">) => void;
  updateGame: (game: Game) => void;
  deleteGame: (id: string) => void;
}

const GamesContext = createContext<GamesContextType>({} as GamesContextType);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(() => {
    const stored = localStorage.getItem("gameshelf_games");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("gameshelf_games", JSON.stringify(games));
  }, [games]);

  function addGame(game: Omit<Game, "id">) {
    setGames((prev) => [...prev, { ...game, id: uuidv4() }]);
  }

  function updateGame(game: Game) {
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? game : g))
    );
  }

  function deleteGame(id: string) {
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <GamesContext.Provider
      value={{ games, addGame, updateGame, deleteGame }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames(){
  return useContext(GamesContext);
}
