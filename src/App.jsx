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
import { supabase } from "./supabase";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(2025);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Sessão
  // -------------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setTasks({});
        setSelectedDate(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------------
  // Carregar tasks
  // -------------------------------
  useEffect(() => {
    if (!user) return;

    loadTasks();
  }, [user, year]);

  async function loadTasks() {
    const data = await getTasksByYear(year);
    setTasks(data);
  }

  // -------------------------------
  // Auth
  // -------------------------------
  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
  }

  async function handleRegister(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) alert(error.message);
    else alert("Conta criada. Faça login.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // -------------------------------
  // Tasks
  // -------------------------------
  async function handleAddTask(date, text) {
    if (!user) return;

    await addTask({
      user_id: user.id,
      date,
      text,
      done: false,
      year
    });

    loadTasks();
  }

  async function handleToggleTask(id, done) {
    await toggleTask(id, done);
    loadTasks();
  }

  async function handleEditTask(id, text) {
    await updateTask(id, text);
    loadTasks();
  }

  async function handleDeleteTask(id) {
    await deleteTask(id);
    loadTasks();
  }

  // -------------------------------
  // Loading
  // -------------------------------
  if (loading) {
    return <div style={{ padding: 40 }}>Carregando…</div>;
  }

  // -------------------------------
  // Login
  // -------------------------------
  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 300, margin: "0 auto" }}>
        <h2>Entrar</h2>

        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Login</button>
        </form>

        <h3>Criar conta</h3>

        <form onSubmit={handleRegister}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Registrar</button>
        </form>
      </div>
    );
  }

  // -------------------------------
  // App
  // -------------------------------
  return (
    <div className="app-layout">
      <button
        onClick={handleLogout}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Sair
      </button>

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
