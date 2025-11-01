import React from 'react';

const GoalItem = ({ goal, onEdit, onDelete, onToggleComplete }) => {
  const handleToggleComplete = () => {
    onToggleComplete(goal._id, !goal.completed);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`goal-item ${goal.completed ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-title-section">
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={handleToggleComplete}
            className="goal-checkbox"
          />
          <h3 className="goal-title">{goal.title}</h3>
          <span className={`priority-badge ${getPriorityClass(goal.priority)}`}>
            {goal.priority}
          </span>
        </div>
        <div className="goal-actions">
          <button 
            onClick={() => onEdit(goal)}
            className="btn btn-edit"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(goal._id)}
            className="btn btn-delete"
          >
            Delete
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="goal-description">{goal.description}</p>
      )}

      <div className="goal-meta">
        {goal.category && (
          <span className="goal-category">{goal.category}</span>
        )}
        {goal.targetDate && (
          <span className="goal-date">
            Target: {formatDate(goal.targetDate)}
          </span>
        )}
        <span className="goal-created">
          Created: {formatDate(goal.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default GoalItem;