import { useState, useMemo } from 'react';

/**
 * usePagination – Pagination logic for tables/lists
 * 
 * @param {array} data - Full data array
 * @param {number} itemsPerPage - Items per page
 * @returns {object} { currentPage, totalPages, paginatedData, setPage, nextPage, prevPage, goToPage }
 * 
 * Usage:
 *   const { paginatedData, currentPage, totalPages, setPage } = usePagination(items, 10);
 */
const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    setPage: goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export default usePagination;