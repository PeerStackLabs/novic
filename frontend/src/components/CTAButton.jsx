import React from 'react';
import { Link } from 'react-router-dom';

const CTAButton = ({ to, children, variant = 'primary', className = '' }) => {
  const baseStyles = "px-8 py-4 rounded-full font-medium text-lg transition-all transform hover:scale-105";
  const variants = {
    primary: "bg-mint text-forest hover:bg-mint-dark shadow-lg shadow-mint/20",
    secondary: "border border-cream/30 text-cream hover:bg-white/5",
    outline: "border border-forest text-forest hover:bg-forest hover:text-cream"
  };

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default CTAButton;
