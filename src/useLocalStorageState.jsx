import { useState, useEffect } from 'react';

export function useLocalStorageState(initialValue, localStorageKey) {
  const [value, setValue] = useState(function () {
    const watchedMovie = localStorage.getItem(localStorageKey);

    return watchedMovie ? JSON.parse(watchedMovie) : initialValue;
  });

  useEffect(
    function () {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    },
    [value, localStorageKey]
  );

  return [value, setValue];
}
