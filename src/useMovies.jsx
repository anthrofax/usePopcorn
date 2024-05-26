import { useEffect, useState } from 'react';
const API_KEY = '4c00399c';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');

          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();

          if (data.Response === 'False')
            throw new Error('Movie yang anda cari tidak ditemukan!');

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(
                err.message === 'Failed to fetch'
                  ? 'Koneksi anda terputus!'
                  : err.message
              );
            console.log(err.message);
          }

        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setError('');
        setMovies([]);
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return {movies, isLoading, error}
}
