import React from 'react';

const StatCard = ({ value, label }) => {
  return (
    <div className="p-6 text-center">
      <div className="text-5xl font-serif text-mint mb-2">{value}</div>
      <div className="text-cream/60 uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
};

export default StatCard;
