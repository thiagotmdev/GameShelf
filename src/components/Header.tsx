import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Sun, Moon, Download, Upload } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useGames } from "../context/GamesContext";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddPage = location.pathname === "/add";
  const isHomePage = location.pathname === "/";

  const { isDark, toggle } = useDarkMode();
  const { games, addGame } = useGames();

  function handleExport() {
    const dataStr = JSON.stringify(games, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "gameshelf-colecao.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedGames = JSON.parse(reader.result as string);
        if (Array.isArray(importedGames)) {
          importedGames.forEach((game) => addGame(game));
          alert("Importação concluída!");
        } else {
          alert("Arquivo inválido");
        }
      } catch {
        alert("Erro ao ler arquivo");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="bg-zinc-100 dark:bg-zinc-900 px-6 py-4 flex justify-between items-center border-b border-zinc-300 dark:border-zinc-800 shadow-md">
      <Link
        to="/"
        className="text-2xl font-bold text-zinc-900 dark:text-white hover:text-violet-500 transition"
      >
        🎮 GameShelf
      </Link>

      <div className="flex gap-4 items-center">
        {!isAddPage && (
          <>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm transition-all shadow"
              title="Exportar coleção"
            >
              <Download size={16} />
              Exportar
            </button>

            <label
              htmlFor="import-file"
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-xl text-sm cursor-pointer select-none shadow"
              title="Importar coleção"
            >
              <Upload size={16} />
              Importar
            </label>
            <input
              type="file"
              id="import-file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={() => navigate("/add")}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm transition-all shadow"
            >
              <Plus size={16} />
              Adicionar Jogo
            </button>
          </>
        )}

        <div className="flex items-center">
          {!isHomePage &&
            <>
              <button
                onClick={goHome}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-10 py-1 rounded-xl text-lg transition-all shadow"
                title="Exportar coleção"
              >
                Voltar
              </button>
            </>
          }
        </div>

        <button
          onClick={toggle}
          className="p-2 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800 transition"
          title="Alternar modo claro/escuro"
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-zinc-800" />
          )}
        </button>
      </div>
    </header>
  );
}
