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
  const [modalTaskId, setModalTaskId] = useState(null); // id da tarefa que quer remover

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    addTask(date, text);
    setText("");
  }

  function openModal(id) {
    setModalTaskId(id);
  }

  function closeModal() {
    setModalTaskId(null);
  }

  function confirmDelete() {
    deleteTask(modalTaskId);
    closeModal();
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
            onChange={() => toggleTask(task.id, !task.done)}
          />

          <input
            type="text"
            value={task.text}
            onChange={(e) => editTask(task.id, e.target.value)}
          />

          <button onClick={() => openModal(task.id)}>
            ✕
          </button>
        </div>
      ))}

      {/* Modal */}
      {modalTaskId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            minWidth: 300
          }}>
            <p>Deseja remover essa tarefa?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={confirmDelete} style={{ backgroundColor: "#f44336", color: "#fff" }}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
