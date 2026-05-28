import { useState, useCallback } from "react";
import { WatchlistContext } from "./watchlist-context";

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const isSaved = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist],
  );

  const addMovie = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        showToast("Already in your watchlist", "warn");
        return prev;
      }
      showToast(`"${movie.title}" added!`);
      return [...prev, movie];
    });
  }, []);

  const removeMovie = useCallback((id) => {
    setWatchlist((prev) => {
      const movie = prev.find((m) => m.id === id);
      if (movie) showToast(`"${movie.title}" removed`);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addMovie, removeMovie, isSaved }}
    >
      {children}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg
          ${
            toast.type === "warn"
              ? "bg-yellow-900/80 text-yellow-300 border border-yellow-700"
              : "bg-green-900/80 text-green-300 border border-green-700"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </WatchlistContext.Provider>
  );
}
