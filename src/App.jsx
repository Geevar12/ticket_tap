import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieListing from './pages/MovieListing';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Admin from './pages/Admin';
import BookingConfirmation from './pages/BookingConfirmation';
import Payment from './pages/Payment';
import './App.css';

// Auth wrapper for protected routes
function RequireAuth({ children }) {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const location = useLocation();
  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Admin auth wrapper
function RequireAdmin({ children }) {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();
  if (!loggedIn || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Layout component for pages with Navbar/Footer
function MainLayout() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            loggedIn
              ? <Navigate to="/home" replace />
              : <div className="fullscreen-login"><Login /></div>
          }
        />
        {/* Logout route */}
        <Route path="/logout" element={<Logout />} />
        {/* Admin dashboard route */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        {/* Main app layout with Navbar/Footer */}
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/movies"
            element={
              <RequireAuth>
                <MovieListing />
              </RequireAuth>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <RequireAuth>
                <MovieDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/booking/:type/:id"
            element={
              <RequireAuth>
                <Booking />
              </RequireAuth>
            }
          />
          <Route
            path="/booking/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />
          <Route
            path="/booking/confirmation"
            element={
              <RequireAuth>
                <BookingConfirmation />
              </RequireAuth>
            }
          />
        </Route>
        {/* Redirect root to login or home */}
        <Route
          path="/"
          element={
            loggedIn
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;