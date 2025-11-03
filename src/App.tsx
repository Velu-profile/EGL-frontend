import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from './_services/authService';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: authListener } = authService.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLoginSuccess = () => {
    // User state will be updated by the auth listener
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to EGL Budget Manager</h1>
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
        <div className="content-section">

        </div>
      </header>
    </div>
  );
}

export default App;
