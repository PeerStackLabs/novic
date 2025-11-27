// Tone: Balanced — human-emotional + technical credibility. Keep copy short & clean.
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../framerConfig';
import Badge from './Badge';

/**
 * About component displaying mission and vision with a balanced tone.
 */
const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const animationProps = shouldReduceMotion ? {} : fadeUp;

  return (
    <section aria-labelledby="about-heading" className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text Column */}
          <motion.div 
            className="w-full md:w-1/2 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationProps}
          >
            <h2 id="about-heading" className="text-3xl md:text-4xl font-serif font-bold text-forest">
              About Novic
            </h2>
            <p className="text-xl text-forest/80 font-medium leading-relaxed">
              Restoring movement through human-centered biomechanical innovation.
            </p>
            <p className="text-forest/70 leading-relaxed">
              Novic is a nonprofit dedicated to making advanced biomechanical prosthetics accessible to underserved communities. We combine compassionate care, verified clinical partners, and modern prosthetic engineering to design and fit custom limbs that restore dignity and independence. Your support funds assessments, custom fabrication, and rehabilitation so recipients can move forward with confidence.
            </p>
          </motion.div>

          {/* Image/Card Column */}
          <motion.div 
            className="w-full md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animationProps}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" 
                alt="Patient receiving care" 
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Patient+Image'; // Fallback
                }}
              />
              <div className="absolute top-4 right-4">
                <Badge variant="mint">Medical-Grade Prosthetics</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
