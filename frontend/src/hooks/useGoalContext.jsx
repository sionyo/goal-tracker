import { useContext } from 'react';
import GoalContext from '../context/GoalContext';

export const useGoalContext = () => {
  const context = useContext(GoalContext);

  if (!context) {
    throw new Error('useGoalContext must be used within a GoalProvider');
  }

  return context;
};