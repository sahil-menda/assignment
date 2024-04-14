import { Icon } from "@iconify/react";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPageCount: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
  const { onPageChange, currentPage, totalPageCount } = props;
  const siblingCount = 1;

  const paginationRange = usePagination({
    currentPage,
    siblingCount,
    totalPageCount,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className="flex flex-row items-center gap-1">
      <li>
        <button disabled={currentPage === 1} onClick={onPrevious}>
          <Icon
            icon="ant-design:down-outlined"
            width="10"
            height="14"
            rotate={1}
            className={`hover:scale-125 hover:bg-slate-100 rounded-sm
             ${currentPage === 1 ? "text-gray-200" : "text-gray-500"}
              `}
          />
        </button>
      </li>
      {paginationRange.map((pageNumber: number, key: number) => {
        if (pageNumber === 0) {
          return (
            <li key={key}>
              <p>&#8230;</p>
            </li>
          );
        }
        return (
          <li key={key}>
            <button
              disabled={pageNumber === currentPage}
              className={` text-xs rounded-md h-9 w-9  ${
                pageNumber === currentPage
                  ? "bg-blue-500 text-white "
                  : "text-gray-500 bg-gray-200"
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        );
      })}
      <li>
        <button disabled={currentPage === lastPage} onClick={onNext}>
          <Icon
            icon="ant-design:down-outlined"
            width="10"
            height="10"
            rotate={3}
            className={`hover:scale-125 hover:bg-slate-100 rounded-sm
             ${currentPage === lastPage ? "text-gray-200" : "text-gray-500"}
              `}
          />
        </button>
      </li>
    </ul>
  );
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = ({
  totalPageCount,
  siblingCount,
  currentPage,
}: {
  totalPageCount: number;
  siblingCount: number;
  currentPage: number;
}): number[] => {
  const paginationRange = useMemo(() => {
    const visiblePages = (2 * siblingCount) + 3;
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );
    const leftDotsNeeded = leftSiblingIndex > 2;
    const rightDotsNeeded = rightSiblingIndex < totalPageCount - 1;
    if (totalPageCount <= visiblePages) {
      return range(1, totalPageCount);
    }
    let pages: number[] = [];
    if (!leftDotsNeeded && rightDotsNeeded) {
      pages = [...range(1, visiblePages - 1), 0, totalPageCount];
    } else if (leftDotsNeeded && !rightDotsNeeded) {
      pages = [1, 0, ...range(totalPageCount - visiblePages + 2, totalPageCount)];
    } else if (leftDotsNeeded && rightDotsNeeded) {
      pages = [1, 0, ...range(leftSiblingIndex, rightSiblingIndex), 0, totalPageCount];
    } else {
      pages = [1, ...range(2, totalPageCount - 1), totalPageCount];
    }
    return pages;
  }, [totalPageCount, siblingCount, currentPage]);

  return paginationRange;
};


export default Pagination;
