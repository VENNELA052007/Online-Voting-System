import { useEffect, useState } from "react";
import { readData, writeData } from "../utils/storage";

// Works like useState, but the value is also saved in Local Storage.
export default function useLocalStorage(key, fallback) {
  // Lazy initial state: Local Storage is read only once, when the component loads.
  const [value, setValue] = useState(() => readData(key, fallback));

  // Side effect 1: save to Local Storage every time the value changes.
  useEffect(() => {
    writeData(key, value);
  }, [key, value]);

  // Side effect 2: when another browser tab changes this key, update our state too.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === key) setValue(readData(key, fallback));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [value, setValue];
}
