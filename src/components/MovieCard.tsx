import React from "react";
import { MOVIE_IMAGE } from "../utils/constant";
import MovieGenre from "./MovieGenre";

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  genre_ids: string[];
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={MOVIE_IMAGE + movie.backdrop_path} />
      <h2>{movie.title}</h2>
      <p>{movie.overview.slice(0, 150)}.....</p>
      <div className="genre-list">
        {movie.genre_ids.map((item, i) => (
          <MovieGenre title={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default MovieCard;
