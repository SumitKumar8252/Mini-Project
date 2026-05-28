import { Link } from "react-router-dom";

const features = [
  {
    icon: "🎬",
    title: "Live TMDB Data",
    desc: "All movies fetched in real-time from The Movie Database API — zero hardcoded data.",
  },
  {
    icon: "🔍",
    title: "Search & Filter",
    desc: "Search by title or narrow results by genre using live TMDB endpoints.",
  },
  {
    icon: "⭐",
    title: "Personal Watchlist",
    desc: "Save and remove movies; summary stats computed with useMemo.",
  },
  {
    icon: "🌙",
    title: "Dark / Light Mode",
    desc: "Toggle themes via Context API. No third-party state library needed.",
  },
  {
    icon: "⚡",
    title: "React Optimized",
    desc: "useMemo, useCallback, React.memo — every unnecessary render eliminated.",
  },
  {
    icon: "🧩",
    title: "Clean Architecture",
    desc: "Services, hooks, context, components, and pages all cleanly separated.",
  },
];

const stack = [
  "React 18",
  "React Router v6",
  "Tailwind CSS",
  "TMDB API",
  "Context API",
  "useMemo",
  "useCallback",
  "useRef",
  "React.memo",
];

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <span className="inline-block mb-4 px-4 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-semibold tracking-widest uppercase border border-gold-500/20">
        About MovieHub
      </span>

      <h1 className="font-display text-6xl tracking-wider mb-4">
        BUILT FOR
        <br />
        <span className="text-gold-500">FILM LOVERS</span>
      </h1>

      <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-10">
        MovieHub pulls live data from{" "}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noreferrer"
          className="text-gold-500 hover:underline"
        >
          The Movie Database (TMDB)
        </a>
        . Explore trending films, search by title, filter by genre, and save
        movies to your personal watchlist — all without a backend.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 transition-colors"
          >
            <p className="text-2xl mb-2">{f.icon}</p>
            <p className="font-semibold text-sm mb-1">{f.title}</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">
        Tech Stack
      </p>
      <div className="flex flex-wrap gap-2 mb-10">
        {stack.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded-lg font-medium transition-colors"
          >
            {t}
          </span>
        ))}
      </div>

      <Link
        to="/movies"
        className="inline-block px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold rounded-lg transition-colors"
      >
        Start Exploring
      </Link>
    </div>
  );
}
