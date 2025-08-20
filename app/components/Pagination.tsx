import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Update input when currentPage changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    } else if (e.key === 'Escape') {
      setPageInput(currentPage.toString());
      setIsEditing(false);
    }
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      onPageChange(pageNumber);
    } else {
      setPageInput(currentPage.toString());
    }
    setIsEditing(false);
  };

  const handlePageInputBlur = () => {
    handlePageInputSubmit();
  };

  const handlePageInputClick = () => {
    setIsEditing(true);
  };

  return (
    <div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Page</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                onBlur={handlePageInputBlur}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">of {totalPages}</span>
            </div>
          ) : (
            <button
              onClick={handlePageInputClick}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Page {currentPage} of {totalPages}
            </button>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}