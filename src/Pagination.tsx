
interface PaginationProps {
  currentPage: number,
  totalPages: number,
  onPageChange:(value: number) => void
}

function Pagination({ currentPage,totalPages, onPageChange }: PaginationProps) {

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-2 py-1 mx-1 ${
            currentPage === index + 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          } rounded cursor-pointer`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;