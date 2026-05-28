import { Link }          from "react-router-dom";
import { useMemo }       from "react";
import { useFetch }      from "../hooks/useFetch";
import { fetchTrending } from "../services/omdb";
import { useWatchlist }  from "../hooks/useWatchlist";
import MovieCard         from "../components/MovieCard";
import Spinner           from "../components/Spinner";

export default function Home() {
  const { data, loading, error }           = useFetch(fetchTrending);
  const { addMovie, removeMovie, isSaved } = useWatchlist();

  // Show top 8 trending
  const featured = useMemo(() => data?.results?.slice(0, 8) ?? [], [data]);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-20 px-4">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-semibold tracking-widest uppercase border border-gold-500/20">
          🎬 Trending This Week
        </span>
        <h1 className="font-display text-7xl md:text-9xl tracking-widest mb-4">
          MOVIE<span className="text-gold-500">HUB</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-md mx-auto mb-8">
          Discover trending films, explore by genre, and build your personal watchlist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/movies" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold rounded-lg transition-colors">
            Explore Movies
          </Link>
          <Link to="/saved" className="px-6 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 font-semibold rounded-lg transition-colors">
            My Watchlist
          </Link>
        </div>
      </section>

      {/* Trending grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-display text-3xl tracking-wider mb-6">
          TRENDING <span className="text-gold-500">NOW</span>
        </h2>

        {loading && <Spinner />}
        {error   && <p className="text-red-400 text-center py-8">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSave={addMovie}
                onRemove={removeMovie}
                isSaved={isSaved(movie.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
