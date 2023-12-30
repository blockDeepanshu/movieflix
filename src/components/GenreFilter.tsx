// GenreFilter.tsx

import React from "react";

interface GenreFilterProps {
  genres: { id: number; name: string }[];
  selectedGenres: string[];
  onGenreChange: (selectedGenres: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onGenreChange,
}) => {
  const handleGenreClick = (genreName: string) => {
    const updatedGenres = selectedGenres.includes(genreName)
      ? selectedGenres.filter((id) => id !== genreName)
      : [...selectedGenres, genreName];

    // console.log("updatedGenres", updatedGenres);
    onGenreChange(updatedGenres);
  };

  return (
    <div className="genre-buttons">
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={selectedGenres.includes(genre.name) ? "active" : ""}
          onClick={() => handleGenreClick(genre.name)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
