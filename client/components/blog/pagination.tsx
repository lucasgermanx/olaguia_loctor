import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center">
      <ul className="flex space-x-1">
        {/* Previous Page Button */}
        {currentPage > 1 && (
          <li>
            <Link
              href={`${baseUrl}&page=${currentPage - 1}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-navy-950 hover:bg-navy-50"
            >
              &lt;
            </Link>
          </li>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
            ) : (
              <Link
                href={`${baseUrl}&page=${page}`}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === page
                    ? "bg-navy-950 text-white"
                    : "border border-gray-300 bg-white text-navy-950 hover:bg-navy-50"
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Next Page Button */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={`${baseUrl}&page=${currentPage + 1}`}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-navy-950 hover:bg-navy-50"
            >
              &gt;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
