import React from 'react';
import { motion } from 'framer-motion';
import { parallaxImage } from '../framerConfig';

const AnimatedImage = ({ src, alt, className }) => {
  return (
    <motion.div variants={parallaxImage} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
};

export default AnimatedImage;
