// components/pagination.tsx
import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/cars?page=${currentPage - 1}`}
          className="px-4 py-2 border rounded"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/cars?page=${page}`}
          className={`px-4 py-2 border rounded ${
            page === currentPage ? "bg-blue-600 text-white" : ""
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/cars?page=${currentPage + 1}`}
          className="px-4 py-2 border rounded"
        >
          Next
        </Link>
      )}
    </div>
  );
}
