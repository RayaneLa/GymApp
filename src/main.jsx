import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './i18n'; // Ensure this is imported here!
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './Header'; // Import the Header component

// Import page components
import Profile from './pages/Profile.jsx';
import Reservations from './pages/Reservations';
import Booking from './pages/Booking';
import SubscriptionInfo from './pages/SubscriptionInfo';
import DiarySchedule from './pages/DiarySchedule';
import Login from './pages/Login';
import Register from './pages/Register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ErrorBoundary>
        <Header /> {/* Place Header here so it stays persistent */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/profile" element={<ProtectedRoute element={Profile} allowedRoles={['admin', 'coach', 'user']} />} />
                  <Route path="/reservations" element={<ProtectedRoute element={Reservations} allowedRoles={['admin', 'coach', 'user']} />} />
                  <Route path="/booking" element={<ProtectedRoute element={Booking} allowedRoles={['admin', 'coach', 'user']} />} />
                  <Route path="/subscription_info" element={<ProtectedRoute element={SubscriptionInfo} allowedRoles={['admin', 'coach', 'user']} />} />
                  <Route path="/diary_schedule" element={<ProtectedRoute element={DiarySchedule} allowedRoles={['admin', 'coach', 'user']} />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}