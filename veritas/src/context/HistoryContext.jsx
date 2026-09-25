import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { truncate } from '../utils/format';

const STORAGE_KEY = 'veritas.history.v1';
const MAX_ENTRIES = 40;

const HistoryContext = createContext(null);

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function HistoryProvider({ children }) {
  const [entries, setEntries] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Storage full or blocked — history stays in memory for this session.
    }
  }, [entries]);

  const addEntry = useCallback(({ result, type, preview }) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      type,
      preview: truncate(preview, 180),
      result,
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => setEntries([]), []);

  const value = useMemo(
    () => ({ entries, addEntry, removeEntry, clearHistory }),
    [entries, addEntry, removeEntry, clearHistory]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used inside <HistoryProvider>.');
  return context;
}
