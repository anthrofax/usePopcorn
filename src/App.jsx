import { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating';
import { useRef } from 'react';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr?.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  // eslint-disable-next-line
  const [watched, setWatched] = useLocalStorageState([], 'watched');
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = function (selectedId) {
    setSelectedId((curId) => (curId === selectedId ? null : selectedId));
  };

  const handleCloseMovie = useCallback(() => {
    setSelectedId(null);
    document.title = 'usePopcorn';
  }, []);

  function handleAddWatchedList(newWatchedMovie) {
    setWatched((watched) => [...watched, newWatchedMovie]);
  }

  function handleDeleteWatchedList(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  const {movies, isLoading, error} = useMovies(query, handleCloseMovie);

  useEffect(function() {
    handleCloseMovie();
  }, [movies, error, handleCloseMovie]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movieNum={movies?.length} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <LoadingComponent />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {!isLoading && error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedList={handleAddWatchedList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedList={handleDeleteWatchedList}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatchedList, watched }) {
  const API_KEY = '4c00399c';
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const countRef = useRef(0);

  const ratedMovieRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    imdbID,
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  useEffect(function() {
    if(userRating) countRef.current++
  }, [userRating])

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );
        const data = await res.json();

        setMovieDetails(data);
        setIsLoading(false);
      }

      fetchMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;

      document.title = `MOVIE: ${title}`;

      return function () {
        document.title = 'usePopcorn';
      };
    },
    [title]
  );

  useKey('Escape', onCloseMovie);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID,
      title,
      year,
      poster,
      runtime: Number(runtime.split(' ').at(0)),
      imdbRating: Number(imdbRating),
      plot,
      released,
      actors,
      director,
      genre,
      userRating,
      amountOfRate: countRef.current
    };

    console.log(newWatchedMovie)

    onAddWatchedList(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      <div className="details">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${title} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              {isWatched ? (
                <p>
                  You rated this movie with {ratedMovieRating}
                  <span> ⭐️</span>
                </p>
              ) : (
                <div className="rating">
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating !== 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </div>
              )}

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingComponent() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">⛔️ {message}</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const searchBar = useRef(null);

  useKey('Enter', function() {
    if (document.activeElement === searchBar.current) return;
    
    searchBar.current.focus();
    setQuery("");
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={searchBar}
    />
  );
}

function NumResult({ movieNum }) {
  return (
    <p className="num-results">
      Found <strong>{movieNum}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li
      onClick={() => {
        onSelectMovie(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched?.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatchedList }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovies
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchedList={onDeleteWatchedList}
        />
      ))}
    </ul>
  );
}

function WatchedMovies({ movie, onDeleteWatchedList }) {
  return (
    <li className="list-movies">
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchedList(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
