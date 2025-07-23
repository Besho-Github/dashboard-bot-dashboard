import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  inputRef,
  bgColor = '#1D1B45', // Default background color
  disabled = false,
  styles = {},
}) => (
  <div className="flex flex-col gap-1 w-full max-w-full mb-2.5" style={{ ...styles }}>
    <div className="w-full text-xs font-bold tracking-wide leading-4 text-gray-400 uppercase">{label}</div>
    <input
      ref={inputRef}
      disabled={disabled}
      name={name}
      value={value}
      onChange={onChange}
      style={{ backgroundColor: '#1D1B45' }} // Set the background color using inline style
      className={`px-2.5 py-3 mt-2 text-sm font-medium leading-4 text-gray-400 whitespace-nowrap rounded-sm max-md:pr-5 max-md:max-w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error && 'border-red-500'
      }`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

export default InputField;
