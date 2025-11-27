import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModalDonate = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-3xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif text-forest mb-4">Make a Donation</h2>
            <p className="mb-6 text-gray-600">Select an amount to donate.</p>
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-forest">Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalDonate;
