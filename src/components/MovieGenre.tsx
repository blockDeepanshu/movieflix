import React from "react";

interface MovieGenreProps {
  title: string;
}

const MovieGenre: React.FC<MovieGenreProps> = ({ title }) => {
  return (
    <div>
      <p className="genre-title">{title}</p>
    </div>
  );
};

export default MovieGenre;
