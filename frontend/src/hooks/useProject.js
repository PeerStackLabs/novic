import { useState, useEffect } from 'react';
import { MOCK_PROJECTS } from '../api/mocks';

const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const found = MOCK_PROJECTS.find(p => p.id === id);
        if (found) {
          setProject(found);
        } else {
          setError(new Error('Project not found'));
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  return { project, loading, error };
};

export default useProject;
