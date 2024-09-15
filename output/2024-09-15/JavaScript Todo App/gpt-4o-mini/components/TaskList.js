import Task from './Task';

export default function TaskList({ tasks, onDelete, onToggle }) {
  return (
    <div>
      {tasks.map((task) => (
        <Task key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
}
