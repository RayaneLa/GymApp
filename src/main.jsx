import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './i18n'; // Ensure this is imported here!
import App from './App.jsx';
import Header from './Header.jsx';

// Import page components
import Profile from './pages/Profile.jsx';
import Reservations from './pages/Reservations';
import Booking from './pages/Booking';
import SubscriptionInfo from './pages/SubscriptionInfo';
import DiarySchedule from './pages/DiarySchedule';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />  {/* Place Header here so it stays persistent */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/subscription_info" element={<SubscriptionInfo />} />
        <Route path="/diary_schedule" element={<DiarySchedule />} />
      </Routes>
    </Router>
  </StrictMode>
);



if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
