import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const API_BASE_URL = 'http://localhost:5000/api';

const Register = () => {
  const { state, dispatch, AUTH_ACTIONS } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/');
    }
  }, [state.isAuthenticated, navigate]);

  const handleRegister = async (formData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: result.data
        });
        navigate('/');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAIL,
        payload: error.message
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Start Your Journey</h1>
            <p>Create an account to track your goals</p>
          </div>

          <RegisterForm
            onSubmit={handleRegister}
            loading={state.loading}
            error={state.error}
          />

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;