import { useState, useEffect } from "react";

export function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setState((prev) => ({ ...prev, loading: true, error: null }));
    });

    (async () => {
      try {
        const data = await fetcher();
        if (active) setState({ data, loading: false, error: null });
      } catch (err) {
        if (active) setState((prev) => ({ ...prev, loading: false, error: err?.message || "Request failed" }));
      }
    })();

    return () => { active = false; };
  }, [fetcher]);

  return state;
}
