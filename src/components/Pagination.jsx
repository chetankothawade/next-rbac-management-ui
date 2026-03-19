import React from "react";
import ReactPaginate from "react-paginate";

/**
 * Reusable Pagination component
 * @param {number} totalPages - total number of pages
 * @param {number} page - current page (1-based)
 * @param {function} handlePageClick - callback from hook
 */
function Pagination({ totalPages, page, handlePageClick }) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={"← Previous"}
      nextLabel={"Next →"}
      breakLabel={"..."}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={"pagination justify-content-center mt-3"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
      activeClassName={"active"}
      forcePage={page - 1} // react-paginate expects 0-based index
    />
  );
}

export default Pagination;
