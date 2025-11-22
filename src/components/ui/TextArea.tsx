'use client';

import React, { TextareaHTMLAttributes, useId } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helpText,
  className = '',
  id,
  rows = 6,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-4 py-2.5 border ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB]'
        } rounded-[10px] shadow-sm focus:outline-none focus:ring-2 transition-colors text-[16px] text-gray-900 placeholder:text-gray-400 resize-y`}
        {...props}
      />
      {helpText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
};

export default TextArea; 