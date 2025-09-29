import React, { useState } from 'react';
import PhoneInputComponent from './PhoneInput';
import OTPVerification from './OTPVerification';
// import authService from '../services/authService';
import authService from '../services/demoAuthService';

const LandingPage = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parent, setParent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                Sabancı Lise Yaz Okulu
              </h1>
            </div>
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <span>Veli Girişi</span>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Lyo'ya
                  <span className="text-primary-600 block">Hoş Geldin!</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Veli portalına telefon numaranızla giriş yaparak 
                  çocuklarınızın akademik bilgilerini görüntüleyebilir, 
                  izinli günlerini takip edebilir ve güncelleyebilirsiniz.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Güvenli Giriş</h3>
                    <p className="text-sm text-gray-600">SMS doğrulama ile güvenli giriş</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Hızlı Erişim</h3>
                    <p className="text-sm text-gray-600">Tüm bilgilerinize anında erişim</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Çocuk Takibi</h3>
                    <p className="text-sm text-gray-600">Tüm çocuklarınızı tek yerden</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">İzin Takvimi</h3>
                    <p className="text-sm text-gray-600">İzinli günleri görsel takvim</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="card animate-slide-up">
                {step === 'phone' ? (
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Giriş Yap
                      </h3>
                      <p className="text-gray-600">
                        Telefon numaranızı girerek başlayın
                      </p>
                    </div>

                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                      <PhoneInputComponent
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        error={error}
                        disabled={isLoading}
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
                        className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h3 className="text-xl font-bold text-gray-900">
                        Doğrulama
                      </h3>
                    </div>

                    <OTPVerification
                      onVerify={handleOTPVerify}
                      onResend={handleOTPResend}
                      phoneNumber={phoneNumber}
                      isLoading={isLoading}
                    />

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-blue-600 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Yardıma mı ihtiyacınız var?
                    </h4>
                    <p className="text-sm text-blue-700">
                      Veli telefon numaranız sistemde kayıtlı değilse lütfen okul yönetimi ile iletişime geçin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Lyo Portal. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* reCAPTCHA Container */}
      <div id="recaptcha-container"></div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Başarılı!
            </h3>
            <p className="text-gray-600 mb-4">
              Demo modunda doğrulama tamamlandı.
            </p>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
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
