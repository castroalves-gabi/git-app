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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user, year]);

  async function loadTasks() {
    const data = await getTasksByYear(year);
    setTasks(data);
  }

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

  function handleLogoutClick() {
    setShowLogoutConfirm(true);
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  async function confirmLogout() {
    setShowLogoutConfirm(false);
    await supabase.auth.signOut();
  }

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

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando…</div>;
  }

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

  return (
    <>
      <div className="top">
        <span className="top-text">Git Tasks</span>

        <button className="logout-btn" onClick={handleLogoutClick}>
          Sair
        </button>
      </div>

      <div className="app-layout">
        <YearSelector year={year} setYear={setYear} />

        <div className="calendar-column">
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
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Deseja sair?</p>

            <div className="modal-actions">
              <button className="cancel" onClick={cancelLogout}>
                Cancelar
              </button>
              <button className="confirm" onClick={confirmLogout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}