import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './App.css'; // Importando o CSS aqui!

export default function App() {
  // Estado que armazena o Array de objetos (Tarefas)
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Aprender a passar Props no React' },
    { id: 2, text: 'Finalizar atividade de Front-end' }
  ]);

  // Função JavaScript para adicionar tarefa
  const addTask = (text) => {
    const newTask = { id: Date.now(), text };
    setTasks([...tasks, newTask]);
  };

  // Função JavaScript para deletar tarefa
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="app-container">
      <h2>Gerenciador de Estudos 📚</h2>
      
      {/* Enviando a função addTask via PROPS */}
      <TaskForm onAddTask={addTask} />

      <ul className="task-list">
        {tasks.map(task => (
          /* Renderizando o componente funcional e passando propriedades (props) */
          <TaskItem key={task.id} task={task} onDelete={deleteTask} />
        ))}
      </ul>

      {tasks.length === 0 && <p className="empty-message">Tudo pronto por hoje! 🚀</p>}
    </div>
  );
}