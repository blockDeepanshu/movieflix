/* eslint-disable react-hooks/rules-of-hooks */
// MovieList.tsx
import React, { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import GenreFilter from "./GenreFilter";
import { useGenere } from "../hooks/useGenre";
import { API_KEY } from "../utils/constant";

interface MovieListProps {
  searchQuery: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  genre_ids: string[];
}

const MovieList: React.FC<MovieListProps> = ({ searchQuery }) => {
  const [movieLists, setMovieLists] = useState<{
    [year: number]: Movie[] | null;
  }>({});
  const [years, setYears] = useState<number[]>([2012]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [years, searchQuery]);

  const fetchMovies = async () => {
    try {
      for (const year of years) {
        if (!movieLists[year]) {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100&query=${searchQuery}`
          );
          let data = await response.json();
          if (data?.results) data = useGenere(data?.results);
          setMovieLists((prevMovieLists) => ({
            ...prevMovieLists,
            [year]: data?.length ? data : null,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [years]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const currentYear = years[years.length - 1];

    // Scrolling down and reaching the bottom
    const bottom =
      Math.ceil(scrollTop + window.innerHeight) >=
      document.documentElement.offsetHeight;

    // Scrolling up and reaching the top
    const top = scrollTop === 0;

    if (bottom && !movieLists[currentYear]) {
      setYears((prevYears) => [...prevYears, currentYear + 1]);

      const targetScroll = loader.current?.offsetTop || 0;
      const scrollDistance = scrollTop - targetScroll;
      setTimeout(() => {
        window.scrollTo({
          top: targetScroll - scrollDistance * 0.1,
          behavior: "smooth",
        });
      }, 500);
    } else if (top && !movieLists[years[0] - 1]) {
      setYears((prevYears) => [years[0] - 1, ...prevYears]);

      const targetScroll = loader.current?.offsetTop || 0;
      const scrollDistance = scrollTop - targetScroll;
      setTimeout(() => {
        window.scrollTo({
          top: scrollTop - scrollDistance * 0.1,
          behavior: "smooth",
        });
      }, 500);
    }
  };

  const handleGenreChange = (selectedGenres: string[]) => {
    setSelectedGenres(selectedGenres);
  };

  const filterMoviesByGenre = (movies: Movie[]) => {
    if (selectedGenres.length === 0 && !searchQuery) {
      return movies;
    }

    const filteredMovies = movies?.filter((movie) => {
      const matchesGenre =
        selectedGenres.length === 0 ||
        movie.genre_ids.some((id) => selectedGenres.includes(id));

      const matchesSearch =
        !searchQuery ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGenre && matchesSearch;
    });

    return filteredMovies;
  };

  return (
    <div className="app">
      <div className="genre-container">
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreChange={handleGenreChange}
        />
      </div>

      {years.map((year) => (
        <div key={year}>
          {movieLists[year] !== null ? (
            <>
              <h1
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {year}
              </h1>

              <div className="movie-list">
                {filterMoviesByGenre(movieLists[year]!)?.length > 0 ? (
                  filterMoviesByGenre(movieLists[year]!)?.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                ) : (
                  <h1 style={{ color: "white", textAlign: "center" }}>
                    No Movies to display
                  </h1>
                )}
              </div>
            </>
          ) : (
            <p key={year}>End of List</p>
          )}
        </div>
      ))}
      <div ref={loader} style={{ height: "10px" }}></div>
    </div>
  );
};

export default MovieList;
