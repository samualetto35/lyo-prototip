import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneInputComponent = ({ value, onChange, error, disabled, isDarkMode = false }) => {
  const [country, setCountry] = useState('TR'); // Türkiye default

  return (
    <div className="w-full">
      <label htmlFor="phone" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Telefon Numarası
      </label>
      <div className="relative">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="TR"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`phone-input ${error ? 'border-red-500' : ''} ${isDarkMode ? 'dark' : ''}`}
          placeholder="Telefon numaranızı girin"
        />
      </div>
      {error && (
        <p className={`mt-2 text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}>{error}</p>
      )}
      
      <style>{`
        .phone-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background-color: white;
          color: #1f2937;
        }
        
        .phone-input:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: none;
        }
        
        .phone-input.error {
          border-color: #ef4444;
        }
        
        .phone-input.dark {
          background-color: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
        
        .phone-input.dark:focus {
          border-color: #60a5fa;
        }
        
        /* Remove focus outline from all elements inside phone input */
        .phone-input *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Style phone input elements for dark mode */
        .phone-input.dark input {
          background-color: #374151 !important;
          color: #f9fafb !important;
          border: none !important;
        }
        
        .phone-input.dark .PhoneInputCountrySelect {
          background-color: #374151 !important;
          color: #f9fafb !important;
        }
        
        .phone-input.dark .PhoneInputCountrySelectArrow {
          color: #f9fafb !important;
        }
        
        /* Mobile responsive */
        @media (max-width: 640px) {
          .phone-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default PhoneInputComponent;
