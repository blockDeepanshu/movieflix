/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { API_KEY } from "../utils/constant";
import { useGenere } from "../hooks/useGenre";

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  genre_ids: string[];
}

const App: React.FC = () => {
  const [movieLists, setMovieLists] = useState<{
    [year: number]: Movie[] | null;
  }>({});
  const [years, setYears] = useState<number[]>([2012]);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMovies();
  }, [years]);

  const fetchMovies = async () => {
    try {
      for (const year of years) {
        if (!movieLists[year]) {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`
          );
          let data = await response.json();
          if (data?.results?.length) data = useGenere(data.results);

          //console.log(data);

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

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const currentYear = years[years.length - 1];

    // Scrolling down and reaching the bottom
    const bottom =
      scrollTop + window.innerHeight === document.documentElement.offsetHeight;

    // Scrolling up and reaching the top
    const top = scrollTop === 0;

    if (bottom && !movieLists[currentYear]) {
      setYears((prevYears) => [...prevYears, currentYear + 1]);
      // Smooth scroll down to the loader element
      const targetScroll = loader.current?.offsetTop || 0;
      setTimeout(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }, 50); // Adjust the delay as needed
    } else if (top && !movieLists[years[0] - 1]) {
      setYears((prevYears) => [years[0] - 1, ...prevYears]);
      // Smooth scroll up to the loader element
      const targetScroll = loader.current?.offsetTop || 0;
      const scrollDistance = scrollTop - targetScroll;
      setTimeout(() => {
        window.scrollTo({
          top: scrollTop - scrollDistance * 0.1,
          behavior: "smooth",
        });
      }, 50); // Adjust the delay as needed
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [years]);

  // console.log(movieLists);

  return (
    <div className="app">
      {years.map((year) => (
        <div key={year}>
          {movieLists[year] !== null ? (
            <>
              <h1 className="movie-year">{year}</h1>

              <div className="movie-list">
                {movieLists[year]?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
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

export default App;
