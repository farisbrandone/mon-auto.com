// hooks/useInfiniteAutos.ts
import { baseUrl } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

export const useInfiniteAutos = () => {
  const [autos, setAutos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchAutos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/autos?page=${page}&size=10`);
      const data = await response.json();
      const newAutos = data._embedded.autos;

      setAutos((prev) => [...prev, ...newAutos]);
      setHasMore(data.page.totalPages > page + 1);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching Autos:", error);
    } finally {
      setLoading(false);
    }
    console.log({ hasMore });
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchAutos();
  }, []);

  return { autos, loading, hasMore, fetchMore: fetchAutos };
};
