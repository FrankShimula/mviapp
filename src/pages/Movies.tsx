import { useEffect, useState } from "react";
//import { watchlist } from "../hooks/watchlist";
import MovieCard from "../components/MovieCard";


export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const url = new URL("https://api.themoviedb.org/3/discover/movie");
      url.searchParams.set("api_key", import.meta.env.VITE_TMDB_KEY);
      url.searchParams.set("sort_by", sortBy);
      if (genre) url.searchParams.set("with_genres", genre);
      if (year) url.searchParams.set("primary_release_year", year);
      if (query) {
        url.pathname = "/3/search/movie";
        url.searchParams.set("query", query);
      }

      const res = await fetch(url.toString());
      const data = await res.json();
      setMovies(data.results || []);
      setLoading(false);
    };

    fetchMovies();
  }, [query, genre, year, sortBy]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🎞️ Movie Library</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          className="p-2 rounded bg-zinc-800 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select className="p-2 rounded bg-zinc-800 text-white" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="27">Horror</option>
          <option value="10749">Romance</option>
        </select>

        <select className="p-2 rounded bg-zinc-800 text-white" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          {Array.from({ length: 20 }).map((_, i) => {
            const y = 2024 - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>

        <select className="p-2 rounded bg-zinc-800 text-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity.desc">Sort: Popular</option>
          <option value="release_date.desc">Newest</option>
          <option value="vote_average.desc">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <p>loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-zinc-400">no movies found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
  <MovieCard key={movie.id} movie={movie} />
))}
        </div>
      )}
    </div>
  );
}

