import { useState, useCallback } from "react";

/**
 * Custom hook for ReactPaginate
 * @param {number} initialPage - starting page (default 1)
 */
const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);
  // ReactPaginate gives selected (0-based)
  const handlePageClick = useCallback((event) => {
    setPage(event.selected + 1);
  }, []);

  return { page, setPage, handlePageClick };
};

export default usePagination;