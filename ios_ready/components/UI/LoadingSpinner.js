/**
 * ACTIFY iOS-Ready Loading Spinner
 * Optimized for mobile performance
 */

import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'purple', 
  className = '',
  fullScreen = false 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };

  const colors = {
    purple: 'border-purple-600',
    white: 'border-white',
    gray: 'border-gray-600',
    blue: 'border-blue-600',
  };

  const spinner = (
    <div
      className={`
        animate-spin rounded-full border-2 border-transparent
        ${sizes[size]}
        ${colors[color]}
        border-t-current
        ${className}
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;