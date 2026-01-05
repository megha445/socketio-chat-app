import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth ,onlineUsers} = useAuthStore();

  const { theme } = useThemeStore();

  console.log("Online Users:", onlineUsers);
  useEffect(() => {
    console.log('Checking authentication status...');
    checkAuth();
  }, [checkAuth]);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // This sets it on <html>
  }, [theme]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-12" />
      </div>
    );
  }
  
  return (
    <div >
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
