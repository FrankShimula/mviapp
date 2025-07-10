import { useUserStats } from "../hooks/userstats"
import { GENRE_MAP } from "../data/genre"

export default function MovieCard({ movie }: { movie: any }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster"

  const genres = movie.genre_ids
    ? movie.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean)
    : movie.genres || []

  const {
    stats,
    toggleWatched,
    toggleLike,
    toggleWatchlist
  } = useUserStats()

  const isWatched = stats.watched.some((m) => m.id === movie.id)
  const isLiked = stats.liked.some((m) => m.id === movie.id)
  const isInWatchlist = stats.watchlist.some((m) => m.id === movie.id)

  const tmdbRating = Math.round(movie.vote_average / 2) // out of 5 stars

  const handleClick = (fn: (m: any) => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    fn({ ...movie, genres })
  }

  return (
    <div className="relative group w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-zinc-900 text-white cursor-pointer">
      <img
        src={poster}
        alt={movie.title}
        className="object-cover w-full h-full group-hover:opacity-30 transition-opacity duration-300"
      />

      {/* ⭐ TMDB rating top-left */}
      <div className="absolute top-3 left-3 flex space-x-[1px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= tmdbRating} />
        ))}
      </div>

      {/* 📄 title (year) on hover top */}
      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 text-center bg-gradient-to-b from-black/80 to-transparent py-3 px-3 text-sm font-medium transition-opacity duration-300">
        {movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})
      </div>

      {/* 🔘 buttons bottom */}
      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-opacity duration-300">
        <div className="flex justify-center space-x-2">
          <button
            onClick={handleClick(toggleWatched)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
              isWatched
                ? "bg-green-500 border-green-500 text-black font-medium"
                : "bg-black/60 border-gray-600 text-white hover:border-green-500 hover:bg-green-500/10"
            }`}
          >
            {isWatched ? "✓ Watched" : "👁️ Watched"}
          </button>

          <button
            onClick={handleClick(toggleLike)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
              isLiked
                ? "bg-red-500 border-red-500 text-white font-medium"
                : "bg-black/60 border-gray-600 text-white hover:border-red-500 hover:bg-red-500/10"
            }`}
          >
            {isLiked ? "❤️ Liked" : "❤️ Like"}
          </button>

          <button
            onClick={handleClick(toggleWatchlist)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
              isInWatchlist
                ? "bg-blue-500 border-blue-500 text-white font-medium"
                : "bg-black/60 border-gray-600 text-white hover:border-blue-500 hover:bg-blue-500/10"
            }`}
          >
            {isInWatchlist ? "📋 Added" : "📋 Watchlist"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-zinc-600"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
    </svg>
  )
}