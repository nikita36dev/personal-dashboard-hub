import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AlertContext } from '../../contexts/AlertContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import '../../styles/TaskManager.css';

const TaskManager = () => {
  const { tasks, saveNotes } = useContext(DataContext);
  const { showSuccess, showError } = useContext(AlertContext);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      console.log('Tasks from context:', tasks);
      setAllTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...allTasks, newTask];
    setAllTasks(updatedTasks);
    saveNotes(updatedTasks);
    showSuccess('Task created successfully!');
    setShowForm(false);
  };

  const handleEditTask = (taskData) => {
    if (!editingTask) return;
    
    const updatedTasks = allTasks.map(t =>
      t.id === editingTask.id ? { ...t, ...taskData, updatedAt: new Date().toISOString() } : t
    );
    
    setAllTasks(updatedTasks);
    saveNotes(updatedTasks);
    showSuccess('Task updated successfully!');
    setEditingTask(null);
    setShowForm(false);
  };

  const handleToggleTask = (id) => {
    const updatedTasks = allTasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    
    setAllTasks(updatedTasks);
    saveNotes(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === id);
    if (task?.completed) {
      showSuccess('Task completed! Great work!');
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = allTasks.filter(t => t.id !== id);
    setAllTasks(updatedTasks);
    saveNotes(updatedTasks);
    showSuccess('Task deleted successfully!');
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return allTasks.filter(t => t.completed);
      case 'active':
        return allTasks.filter(t => !t.completed);
      case 'work':
        return allTasks.filter(t => t.category === 'Work');
      case 'personal':
        return allTasks.filter(t => t.category === 'Personal');
      default:
        return allTasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeTasks = allTasks.filter(t => !t.completed).length;

  return (
    <div className="task-manager">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>{activeTasks} active tasks</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="task-filters">
        {['all', 'active', 'completed', 'work', 'personal'].map(f => (
          <button
            key={f}
            className={`filter-button ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onEdit={(t) => {
                setEditingTask(t);
                setShowForm(true);
              }}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => {
          setShowForm(false);
          setEditingTask(null);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            {editingTask ? (
              <TaskForm
                task={editingTask}
                onSubmit={handleEditTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            ) : (
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
