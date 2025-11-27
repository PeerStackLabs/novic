import { useState, useEffect } from 'react';
import { MOCK_PROJECTS } from '../api/mocks';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProjects(MOCK_PROJECTS);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

export default useProjects;
