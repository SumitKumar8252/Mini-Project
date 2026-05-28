import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
      <p className="font-display text-9xl text-gold-500 tracking-widest">404</p>
      <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Page Not Found</h2>
      <p className="text-neutral-500 mb-8">This scene got cut from the final edit.</p>
      <Link to="/" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-semibold rounded-lg transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
