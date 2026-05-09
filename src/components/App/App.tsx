import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { useState, useEffect, useMemo } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";

const ReactPaginate = (ReactPaginateModule as any).default;

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: (previousData) => previousData,
  });

  const movies = useMemo(() => data?.results ?? [], [data]);

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && searchQuery && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [movies, isLoading, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid
            movies={movies}
            onSelect={handleSelectMovie}
          />

          {totalPages > 1 && (
            <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }: { selected: number }) =>
              setCurrentPage(selected + 1)
            }
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
        />
      )}
    </div>
  );
}