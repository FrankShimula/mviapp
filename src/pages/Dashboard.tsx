import { useEffect, useState } from "react"
import { useUserStats } from "../hooks/userstats"

export default function Dashboard() {
  const { stats } = useUserStats()
  const [recent, setRecent] = useState<any[]>([])
  const [sortKey, setSortKey] = useState<"title" | "release_date" | "popularity">("release_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchRecent = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      )
      const data = await res.json()
      const trimmed = (data.results || []).slice(0, 5)
      setRecent(trimmed)
    }
    fetchRecent()
  }, [])

  const sortBy = (key: typeof sortKey) => {
    const newDir = key === sortKey
      ? (sortDirection === "asc" ? "desc" : "asc")
      : key === "title" ? "asc" : "desc"

    setSortKey(key)
    setSortDirection(newDir)

    setRecent(prev =>
      [...prev].sort((a, b) => {
        let aVal: any = a[key] ?? ""
        let bVal: any = b[key] ?? ""

        if (key === "title") {
          const cmp = aVal.localeCompare(bVal)
          return newDir === "asc" ? cmp : -cmp
        }

        if (key === "release_date") {
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
        }

        return newDir === "asc" ? aVal - bVal : bVal - aVal
      })
    )
  }

  const getSortIcon = (col: typeof sortKey) =>
    sortKey !== col ? "↕️" : sortDirection === "asc" ? "↑" : "↓"

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-10 bg-zinc-950 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-white">🎬 Your Movie Stats</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* stats section */}
        <div className="space-y-4">
          <StatBlock label="Total Watch Time" value={stats.totalTime || "0h"} />
          <StatBlock label="Most Watched Genre" value={stats.topGenre || "N/A"} />
          <StatBlock label="Average Rating" value={stats.avgRating ? `${stats.avgRating} / 5` : "N/A"} />
          <StatBlock label="Movies Watched" value={`${stats.watched.length}`} />
        </div>

        {/* genres + recents */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-zinc-400 uppercase text-xs font-semibold mb-3">Genres</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(stats.genreFreq).map(([g, freq]) => (
                <GenreBar key={g} genre={g} percent={freq} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-zinc-400 uppercase text-xs font-semibold mb-3">Recently Watched</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-zinc-800 rounded overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    {["title", "release_date", "popularity"].map((key) => (
                      <th
                        key={key}
                        className="text-left px-4 py-2 cursor-pointer hover:bg-zinc-800 transition-colors select-none"
                        onClick={() => sortBy(key as typeof sortKey)}
                      >
                        <div className="flex items-center gap-2">
                          {key === "title" ? "Title" : key === "release_date" ? "Year" : "Popularity"}
                          <span className="text-xs">{getSortIcon(key as typeof sortKey)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((movie) => (
                    <tr key={movie.id} className="border-t border-zinc-800 hover:bg-zinc-800/40">
                      <td className="px-4 py-2 text-white truncate">{movie.title}</td>
                      <td className="px-4 py-2 text-zinc-400">{movie.release_date?.slice(0, 4) || "N/A"}</td>
                      <td className="px-4 py-2 text-zinc-400">{Math.round(movie.popularity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-2">
              <a href="/movies" className="text-blue-400 hover:underline text-sm">
                View More →
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 rounded p-4 bg-zinc-900">
      <p className="text-zinc-400 text-xs uppercase mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function GenreBar({ genre, percent }: { genre: string; percent: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400 font-medium">
        <span className="uppercase tracking-wide">{genre}</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div className="w-full h-2 rounded bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
