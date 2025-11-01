import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { state, dispatch, AUTH_ACTIONS } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    navigate('/login');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🎯</span>
          GoalTracker
        </Link>

        <nav className="nav">
          {state.isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-avatar"
                onClick={toggleDropdown}
              >
                {state.user?.avatar ? (
                  <img src={state.user.avatar} alt={state.user.name} />
                ) : (
                  <span className="avatar-fallback">
                    {getInitials(state.user?.name || 'U')}
                  </span>
                )}
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-name">{state.user?.name}</p>
                    <p className="user-email">{state.user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile Settings
                  </Link>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;