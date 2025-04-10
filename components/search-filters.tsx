// components/search-filters.tsx

import type { SearchFilters } from "@/types/types";

export function SearchFilters({
  currentFilters,
}: {
  currentFilters: SearchFilters;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Filter By</h2>

      <div className="space-y-6">
        {/* Search input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Keyword Search
          </label>
          <input
            type="text"
            defaultValue={currentFilters.searchQuery}
            className="w-full border rounded p-2"
            placeholder="Search by make, model, etc."
          />
        </div>

        {/* Price range */}
        <div>
          <label className="block text-sm font-medium mb-1">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={currentFilters.minPrice}
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={currentFilters.maxPrice}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Year range */}
        <div>
          <label className="block text-sm font-medium mb-1">Year Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={currentFilters.minYear}
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={currentFilters.maxYear}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Make/Model filters would go here */}
        {/* Body style, transmission, etc. filters would go here */}

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
