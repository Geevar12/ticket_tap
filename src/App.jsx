import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieListing from './pages/MovieListing';
import EventListing from './pages/EventListing';
import MovieDetail from './pages/MovieDetail';
import EventDetail from './pages/EventDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Logout from './pages/Logout';
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
            path="/events"
            element={
              <RequireAuth>
                <EventListing />
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
            path="/event/:id"
            element={
              <RequireAuth>
                <EventDetail />
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