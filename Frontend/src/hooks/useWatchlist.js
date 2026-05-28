import { useContext } from "react";
import { WatchlistContext } from "../context/watchlist-context";

export const useWatchlist = () => useContext(WatchlistContext);
