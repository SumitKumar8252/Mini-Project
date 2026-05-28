import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useWatchlist } from "../hooks/useWatchlist";

const links = [
  { to: "/",       label: "Home"      },
  { to: "/movies", label: "Movies"    },
  { to: "/saved",  label: "Watchlist" },
  { to: "/about",  label: "About"     },
];

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { watchlist }         = useWatchlist();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">

        {/* Logo */}
        <Link to="/" className="font-display text-2xl text-gold-500 tracking-wider shrink-0">
          MOVIE<span className="text-neutral-900 dark:text-neutral-100 transition-colors">HUB</span>
        </Link>

        {/* Links */}
        <div className="flex gap-1 flex-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                 ${isActive
                   ? "text-gold-500 bg-gold-500/10"
                   : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                 }`
              }
            >
              {label}
              {label === "Watchlist" && watchlist.length > 0 && (
                <span className="ml-1.5 bg-gold-500 text-neutral-950 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {watchlist.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="text-xs font-medium text-neutral-700 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-md hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
