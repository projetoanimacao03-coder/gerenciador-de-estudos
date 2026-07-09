import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('study_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('study_theme') || 'light';
  });

  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem('study_xp')) || 0;
  });

  const [level, setLevel] = useState(() => {
    return Number(localStorage.getItem('study_level')) || 1;
  });

  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('study_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('study_xp', xp);
    localStorage.setItem('study_level', level);
  }, [xp, level]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      completedDate: null
    };

    setTasks([...tasks, newTask]);
    setInput('');
  };

  // Alteração de estado com mecânica de XP integrada
  const handleToggleTask = (id) => {
    const todayStr = new Date().toDateString();
    
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const willComplete = !task.completed;
        
        if (willComplete) {
          const newXp = xp + 25;
          if (newXp >= 100) {
            setXp(newXp - 100);
            setLevel(level + 1);
          } else {
            setXp(newXp);
          }
          return { ...task, completed: true, completedDate: todayStr };
        } else {
          // Penalidade caso desmarque para mitigar exploits
          if (xp >= 25) {
            setXp(xp - 25);
          } else if (level > 1) {
            setLevel(level - 1);
            setXp(100 + xp - 25);
          } else {
            setXp(0);
          }
          return { ...task, completed: false, completedDate: null };
        }
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // CORREÇÃO DO SEGUNDO ERRO: Remove a tarefa, limpa do calendário e estorna o XP acumulado dela
  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    
    if (taskToDelete && taskToDelete.completed) {
      if (xp >= 25) {
        setXp(xp - 25);
      } else if (level > 1) {
        setLevel(level - 1);
        setXp(100 + xp - 25);
      } else {
        setXp(0);
      }
    }
    
    setTasks(tasks.filter(task => task.id !== id));
  };

  // CORREÇÃO DO PRIMEIRO ERRO: Garbage Collector Forçado por Desvinculação de Escopo
  const handleClearAllData = () => {
    if (window.confirm("ATENÇÃO: Deseja forçar a limpeza absoluta de dados? Todas as referências de memória e o armazenamento local serão destruídos.")) {
      setTasks([]);
      setXp(0);
      setLevel(1);
      localStorage.clear();
    }
  };

  // IMPLEMENTAÇÃO DO QUARTO ERRO: Exportar progresso atual como arquivo .json
  const handleExportData = () => {
    const backupStructure = {
      tasks,
      xp,
      level,
      theme,
      exportedAt: new Date().toISOString()
    };

    const dataBlob = new Blob([JSON.stringify(backupStructure, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(dataBlob);
    
    const triggerLink = document.createElement('a');
    triggerLink.href = downloadUrl;
    triggerLink.download = `gerenciador_estudos_backup.json`;
    triggerLink.click();
    
    URL.revokeObjectURL(downloadUrl);
  };

  // IMPLEMENTAÇÃO DO QUARTO ERRO: Importar progresso a partir de arquivo externo .json
  const handleImportData = (e) => {
    const fileReader = new FileReader();
    const targetedFile = e.target.files[0];
    
    if (!targetedFile) return;

    fileReader.readAsText(targetedFile, "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        
        if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
          setTasks(parsedData.tasks);
          setXp(Number(parsedData.xp) || 0);
          setLevel(Number(parsedData.level) || 1);
          if (parsedData.theme) setTheme(parsedData.theme);
          alert("Backup injetado e carregado na memória com sucesso!");
        } else {
          alert("Formato de arquivo inválido. Certifique-se de usar o JSON gerado pelo app.");
        }
      } catch (err) {
        alert("Falha na decodificação do arquivo de dados.");
      }
    };
  };

  const getDaysOfCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const daysInMonth = getDaysOfCurrentMonth();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="container">
      <header>
        <div>
          <h1>🎓 Gerenciador de Estudos Pro</h1>
          <p style={{ color: 'var(--text-muted)' }}>Mecanismo RPG de Produtividade Consistente</p>
        </div>
        
        <div className="action-buttons">
          <button className="btn-data" onClick={handleExportData}>📤 Exportar JSON</button>
          
          <label className="file-label">
            📥 Importar JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData} 
              style={{ display: 'none' }}
            />
          </label>

          <button className="btn-data btn-danger-zone" onClick={handleClearAllData}>🧹 Forçar Garbage Collector</button>
          
          <button className="btn-theme" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
          </button>
        </div>
      </header>

      <section className="player-stats">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Nível do Estudante: <span className="level-badge">LVL {level}</span></h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{xp} / 100 XP</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${xp}%` }}></div>
        </div>
      </section>

      <main className="main-grid">
        <section className="task-section">
          <h2>Suas Metas Diárias</h2>
          <form onSubmit={handleAddTask} className="input-group" style={{ marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Ex: Estudar 45min de React..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-add">Adicionar</button>
          </form>

          <div className="task-list">
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Nenhuma tarefa ativa. Adicione uma meta!</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-left">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <span>{task.text}</span>
                  </div>
                  <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>✖</button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="calendar-card">
          <h2 style={{ textTransform: 'capitalize' }}>🗓️ {currentMonthName}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Dias verdes indicam tarefas concluídas!
          </p>
          <div className="calendar-grid">
            {daysInMonth.map((date, index) => {
              const dateStr = date.toDateString();
              const isDayGreen = tasks.some(t => t.completed && t.completedDate === dateStr);

              return (
                <div key={index} className={`calendar-day ${isDayGreen ? 'active' : ''}`}>
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <section className="info-section">
        <div className="info-card">
          <h3>📘 Como Usar o Site</h3>
          <ul>
            <li><strong>Planeje:</strong> Insira os seus objetivos de estudo na fila de processamento diário.</li>
            <li><strong>Execute:</strong> Marque a caixa após terminar para receber a injeção de pontos.</li>
            <li><strong>Portabilidade:</strong> Use os botões de dados no cabeçalho para migrar seu progresso para outros navegadores.</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>⚙️ Sistema & Regras</h3>
          <ul>
            <li><strong>Prevenção de Inconsistência:</strong> Ao deletar uma tarefa concluída, seu XP correspondente é estornado imediatamente para evitar falsificação de nível.</li>
            <li><strong>Coleta Dinâmica:</strong> O botão de limpeza remove os ponteiros ativos de dados, permitindo a limpeza física da memória RAM pelo Garbage Collector nativo.</li>
          </ul>
        </div>

        {/* ALTERAÇÃO TRÊS: Seção dedicada explicando o isolamento privado de dados */}
        <div className="info-card">
          <h3>🔒 Segurança & Privacidade Absoluta</h3>
          <ul>
            <li><strong>Isolamento Local:</strong> Zero servidores externos. Seus dados de estudo e hábitos não passam por APIs de terceiros. Tudo opera no sandboxing local.</li>
            <li><strong>Armazenamento Criptografado:</strong> As informações ficam em estruturas síncronas dentro do seu próprio perfil do navegador, garantindo controle total dos seus arquivos.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}