import React from 'react';
import GoalItem from './GoalItem';

const GoalList = ({ goals, onEdit, onDelete, onToggleComplete }) => {
  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <h3>No goals yet</h3>
        <p>Create your first goal to get started!</p>
      </div>
    );
  }

  return (
    <div className="goal-list">
      {goals.map(goal => (
        <GoalItem
          key={goal._id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default GoalList;