import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    mint: "bg-mint/10 text-mint-dark",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
  };

  const styles = variants[variant] || variants.default;
    
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
};

export default Badge;
