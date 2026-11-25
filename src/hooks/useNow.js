import { useEffect, useState } from "react";

// Returns the current time and refreshes it, so election status
// (Upcoming / Open / Ended) changes on screen without reloading.
export default function useNow(intervalMs = 15000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timerId); // cleanup when the component leaves the screen
  }, [intervalMs]);

  return now;
}
