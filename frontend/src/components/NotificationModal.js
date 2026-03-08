import React, { useEffect, useState } from 'react';

const NotificationModal = ({ isOpen, onClose, type = 'success', title, message, autoClose = true }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, 3000);
      const progressTimer = setInterval(() => {
        setProgress(prev => prev - 2);
      }, 60);
      
      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }
  }, [isOpen, onClose, autoClose]);

  useEffect(() => {
    if (isOpen) setProgress(100);
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500 to-emerald-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          progressBg: 'bg-green-300'
        };
      case 'error':
        return {
          bg: 'from-red-500 to-pink-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          progressBg: 'bg-red-300'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500 to-orange-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          progressBg: 'bg-yellow-300'
        };
      default:
        return {
          bg: 'from-blue-500 to-purple-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          progressBg: 'bg-blue-300'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`bg-gradient-to-r ${styles.bg} text-white rounded-2xl shadow-2xl overflow-hidden max-w-sm animate-bounce-in`}>
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                {styles.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-white/90 text-sm">{message}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {autoClose && (
          <div className="h-1 bg-white/20">
            <div 
              className={`h-full ${styles.progressBg} transition-all duration-75 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;