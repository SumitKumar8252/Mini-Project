import { memo }  from "react";
import { Link }  from "react-router-dom";
import { posterUrl } from "../services/omdb";

const PLACEHOLDER = "https://placehold.co/342x513/1a1a2e/6b6a85?text=No+Image";

function MovieCard({ movie, onSave, onRemove, isSaved }) {
  const poster = posterUrl(movie.poster_path) ?? PLACEHOLDER;
  const year   = movie.release_date?.slice(0, 4) ?? "—";
  const rating = movie.vote_average?.toFixed(1)  ?? "—";

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 transition-all duration-200">

      {/* Poster */}
      <Link to={`/movies/${movie.id}`}>
        <img
          src={poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </Link>

      {/* Body */}
      <div className="p-3">
        <p className="font-semibold text-sm leading-snug truncate mb-1">{movie.title}</p>
        <div className="flex items-center gap-2 mb-3 text-xs text-neutral-600 dark:text-neutral-400">
          <span>⭐ {rating}</span>
          <span className="text-neutral-400 dark:text-neutral-600">·</span>
          <span>{year}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/movies/${movie.id}`}
            className="flex-1 text-center py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-neutral-950 text-xs font-semibold transition-colors"
          >
            Details
          </Link>

          {isSaved ? (
            <button
              onClick={() => onRemove(movie.id)}
              className="flex-1 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-400 text-xs font-semibold border border-red-900/50 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => onSave(movie)}
              className="flex-1 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 transition-colors"
            >
              + Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);
