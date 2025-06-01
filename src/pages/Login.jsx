import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [error, setError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Simple login for testing
    localStorage.setItem('loggedIn', 'true');
    navigate('/home', { replace: true });
    if (onLogin) onLogin();
  };

  const handleSignup = e => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupConfirm) {
      setSignupError('Please fill all fields.');
      setSignupSuccess('');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      setSignupSuccess('');
      return;
    }
    setSignupError('');
    setSignupSuccess('Account created! You can now log in.');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirm('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          {isSignup ? 'Create your TicketTap Account' : 'Sign in to TicketTap'}
        </h2>
        {!isSignup ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                autoComplete="username"
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
            </div>
            {error && <div className="login-error">{error}</div>}
            <button className="btn btn-primary login-btn" type="submit">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                autoFocus
                autoComplete="username"
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  tabIndex={-1}
                  onClick={() => setShowSignupPassword(v => !v)}
                  aria-label={showSignupPassword ? "Hide password" : "Show password"}
                >
                  {showSignupPassword ? "👁" : "👁"}
                </button>
              </div>
            </div>
            <div className="input-group password-group">
              <label>Confirm Password</label>
              <div className="password-input-wrap">
                <input
                  type={showSignupConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={signupConfirm}
                  onChange={e => setSignupConfirm(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  tabIndex={-1}
                  onClick={() => setShowSignupConfirm(v => !v)}
                  aria-label={showSignupConfirm ? "Hide password" : "Show password"}
                >
                  {showSignupConfirm ? "👁" : "👁"}
                </button>
              </div>
            </div>
            {signupError && <div className="login-error">{signupError}</div>}
            {signupSuccess && <div className="login-success">{signupSuccess}</div>}
            <button className="btn btn-primary login-btn" type="submit">
              Create Account
            </button>
          </form>
        )}
        <div className="login-footer">
          {!isSignup ? (
            <>
              <span>New to TicketTap?</span>
              <button
                className="login-link"
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                className="login-link"
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  setSignupError('');
                  setSignupSuccess('');
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
