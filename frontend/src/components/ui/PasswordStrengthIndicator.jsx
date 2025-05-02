import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;
  
  // Password requirements
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const requirements = [
    { label: 'At least 8 characters', met: hasLength },
    { label: 'At least 1 uppercase letter', met: hasUppercase },
    { label: 'At least 1 lowercase letter', met: hasLowercase },
    { label: 'At least 1 number', met: hasNumber },
    { label: 'At least 1 special character', met: hasSpecialChar },
  ];
  
  const metCount = requirements.filter(req => req.met).length;
  const strengthPercentage = (metCount / requirements.length) * 100;
  
  // Determine color based on strength
  let strengthColor = 'bg-red-500';
  if (strengthPercentage >= 80) strengthColor = 'bg-green-500';
  else if (strengthPercentage >= 60) strengthColor = 'bg-yellow-500';
  else if (strengthPercentage >= 40) strengthColor = 'bg-orange-500';
  
  return (
    <div className="mt-2 mb-4">
      <div className="w-full bg-gray-200 h-2 mb-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-600">
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center">
              {req.met ? (
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;