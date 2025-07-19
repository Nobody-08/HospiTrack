// frontend/src/hooks/useAPI.js

import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading, error, and data states
export const useAPI = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Custom hook for API mutations (POST, PUT, DELETE)
export const useAPIMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (apiCall, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await apiCall();
      
      setSuccess(true);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return { mutate, loading, error, success, reset };
};

// Hook for real-time data updates
export const useRealTimeData = (apiCall, interval = 30000, dependencies = []) => {
  const { data, loading, error, refetch } = useAPI(apiCall, dependencies);
  
  useEffect(() => {
    if (interval > 0) {
      const intervalId = setInterval(() => {
        refetch();
      }, interval);
      
      return () => clearInterval(intervalId);
    }
  }, [refetch, interval]);
  
  return { data, loading, error, refetch };
};

// Hook for paginated data
export const usePaginatedAPI = (apiCall, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState({ page: 1, ...initialParams });

  const fetchData = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(reset ? { ...params, page: 1 } : params);
      const newData = response.data.results || response.data;
      
      if (reset) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }
      
      setHasMore(!!response.data.next);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, params]);

  useEffect(() => {
    fetchData(true);
  }, [params.page]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [hasMore, loading]);

  const refresh = useCallback(() => {
    setParams(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  return { 
    data, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh, 
    updateParams,
    params 
  };
};
