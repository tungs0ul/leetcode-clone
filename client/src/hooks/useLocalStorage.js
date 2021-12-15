import { useState, useEffect } from "react";

const PREFIX = "code-heaven-";

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = `${PREFIX}${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
  }, [storedValue, prefixedKey]);

  return [storedValue, setStoredValue];
}
