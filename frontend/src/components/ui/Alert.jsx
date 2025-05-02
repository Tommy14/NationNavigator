import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  
  const alertTypes = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };
  
  return (
    <div className={`${alertTypes[type]} border rounded-md p-4 my-4 relative`} role="alert">
      <div className="flex">
        <div className="flex-grow">{message}</div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;