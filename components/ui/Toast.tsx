"use client";

import React, { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Alert01Icon
} from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className={`border rounded-xl p-4 shadow-lg flex items-start gap-3 max-w-md ${
        type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="mt-0.5">
          {type === 'error' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {type === 'success' && <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-5 h-5 text-green-600" />}
          {type === 'warning' && <HugeiconsIcon icon={Alert01Icon} className="w-5 h-5 text-amber-600" />}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${
            type === 'error' ? 'text-red-800' :
            type === 'success' ? 'text-green-800' :
            'text-amber-900'
          }`}>
            {type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Warning'}
          </h3>
          <p className={`text-sm mt-1 ${
            type === 'error' ? 'text-red-700' :
            type === 'success' ? 'text-green-700' :
            'text-amber-800'
          }`}>
            {message}
          </p>
        </div>
        <button onClick={onClose} className={`transition ${
          type === 'error' ? 'text-red-500 hover:text-red-700' :
          type === 'success' ? 'text-green-500 hover:text-green-700' :
          'text-amber-500 hover:text-amber-700'
        }`}>
          <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
