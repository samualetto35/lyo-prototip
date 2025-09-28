import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneInputComponent = ({ value, onChange, error, disabled }) => {
  const [country, setCountry] = useState('TR'); // Türkiye default

  return (
    <div className="w-full">
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
          className={`phone-input ${error ? 'border-red-500' : ''}`}
          placeholder="Telefon numaranızı girin"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <style>{`
        .phone-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }
        
        .phone-input:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: none;
        }
        
        .phone-input.error {
          border-color: #ef4444;
        }
        
        /* Remove focus outline from all elements inside phone input */
        .phone-input *:focus {
          outline: none !important;
          box-shadow: none !important;
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
