import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { MOCK_PROJECTS } from '../api/mocks';

const Projects = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif text-forest mb-8">All Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
