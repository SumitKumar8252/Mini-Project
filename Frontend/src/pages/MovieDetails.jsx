import { useCallback } from "react";
import { useParams, Link }   from "react-router-dom";
import { useFetch }          from "../hooks/useFetch";
import { fetchMovieDetails, posterUrl, backdropUrl } from "../services/omdb";
import { useWatchlist }      from "../hooks/useWatchlist";
import Spinner               from "../components/Spinner";

export default function MovieDetails() {
  const { movieId } = useParams();  // ← reads id from /movies/:movieId

  const detailsFetcher = useCallback(
    () => fetchMovieDetails(movieId),
    [movieId],
  );

  const { data: movie, loading, error } = useFetch(detailsFetcher);

  const { addMovie, removeMovie, isSaved } = useWatchlist();

  if (loading) return <Spinner />;
  if (error)   return <p className="text-center text-red-400 py-20">{error}</p>;
  if (!movie)  return null;

  const saved    = isSaved(movie.id);
  const poster   = posterUrl(movie.poster_path, "w500");
  const backdrop = backdropUrl(movie.backdrop_path);
  const year     = movie.release_date?.slice(0, 4) ?? "—";
  const rating   = movie.vote_average?.toFixed(1)  ?? "—";
  const runtime  = movie.runtime ? `${movie.runtime} min` : "—";
  const genres   = movie.genres?.map((g) => g.name).join(", ") ?? "—";
  const director = movie.credits?.crew?.find((p) => p.job === "Director")?.name ?? "—";

  return (
    <div>
      {/* Backdrop */}
      {backdrop && (
        <div
          className="h-48 md:h-64 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-neutral-950/30" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-16 -mt-20 relative">
        <Link to="/movies" className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-sm mb-6 transition-colors">
          ← Back to Movies
        </Link>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          {poster && (
            <img
              src={poster}
              alt={movie.title}
              className="w-48 md:w-56 rounded-xl border border-neutral-300 dark:border-neutral-800 shrink-0 self-start"
            />
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-3">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4 text-sm">
              <span className="px-3 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-full font-medium">⭐ {rating}</span>
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full">{year}</span>
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full">{runtime}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Genre",    value: genres   },
                { label: "Director", value: director  },
                { label: "Runtime",  value: runtime   },
                { label: "Released", value: year      },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">{movie.overview}</p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => saved ? removeMovie(movie.id) : addMovie(movie)}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors
                  ${saved
                    ? "bg-red-900/40 text-red-400 border border-red-900/50 hover:bg-red-900/70"
                    : "bg-gold-500 hover:bg-gold-400 text-neutral-950"
                  }`}
              >
                {saved ? "✕ Remove from Watchlist" : "+ Add to Watchlist"}
              </button>
              <Link to="/movies" className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors">
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
