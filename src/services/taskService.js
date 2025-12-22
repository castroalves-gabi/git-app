import { supabase } from "../supabase";

export async function getTasksByYear(year) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("year", year);

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
  const { error } = await supabase
    .from("tasks")
    .update({ done })
    .eq("id", id);

  if (error) throw error;
}

export async function updateTask(id, text) {
  const { error } = await supabase
    .from("tasks")
    .update({ text })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTask(id) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
