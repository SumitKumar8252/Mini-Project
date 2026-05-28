import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import { posterUrl } from "../services/omdb";

// Memoized row card
const SavedCard = memo(function SavedCard({ movie, onRemove }) {
  const poster = posterUrl(movie.poster_path, "w185");
  const year = movie.release_date?.slice(0, 4) ?? "—";
  const rating = movie.vote_average?.toFixed(1) ?? "—";

  return (
    <div className="flex gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
      {poster ? (
        <img
          src={poster}
          alt={movie.title}
          className="w-14 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-14 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg shrink-0 flex items-center justify-center text-neutral-500 dark:text-neutral-600 text-xs">
          🎬
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate mb-1">{movie.title}</p>
        <p className="text-xs text-neutral-500">
          {year} · ⭐ {rating}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <Link
          to={`/movies/${movie.id}`}
          className="text-xs px-2.5 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-md font-medium hover:bg-gold-500/20 transition-colors"
        >
          Details
        </Link>
        <button
          onClick={() => onRemove(movie.id)}
          className="text-xs px-2.5 py-1 bg-red-900/30 text-red-400 border border-red-900/40 rounded-md font-medium hover:bg-red-900/60 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

export default function Saved() {
  const { watchlist, removeMovie } = useWatchlist();

  // useMemo: summary stats
  const summary = useMemo(() => {
    if (!watchlist.length) return null;
    const avg = (
      watchlist.reduce((s, m) => s + (m.vote_average ?? 0), 0) /
      watchlist.length
    ).toFixed(1);
    const genres = new Set(watchlist.flatMap((m) => m.genre_ids ?? [])).size;
    return { count: watchlist.length, avg, genres };
  }, [watchlist]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl tracking-wider mb-1">
        MY WATCHLIST
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
        {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
      </p>

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6 transition-colors">
          {[
            { num: summary.count, label: "Movies" },
            { num: summary.avg, label: "Avg Rating" },
            { num: summary.genres, label: "Genres" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl text-gold-500 tracking-wider">
                {num}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div className="text-center py-24 text-neutral-500">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium mb-2">
            Your watchlist is empty
          </p>
          <p className="text-sm mb-6">Save movies from the explore page</p>
          <Link
            to="/movies"
            className="inline-block px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold rounded-lg transition-colors"
          >
            Explore Movies
          </Link>
        </div>
      )}

      {/* List */}
      {watchlist.length > 0 && (
        <div className="flex flex-col gap-3">
          {watchlist.map((movie) => (
            <SavedCard key={movie.id} movie={movie} onRemove={removeMovie} />
          ))}
        </div>
      )}
    </div>
  );
}
