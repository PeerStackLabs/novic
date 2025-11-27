import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PROJECTS } from '../api/mocks';
import { formatCurrency, calculateProgress } from '../utils';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = MOCK_PROJECTS.find(p => p.id === id);

  if (!project) return <div className="container mx-auto px-6 py-12">Project not found</div>;

  const progress = calculateProgress(project.raised, project.goal);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img src={project.image} alt={project.title} className="w-full rounded-2xl shadow-lg" />
        </div>
        <div>
          <span className="text-mint-dark font-medium uppercase tracking-wide text-sm">{project.category}</span>
          <h1 className="text-4xl font-serif text-forest mt-2 mb-4">{project.title}</h1>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">{project.description}</p>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between text-lg font-medium mb-2">
              <span className="text-forest">{formatCurrency(project.raised)} raised</span>
              <span className="text-gray-500">of {formatCurrency(project.goal)}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-mint" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="w-full bg-mint text-forest py-4 rounded-xl font-medium text-lg hover:bg-mint-dark transition-colors">
              Donate to this Campaign
            </button>
          </div>

          <div className="prose prose-forest">
            <h3 className="font-serif text-2xl mb-4">Their Story</h3>
            <p className="text-gray-600 mb-6">{project.story}</p>
            <h3 className="font-serif text-2xl mb-4">Impact</h3>
            <p className="text-gray-600">{project.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
