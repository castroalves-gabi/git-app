import DayCell from "./DayCell";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearGrid({ year, tasks, selectedDate, onSelectDay }) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const days = [];
  let current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const firstDayOffset = start.getDay();
  const totalCells = firstDayOffset + days.length;
  const weeks = Math.ceil(totalCells / 7);

  const grid = Array.from({ length: weeks * 7 }, (_, i) => {
    const dayIndex = i - firstDayOffset;
    return dayIndex >= 0 && dayIndex < days.length ? days[dayIndex] : null;
  });

  const monthLabels = {};
  days.forEach(d => {
    if (d.getDate() === 1) {
      const weekIndex = Math.floor((firstDayOffset + days.indexOf(d)) / 7);
      monthLabels[weekIndex] = months[d.getMonth()];
    }
  });

  return (
    <div className="calendar-wrapper">
      <div className="month-row">
        {Array.from({ length: weeks }).map((_, i) => (
          <div key={i} className="month-label">
            {monthLabels[i] || ""}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        <div className="week-labels">
          {weekDays.map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="year-grid">
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;

            const key = date.toISOString().slice(0, 10);

            return (
              <DayCell
                key={key}
                date={date}
                iso={key}
                tasks={tasks[key] || []}
                selected={selectedDate === key}
                onClick={() => onSelectDay(key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
