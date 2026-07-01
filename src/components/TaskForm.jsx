import React, { useState } from 'react';

export default function TaskForm({ onAddTask }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return; // Evita adicionar item vazio
    
    onAddTask(inputValue); // Passando o dado de volta para o componente Pai
    setInputValue('');     // Limpa o input
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="Próxima tarefa..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="add-button">Add</button>
    </form>
  );
}