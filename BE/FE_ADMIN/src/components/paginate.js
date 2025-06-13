import React, { useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <CPagination
      align="center"
      aria-label="Pagination"
      style={{ cursor: "pointer" }}
    >
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </CPaginationItem>
      {Array.from({ length: totalPages }, (_, index) => (
        <CPaginationItem
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </CPaginationItem>
      ))}
      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  );
};

export default Pagination;
