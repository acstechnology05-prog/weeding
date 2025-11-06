import { useEffect, useState, useRef, useCallback } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  initialLoad?: boolean;
}

export function useLazyLoad<T>(
  fetchFn: () => Promise<T>,
  options: UseLazyLoadOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    initialLoad = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoad);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (hasLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, hasLoaded, isLoading]);

  useEffect(() => {
    if (initialLoad) {
      load();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            load();
          }
        });
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [load, hasLoaded, threshold, rootMargin]);

  return { ref, data, isLoading, error, reload: load };
}

export function usePaginatedLoad<T>(
  fetchFn: (page: number) => Promise<T[]>,
  pageSize: number = 10
) {
  const [allData, setAllData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page);
      if (result.length === 0 || result.length < pageSize) {
        setHasMore(false);
      }
      setAllData((prev) => [...prev, ...result]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setHasMore(false);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [fetchFn, page, hasMore, pageSize]);

  const reset = useCallback(() => {
    setAllData([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  }, []);

  return { data: allData, isLoading, hasMore, error, loadMore, reset };
}
