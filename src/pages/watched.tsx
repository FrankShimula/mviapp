import { useState } from "react";
import { useUserStats } from "../hooks/userstats";
import MovieCard from "../components/MovieCard";

export default function WatchedPage() {
  const { stats } = useUserStats();
  const [sortBy, setSortBy] = useState<"title" | "date_added" | "rating" | "release_date">("date_added");
  const [query, setQuery] = useState("");

  const filteredMovies = stats.watched
    .filter(m => query === "" || m.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (b.vote_average || 0) - (a.vote_average || 0);
        case "release_date":
          return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        case "date_added":
        default:
          return stats.watched.indexOf(b) - stats.watched.indexOf(a);
      }
    });

  {/*const getSortLabel = (s: string) => {
    switch (s) {
      case "date_added": return "Recently Added";
      case "title": return "Title A-Z";
      case "rating": return "TMDb Rating";
      case "release_date": return "Release Date";
      default: return "Recently Added";
    }
  };*/}

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-zinc-950 min-h-screen">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🎬 Watched Movies</h1>
        <p className="text-zinc-400">{stats.watched.length} movie{stats.watched.length !== 1 ? "s" : ""} in your collection</p>
      </div>

      {/* search & sort */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search watched movies by title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-grow px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="date_added">Recently Added</option>
          <option value="title">Title A-Z</option>
          <option value="rating">TMDb Rating</option>
          <option value="release_date">Release Date</option>
        </select>
      </div>

      {/* content */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <div className="text-8xl mb-4">🎬</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {stats.watched.length === 0 ? "No movies watched yet" : "No movies found"}
          </h2>
          <p className="max-w-md mx-auto mb-6 leading-relaxed">
            {stats.watched.length === 0
              ? "Start watching movies to build your collection!"
              : "Try adjusting your search or filters to find what you're looking for."
            }
          </p>
          {stats.watched.length === 0 && (
            <a
              href="/movies"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Movies
            </a>
          )}
        </div>
      ) : (
        <>
          <p className="text-zinc-400 mb-6">
            {query ? `Found ${filteredMovies.length} results for "${query}"` : `Showing ${filteredMovies.length} watched movies`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
