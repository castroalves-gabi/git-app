import { supabase } from "../supabase";

export async function getTasksByYear(year) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("year", year);

  if (error) throw error;

  const tasks = {};
  data.forEach(task => {
    const key = task.date;
    if (!tasks[key]) tasks[key] = [];
    tasks[key].push(task);
  });

  return tasks;
}

export async function addTask(task) {
  const { error } = await supabase.from("tasks").insert(task);
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
