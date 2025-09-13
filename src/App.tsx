import React, { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Camera } from './components/Camera';
import { Recommendations } from './components/Recommendations';
import { api, setAuthToken, getAuthToken, removeAuthToken } from './utils/api';
import { type Measurements } from './utils/measurementSimulator';

type View = 'login' | 'register' | 'home' | 'dashboard' | 'camera' | 'recommendations';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  recommendedSize: string;
  fit: 'Perfect' | 'Good' | 'Loose';
  brand: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [recommendations, setRecommendations] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // In a real app, validate token with backend
      setUser({ username: 'User' }); // Mock user data
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.login({ email, password });
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setCurrentView('dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.register({ username, email, password });
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setCurrentView('dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setCurrentView('home');
  };

  const handleMeasurementsCapture = async (measurements: Measurements) => {
    try {
      const token = getAuthToken();
      if (token) {
        // Save measurements
        await api.saveMeasurements(measurements, token);
        
        // Get recommendations
        const recResponse = await api.getRecommendations(measurements, token);
        if (recResponse.success) {
          setRecommendations(recResponse.recommendations);
          setCurrentView('recommendations');
        } else {
          setCurrentView('dashboard');
        }
      }
    } catch (error) {
      console.error('Error processing measurements:', error);
      setCurrentView('dashboard');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
            loading={loading}
            error={error}
          />
        );
      case 'register':
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
            loading={loading}
            error={error}
          />
        );
      case 'home':
        return (
          <Home
            onOpenCamera={() => setCurrentView('camera')}
            onLogin={() => setCurrentView('login')}
            onRegister={() => setCurrentView('register')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenCamera={() => setCurrentView('camera')}
            onViewRecommendations={() => setCurrentView('recommendations')}
          />
        );
      case 'camera':
        return (
          <Camera
            onMeasurementsCapture={handleMeasurementsCapture}
            onClose={() => setCurrentView('dashboard')}
          />
        );
      case 'recommendations':
        return (
          <Recommendations
            items={recommendations}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <Home onOpenCamera={() => setCurrentView('camera')} onLogin={function (): void {
          throw new Error('Function not implemented.');
        } } onRegister={function (): void {
          throw new Error('Function not implemented.');
        } } />;
    }
  };

  return <div className="App">{renderCurrentView()}</div>;
}

export default App;