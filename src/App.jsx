import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
// import authService from './services/authService';
import authService from './services/demoAuthService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde Firebase auth durumunu kontrol et
    const checkAuthState = () => {
      const user = authService.getCurrentUser();
      if (user) {
        // Kullanıcı giriş yapmış, ancak parent bilgisini localStorage'dan al
        const savedParent = localStorage.getItem('currentParent');
        if (savedParent) {
          setCurrentParent(JSON.parse(savedParent));
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    // Dark mode tercihini localStorage'dan yükle
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    checkAuthState();
  }, []);

  const handleLogin = (parent) => {
    setCurrentParent(parent);
    setIsAuthenticated(true);
    // Parent bilgisini localStorage'a kaydet
    localStorage.setItem('currentParent', JSON.stringify(parent));
    // Giriş sonrası sayfayı en üste scroll et
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentParent(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentParent');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`App transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {isAuthenticated && currentParent ? (
        currentParent.type === 'admin' ? (
          <AdminDashboard 
            admin={currentParent} 
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : (
          <Dashboard 
            parent={currentParent} 
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )
      ) : (
        <LandingPage 
          onLogin={handleLogin}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

export default App;
