// Tone: Balanced — human-emotional + technical credibility. Keep copy short & clean.
import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../framerConfig';

const CountUp = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(end);
      return;
    }

    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      setCount(Math.floor(percentage * end));

      if (progress < duration * 1000) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, shouldReduceMotion]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/**
 * Impact component displaying key statistics.
 */
const Impact = () => {
  const shouldReduceMotion = useReducedMotion();
  const containerVariants = shouldReduceMotion ? {} : staggerContainer;
  const itemVariants = shouldReduceMotion ? {} : fadeUp;

  // Static stats data
  const limbsFundedNum = 2800;
  const mobilityNum = 93;
  const centersNum = 27;

  return (
    <section aria-labelledby="impact-heading" className="py-16 md:py-24 bg-forest text-cream">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="impact-heading" className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Our Impact
          </h2>
          <p className="text-lg text-cream/80 leading-relaxed">
            Transparent results — every contribution supports measurable outcomes in mobility, health, and independence.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-cardbg p-8 rounded-2xl text-center border border-white/10">
            <div className="text-4xl md:text-5xl font-serif font-bold text-mint mb-2" role="status" aria-live="polite">
              <CountUp end={limbsFundedNum} suffix="+" />
            </div>
            <div className="text-xs uppercase tracking-widest text-cream/60 mb-4 font-bold">Limbs funded</div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Custom prosthetics fitted for thousands of recipients across partner clinics.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-cardbg p-8 rounded-2xl text-center border border-white/10">
            <div className="text-4xl md:text-5xl font-serif font-bold text-mint mb-2" role="status" aria-live="polite">
              <CountUp end={mobilityNum} suffix="%" />
            </div>
            <div className="text-xs uppercase tracking-widest text-cream/60 mb-4 font-bold">Regain functional mobility</div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Clinical follow-ups show most recipients regain independent mobility after fitting and rehab.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-cardbg p-8 rounded-2xl text-center border border-white/10">
            <div className="text-4xl md:text-5xl font-serif font-bold text-mint mb-2" role="status" aria-live="polite">
              <CountUp end={centersNum} />
            </div>
            <div className="text-xs uppercase tracking-widest text-cream/60 mb-4 font-bold">Partner centers</div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Rehabilitation and fitting centers across regions ensure local care and follow-up.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
