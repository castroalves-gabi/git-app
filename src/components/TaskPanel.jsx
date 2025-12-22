import { useState } from "react";

export default function TaskPanel({
  date,
  tasks,
  addTask,
  toggleTask,
  editTask,
  deleteTask
}) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    addTask(date, text);
    setText("");
  }

  return (
    <div className="task-panel">
      <h3>
        {new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}
      </h3>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">+</button>
      </form>

      {tasks.length === 0 && <p>Nenhuma tarefa.</p>}

      {tasks.map(task => (
        <div key={task.id} className="task">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() =>
              toggleTask(date, task.id, !task.done)
            }
          />

          <input
            type="text"
            value={task.text}
            onChange={(e) =>
              editTask(date, task.id, e.target.value)
            }
          />

          <button onClick={() => deleteTask(date, task.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
