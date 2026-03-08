import React from 'react';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = 'responsive' 
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'px-2 sm:px-4';
      case 'medium':
        return 'px-4 sm:px-6';
      case 'large':
        return 'px-4 sm:px-6 lg:px-8';
      case 'responsive':
      default:
        return 'px-4 sm:px-6 lg:px-8';
    }
  };

  const getMaxWidthClass = () => {
    const maxWidthMap = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      'full': 'max-w-full'
    };
    return maxWidthMap[maxWidth] || 'max-w-7xl';
  };

  return (
    <div className={`${getMaxWidthClass()} mx-auto ${getPaddingClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;