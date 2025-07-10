import { useEffect, useState } from "react";
import { useUserStats } from "../hooks/userstats";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { stats } = useUserStats();
  const [recent, setRecent] = useState<any[]>([]);
  const [sortKey, setSortKey] = useState<"title" | "release_date" | "popularity">("release_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchRecent = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const data = await res.json();
      setRecent((data.results || []).slice(0, 5));
    };
    fetchRecent();
  }, []);

  const sortBy = (key: typeof sortKey) => {
    const newDir = key === sortKey ? (sortDirection === "asc" ? "desc" : "asc") : (key === "title" ? "asc" : "desc");
    setSortKey(key);
    setSortDirection(newDir);

    setRecent(prev =>
      [...prev].sort((a, b) => {
        let aVal: any = a[key] ?? "";
        let bVal: any = b[key] ?? "";

        if (key === "title") {
          const cmp = aVal.localeCompare(bVal);
          return newDir === "asc" ? cmp : -cmp;
        }
        if (key === "release_date") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        return newDir === "asc" ? aVal - bVal : bVal - aVal;
      })
    );
  };

  const getSortIcon = (col: typeof sortKey) => {
    if (sortKey !== col) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-zinc-950 min-h-screen space-y-12">
      <h1 className="text-4xl font-bold text-white tracking-tight">🎬 your movie stats</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* stats */}
        <div className="space-y-4">
          <Link to="/watched" className="block">
            <StatBlock label="movies watched" value={stats.watched.length.toString()} />
          </Link>
          <Link to="/watchlist" className="block">
            <StatBlock label="watchlist" value={stats.watchlist.length.toString()} />
          </Link>
          <StatBlock label="most watched genre" value={stats.topGenre || "n/a"} />
        </div>

        {/* genres + recent releases */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-zinc-400 uppercase text-xs font-semibold mb-4">genres</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(stats.genreFreq).map(([genre, freq]) => (
                <GenreBar key={genre} genre={genre} percent={freq} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-zinc-400 uppercase text-xs font-semibold mb-4">recent releases</h2>
            <div className="overflow-x-auto rounded border border-zinc-800">
              <table className="w-full text-sm text-left text-white">
                <thead className="bg-zinc-900 text-zinc-400 select-none">
                  <tr>
                    {["title", "release_date", "popularity"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                        onClick={() => sortBy(col as typeof sortKey)}
                      >
                        <div className="flex items-center gap-1 font-semibold">
                          {col === "title" ? "title" : col === "release_date" ? "year" : "popularity"}
                          <span className="text-xs">{getSortIcon(col as typeof sortKey)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((movie) => (
                    <tr key={movie.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-2 truncate max-w-xs">{movie.title}</td>
                      <td className="px-4 py-2 text-zinc-400">{movie.release_date?.slice(0, 4) || "n/a"}</td>
                      <td className="px-4 py-2 text-zinc-400">{Math.round(movie.popularity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right mt-2">
              <Link to="/movies" className="text-blue-400 hover:underline text-sm">
                view more →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-zinc-400 uppercase text-xs mb-2 tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function GenreBar({ genre, percent }: { genre: string; percent: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wide">
        <span>{genre}</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
