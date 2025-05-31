/**
 * ACTIFY iOS-Ready TouchableButton Component
 * Optimized for mobile touch interactions
 */

import React from 'react';

const TouchableButton = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 active:bg-gray-500 dark:bg-gray-600 dark:text-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100 dark:hover:bg-purple-900/20',
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-150
    transform active:scale-95
    select-none
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const handlePress = (e) => {
    if (disabled || loading) return;
    
    // Add haptic feedback for iOS
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    onPress?.(e);
  };

  return (
    <button
      className={baseClasses}
      onClick={handlePress}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export default TouchableButton;