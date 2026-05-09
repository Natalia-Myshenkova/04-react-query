import { useState } from "react";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({
  onSubmit,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (query.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query.trim());
    setQuery("");
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form
          className={css.form}
          onSubmit={handleSubmit}
        >
          <input
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search movies..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />

          <button
            className={css.button}
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}