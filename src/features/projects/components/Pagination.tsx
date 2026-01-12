import React from "react";
import clsx from "clsx";
import ArrowIcon from "@/features/projects/svg/ArrowIcon";
import css from "@/features/projects/index.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={css.pagination}>
      <ArrowButton
        direction="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className={css.paginationEllipsis}>...</span>
          ) : (
            <button
              className={clsx(
                css.paginationButton,
                currentPage === page && css.active
              )}
              onClick={() => onPageChange(page as number)}
              type="button"
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <ArrowButton
        direction="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
};

interface ArrowButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function ArrowButton({ direction, disabled, onClick }: ArrowButtonProps) {
  return (
    <button
      className={clsx(css.paginationButton, disabled && css.disabled)}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={`${direction === "prev" ? "Previous" : "Next"} page`}
    >
      <ArrowIcon
        style={{
          width: "16px",
          height: "16px",
          transform: direction === "prev" ? "rotate(-90deg)" : "rotate(90deg)",
          transformOrigin: "center",
        }}
      />
    </button>
  );
}

export default Pagination;
