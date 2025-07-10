import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function Landing() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrendingMovies();
        setMovies(data.results || []);
      } catch (err) {
        setError("Failed to load trending movies. Please try again later.");
        console.error("Error fetching trending movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingMovies();
  }, []);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchTrendingMovies()
      .then((data) => setMovies(data.results || []))
      .catch((err) => {
        setError("Failed to load trending movies. Please try again later.");
        console.error("Error fetching trending movies:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
               Trending Movies
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Discover what's hot right now. The most popular movies everyone's talking about.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-8">
            {/* Loading Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="text-zinc-400 text-lg">Loading trending movies...</span>
              </div>
            </div>

            {/* Loading Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-zinc-800/50 rounded-lg overflow-hidden"
                >
                  <div className="aspect-[2/3] bg-zinc-700/50" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-zinc-700/50 rounded w-full" />
                    <div className="h-3 bg-zinc-700/50 rounded w-3/4" />
                    <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No trending movies found
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              We couldn't find any trending movies at the moment. Please check back later.
            </p>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  What's Trending Now
                </h2>
                <p className="text-zinc-400">
                  {movies.length} movies currently trending
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-zinc-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Live data</span>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="relative group"
                >
                  {/* Trending Badge for Top 3 */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  
                  {/* Fire Badge for Top 10 */}
                  {index < 10 && index >= 3 && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        🔥
                      </div>
                    </div>
                  )}

                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Footer Info */}
            <div className="text-center pt-8 border-t border-zinc-800">
              <p className="text-zinc-400 text-sm">
                Trending data updates every few hours • Powered by The Movie Database
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}