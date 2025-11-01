import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useGoalContext } from '../context/GoalContext';
import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';

const API_BASE_URL = 'http://localhost:5000/api';

const Home = () => {
  const { state: authState } = useAuthContext();
  const { state: goalState, dispatch, GOAL_ACTIONS } = useGoalContext();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Fetch goals on component mount or when auth changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchGoals();
    }
  }, [authState.isAuthenticated]);

  const fetchGoals = async () => {
    if (!authState.token) return;

    dispatch({ type: GOAL_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: GOAL_ACTIONS.SET_GOALS, payload: result.data });
      }
    } catch (error) {
      dispatch({ 
        type: GOAL_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  };

  const handleCreateGoal = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: GOAL_ACTIONS.ADD_GOAL, payload: result.data });
        setShowForm(false);
      }
    } catch (error) {
      dispatch({ 
        type: GOAL_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  };

  const handleUpdateGoal = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${editingGoal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: GOAL_ACTIONS.UPDATE_GOAL, payload: result.data });
        setEditingGoal(null);
      }
    } catch (error) {
      dispatch({ 
        type: GOAL_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: GOAL_ACTIONS.DELETE_GOAL, payload: goalId });
      }
    } catch (error) {
      dispatch({ 
        type: GOAL_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  };

  const handleToggleComplete = async (goalId, completed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: GOAL_ACTIONS.UPDATE_GOAL, payload: result.data });
      }
    } catch (error) {
      dispatch({ 
        type: GOAL_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
  };

  const completedGoals = goalState.goals.filter(goal => goal.completed).length;
  const totalGoals = goalState.goals.length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  if (!authState.isAuthenticated) {
    return <div className="loading">Please sign in to view your goals</div>;
  }

  if (goalState.loading && goalState.goals.length === 0) {
    return <div className="loading">Loading your goals...</div>;
  }

  return (
    <div className="home">
      <header className="page-header">
        <div className="welcome-section">
          <h1>Welcome back, {authState.user?.name}!</h1>
          <p>Keep pushing towards your dreams</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Goal'}
        </button>
      </header>

      {goalState.error && (
        <div className="error-message">
          Error: {goalState.error}
          <button 
            onClick={() => dispatch({ type: GOAL_ACTIONS.SET_ERROR, payload: null })}
            className="btn-close"
          >
            ×
          </button>
        </div>
      )}

      {(showForm || editingGoal) && (
        <div className="form-section">
          <h2>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <GoalForm
            onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
            initialData={editingGoal || {}}
            isEditing={!!editingGoal}
          />
          {editingGoal && (
            <button 
              onClick={handleCancelEdit}
              className="btn btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      {totalGoals > 0 && (
        <div className="progress-section glass-container">
          <h3>Your Progress</h3>
          <div className="progress-stats">
            <p>{completedGoals} of {totalGoals} goals completed</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="progress-percentage">{Math.round(progressPercentage)}%</p>
          </div>
        </div>
      )}

      <GoalList
        goals={goalState.goals}
        onEdit={handleEdit}
        onDelete={handleDeleteGoal}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default Home;