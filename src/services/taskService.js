import { supabase } from "../supabase";

export async function getTasksByYear(year) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("year", year)
    .eq("user_id", user.id); // filtra pelo usuário logado

  if (error) throw error;

  const tasks = {};
  data.forEach(task => {
    if (!tasks[task.date]) tasks[task.date] = [];
    tasks[task.date].push(task);
  });

  return tasks;
}

export async function addTask(task) {
  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase.from("tasks").insert({
    ...task,
    user_id: user.id
  });

  if (error) throw error;
}

export async function toggleTask(id, done) {
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase
        .from("tasks")
        .update({ done })
        .eq("id", id)
        .eq("user_id", user.id); // garante que o usuário só possa modificar suas próprias tarefas

  if (error) throw error;
}

export async function updateTask(id, text) {
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase
        .from("tasks")
        .update({ text })
        .eq("id", id)
        .eq("user_id", user.id); // garante que o usuário só possa modificar suas próprias tarefas

    if (error) throw error;
}

export async function deleteTask(id) {
    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // garante que o usuário só possa deletar suas próprias tarefas    

    if (error) throw error;
}
