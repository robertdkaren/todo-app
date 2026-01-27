import { useState, useEffect } from 'react';
import { api } from './api';
import Login from './components/Login';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

const DEFAULT_FIELD_ORDER = ['title', 'custom_field_type', 'custom_field_value'];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [fieldOrder, setFieldOrder] = useState(DEFAULT_FIELD_ORDER);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const userData = await api.me();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [todosData, prefsData] = await Promise.all([
        api.getTodos(),
        api.getPreferences(),
      ]);
      setTodos(todosData);
      if (prefsData.field_order?.length === 3) {
        setFieldOrder(prefsData.field_order);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      setTodos([]);
      setFieldOrder(DEFAULT_FIELD_ORDER);
    }
  };

  const handleCreateTodo = async (todoData) => {
    setError('');
    try {
      const newTodo = await api.createTodo(todoData);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      const message = err.custom_field_value?.[0] || err.title?.[0] || err.error || 'Failed to create todo';
      setError(message);
    }
  };

  const handleFieldReorder = async (newOrder) => {
    setFieldOrder(newOrder);
    try {
      await api.updatePreferences({ field_order: newOrder });
    } catch {
      // Silently fail - the UI is already updated
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Todo List</h1>
        <div className="user-info">
          <span>{user.username}</span>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <main>
        {error && <div className="error-message">{error}</div>}

        <TodoForm
          fieldOrder={fieldOrder}
          onSubmit={handleCreateTodo}
          onReorder={handleFieldReorder}
        />

        <TodoList todos={todos} fieldOrder={fieldOrder} />
      </main>
    </div>
  );
}
