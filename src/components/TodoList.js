import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TodoList = () => {
  // Initialize state with tasks from localStorage or an empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // State for the new task input
  const [newTask, setNewTask] = useState('');
  
  // States for sorting and filtering options
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task
  const addTask = () => {
    if (newTask.trim()) { // Validate non-empty input
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask(''); // Clear the input after adding
    } else {
      alert('Task cannot be empty!');
    }
  };

  // Function to remove a task by index
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Function to toggle task completion status by index
  const toggleCompletion = (index) => {
    setTasks(tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  // Handle input changes
  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  // Filter tasks based on the filterBy state
  const filteredTasks = tasks.filter(task => {
    if (filterBy === 'completed') return task.completed;
    if (filterBy === 'pending') return !task.completed;
    return true;
  });

  // Sort tasks based on the sortBy state
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
    if (sortBy === 'completed') return a.completed - b.completed;
    return 0;
  });

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      <input
        type="text"
        value={newTask}
        onChange={handleNewTaskChange}
        placeholder="Enter a new task"
      />
      <button className="add-button" onClick={addTask}>Add Task</button>
      <div className="filters">
        <select onChange={e => setSortBy(e.target.value)} value={sortBy}>
          <option value="default">Default</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="completed">Completion Status</option>
        </select>
        <select onChange={e => setFilterBy(e.target.value)} value={filterBy}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <TransitionGroup component="ul">
        {sortedTasks.map((task, index) => (
          <CSSTransition
            key={index}
            timeout={500}
            classNames="task"
          >
            <li className={task.completed ? 'completed' : ''}>
              <span onClick={() => toggleCompletion(index)}>{task.text}</span>
              <button className="remove-button" onClick={() => removeTask(index)}>Remove</button>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default TodoList;
