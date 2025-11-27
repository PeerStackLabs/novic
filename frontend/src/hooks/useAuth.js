import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosClient.get(ENDPOINTS.AUTH.ME);
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { user, loading };
};

export default useAuth;
