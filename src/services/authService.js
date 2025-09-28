import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  PhoneAuthProvider,
  signInWithCredential 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { findStudentByPhone } from '../data/mockData';

class AuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // ReCAPTCHA verifier'ı başlat
  initializeRecaptcha() {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }
    return this.recaptchaVerifier;
  }

  // Telefon numarasını veritabanında kontrol et
  async checkPhoneNumber(phoneNumber) {
    try {
      // Telefon numarasını temizle ve formatla
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = `+${cleanPhone}`;
      
      // Veritabanında ara
      const student = findStudentByPhone(formattedPhone);
      
      if (student) {
        return {
          success: true,
          student: student,
          message: 'Telefon numarası bulundu'
        };
      } else {
        return {
          success: false,
          message: 'Bu telefon numarası sistemde kayıtlı değil'
        };
      }
    } catch (error) {
      console.error('Telefon kontrol hatası:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      };
    }
  }

  // SMS doğrulama kodu gönder
  async sendVerificationCode(phoneNumber) {
    try {
      // Önce telefon numarasını kontrol et
      const phoneCheck = await this.checkPhoneNumber(phoneNumber);
      if (!phoneCheck.success) {
        return phoneCheck;
      }

      // ReCAPTCHA'yı başlat
      const recaptchaVerifier = this.initializeRecaptcha();

      // SMS gönder
      this.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      return {
        success: true,
        message: 'Doğrulama kodu gönderildi',
        student: phoneCheck.student
      };
    } catch (error) {
      console.error('SMS gönderme hatası:', error);
      
      let errorMessage = 'SMS gönderilirken bir hata oluştu';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Geçersiz telefon numarası';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'Günlük SMS limiti aşıldı';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Doğrulama kodunu kontrol et
  async verifyCode(otpCode) {
    try {
      if (!this.confirmationResult) {
        throw new Error('Doğrulama süreci başlatılmamış');
      }

      const result = await this.confirmationResult.confirm(otpCode);
      
      return {
        success: true,
        user: result.user,
        message: 'Telefon numarası doğrulandı'
      };
    } catch (error) {
      console.error('Kod doğrulama hatası:', error);
      
      let errorMessage = 'Doğrulama kodu hatalı';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Geçersiz doğrulama kodu';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Doğrulama kodu süresi dolmuş';
      } else if (error.code === 'auth/credential-already-in-use') {
        errorMessage = 'Bu telefon numarası zaten kullanımda';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // ReCAPTCHA'yı temizle
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  // Çıkış yap
  async signOut() {
    try {
      await auth.signOut();
      this.clearRecaptcha();
      this.confirmationResult = null;
      return { success: true };
    } catch (error) {
      console.error('Çıkış hatası:', error);
      return { success: false, message: 'Çıkış yapılırken hata oluştu' };
    }
  }

  // Mevcut kullanıcıyı al
  getCurrentUser() {
    return auth.currentUser;
  }
}

export default new AuthService();
