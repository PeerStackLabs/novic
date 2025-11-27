import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hoverLift } from '../framerConfig';
import { calculateProgress, formatCurrency } from '../utils';

const ProjectCard = ({ project }) => {
  const progress = calculateProgress(project.raised, project.goal);

  return (
    <motion.div 
      variants={hoverLift}
      whileHover="hover"
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/1A2F28/39D7A9?text=Campaign+Image';
          }}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-forest uppercase tracking-wide">
          {project.category}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-serif text-forest mb-3">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-forest">{formatCurrency(project.raised)} raised</span>
              <span className="text-gray-500">of {formatCurrency(project.goal)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-mint"
              />
            </div>
          </div>

          <Link 
            to={`/projects/${project.id}`}
            className="block w-full text-center border border-forest text-forest py-3 rounded-xl font-medium hover:bg-forest hover:text-cream transition-colors"
          >
            View Campaign
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
