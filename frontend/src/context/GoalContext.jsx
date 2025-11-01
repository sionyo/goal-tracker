import React, { createContext, useReducer, useContext } from 'react';

// Action types
export const GOAL_ACTIONS = {
  SET_GOALS: 'SET_GOALS',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  goals: [],
  loading: false,
  error: null
};

// Reducer
const goalReducer = (state, action) => {
  switch (action.type) {
    case GOAL_ACTIONS.SET_GOALS:
      return {
        ...state,
        goals: action.payload,
        loading: false,
        error: null
      };
    case GOAL_ACTIONS.ADD_GOAL:
      return {
        ...state,
        goals: [action.payload, ...state.goals],
        error: null
      };
    case GOAL_ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal._id === action.payload._id ? action.payload : goal
        ),
        error: null
      };
    case GOAL_ACTIONS.DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        error: null
      };
    case GOAL_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case GOAL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Create context
const GoalContext = createContext();

// Provider component
export const GoalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  return (
    <GoalContext.Provider value={{ state, dispatch, GOAL_ACTIONS }}>
      {children}
    </GoalContext.Provider>
  );
};

// Custom hook
export const useGoalContext = () => {
  const context = useContext(GoalContext);

  if (!context) {
    throw new Error('useGoalContext must be used within a GoalProvider');
  }

  return context;
};

export default GoalContext;