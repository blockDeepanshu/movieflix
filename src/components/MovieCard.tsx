import React from "react";

interface Movie {
  id: number;
  title: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <h2>{movie.title}</h2>
    </div>
  );
};

export default MovieCard;
