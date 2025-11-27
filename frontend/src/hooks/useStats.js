import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useStats = () => {
  const [stats, setStats] = useState({
    limbsFunded: '2800+',
    regainMobilityPercent: '93%',
    partnerCenters: 27
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Verify backend endpoint for stats
        const response = await axiosClient.get('/stats');
        if (response.data) {
          setStats({
            limbsFunded: response.data.limbsFunded || '2800+',
            regainMobilityPercent: response.data.regainMobilityPercent || '93%',
            partnerCenters: response.data.partnerCenters || 27
          });
        }
      } catch (err) {
        console.warn('Failed to fetch stats, using fallback data.', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useStats;
