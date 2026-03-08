import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionModal = ({ isOpen, onClose, missingFields }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCompleteProfile = () => {
    navigate('/profile');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
          <p className="text-orange-100">Please complete your profile to proceed with checkout</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Missing Information:</h3>
            <ul className="space-y-2">
              {missingFields.map((field, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCompleteProfile}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Complete Profile
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;