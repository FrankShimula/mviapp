import { useEffect, useState } from "react";

const STORAGE_KEY = "watchlist";

export function watchlist() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIds(JSON.parse(stored));
  }, []);

  const save = (newIds: number[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    setIds(newIds);
  };

  const toggle = (id: number) => {
    const exists = ids.includes(id);
    const updated = exists ? ids.filter((x) => x !== id) : [...ids, id];
    save(updated);
  };

  const isSaved = (id: number) => ids.includes(id);

  const getAll = () => ids;

  return { toggle, isSaved, getAll };
}
