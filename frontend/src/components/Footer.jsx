import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-forest text-cream py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold">Novic<span className="text-mint">.</span></h3>
            <p className="text-cream/60 text-sm leading-relaxed">
              Restoring movement and hope through advanced biomechanical prosthetics. Join us in making mobility accessible to all.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li><Link to="/projects" className="hover:text-mint transition-colors">Campaigns</Link></li>
              <li><Link to="/about" className="hover:text-mint transition-colors">About Us</Link></li>
              <li><Link to="/impact" className="hover:text-mint transition-colors">Our Impact</Link></li>
              <li><Link to="/donate" className="hover:text-mint transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li><Link to="/privacy" className="hover:text-mint transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-mint transition-colors">Terms of Service</Link></li>
              <li><Link to="/transparency" className="hover:text-mint transition-colors">Transparency Report</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/60">
              <li>contact@novic.org</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Hope Avenue, Suite 400<br />New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-cream/40">
          <p>&copy; {new Date().getFullYear()} Novic Foundation. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-mint transition-colors">Twitter</a>
            <a href="#" className="hover:text-mint transition-colors">Instagram</a>
            <a href="#" className="hover:text-mint transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
