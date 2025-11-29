import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, staggerContainer, parallaxImage } from '../framerConfig';

const Hero = () => {
  const videoRef = useRef(null);
  const isVideoInView = useInView(videoRef, { amount: 0.3 });

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoInView) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoInView]);

  return (
    <section className="relative bg-forest min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="space-y-2">
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif text-cream leading-tight">
                Give Hope. <br />
                Restore Movement.
              </motion.h1>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif text-mint italic">
                Impact lives with prosthetic support.
              </motion.h2>
            </div>

            <motion.p variants={fadeUp} className="text-cream/80 text-lg md:text-xl max-w-xl leading-relaxed">
              Join us in helping individuals who have lost limbs regain independence. Your contribution funds high-quality biomechanical prosthetic arms, legs, and assistive devices for those who need them the most.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link 
                to="/donate" 
                className="bg-mint text-forest px-8 py-4 rounded-full font-medium text-lg hover:bg-mint-dark transition-all transform hover:scale-105 shadow-lg shadow-mint/20"
              >
                Sponsor a Limb
              </Link>
              <Link 
                to="/about" 
                className="border border-cream/30 text-cream px-8 py-4 rounded-full font-medium text-lg hover:bg-white/5 transition-all"
              >
                How it Works
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 pt-4 text-sm text-cream/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint"></span>
                100% transparent donations
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint"></span>
                Backed by verified medical partners
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint"></span>
                Real stories. Real impact.
              </div>
            </motion.div>
          </motion.div>

          {/* Image / Visuals */}
          <motion.div 
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.div variants={parallaxImage} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
              {/* Placeholder for Hero Image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest/80 z-10"></div>
              <video 
                ref={videoRef}
                src="/images/Prosthetic Program.mp4" 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Tag */}
              <div className="absolute top-6 right-6 z-20 bg-forest/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-mint text-xs font-medium tracking-wider uppercase">
                Medical-Grade Prosthetics
              </div>

              {/* Info Card Overlay */}
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-cream font-serif text-xl mb-2">Prosthetic Support Program</h3>
                  <p className="text-cream/80 text-sm leading-relaxed">
                    Helping underserved amputees access advanced biomechanical prosthetics. Designed for durability, comfort, and real-world mobility.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
