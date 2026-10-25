import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { searchCities } from '../services/geoApi';

/**
 * Hook for debounced autocomplete city search with AbortController cancellation
 */
export function useCitySearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const abortControllerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    searchCities(debouncedQuery, controller.signal)
      .then((results) => {
        setSuggestions(results);
        setIsLoading(false);
        setSelectedIndex(-1);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Failed to fetch cities. Check your connection.');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const clear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsLoading(false);
  }, []);

  const handleKeyDown = useCallback(
    (e, onSelect) => {
      if (suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          onSelect(suggestions[selectedIndex]);
          clear();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clear();
      }
    },
    [suggestions, selectedIndex, clear]
  );

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    clear
  };
}
