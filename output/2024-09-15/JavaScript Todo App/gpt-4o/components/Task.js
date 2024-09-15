import React from 'react';

const Task = ({ task, onDelete, onComplete }) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div className={task.completed ? "line-through" : ""}>{task.title}</div>
      <div>
        <button
          onClick={() => onComplete(task.id)}
          className="mr-2 text-green-500"
        >
          Complete
        </button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
