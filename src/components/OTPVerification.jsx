import React, { useState, useRef, useEffect } from 'react';

const OTPVerification = ({ onVerify, onResend, phoneNumber, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // İlk input'a focus
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Sadece rakam kabul et
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Bir sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace ile önceki input'a geç
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Son dolu input'a focus
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    onResend();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Doğrulama Kodu
        </h3>
        <p className="text-gray-600">
          <span className="font-medium">{phoneNumber}</span> numarasına gönderilen 6 haneli kodu girin
        </p>
      </div>

      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 || isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Doğrulanıyor...
            </div>
          ) : (
            'Doğrula'
          )}
        </button>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:opacity-50"
          >
            Kodu yeniden gönder
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Kodu almadınız mı? Spam klasörünüzü kontrol edin.</p>
      </div>
    </div>
  );
};

export default OTPVerification;
