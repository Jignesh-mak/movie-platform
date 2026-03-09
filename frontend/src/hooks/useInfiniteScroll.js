import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchFn, deps = []) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    reset();
  }, deps); // eslint-disable-line

  useEffect(() => {
    const load = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const res = await fetchFn(page);
        const newItems = res.data?.results || [];
        const totalPages = res.data?.total_pages || 1;
        setItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setHasMore(page < totalPages);
      } catch (err) {
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]); // eslint-disable-line

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    });
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  return { items, loading, error, hasMore, loaderRef, reset };
};

export default useInfiniteScroll;
