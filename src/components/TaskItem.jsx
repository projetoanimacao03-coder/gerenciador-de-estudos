import React from 'react';

export default function TaskItem({ task, onDelete }) {
  return (
    <li className="task-item">
      <span>{task.text}</span>
      <button className="delete-button" onClick={() => onDelete(task.id)}>
        Deletar
      </button>
    </li>
  );
}