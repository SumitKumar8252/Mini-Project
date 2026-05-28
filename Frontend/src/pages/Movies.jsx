import { useState, useMemo, useRef, useCallback } from "react";
import { useFetch }      from "../hooks/useFetch";
import { fetchTrending, fetchGenres, fetchByGenre, searchMovies } from "../services/omdb";
import { useWatchlist }  from "../hooks/useWatchlist";
import MovieCard         from "../components/MovieCard";
import Spinner           from "../components/Spinner";

export default function Movies() {
  const [search,  setSearch]  = useState("");
  const [genreId, setGenreId] = useState("");
  const searchRef = useRef(null);

  const { addMovie, removeMovie, isSaved } = useWatchlist();

  // Genres for dropdown
  const { data: genreData } = useFetch(fetchGenres);
  const genres = useMemo(() => genreData?.genres ?? [], [genreData]);

  // Switch fetcher based on active filter
  const fetcher = useCallback(() => {
    if (search.trim()) return searchMovies(search.trim());
    if (genreId)       return fetchByGenre(genreId);
    return fetchTrending();
  }, [search, genreId]);

  const { data, loading, error } = useFetch(fetcher);

  // If both search + genre active, filter client-side by genre_ids
  const movies = useMemo(() => {
    const results = data?.results ?? [];
    if (search.trim() && genreId) {
      return results.filter((m) => m.genre_ids?.includes(Number(genreId)));
    }
    return results;
  }, [data, search, genreId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="font-display text-5xl tracking-wider mb-1">ALL MOVIES</h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">Search, filter by genre, and save to your watchlist</p>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 mb-4 transition-colors">

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:border-gold-500 outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 transition-colors"
          />
        </div>

        {/* Genre filter */}
        <select
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:border-gold-500 outline-none rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 transition-colors"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Focus button — useRef demo */}
        <button
          onClick={() => searchRef.current?.focus()}
          className="text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-2 rounded-lg transition-colors"
        >
          Focus Search
        </button>
      </div>

      {/* Results count — useMemo */}
      <p className="text-xs text-neutral-500 mb-4">
        Showing <span className="text-neutral-700 dark:text-neutral-300 font-medium">{movies.length}</span> results
      </p>

      {loading && <Spinner />}
      {error   && <p className="text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-5xl mb-3">🎬</p>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">No movies found</p>
          <p className="text-sm mt-1">Try a different search or genre</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
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
    </div>
  );
}
