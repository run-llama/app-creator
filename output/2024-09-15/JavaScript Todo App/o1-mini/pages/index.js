import { useState, useEffect } from 'react'
import axios from 'axios'
import AddTaskForm from '../components/AddTaskForm'
import TaskList from '../components/TaskList'

export default function Home() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const res = await axios.get('/api/tasks')
    setTasks(res.data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (title) => {
    const res = await axios.post('/api/tasks', { title })
    setTasks([res.data, ...tasks])
  }

  const toggleTask = async (id, completed) => {
    const res = await axios.put('/api/tasks', { id, completed })
    setTasks(tasks.map(task => task.id === id ? res.data : task))
  }

  const deleteTask = async (id) => {
    await axios.delete('/api/tasks', { data: { id } })
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
        <AddTaskForm addTask={addTask} />
        <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      </div>
    </div>
  )
}
