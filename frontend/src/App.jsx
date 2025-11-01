import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoalProvider, useGoalContext } from './context/GoalContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './index.css';

// Component to check authentication on app start
const AuthInitializer = ({ children }) => {
  const { state, dispatch, AUTH_ACTIONS } = useAuthContext();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { ...result.data, token }
              });
            }
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [dispatch, AUTH_ACTIONS]);

  return children;
};

function AppContent() {
  const { state } = useAuthContext();

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!state.isAuthenticated ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!state.isAuthenticated ? <Register /> : <Navigate to="/" />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <AuthInitializer>
          <AppContent />
        </AuthInitializer>
      </GoalProvider>
    </AuthProvider>
  );
}

export default App;