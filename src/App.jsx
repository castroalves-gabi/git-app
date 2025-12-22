import { useEffect, useState } from "react";
import YearGrid from "./components/YearGrid";
import TaskPanel from "./components/TaskPanel";
import YearSelector from "./components/YearSelector";
import {
  getTasksByYear,
  addTask,
  toggleTask,
  updateTask,
  deleteTask
} from "./services/taskService";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    loadTasks();
  }, [year]);

  async function loadTasks() {
    const data = await getTasksByYear(year);
    setTasks(data);
  }

  async function handleAddTask(date, text) {
    await addTask({
      date,
      text,
      done: false,
      year
    });
    loadTasks();
  }

  async function handleToggleTask(date, id, done) {
    await toggleTask(id, done);
    loadTasks();
  }

  async function handleEditTask(date, id, text) {
    await updateTask(id, text);
    loadTasks();
  }

  async function handleDeleteTask(date, id) {
    await deleteTask(id);
    loadTasks();
  }

  return (
    <div className="app-layout">
      <YearSelector year={year} setYear={setYear} />

      <YearGrid
        year={year}
        tasks={tasks}
        onSelectDay={setSelectedDate}
      />

      {selectedDate && (
        <TaskPanel
          date={selectedDate}
          tasks={tasks[selectedDate] || []}
          addTask={handleAddTask}
          toggleTask={handleToggleTask}
          editTask={handleEditTask}
          deleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}
