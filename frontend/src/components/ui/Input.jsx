import React from 'react';
 
const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete = "on",
  theme = "dark",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-indigo-100' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : theme === 'dark' ? 'border-indigo-700' : 'border-gray-300'}
          ${theme === 'dark' ? 'bg-[#1e1b4b] text-indigo-100' : 'bg-white text-indigo-900'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
 
export default Input;