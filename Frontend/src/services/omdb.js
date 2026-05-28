const env = (k, d = "") => (import.meta.env[k] ?? d).toString().trim();
const BASE_URL = env("VITE_OMDB_BASE_URL");
const API_KEY = env("VITE_OMDB_KEY");
const API_KEY_PARAM = env("VITE_OMDB_API_KEY_PARAM");
const TYPE_FILTER = env("VITE_OMDB_TYPE");
const DISCOVERY_QUERIES = env("VITE_OMDB_DISCOVERY_QUERIES")
  .split(",")
  .map((q) => q.trim())
  .filter(Boolean);
const GENRES = env("VITE_OMDB_GENRES")
  .split(",")
  .map((n) => n.trim())
  .filter(Boolean)
  .map((name, i) => ({ id: String(i + 1), name }));
const GENRE_ID_MAP = new Map(
  GENRES.map((g) => [g.name.toLowerCase(), Number(g.id)]),
);
const detailCache = new Map();
const empty = { results: [] };
const isNA = (v) => !v || v === "N/A";
const log = (where, err) =>
  console.log(`[omdb] ${where}:`, err?.message || err);

function toDate(released, year) {
  if (!isNA(released)) {
    const t = Date.parse(released);
    if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  }
  const y = String(year || "").match(/\d{4}/)?.[0];
  return y ? `${y}-01-01` : "";
}

function toMovie(raw = {}) {
  const genreNames = isNA(raw.Genre)
    ? []
    : raw.Genre.split(",")
        .map((g) => g.trim())
        .filter(Boolean);
  return {
    id: raw.imdbID,
    title: raw.Title || "",
    poster_path: isNA(raw.Poster) ? null : raw.Poster,
    backdrop_path: null,
    release_date: toDate(raw.Released, raw.Year),
    vote_average: Number.parseFloat(raw.imdbRating) || null,
    runtime: Number.parseInt(raw.Runtime, 10) || null,
    overview: isNA(raw.Plot) ? "" : raw.Plot,
    genres: genreNames.map((name) => ({ id: name, name })),
    genre_ids: genreNames
      .map((name) => GENRE_ID_MAP.get(name.toLowerCase()))
      .filter((id) => id !== undefined),
    credits: {
      crew: isNA(raw.Director)
        ? []
        : raw.Director.split(",").map((name) => ({
            job: "Director",
            name: name.trim(),
          })),
    },
  };
}

async function callOmdb(params = {}) {
  if (!BASE_URL || !API_KEY || !API_KEY_PARAM) {
    log(
      "config",
      "Set VITE_OMDB_BASE_URL, VITE_OMDB_KEY, VITE_OMDB_API_KEY_PARAM in Frontend/.env",
    );
    return null;
  }
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set(API_KEY_PARAM, API_KEY);
    Object.entries(params).forEach(
      ([k, v]) =>
        v !== undefined &&
        v !== null &&
        `${v}`.trim() !== "" &&
        url.searchParams.set(k, v),
    );
    const res = await fetch(url.toString());
    const data = await res.json();
    if (!res.ok || data?.Response === "False") {
      log("request", data?.Error || `${res.status} ${res.statusText}`);
      return null;
    }
    return data;
  } catch (err) {
    log("request", err);
    return null;
  }
}

async function getDetails(id, fullPlot = false) {
  const key = `${id}-${fullPlot ? "full" : "short"}`;
  if (detailCache.has(key)) return detailCache.get(key);
  const data = await callOmdb({ i: id, plot: fullPlot ? "full" : "short" });
  if (data) detailCache.set(key, data);
  return data;
}

export const posterUrl = (url) => (isNA(url) ? null : url);
export const backdropUrl = () => null;

export async function searchMovies(query, page = 1) {
  const q = (query || "").trim();
  if (!q) return empty;
  const params = { s: q, page };
  if (TYPE_FILTER) params.type = TYPE_FILTER;
  const data = await callOmdb(params);
  const items = Array.isArray(data?.Search) ? data.Search : [];
  const results = await Promise.all(
    items.map(async (item) => toMovie((await getDetails(item.imdbID)) || item)),
  );
  return { results };
}

async function fetchDiscovery(page = 1) {
  if (!DISCOVERY_QUERIES.length) return empty;
  const lists = await Promise.all(
    DISCOVERY_QUERIES.map((q) => searchMovies(q, page).then((r) => r.results)),
  );
  return {
    results: Array.from(new Map(lists.flat().map((m) => [m.id, m])).values()),
  };
}

export const fetchTrending = () => fetchDiscovery(1);
export const fetchTopRated = () => fetchDiscovery(1);
export const fetchGenres = async () => ({ genres: GENRES });

export async function fetchMovieDetails(id) {
  const data = await getDetails(id, true);
  return data ? toMovie(data) : null;
}

export async function fetchByGenre(genreId, page = 1) {
  const name = GENRES.find((g) => g.id === String(genreId))?.name;
  const data = await fetchDiscovery(page);
  if (!name) return data;
  return {
    results: data.results.filter((m) =>
      m.genres.some((g) => g.name.toLowerCase() === name.toLowerCase()),
    ),
  };
}
