// hooks/useCarSearch.ts
import { useState, useEffect, useCallback } from "react";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
}

interface SearchParams {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

export const useCarSearch = (searchParams: SearchParams) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchCars = useCallback(
    async (reset = false) => {
      if (loading || (!reset && !hasMore)) return;

      setLoading(true);
      try {
        const currentPage = reset ? 0 : page;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          size: "10",
          ...(searchParams.make && { make: searchParams.make }),
          ...(searchParams.model && { model: searchParams.model }),
          ...(searchParams.minYear && {
            minYear: searchParams.minYear.toString(),
          }),
          ...(searchParams.maxYear && {
            maxYear: searchParams.maxYear.toString(),
          }),
          ...(searchParams.color && { color: searchParams.color }),
          ...(searchParams.minPrice && {
            minPrice: searchParams.minPrice.toString(),
          }),
          ...(searchParams.maxPrice && {
            maxPrice: searchParams.maxPrice.toString(),
          }),
          ...(searchParams.keyword && { keyword: searchParams.keyword }),
        });

        const response = await fetch(`/api/cars/search?${params}`);
        const data = await response.json();

        const newCars = data.content;
        setCars((prev) => (reset ? newCars : [...prev, ...newCars]));
        setHasMore(!data.last);
        setPage(currentPage + 1);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
        if (initialLoad) setInitialLoad(false);
      }
    },
    [page, loading, hasMore, searchParams, initialLoad]
  );

  // Reset search when params change
  useEffect(() => {
    setCars([]);
    setPage(0);
    setHasMore(true);
    fetchCars(true);
  }, [searchParams]);

  return { cars, loading, hasMore, initialLoad, fetchMore: fetchCars };
};
