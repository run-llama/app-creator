import { useEffect, useState } from 'react';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import fetcher from '../utils/fetcher';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetcher('/api/tasks');
      setTasks(data);
    };
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!taskInput) return;
    const newTask = await fetcher('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskInput }),
    });
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const deleteTask = async (id) => {
    await fetcher('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = async (id, completed) => {
    await fetcher('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    });
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed } : task)));
  };

  return (
    <div className="container mx-auto">
      <Header />
      <div className="p-4">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="border p-2 w-full"
          placeholder="Add a new task"
        />
        <button onClick={addTask} className="bg-blue-500 text-white p-2 mt-2">Add Task</button>
      </div>
      <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} />
    </div>
  );
}
