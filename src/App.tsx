import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import MovieList from "./components/MovieList";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div style={{ minHeight: "500px" }}>
      <Header onSearch={handleSearch} />
      <MovieList searchQuery={searchQuery} />
    </div>
  );
};

export default App;
