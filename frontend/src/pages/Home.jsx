import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import Impact from '../components/Impact';
import { MOCK_PROJECTS, MOCK_TESTIMONIALS } from '../api/mocks';
import { fadeUp, staggerContainer } from '../framerConfig';

const Home = () => {
  return (
    <div className="bg-cream-light">
      <Hero />

      {/* Featured Campaigns */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif text-forest mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-xl">
              Support urgent cases and help individuals regain their mobility today.
            </p>
          </div>
          <a href="/projects" className="hidden md:block text-forest font-medium hover:text-mint-dark transition-colors">
            View all campaigns &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href="/projects" className="text-forest font-medium hover:text-mint-dark transition-colors">
            View all campaigns &rarr;
          </a>
        </div>
      </section>

      {/* How Your Donation Helps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif text-forest mb-6">How Your Donation Helps</h2>
            <p className="text-gray-600">
              We ensure transparency at every step. Your contribution directly funds the manufacturing and fitting of custom prosthetic limbs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Assessment & Design",
                desc: "Medical experts assess the patient's needs and design a custom biomechanical limb."
              },
              {
                step: "02",
                title: "Manufacturing",
                desc: "Using advanced materials, we manufacture durable and comfortable prosthetics."
              },
              {
                step: "03",
                title: "Fitting & Rehab",
                desc: "Patients receive their new limb along with physical therapy to ensure full mobility."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 rounded-3xl bg-cream/50 border border-cream-dark/10"
              >
                <span className="text-6xl font-serif text-mint/20 absolute top-4 right-6 font-bold">
                  {item.step}
                </span>
                <h3 className="text-xl font-serif text-forest mb-4 relative z-10">{item.title}</h3>
                <p className="text-gray-600 relative z-10 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <Impact />

      {/* Stories of Hope */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-4xl font-serif text-forest mb-12 text-center">Stories of Hope</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((story) => (
            <motion.div 
              key={story.id}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-serif text-forest font-bold">{story.name}</h4>
                  <span className="text-xs text-mint-dark font-medium uppercase tracking-wide">{story.role}</span>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">
                "{story.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
