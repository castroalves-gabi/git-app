export default function DayCell({ date, iso, tasks, selected, onClick, children }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  function getColor() {
    if (total === 0) return "day gray";
    if (done === 0) return "day blue";

    const ratio = done / total;
    if (ratio <= 1 / 3) return "day green-dark";
    if (ratio <= 2 / 3) return "day green-medium";
    if (ratio < 1) return "day green-light";
    return "day green-very-light";
  }

  const title = `${done}/${total} tarefas realizadas em ${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })}`;

  return (
    <div
      className={`${getColor()} ${selected ? "selected" : ""}`}
      title={title}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20%",
        cursor: "pointer",
        color: "#03030373"
      }}
    >
      {children}
    </div>
  );
}
