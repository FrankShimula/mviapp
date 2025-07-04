import { useEffect, useState } from "react"

type Movie = {
  id: number
  title: string
  runtime?: number
  rating?: number
  vote_average?: number
  genres?: string[]
  release_date?: string
  poster_path?: string
}

type Stats = {
  watched: Movie[]
  liked: Movie[]
  watchlist: Movie[]
  avgRating: number
  totalTime: string
  topGenre: string
  genreFreq: Record<string, number>
}

export function useUserStats() {
  const [stats, setStats] = useState<Stats>({
    watched: [],
    liked: [],
    watchlist: [],
    avgRating: 0,
    totalTime: "0h 0m",
    topGenre: "",
    genreFreq: {}
  })

  // Try to use localStorage if available, fallback to in-memory storage
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([])
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([])

  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    // Load initial data from localStorage if available
    if (isLocalStorageAvailable()) {
      const watched = JSON.parse(localStorage.getItem("watched") || "[]")
      const liked = JSON.parse(localStorage.getItem("liked") || "[]")
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
      
      setWatchedMovies(watched)
      setLikedMovies(liked)
      setWatchlistMovies(watchlist)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [watchedMovies, likedMovies, watchlistMovies])

  const loadStats = () => {
    const runtimes = watchedMovies.map((m) => m.runtime || 0)
    const totalMinutes = runtimes.reduce((a, b) => a + b, 0)
    const totalTime = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`

    const ratings = likedMovies.map((m) => m.rating || 0).filter(r => r > 0)
    const avgRating = ratings.length
      ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : 0

    const genreCount: Record<string, number> = {}
    watchedMovies.forEach((movie) => {
      movie.genres?.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    })

    const totalGenres = Object.values(genreCount).reduce((a, b) => a + b, 0)
    const genreFreq: Record<string, number> = {}
    for (const [genre, count] of Object.entries(genreCount)) {
      genreFreq[genre] = totalGenres > 0 ? Math.round((count / totalGenres) * 100) : 0
    }

    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || ""

    setStats({
      watched: watchedMovies,
      liked: likedMovies,
      watchlist: watchlistMovies,
      avgRating,
      totalTime,
      topGenre,
      genreFreq
    })
  }

  const markWatched = (movie: Movie) => {
    setWatchedMovies(prev => {
      // Check if movie is already in the list
      if (prev.find((m) => m.id === movie.id)) {
        return prev // No change if already watched
      }
      
      const newWatched = [...prev, movie]
      
      // Save to localStorage if available
      if (isLocalStorageAvailable()) {
        localStorage.setItem("watched", JSON.stringify(newWatched))
      }
      
      return newWatched
    })
  }

  const toggleLike = (movie: Movie) => {
    setLikedMovies(prev => {
      const isLiked = prev.find((m) => m.id === movie.id)
      const newLiked = isLiked
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
      
      // Save to localStorage if available
      if (isLocalStorageAvailable()) {
        localStorage.setItem("liked", JSON.stringify(newLiked))
      }
      
      return newLiked
    })
  }

  const toggleWatchlist = (movie: Movie) => {
    setWatchlistMovies(prev => {
      const isInWatchlist = prev.find((m) => m.id === movie.id)
      const newWatchlist = isInWatchlist
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
      
      // Save to localStorage if available
      if (isLocalStorageAvailable()) {
        localStorage.setItem("watchlist", JSON.stringify(newWatchlist))
      }
      
      return newWatchlist
    })
  }

  const rateMovie = (movieId: number, rating: number) => {
    setLikedMovies(prev => {
      const newLiked = prev.map((m) =>
        m.id === movieId ? { ...m, rating } : m
      )
      
      // Save to localStorage if available
      if (isLocalStorageAvailable()) {
        localStorage.setItem("liked", JSON.stringify(newLiked))
      }
      
      return newLiked
    })
  }

  return { stats, markWatched, toggleLike, toggleWatchlist, rateMovie }
}