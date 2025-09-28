import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

// Firebase konfigürasyonu - Bu bilgileri kendi Firebase projenizden alın
const firebaseConfig = {
  apiKey: "your-api-key-here", // Firebase Console'dan alın
  authDomain: "your-project.firebaseapp.com", // Firebase Console'dan alın
  projectId: "your-project-id", // Firebase Console'dan alın
  storageBucket: "your-project.appspot.com", // Firebase Console'dan alın
  messagingSenderId: "123456789", // Firebase Console'dan alın
  appId: "your-app-id" // Firebase Console'dan alın
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth instance'ını al
export const auth = getAuth(app);

// ReCAPTCHA verifier'ı oluştur
export const createRecaptchaVerifier = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

export default app;
