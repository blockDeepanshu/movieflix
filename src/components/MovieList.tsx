import React, { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";

interface Movie {
  id: number;
  title: string;
}

const API_KEY = "2dca580c2a14b55200e784d157207b4d";

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
          const data = await response.json();

          setMovieLists((prevMovieLists) => ({
            ...prevMovieLists,
            [year]: data.results.length ? data.results : null,
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

    const bottom =
      scrollTop + window.innerHeight === document.documentElement.offsetHeight;

    const top = scrollTop === 0;

    if (bottom && !movieLists[currentYear]) {
      setYears((prevYears) => [...prevYears, currentYear + 1]);

      const targetScroll = loader.current?.offsetTop || 0;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else if (top && !movieLists[years[0] - 1]) {
      setYears((prevYears) => [years[0] - 1, ...prevYears]);

      const targetScroll = loader.current?.offsetTop || 0;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [years]);

  return (
    <div className="app">
      {years.map((year) => (
        <div key={year}>
          {movieLists[year] !== null ? (
            <>
              <h1>{year}</h1>
              <hr style={{ width: "80%", margin: "10px auto" }} />
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
