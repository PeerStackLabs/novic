import React from 'react';

const InfoPanel = ({ title, children }) => {
  return (
    <div className="bg-cream/50 p-8 rounded-3xl border border-cream-dark/10">
      <h3 className="text-xl font-serif text-forest mb-4">{title}</h3>
      <div className="text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default InfoPanel;
