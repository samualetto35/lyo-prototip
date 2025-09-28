# Lyo Veli Portal Prototipi

Bu proje, velilerin telefon numarası ile giriş yapabileceği ve Firebase SMS doğrulama kullanan bir veli portalıdır.

## 🌐 **Canlı Demo**

**https://lyo-prototip.vercel.app**

## 🚀 **Hızlı Test**

Demo modu aktif! Test telefon numaraları:
- `+905559876543` - Ayşe Yılmaz (2 çocuk: Ahmet & Elif)
- `+905554321098` - Fatma Demir (1 çocuk: Zeynep)
- `+905551098765` - Sema Kaya (1 çocuk: Emre)

**Demo OTP Kodu**: `123456`

## ✨ **Özellikler**

- 📱 **Responsive Tasarım**: Mobile, tablet ve desktop için optimize edilmiş
- 🔐 **Güvenli Giriş**: Firebase SMS doğrulama sistemi
- 👨‍👩‍👧‍👦 **Veli Odaklı**: Çocukları yönetme ve takip etme
- 📊 **Detaylı Profil**: Öğrenci ve veli bilgileri
- 🎓 **Akademik Bilgiler**: Program ve dönem takibi
- 📅 **İzin Takvimi**: Görsel takvim ile izinli günler
- ✏️ **İzin Yönetimi**: İnteraktif takvim ile izin ekleme/düzenleme
- 📱 **SMS Onay**: İzin ekleme için SMS doğrulama

## Teknolojiler

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Phone Input**: react-phone-number-input
- **State Management**: React Hooks

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd lyo_prototip
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Firebase konfigürasyonunu yapın:
   - `src/config/firebase.js` dosyasında Firebase proje bilgilerinizi güncelleyin
   - Firebase Console'da Authentication > Sign-in method > Phone'u etkinleştirin
   - reCAPTCHA ayarlarını yapılandırın

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Veritabanı Yapısı

Her öğrenci için aşağıdaki bilgiler saklanır:

```javascript
{
  id: 'STU001',                    // Unique öğrenci ID
  firstName: 'Ahmet',              // Öğrenci adı
  lastName: 'Yılmaz',              // Öğrenci soyadı
  phoneNumber: '+905551234567',    // Öğrenci telefonu
  motherId: 'PAR001',              // Anne ID
  motherName: 'Ayşe Yılmaz',       // Anne adı
  motherPhone: '+905559876543',    // Anne telefonu
  fatherId: 'PAR002',              // Baba ID
  fatherName: 'Mehmet Yılmaz',     // Baba adı
  fatherPhone: '+905557654321',    // Baba telefonu
  birthDate: '2010-05-15',         // Doğum tarihi
  program: 'İlkokul 4. Sınıf',     // Kayıtlı program
  semester: 1,                     // Dönem (1,2,3)
  permissions: ['academic', 'transportation', 'meals'] // İzinler
}
```

## Kullanım

1. **Telefon Girişi**: Öğrenci, anne veya baba telefon numarası ile giriş yapabilir
2. **SMS Doğrulama**: Firebase SMS ile doğrulama kodu gönderilir
3. **Profil Görüntüleme**: Öğrenci bilgileri, veli bilgileri ve akademik bilgiler
4. **Kardeş Görüntüleme**: Aynı veliye ait diğer öğrencileri görüntüleme

## Test Verileri

Sistemde 5 adet test öğrencisi bulunmaktadır:

- **Ahmet Yılmaz** (+905551234567) - İlkokul 4. Sınıf
- **Zeynep Demir** (+905556543210) - Ortaokul 2. Sınıf  
- **Emre Kaya** (+905553210987) - İlkokul 3. Sınıf
- **Elif Yılmaz** (+905550987654) - Ahmet'in kardeşi, İlkokul 2. Sınıf
- **Can Özkan** (+905549876543) - Ortaokul 3. Sınıf

## Responsive Tasarım

- **Mobile** (< 640px): Tek sütun, büyük dokunmatik alanlar
- **Tablet** (640px - 1024px): İki sütun, orta boyut
- **Desktop** (> 1024px): İki sütun, geniş layout

## Güvenlik

- Firebase Authentication ile güvenli SMS doğrulama
- reCAPTCHA ile bot koruması
- Telefon numarası formatı doğrulama
- Veri şifreleme (production'da)

## Geliştirme

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
