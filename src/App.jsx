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

  // -------------------------------
  // 1) Checa usuário logado
  // -------------------------------
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------------
  // 2) Se não estiver logado → tela de login
  // -------------------------------
  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password: pass
    });

    if (error) {
      alert("Erro ao registrar: " + error.message);
    } else {
      alert("Conta criada! Agora faça login.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setTasks({});
    setSelectedDate(null);
  }

  // -------------------------------
  // 3) Carrega tasks do ano do usuário logado
  // -------------------------------
  useEffect(() => {
    if (user) loadTasks();
  }, [year, user]);

  async function loadTasks() {
    if (!user) return;

    const data = await getTasksByYear(year, user.id);
    setTasks(data);
  }

  async function handleAddTask(date, text) {
    await addTask({
      user_id: user.id,
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

  // -------------------------------
  // 4) Tela de login/registro
  // -------------------------------
  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 300, margin: "0 auto" }}>
        <h2>Entrar</h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Login</button>
        </form>

        <h3>Criar Conta</h3>
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Registrar</button>
        </form>
      </div>
    );
  }

  // -------------------------------
  // 5) Tela principal (usuário logado)
  // -------------------------------
  return (
    <div className="app-layout">

      {/* Botão de Logout */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <button onClick={handleLogout}>Sair</button>
      </div>

      {/* Seletor de Ano */}
      <YearSelector year={year} setYear={setYear} />

      {/* Calendário */}
      <YearGrid
        year={year}
        tasks={tasks}
        onSelectDay={setSelectedDate}
      />

      {/* Painel de Tarefas do Dia */}
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
