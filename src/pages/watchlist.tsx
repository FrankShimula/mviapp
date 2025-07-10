import { useState } from "react";
import { useUserStats } from "../hooks/userstats";
import MovieCard from "../components/MovieCard";

export default function WatchlistPage() {
  const { stats } = useUserStats();
  const [sortBy, setSortBy] = useState<"title" | "date_added" | "rating" | "release_date">("date_added");

  const sortedMovies = stats.watchlist
    .slice() // make a copy
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          // Handle null/undefined ratings properly
          const ratingA = a.vote_average || 0;
          const ratingB = b.vote_average || 0;
          return ratingB - ratingA; // Higher ratings first
        case "release_date":
          // Handle null/undefined release dates properly
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA; // Newer releases first
        case "date_added":
        default:
          return stats.watchlist.indexOf(b) - stats.watchlist.indexOf(a);
      }
    });

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "date_added":
        return "Recently Added";
      case "title":
        return "Title A-Z";
      case "rating":
        return "TMDb Rating";
      case "release_date":
        return "Release Date";
      default:
        return "Recently Added";
    }
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-zinc-950 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-white">📋 My Watchlist</h1>
          {stats.watchlist.length > 0 && (
            <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {stats.watchlist.length}
            </div>
          )}
        </div>
        <p className="text-zinc-400 text-lg">
          {stats.watchlist.length === 0
            ? "Start building your perfect movie collection"
            : `${stats.watchlist.length} movie${stats.watchlist.length !== 1 ? "s" : ""} waiting to be watched`}
        </p>
      </div>

      {/* Controls Section */}
      {stats.watchlist.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
                <label className="text-zinc-300 font-medium">Sort by:</label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="date_added">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="rating">TMDb Rating</option>
                <option value="release_date">Release Date</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>Sorted by {getSortLabel(sortBy)}</span>
              <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
              <span>{sortedMovies.length} results</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {sortedMovies.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-8">
            <div className="text-8xl mb-4">🍿</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your watchlist is empty
            </h2>
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
              Discover amazing movies and add them to your watchlist to keep track of what you want to watch next!
            </p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/movies"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Movies
            </a>
            
            <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
              <span>or explore</span>
              <a
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Trending Movies
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="relative group"
              >
                {/* Recently Added Badge */}
                {sortBy === "date_added" && index < 3 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      New
                    </div>
                  </div>
                )}
                
                {/* High Rating Badge */}
                {sortBy === "rating" && movie.vote_average && movie.vote_average >= 8.0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-yellow-500/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                )}

                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{stats.watchlist.length} movies total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {stats.watchlist.filter(m => m.vote_average && m.vote_average >= 7.0).length} highly rated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>
                    {stats.watchlist.filter(m => {
                      const releaseYear = m.release_date ? new Date(m.release_date).getFullYear() : 0;
                      return releaseYear >= 2020;
                    }).length} recent releases
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Your personal collection</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}