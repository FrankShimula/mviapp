import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function Landing() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchTrendingMovies().then((data) =>
      setMovies(data.results.slice(0, 11)) 
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">🔥 Trending Movies</h1>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}