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
    <div className="App">
      {isAuthenticated && currentParent ? (
        currentParent.type === 'admin' ? (
          <AdminDashboard 
            admin={currentParent} 
            onLogout={handleLogout}
          />
        ) : (
          <Dashboard 
            parent={currentParent} 
            onLogout={handleLogout} 
          />
        )
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
