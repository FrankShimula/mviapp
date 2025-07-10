import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const url = new URL("https://api.themoviedb.org/3/discover/movie");
      url.searchParams.set("api_key", import.meta.env.VITE_TMDB_KEY);
      url.searchParams.set("sort_by", sortBy);
      url.searchParams.set("page", page.toString());

      if (genre) url.searchParams.set("with_genres", genre);
      if (year) url.searchParams.set("primary_release_year", year);

      const today = new Date().toISOString().split("T")[0];
      if (query) {
        url.pathname = "/3/search/movie";
        url.searchParams.set("query", query);
      } else if (sortBy === "release_date.desc") {
        url.searchParams.set("primary_release_date.lte", today);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    };

    fetchMovies();
  }, [query, genre, year, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [query, genre, year, sortBy]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const clearFilters = () => {
    setQuery("");
    setGenre("");
    setYear("");
    setSortBy("popularity.desc");
  };

  const hasActiveFilters = query || genre || year || sortBy !== "popularity.desc";

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🎬 Movie Library</h1>
        <p className="text-zinc-400">
          Discover thousands of movies across all genres
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies by title..."
              className="w-full px-4 py-3 pl-12 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Genre
              </label>
              <select
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Release Year
              </label>
              <select
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                {Array.from({ length: 20 }).map((_, i) => {
                  const y = 2025 - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="release_date.desc">Newest First</option>
                <option value="vote_average.desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-zinc-400">Loading movies...</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-800/50 rounded-lg overflow-hidden"
              >
                <div className="aspect-[2/3] bg-zinc-700/50" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-700/50 rounded w-3/4" />
                  <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No movies found
          </h2>
          <p className="text-zinc-400 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-zinc-400">
              {query
                ? `Found ${movies.length} results for "${query}"`
                : `Showing ${movies.length} movies`}
            </p>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  title="First page"
                >
                  ««
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  title="Previous page"
                >
                  ←
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const buttons = new Set<number | string>();
                    const pad = 2;

                    buttons.add(1);
                    for (let i = page - pad; i <= page + pad; i++) {
                      if (i > 1 && i < totalPages) buttons.add(i);
                    }
                    if (totalPages > 1) buttons.add(totalPages);

                    const sorted = [...buttons].sort((a, b) =>
                      typeof a === "number" && typeof b === "number" ? a - b : 0
                    );

                    const final: (number | string)[] = [];
                    for (let i = 0; i < sorted.length; i++) {
                      final.push(sorted[i]);
                      const curr = sorted[i];
                      const next = sorted[i + 1];
                      if (
                        typeof curr === "number" &&
                        typeof next === "number" &&
                        next - curr > 1
                      ) {
                        final.push("...");
                      }
                    }

                    return final.map((p) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${Math.random()}`}
                          className="px-2 text-zinc-400"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => typeof p === "number" && setPage(p)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === p
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-zinc-800 text-white hover:bg-zinc-700"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  title="Next page"
                >
                  →
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  title="Last page"
                >
                  »»
                </button>
              </div>

              {/* Page Info and Jump */}
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <span>Jump to:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder={page.toString()}
                    className="w-20 px-2 py-1 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt(
                          (e.target as HTMLInputElement).value
                        );
                        if (val >= 1 && val <= totalPages) {
                          setPage(val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}