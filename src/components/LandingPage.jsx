import React, { useState, useEffect } from 'react';
import PhoneInputComponent from './PhoneInput';
import OTPVerification from './OTPVerification';
import SlidingBanner from './SlidingBanner';
// import authService from '../services/authService';
import authService from '../services/demoAuthService';

const LandingPage = ({ onLogin, isDarkMode, toggleDarkMode }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parent, setParent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Gerçek zamanlı saat güncellemesi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.sendVerificationCode(phoneNumber);
      
      if (result.success) {
        setParent(result.parent);
        setStep('otp');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyCode(otpCode);
      
      if (result.success) {
        // Demo başarı popup'ı göster
        setShowSuccess(true);
        
        // 2 saniye sonra giriş yap
        setTimeout(() => {
          setShowSuccess(false);
          onLogin(parent);
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Doğrulama hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.sendVerificationCode(phoneNumber);
      
      if (result.success) {
        // Başarılı mesajı göster
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('SMS gönderilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setError('');
    setParent(null);
    authService.clearRecaptcha();
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className="bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <h1 className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sabancı Lise Yaz Okulu
              </h1>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Sistem Aktif</span>
                </div>
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Lyo'ya
                  <span className={`block transition-colors duration-300 ${isDarkMode ? 'text-primary-400' : 'text-primary-600'}`}>Hoş Geldin!</span>
                </h2>
                <p className={`text-lg mb-6 leading-relaxed font-normal transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Veli portalına telefon numaranızla giriş yaparak 
                  çocuklarınızın akademik bilgilerini görüntüleyebilir, 
                  izinli günlerini takip edebilir ve güncelleyebilirsiniz.
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className={`rounded-xl shadow-lg border p-6 animate-slide-up transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                {step === 'phone' ? (
                  <div>

                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                      <PhoneInputComponent
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        error={error}
                        disabled={isLoading}
                        isDarkMode={isDarkMode}
                      />

                      <button
                        type="submit"
                        disabled={!phoneNumber || isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Kontrol ediliyor...
                          </div>
                        ) : (
                          'Devam Et'
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500">
                        Veli telefon numaranız sistemde kayıtlı olmalıdır
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-6">
                      <button
                        onClick={handleBackToPhone}
                        className={`mr-3 p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <svg className={`w-5 h-5 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Doğrulama
                      </h3>
                    </div>

                    <OTPVerification
                      onVerify={handleOTPVerify}
                      onResend={handleOTPResend}
                      phoneNumber={phoneNumber}
                      isLoading={isLoading}
                      isDarkMode={isDarkMode}
                    />

                    {error && (
                      <div className={`mt-4 p-3 border rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-red-900/50 border-red-700' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-red-300' : 'text-red-600'
                        }`}>{error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className={`mt-6 p-4 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/50 border-blue-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 mt-0.5 transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-900'
                    }`}>
                      Yardıma mı ihtiyacınız var?
                    </h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Veli telefon numaranız sistemde kayıtlı değilse lütfen okul yönetimi ile iletişime geçin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Sliding Banner - Below Login Form */}
            <div className="lg:col-span-2 mt-2">
              <SlidingBanner 
                isDarkMode={isDarkMode}
                items={[
                  {
                    title: "Güvenli Giriş",
                    description: "SMS doğrulama ile güvenli giriş",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ),
                    iconBg: "bg-primary-100",
                    iconColor: "text-primary-600"
                  },
                  {
                    title: "Hızlı Erişim",
                    description: "Tüm bilgilerinize anında erişim",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    iconBg: "bg-green-100",
                    iconColor: "text-green-600"
                  },
                  {
                    title: "Çocuk Takibi",
                    description: "Tüm çocuklarınızı tek yerden",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    ),
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600"
                  },
                  {
                    title: "İzin Takvimi",
                    description: "İzinli günleri görsel takvim",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ),
                    iconBg: "bg-purple-100",
                    iconColor: "text-purple-600"
                  },
                  {
                    title: "Anlık Bildirimler",
                    description: "Önemli güncellemeler için SMS",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ),
                    iconBg: "bg-orange-100",
                    iconColor: "text-orange-600"
                  },
                  {
                    title: "Mobil Uyumlu",
                    description: "Her cihazda mükemmel deneyim",
                    icon: (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.759 8.071 16 9.007 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a3.996 3.996 0 01-.041-2.08l-.08.08A3.996 3.996 0 015 10c0 .54.081 1.061.241 1.546l-.663.663zm1.519-1.519l.662-.662a3.996 3.996 0 01.041 2.08l.08-.08a3.996 3.996 0 01-.241-1.546l-.662.662z" clipRule="evenodd" />
                      </svg>
                    ),
                    iconBg: "bg-teal-100",
                    iconColor: "text-teal-600"
                  }
                ]}
                autoSlide={true}
                slideInterval={4000}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>&copy; 2024 Lyo Portal. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* reCAPTCHA Container */}
      <div id="recaptcha-container"></div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-8 max-w-md w-full mx-4 text-center transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
              isDarkMode ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <span className="text-3xl">✅</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Başarılı!
            </h3>
            <p className={`mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Demo modunda doğrulama tamamlandı.
            </p>
            <div className={`p-3 rounded-lg border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-green-900/50 border-green-700' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Giriş yapılıyor...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
