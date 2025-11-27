import React from 'react';
import ProjectCard from './ProjectCard';

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProjectCard key={product.id} project={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
