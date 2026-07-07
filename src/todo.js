import React, { useState, useEffect } from "react";
import "./todo.css";

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://daily-io-hgba.vercel.app/api';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Default todos for guest users
const guestDefaultTodos = [
  { id: 1, text: "Try adding a new task", completed: false },
  { id: 2, text: "Mark a task as complete", completed: false },
  { id: 3, text: "Delete a task", completed: false }
];

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getToken();
  const isGuest = !token;

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError("");
      if (isGuest) {
        setTasks(guestDefaultTodos);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/todos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) {
          // If token is invalid, treat as guest
          setTasks(guestDefaultTodos);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch todos');
        const data = await res.json();
        setTasks(data.map(todo => ({ id: todo._id, text: todo.text, completed: todo.completed })));
      } catch (err) {
        setError(err.message || 'Error loading todos');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
    // eslint-disable-next-line
  }, [token]);

  // Add a new todo
  const addTask = async () => {
    if (newTask.trim() === "") return;
    if (isGuest) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTask })
      });
      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error('Failed to add todo');
      const todo = await res.json();
      setTasks([...tasks, { id: todo._id, text: todo.text, completed: todo.completed }]);
      setNewTask("");
    } catch (err) {
      setError(err.message || 'Error adding todo');
    }
  };

  // Toggle complete
  const toggleComplete = async (id) => {
    if (isGuest) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      return;
    }
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error('Failed to update todo');
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: updated.completed } : t));
    } catch (err) {
      setError(err.message || 'Error updating todo');
    }
  };

  // Delete a todo
  const deleteTask = async (id) => {
    if (isGuest) {
      setTasks(tasks.filter((task) => task.id !== id));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error('Failed to delete todo');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting todo');
    }
  };

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-card">
          <h2 className="todo-header">To-Do List</h2>
          {isGuest && (
            <div style={{ color: "#888", fontSize: "0.95em", marginBottom: 10 }}>
              You are using guest mode. Your tasks will not be saved after you leave or refresh the page.
            </div>
          )}
          {error && <div className="todo-error">{error}</div>}
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            disabled={loading}
          />
          <div className="todo-list">
            {loading ? (
              <div>Loading...</div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`todo-item ${task.completed ? "completed" : ""}`}>
                  <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
                  <div className="todo-actions">
                    <button className="todo-complete-btn" onClick={() => toggleComplete(task.id)}>✓</button>
                    <button className="todo-delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDo;