import { useState, useCallback } from 'react';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';

/**
 * useAxios – Hook for making API calls with loading and error states
 * 
 * @returns {object} { loading, error, data, request, reset }
 * 
 * Usage:
 *   const { loading, error, data, request } = useAxios();
 *   const fetchData = async () => {
 *     const response = await request('GET', '/trips');
 *   };
 */
const useAxios = () => {
  const { showLoading, hideLoading } = useLoading();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (method, url, payload = null, params = null) => {
    setLoading(true);
    setError(null);
    showLoading();

    try {
      const config = {
        method,
        url,
        data: payload,
        params,
      };
      const response = await api(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, data, request, reset };
};

export default useAxios;