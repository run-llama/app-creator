export default function Task({ task, onDelete, onToggle }) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span className={task.completed ? 'line-through' : ''}>{task.task}</span>
      <div>
        <button onClick={() => onToggle(task.id, !task.completed)} className="bg-green-500 text-white p-1 rounded">
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={() => onDelete(task.id)} className="bg-red-500 text-white p-1 rounded ml-2">
          Delete
        </button>
      </div>
    </div>
  );
}
