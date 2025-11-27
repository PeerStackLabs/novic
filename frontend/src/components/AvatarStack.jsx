import React from 'react';

const AvatarStack = ({ images }) => {
  return (
    <div className="flex -space-x-2">
      {images.map((src, i) => (
        <img 
          key={i} 
          src={src} 
          alt={`User ${i}`} 
          className="w-8 h-8 rounded-full border-2 border-white object-cover" 
        />
      ))}
    </div>
  );
};

export default AvatarStack;
