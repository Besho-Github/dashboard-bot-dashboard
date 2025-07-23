import React, { useState } from 'react';

const CustomCheckbox = ({ size = 5, isChecked = true, toggleCheckbox, className }) => {
  return (
    <div
      className={`size-${size} rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200 border ${
        !!isChecked ? 'bg-[#5865F2] border-[#7983F5]' : 'border-gray-700'
      } ${className}`}
      onClick={toggleCheckbox}
    >
      {!!isChecked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`text-white size-${size + 1}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};

export default CustomCheckbox;
