import { useEffect, useState } from "react";

/**
 * Live media-query flag, so layout decisions (such as showing one dock preview instead of two)
 * follow the viewport instead of a width read once at mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}
