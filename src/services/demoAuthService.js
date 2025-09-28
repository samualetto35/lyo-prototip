// Demo Authentication Service - Firebase olmadan test için
import { findParentByPhone } from '../data/mockData';

class DemoAuthService {
  constructor() {
    this.confirmationResult = null;
    this.sentOTP = null;
  }

  // Veli telefon numarasını veritabanında kontrol et
  async checkPhoneNumber(phoneNumber) {
    try {
      const parent = findParentByPhone(phoneNumber);
      
      if (parent) {
        return {
          success: true,
          parent: parent,
          message: 'Veli telefon numarası bulundu'
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

  // Demo SMS doğrulama kodu gönder
  async sendVerificationCode(phoneNumber) {
    try {
      const phoneCheck = await this.checkPhoneNumber(phoneNumber);
      if (!phoneCheck.success) {
        return phoneCheck;
      }

      // Demo için sabit OTP kodu
      this.sentOTP = '123456';
      
      // Demo confirmation result
      this.confirmationResult = {
        confirm: async (otp) => {
          if (otp === this.sentOTP) {
            return {
              user: {
                phoneNumber: phoneNumber,
                uid: `demo_${Date.now()}`
              }
            };
          } else {
            throw new Error('Invalid OTP');
          }
        }
      };
      
      return {
        success: true,
        message: `Demo modu: Doğrulama kodu gönderildi. Kullanım için: ${this.sentOTP}`,
        parent: phoneCheck.parent
      };
    } catch (error) {
      console.error('Demo SMS gönderme hatası:', error);
      return {
        success: false,
        message: 'Demo SMS gönderilirken hata oluştu'
      };
    }
  }

  // Demo kod doğrulama
  async verifyCode(otpCode) {
    try {
      if (!this.confirmationResult) {
        throw new Error('Doğrulama süreci başlatılmamış');
      }

      const result = await this.confirmationResult.confirm(otpCode);
      
      return {
        success: true,
        user: result.user,
        message: 'Demo: Telefon numarası doğrulandı'
      };
    } catch (error) {
      console.error('Demo kod doğrulama hatası:', error);
      
      let errorMessage = 'Doğrulama kodu hatalı';
      
      if (error.message === 'Invalid OTP') {
        errorMessage = 'Geçersiz doğrulama kodu (Demo: 123456 kullanın)';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Demo temizlik
  clearRecaptcha() {
    // Demo için boş
  }

  // Demo çıkış
  async signOut() {
    this.confirmationResult = null;
    this.sentOTP = null;
    return { success: true };
  }

  // Demo kullanıcı
  getCurrentUser() {
    return null;
  }
}

export default new DemoAuthService();
